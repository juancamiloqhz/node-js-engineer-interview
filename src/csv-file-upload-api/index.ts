import express, { Request, Response, NextFunction } from 'express'
import multer, { diskStorage } from 'multer'
import csvParser from 'csv-parser'
import fs from 'fs'
import path from 'path'
import { ParamsDictionary } from 'express-serve-static-core'
import { ParsedQs } from 'qs'

const app = express()

interface MulterRequest extends Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>> {
  fileValidationError?: string
}

// Define the storage for multer middleware & add file type validation
const storage = diskStorage({
  destination: 'uploads/',
  filename: (req: MulterRequest, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const originalNameWithoutExtension = path.basename(file.originalname, path.extname(file.originalname))
    const newFilename = `${Date.now()}-${originalNameWithoutExtension}${path.extname(file.originalname)}`
    cb(null, newFilename)
  }
})

const upload = multer({
  storage: storage,
  fileFilter(req: MulterRequest, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    // console.log('file', file)
    if (!file.originalname.match(/\.csv$/)) {
      req.fileValidationError = 'Only CSV files are allowed!'
      return cb(null, false)
    }
    cb(null, true)
  }
})

interface File {
  [filename: string]: any[]
}

let files: File = {}

// Upload CSV file
app.post('/upload', upload.single('file'), (req: MulterRequest, res: Response, next: NextFunction) => {
  if (req.fileValidationError) {
    return res.status(400).send({ error: req.fileValidationError })
  }

  if (!req.file) {
    return res.status(400).json({ error: 'Please upload a file!' })
  }

  files[req.file.filename] = []

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data: any) => files[req.file!.filename].push(data))
    .on('end', () => {
      res.json({ filename: req.file!.filename, message: 'File uploaded successfully!' })
    })
})

// List all CSV files
app.get('/files', (req: Request, res: Response) => {
  // console.log('files', files)
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
