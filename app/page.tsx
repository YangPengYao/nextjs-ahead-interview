import { getCSVData, get2DChartData } from "@/app/get-csv-data";
import { ScatterPlot } from "@/components/chart/scatter-plot";

export default async function Home() {
  const result = await getCSVData();
  const chartData = await get2DChartData(
    { x: "CD45-KrO", y: "SS INT LIN" },
    result.data as Record<string, number>[]
  );

  console.log(chartData);

  return (
    <div className="flex justify-center items-center h-screen">
      <ScatterPlot
        title="Cell Distribution (CD45+)"
        width={600}
        height={600}
        labelX={chartData.x}
        labelY={chartData.y}
        data={chartData.list}
      />
    </div>
  );
}
