import { Button } from '@/components/ui/button'
import {
  CoordinatesAlert,
  LocationErrorAlert,
} from '@/components/view/components/Alert/Alert'
import WeatherSkeleton from '@/components/view/components/Skeleton/loadingSkeleton'
import { useGeoLocation } from '@/hooks/useGeoLocation'
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from '@/hooks/useWeather'
import { RefreshCcw } from 'lucide-react'

export default function WeatherDashboard() {
  const {
    coordinates,
    error: locationError,
    getLocation,
    isLoading: locationLoading,
  } = useGeoLocation()

  const weatherQuery = useWeatherQuery(coordinates)
  const forecastQuery = useForecastQuery(coordinates)
  const locationQuery = useReverseGeocodeQuery(coordinates)

  const handleRefresh = () => {
    getLocation()
    if (coordinates) {
      weatherQuery.refetch()
      forecastQuery.refetch()
      locationQuery.refetch()
    }
  }

  if (locationLoading) {
    return <WeatherSkeleton />
  }

  if (locationError) {
    return (
      <LocationErrorAlert
        locationError={locationError}
        getLocation={getLocation}
      />
    )
  }

  if (!coordinates) {
    return <CoordinatesAlert getLocation={getLocation} />
  }

  const locationName = locationQuery.data?.[0]

  if (weatherQuery.error || forecastQuery.error) {
    return <LocationErrorAlert handleRefresh={handleRefresh} />
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />
  }

  return (
    <div className="space-y-4">
      {/* {favorite contris} */}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={'outline'}
          size={'icon'}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCcw
            className={`h-4 w-4 ${
              weatherQuery.isFetching ? 'animate-spin' : ''
            }`}
          />
        </Button>
      </div>

      {/* {curr weather} */}
    </div>
  )
}
