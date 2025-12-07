import type { Coordinates } from '@/api/types'
import { useEffect, useState } from 'react'

interface GeoLocationState {
  coordinates: Coordinates | null
  error: string | null
  isLoading: boolean
}

export function useGeoLocation() {
  const [locationData, setLocationData] = useState<GeoLocationState>({
    coordinates: null,
    error: null,
    isLoading: true,
  })

  const getLocation = () => {
    setLocationData((prev) => ({ ...prev, isLoading: true, error: null }))

    if (!navigator.geolocation) {
      setLocationData({
        coordinates: null,
        error: 'GeoLocation is not supported by your browser',
        isLoading: false,
      })
      return
    }

    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData({
          coordinates: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          error: null,
          isLoading: false,
        })
      },
      async (error) => {
        try {
          const ipResponse = await fetch('https://ipapi.co/json/')
          const ipData = await ipResponse.json()

          if (ipData.latitude && ipData.longitude) {
            setLocationData({
              coordinates: {
                lat: ipData.latitude,
                lon: ipData.longitude,
              },
              error: null,
              isLoading: false,
            })
            return
          }
        } catch (ipError) {}

        let errorMessage: string

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              'Location permission denied. Please enable location access.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              'Location information is unavailable.' +
              (isLocalhost ? ' Using approximate location based on IP.' : '')
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
          default:
            errorMessage = 'An unknown error occurred'
        }

        setLocationData({
          coordinates: null,
          error: errorMessage,
          isLoading: false,
        })
      },
      {
        enableHighAccuracy: !isLocalhost,
        timeout: 10000,
        maximumAge: isLocalhost ? 60 * 60 * 1000 : 0,
      }
    )
  }

  useEffect(() => {
    getLocation()
  }, [])

  return {
    ...locationData,
    getLocation,
  }
}
