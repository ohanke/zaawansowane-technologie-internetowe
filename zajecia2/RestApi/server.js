const express = require('express')
const morgan = require('morgan')

const usersRouter = require('./routes/users')

const app = express()

const PORT = 3000

app.use(express.json())
app.use(morgan('dev'))
app.use(express.static('public'))

app.use('/api/users',usersRouter)

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})

