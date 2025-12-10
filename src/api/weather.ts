import { API_CONFIG } from './config'
import type {
  Coordinates,
  ForecastData,
  GeocodingResponse,
  WeatherData,
} from './types'

class WeatherAPI {
  private createUrl(endpoint: string, params: Record<string, string | number>) {
    const searchParams = new URLSearchParams()

    searchParams.append('appid', API_CONFIG.API_KEY)

    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value.toString())
    })

    return `${endpoint}?${searchParams.toString()}`
  }

  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Weather API Error (${response.status}): ${errorText}`)
    }

    return response.json()
  }

  async getCurrntWeather({ lat, lon }: Coordinates): Promise<WeatherData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/weather`, {
      lat,
      lon,
      units: API_CONFIG.DEFAULT_PARAMS.units,
    })

    return this.fetchData<WeatherData>(url)
  }

  async getForecast({ lat, lon }: Coordinates): Promise<ForecastData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/forecast`, {
      lat,
      lon,
      units: API_CONFIG.DEFAULT_PARAMS.units,
    })

    return this.fetchData<ForecastData>(url)
  }

  async reverseGeocode({
    lat,
    lon,
  }: Coordinates): Promise<GeocodingResponse[]> {
    const url = this.createUrl(`${API_CONFIG.GEO}/reverse`, {
      lat,
      lon,
      limit: 1,
    })
    return this.fetchData<GeocodingResponse[]>(url)
  }

  async searchLocations(query: string): Promise<GeocodingResponse[]> {
    const url = this.createUrl(`${API_CONFIG.GEO}/direct`, {
      q: query,
      limit: 5,
    })

    return this.fetchData<GeocodingResponse[]>(url)
  }
}

export const weatherAPI = new WeatherAPI()
