import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { useMemo } from 'react'
import type { DashboardChartPayload } from '../../services/dashboardApi'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export function ChartCard({ chart }: { chart: DashboardChartPayload | null }) {
  const data = useMemo(() => {
    if (!chart) {
      return {
        labels: [],
        datasets: [],
      }
    }

    // Chart.js expects dataset objects; backend already returns compatible fields.
    return {
      labels: chart.labels,
      datasets: chart.datasets,
    }
  }, [chart])

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Activity</div>
        <div className="text-xs text-slate-400">Last 6 weeks</div>
      </div>
      <div className="mt-3">
        {chart && chart.labels.length > 0 ? (
          <Line data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        ) : (
          <div className="h-44 flex items-center justify-center text-sm text-slate-400">No activity data yet.</div>
        )}
      </div>
    </div>
  )
}

