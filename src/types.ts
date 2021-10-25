import {
    AppState,
    SaluteRequest,
    SaluteRequestVariable
} from '@salutejs/scenario'


export type CustomRequest = SaluteRequest<SaluteRequestVariable, AppState>

export type Weather = {
    coord: {
        lon: number
        lat: number
    }
    main: {
        temp: number
        feels_like: number
        temp_min: number
        temp_max: number
        pressure: number
        humidity: number
        sea_level: number
        grnd_level: number
    }
    wind: {
        speed: number
        deg: number
        gust: number
    }
    clouds: {
        all: number
    }
    weather: {
        id: number
        main: string
        description: string
        icon: string
    }[]
}