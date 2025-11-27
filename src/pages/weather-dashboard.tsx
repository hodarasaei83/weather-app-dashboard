import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'

export default function WeatherDashboard() {
  return (
    <div className="space-y-4">
      {/* {favorite contris} */}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={'outline'}
          size={'icon'}
          // onClick={}
          // disabled={}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* {curr weather} */}
    </div>
  )
}
