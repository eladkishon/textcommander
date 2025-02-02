import express from 'express'

const app = express()
const port = (process.env.PORT) || 3000

app.get('/health', (req, res) => {
    res.send('OK')
})

app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${port}`)
})

