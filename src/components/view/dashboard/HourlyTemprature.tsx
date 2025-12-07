import type { ForecastData } from '@/api/types'

interface HourlyTempratureProps {
  data: ForecastData
}

const HourlyTemprature = ({ data }: HourlyTempratureProps) => {
  return <div>HourlyTemprature</div>
}

export default HourlyTemprature
