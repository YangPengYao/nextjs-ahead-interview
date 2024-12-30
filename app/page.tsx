import { getCSVData, get2DChartData } from "@/app/actions/get-csv-data";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const result = await getCSVData();
  const chartData = await get2DChartData(
    { x: "CD45-KrO", y: "SS INT LIN" },
    result.data as Record<string, number>[]
  );

  console.log(chartData);

  return (
    <div className="flex justify-center items-center h-screen">
      <Button>Test</Button>
    </div>
  );
}
