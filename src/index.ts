import express from 'express'
import cors from 'cors'
import { webHookRout } from './routes/webHookRout'
import { requestWeather, requestWeatherPeriodically } from './api'
require('dotenv').config()

const PORT = process.env.PORT ?? 5000

const app = express()
app.use(express.json())
app.use(cors())
app.use(webHookRout)

requestWeather()
requestWeatherPeriodically(60000)

app.listen(PORT, () => {
  console.log('server started on port ', PORT)
//   requestWeather()
//   requestWeatherPeriodically(60000)
})

app.get('/', (_, res) => {
  res.status(200).send('Какой полюс холоднее чатап')
})