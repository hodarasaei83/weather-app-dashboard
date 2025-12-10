import type { Coordinates } from '@/api/types'
import { weatherAPI } from '@/api/weather'
import { useQuery } from '@tanstack/react-query'

export const WEATHER_KEYS = {
  weather: (coords: Coordinates | null) =>
    ['weather', coords?.lat, coords?.lon] as const,
  forecast: (coords: Coordinates | null) =>
    ['forecast', coords?.lat, coords?.lon] as const,
  location: (coords: Coordinates | null) =>
    ['location', coords?.lat, coords?.lon] as const,
  search: (query: string | null) => ['location-search', query] as const,
} as const

function isValidCoordinate(coords: Coordinates): boolean {
  return (
    coords !== null &&
    typeof coords.lat === 'number' &&
    typeof coords.lon === 'number' &&
    !isNaN(coords.lat) &&
    !isNaN(coords.lon)
  )
}

export function useWeatherQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.weather(coordinates),
    queryFn: () => {
      if (!coordinates || !isValidCoordinate(coordinates)) {
        return Promise.resolve(null)
      }
      return weatherAPI.getCurrntWeather(coordinates)
    },
    enabled: !!coordinates && isValidCoordinate(coordinates),
    retry: 1,
    retryDelay: 1000,
  })
}

export function useForecastQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.forecast(coordinates),
    queryFn: () => {
      if (!coordinates || !isValidCoordinate(coordinates)) {
        return Promise.resolve(null)
      }
      return weatherAPI.getForecast(coordinates)
    },
    enabled: !!coordinates && isValidCoordinate(coordinates),
    retry: 1,
    retryDelay: 1000,
  })
}

export function useReverseGeocodeQuery(coordinates: Coordinates | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.location(coordinates),
    queryFn: () => {
      if (!coordinates || !isValidCoordinate(coordinates)) {
        return Promise.resolve(null)
      }
      return weatherAPI.reverseGeocode(coordinates)
    },
    enabled: !!coordinates && isValidCoordinate(coordinates),
    retry: 1,
    retryDelay: 1000,
  })
}

export function useLocationSearch(query: string | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.search(query),
    queryFn: () => {
      if (!query) {
        return Promise.resolve(null)
      }
      return weatherAPI.searchLocations(query)
    },
    enabled: !!query && query.length >= 3,
    retry: 1,
    retryDelay: 1000,
  })
}
