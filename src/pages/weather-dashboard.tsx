import { Button } from '@/components/ui/button'
import {
  CoordinatesAlert,
  LocationErrorAlert,
  QueryAlert,
} from '@/components/view/components/Alert/Alert'
import WeatherSkeleton from '@/components/view/components/Skeleton/loadingSkeleton'
import CurrentWeather from '@/components/view/dashboard/CurrentWeather'
import HourlyTemperature from '@/components/view/dashboard/HourlyTemperature'
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

  const hasValidCoordinates =
    coordinates &&
    typeof coordinates.lat === 'number' &&
    typeof coordinates.lon === 'number' &&
    coordinates.lat !== 0 &&
    coordinates.lon !== 0

  const weatherQuery = useWeatherQuery(hasValidCoordinates ? coordinates : null)
  const forecastQuery = useForecastQuery(
    hasValidCoordinates ? coordinates : null
  )
  const locationQuery = useReverseGeocodeQuery(
    hasValidCoordinates ? coordinates : null
  )

  const handleRefresh = () => {
    getLocation()
    if (hasValidCoordinates) {
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

  if (!hasValidCoordinates) {
    return <CoordinatesAlert getLocation={getLocation} />
  }

  if (weatherQuery.error || forecastQuery.error) {
    return <QueryAlert handleRefresh={handleRefresh} />
  }

  if (
    weatherQuery.isLoading ||
    forecastQuery.isLoading ||
    locationQuery.isLoading
  ) {
    return <WeatherSkeleton />
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />
  }

  const locationName = locationQuery.data?.[0]

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

      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <CurrentWeather
            data={weatherQuery.data}
            locationName={locationName}
          />
          <HourlyTemperature data={forecastQuery.data} />
        </div>
        <div>
          {/* details */}
          {/* forecast */}
        </div>
      </div>
    </div>
  )
}
