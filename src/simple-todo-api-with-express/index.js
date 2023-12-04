const express = require('express')
const app = express()

app.use(express.json())

const todos = [] // This will initialize an empty todos array
let currentId = 1 // This will be used to assign unique ids to todos

// Get all todos
app.get('/todos', (req, res) => {
  res.json(todos)
})

// Create new todo
app.post('/todos', (req, res) => {
  const newTodo = {
    id: currentId++,
    task: req.body.task
  }
  todos.push(newTodo)
  res.json(newTodo)
})

// Update a todo
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const updatedTask = req.body.task
  const todo = todos.find((todo) => todo.id === id)

  if (todo) {
    todo.task = updatedTask
    res.json(todo)
  } else {
    res.status(404).json({ error: 'Todo not found' })
  }
})

// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = todos.findIndex((todo) => todo.id === id)

  if (index > -1) {
    todos.splice(index, 1)
    res.json({ message: 'Todo deleted successfully' })
  } else {
    res.status(404).json({ error: 'Todo not found' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
