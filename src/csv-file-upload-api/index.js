/* eslint-disable space-before-function-paren */
const express = require('express')
const multer = require('multer')
const csvParser = require('csv-parser')
const fs = require('fs')
const path = require('path')

const app = express()

// Define storage for the multer middleware & add file type validation
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // Appending .csv extension
  }
})

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    // test file type and respond accordingly
    if (!file.originalname.match(/\\.(csv)$/)) {
      return cb(new Error('Only CSV files are allowed!'))
    }
    cb(undefined, true)
  }
})

const files = {}

// Upload CSV file
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please upload a file!' })
  }

  files[req.file.filename] = []

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => files[req.file.filename].push(data))
    .on('end', () => {
      res.json({ filename: req.file.filename })
    })
})

// List all CSV files
app.get('/files', (req, res) => {
  res.json(Object.keys(files))
})

// Get specific CSV file data
app.get('/files/:filename', (req, res) => {
  const fileContent = files[req.params.filename]

  if (!fileContent) {
    return res.status(404).json({ error: 'File not found!' })
  }

  res.json(fileContent)
})

// Server Setup
const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
