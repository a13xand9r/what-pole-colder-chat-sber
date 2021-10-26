import express from 'express'
import cors from 'cors'
import { webHookRout } from './routes/webHookRout'
import { requestWeather } from './api'
require('dotenv').config()

const PORT = process.env.PORT ?? 5000

const app = express()
app.use(express.json())
app.use(cors())
app.use(webHookRout)


const startServer = async () => {
  await requestWeather()

  app.listen(PORT, () => {
    console.log('server started on port ', PORT)
  })

  app.get('/', (_, res) => {
    requestWeather()
    res.status(200).send('Какой полюс холоднее чатап')
  })

  console.log('SERVER START')
}

startServer()

