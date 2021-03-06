import { SaluteHandler, SaluteRequest, SaluteResponse } from '@salutejs/scenario'
import * as dictionary from './system.i18n'
import { getNorthPoleWeather, getSouthPoleWeather, requestWeather, weatherCache } from './api'
import { Weather } from './types'

let coldPole: Weather & {pole: 'Южном' | 'Северном'}
let warmPole: Weather & {pole: 'Южном' | 'Северном'}

export const runAppHandler: SaluteHandler = ({ req, res }, dispatch) => {
    requestWeather()
    if (weatherCache.northPoleWeather && weatherCache.southPoleWeather){
        dispatch && dispatch(['WhatIsColder'])
    } else {
        const keyset = req.i18n(dictionary)
        res.setPronounceText(keyset('404'))
        res.appendBubble(keyset('404'))
        res.setAutoListening(true)
        res.appendSuggestions(['Помощь', 'Выйти'])
    }
}

export const noMatchHandler: SaluteHandler = async ({ req, res }) => {
    const keyset = req.i18n(dictionary)
    res.appendBubble(keyset('404'))
    res.setPronounceText(keyset('404'))
    res.appendSuggestions(['Выйти'])
}

export const whatIsColderHandler: SaluteHandler = async ({ req, res }) => {

    if (weatherCache.northPoleWeather && weatherCache.southPoleWeather){
        coldPole = weatherCache.northPoleWeather.main.temp < weatherCache.southPoleWeather.main.temp ? {...weatherCache.northPoleWeather, pole: 'Северном'} : {...weatherCache.southPoleWeather, pole: 'Южном'}
        warmPole = weatherCache.northPoleWeather.main.temp < weatherCache.southPoleWeather.main.temp ? {...weatherCache.southPoleWeather, pole: 'Южном'} : {...weatherCache.northPoleWeather, pole: 'Северном'}
    } else {
        await Promise.all([
            getNorthPoleWeather(),
            getSouthPoleWeather()
        ])
        //@ts-ignore
        coldPole = weatherCache.northPoleWeather.main.temp < weatherCache.southPoleWeather.main.temp ? {...weatherCache.northPoleWeather, pole: 'Северном'} : {...weatherCache.southPoleWeather, pole: 'Южном'}
        //@ts-ignores
        warmPole = weatherCache.northPoleWeather.main.temp < weatherCache.southPoleWeather.main.temp ? {...weatherCache.southPoleWeather, pole: 'Южном'} : {...weatherCache.northPoleWeather, pole: 'Северном'}
    }

    const keyset = req.i18n(dictionary)
    const responseText = keyset('Холоднее', {
        coldPole: coldPole.pole,
        warmPole: warmPole.pole,
        coldTemperature: Math.round(coldPole.main.temp),
        warmTemperature: Math.round(warmPole.main.temp),
    })
    console.log('responseText', responseText)
    res.setPronounceText(responseText)
    res.appendBubble(responseText)
    res.appendSuggestions(['Помощь', 'Выйти'])
}

const poleWeatherInfo = (req: SaluteRequest, res: SaluteResponse, pole: 'Южном' | 'Северном') => {
    const keyset = req.i18n(dictionary)

    let poleWeather: Weather
    if (weatherCache.northPoleWeather && weatherCache.southPoleWeather) {
        if (pole === 'Северном') poleWeather = weatherCache.northPoleWeather
        else poleWeather = weatherCache.southPoleWeather

        const responseText = keyset('Погода на полюсе', {
            pole,
            description: poleWeather.weather[0].description,
            temp: Math.round(poleWeather.main.temp),
            feelsLike: Math.round(poleWeather.main.feels_like),
            wind: poleWeather.wind.speed,
            humidity: poleWeather.main.humidity
        })

        res.appendBubble(responseText)
        res.setPronounceText(responseText)
    }
    res.appendSuggestions(['Помощь', 'Выйти'])
}

export const northPoleHandler: SaluteHandler = async ({ req, res }) => {
    console.log('north temp',weatherCache.northPoleWeather?.main.temp)
    poleWeatherInfo(req, res, 'Северном')
}
export const southPoleHandler: SaluteHandler = async ({ req, res }) => {
    console.log('south temp',weatherCache.southPoleWeather?.main.temp)
    poleWeatherInfo(req, res, 'Южном')
}


