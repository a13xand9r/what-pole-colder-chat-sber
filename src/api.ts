import axios from 'axios'
import { Weather } from './types'
require('dotenv').config()

export const weatherCache = {
  northPoleWeather: null as null | Weather,
  southPoleWeather: null as null | Weather,
}

export const getNorthPoleWeather = async () => {
  try {
    const { data } = await axios.get<Weather>(`https://api.openweathermap.org/data/2.5/weather?lat=90&lon=0&&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=ru`)
    console.log('NORTH-----REQUEST-----DONE')
    return data
  } catch (error) {
    console.log('WEATHER----------ERROR', error)
    return null
  }
}

export const getSouthPoleWeather = async () => {
  try {
    const { data } = await axios.get<Weather>(`https://api.openweathermap.org/data/2.5/weather?lat=-90&lon=0&&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=ru`)
    console.log('SOUTH-----REQUEST-----DONE')
    return data
  } catch (error) {
    console.log('WEATHER----------ERROR', error)
    return null
  }
}

export const requestWeather = async () => {
  const [northPoleWeather, southPoleWeather] = await Promise.all([
    getNorthPoleWeather(),
    getSouthPoleWeather()
  ]) as Weather[]
  console.log('start request')
  if (northPoleWeather && southPoleWeather){
    weatherCache.northPoleWeather = northPoleWeather
    weatherCache.southPoleWeather = southPoleWeather
  }
}
export const requestWeatherPeriodically = (time: number = 1200000) => {
  console.log('periodically time', time)
  const timerId = setInterval(() => {
    const request = async () => {
      const [northPoleWeather, southPoleWeather] = await Promise.all([
        getNorthPoleWeather(),
        getSouthPoleWeather()
      ]) as Weather[]

      if (northPoleWeather && southPoleWeather) {
        weatherCache.northPoleWeather = northPoleWeather
        weatherCache.southPoleWeather = southPoleWeather
      }
    }
    request()

    console.log('Periodically weather request')
  }, time)

  return timerId
}