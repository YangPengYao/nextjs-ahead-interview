export type Point = { x: number; y: number };

export type Polygon = {
  id: string;
  points: Point[];
  label: string;
  color: string;
  isVisible: boolean;
  style: "solid" | "dashed";
  lineWidth: number;
};

export type PointsInsidePolygonStat = {
  percentage: number;
  count: number;
};
