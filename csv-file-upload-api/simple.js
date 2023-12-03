const express = require('express')
const multer = require('multer')
const csvParser = require('csv-parser')
const fs = require('fs')

const app = express()

const upload = multer({ dest: 'uploads/' }) // Set up multer to upload to 'uploads/' folder

const files = {}

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file || req.file.mimetype !== 'text/csv') {
    return res.status(400).json({ error: 'Only CSV file uploads are accepted.' })
  }

  files[req.file.filename] = []

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => files[req.file.filename].push(data))
    .on('end', () => {
      res.json({ filename: req.file.filename })
    })
})

app.get('/files', (req, res) => {
  res.json(Object.keys(files))
})

app.get('/files/:filename', (req, res) => {
  const fileContent = files[req.params.filename]

  if (!fileContent) {
    return res.status(404).json({ error: 'No such file.' })
  }

  res.json(fileContent)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
