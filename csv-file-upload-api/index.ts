import express, { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import csvParser from 'csv-parser'
import fs from 'fs'
import path from 'path'

const app = express()

// Define the storage for multer middleware & add file type validation
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    if (!file.originalname.match(/\\.(csv)$/)) {
      return cb(new Error('Only CSV files are allowed!'), false)
    }
    cb(null, true)
  }
})

interface File {
  [filename: string]: any[]
}

let files: File = {}

// Upload CSV file
app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please upload a file!' })
  }

  files[req.file.filename] = []

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data: any) => files[req.file!.filename].push(data))
    .on('end', () => {
      res.json({ filename: req.file!.filename })
    })
})

// List all CSV files
app.get('/files', (req: Request, res: Response) => {
  res.json(Object.keys(files))
})

// Get specific CSV file data
app.get('/files/:filename', (req: Request, res: Response) => {
  const fileContent = files[req.params.filename]

  if (!fileContent) {
    return res.status(404).json({ error: 'File not found!' })
  }

  res.json(fileContent)
})

// Server Setup
const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
