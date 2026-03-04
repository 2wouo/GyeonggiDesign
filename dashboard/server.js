import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Define directories
const PUBLIC_DIR = path.join(__dirname, 'public');
const PDF_DIR = path.join(PUBLIC_DIR, 'pdfs');
const DATA_FILE = path.join(PDF_DIR, 'data.json');

// Ensure directories and data file exist
if (!fs.existsSync(PDF_DIR)) {
    fs.mkdirSync(PDF_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
    // Initialize with the mock data if it doesn't exist
    const initialData = [
        {
            id: '1',
            title: '2024년 공공디자인나눔 최종 결과보고서',
            year: 2024,
            description: '2024년도 사업 성과 및 참여 기업 디자인 결과물 총람',
            url: '/pdfs/sample.pdf'
        },
        {
            id: '2',
            title: '2023년 우수 디자인 기업 사례집',
            year: 2023,
            description: '2023년 공공디자인 수혜기업 중 우수 사례 모음',
            url: '/pdfs/sample.pdf'
        }
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf8');
}

// Setup Express middlewares
app.use(cors());
app.use(express.json());
// Serve static files from the public directory so that /pdfs/... URLs work and don't return 404s
app.use(express.static(PUBLIC_DIR));

// Setup Multer for PDF uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, PDF_DIR);
    },
    filename: function (req, file, cb) {
        // Generate a unique filename using timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Fix multer unicode filename issue
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, uniqueSuffix + '-' + originalName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'));
        }
    }
});

// Helper to read data
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Helper to write data
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// API Routes

// GET all documents
app.get('/api/documents', (req, res) => {
    const documents = readData();
    res.json(documents);
});

// POST new document with PDF upload
app.post('/api/documents', upload.single('pdfFile'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

        const { title, year, description } = req.body;

        // Create new document entry
        const newDoc = {
            id: Date.now().toString(),
            title: title || '제목 없음',
            year: parseInt(year) || new Date().getFullYear(),
            description: description || '',
            url: `/pdfs/${encodeURIComponent(req.file.filename)}` // The path relative to the public folder
        };

        const documents = readData();
        documents.unshift(newDoc); // Add to the front of the list
        writeData(documents);

        res.status(201).json(newDoc);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT update an existing document
app.put('/api/documents/:id', upload.single('pdfFile'), (req, res) => {
    try {
        const { id } = req.params;
        const { title, year, description } = req.body;
        let documents = readData();

        const docIndex = documents.findIndex(doc => doc.id === id);
        if (docIndex === -1) {
            if (req.file) {
                // Cleanup orphaned uploaded file
                const filePath = path.join(PUBLIC_DIR, 'pdfs', req.file.filename);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
            return res.status(404).json({ error: 'Document not found' });
        }

        const docToUpdate = documents[docIndex];
        let newUrl = docToUpdate.url;

        // If a new file was uploaded, update the URL and try to delete the old one
        if (req.file) {
            newUrl = `/pdfs/${encodeURIComponent(req.file.filename)}`;
            if (docToUpdate.url !== '/pdfs/sample.pdf') {
                const oldFilePath = path.join(PUBLIC_DIR, decodeURIComponent(docToUpdate.url));
                if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
            }
        }

        documents[docIndex] = {
            ...docToUpdate,
            title: title || docToUpdate.title,
            year: parseInt(year) || docToUpdate.year,
            description: description !== undefined ? description : docToUpdate.description,
            url: newUrl
        };

        writeData(documents);
        res.json(documents[docIndex]);
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE a document
app.delete('/api/documents/:id', (req, res) => {
    try {
        const { id } = req.params;
        let documents = readData();
        const docToDelete = documents.find(doc => doc.id === id);

        if (!docToDelete) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Attempt to delete the physical file if it's not the sample.pdf
        if (docToDelete.url !== '/pdfs/sample.pdf') {
            const filePath = path.join(PUBLIC_DIR, docToDelete.url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Filter out the deleted document
        documents = documents.filter(doc => doc.id !== id);
        writeData(documents);

        res.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Local dev API server running on http://localhost:${PORT}`);
});
