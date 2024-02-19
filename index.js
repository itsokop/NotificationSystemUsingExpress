import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import user from './routes.js'

dotenv.config()

const app = express()

app.use(cors({
    'origin': ["http://127.0.0.1:5500"]
}))
app.use(bodyParser.json())
app.use(express.json())

app.get("/", (req, res)=>{
    res.json({"Hi":"Hello World"})
})

app.use('/api', user)

const PORT = 8080

app.listen(PORT, () => {
    console.log(`Port listening on ${PORT}`)
})

