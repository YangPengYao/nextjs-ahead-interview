import type { Point, Polygon, PointsInsidePolygonStat } from "./types";

export const generateRandomColor = (): string => {
  // 16777215 = 16^6 - 1 (000000 ~ FFFFFF)
  // subtract 1 to make sure when the random number is like 0.9999999999999
  // js will treat this like 1 and toString(16) will return '1000000'
  // which is a overflow value
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

export const checkIsPointInPolygon = (
  point: Point,
  polygon: Polygon
): boolean => {
  const x = point.x;
  const y = point.y;
  const vs = polygon.points;

  let isInside = false;

  // get the edge of the polygon
  // i = 0, j = vs.length - 1
  // i = 1, j = 0
  // i = 2, j = 1
  // ...
  // i = vs.length - 1, j = vs.length - 2
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    // ray-casting algorithm
    // y: need to check if y is between vs[i].y and vs[j].y
    // x: need to check if x is on the left side of the edge
    const isIntersect =
      vs[i].y > y !== vs[j].y > y &&
      // line equation: (y1 - y) / (y1 - y2) = (x1 - x) / (x1 - x2)
      // x = (x2 - x1) * (y - y1) / (y2 - y1) + x1
      // but we only need to check if x is on the left side of the edge
      // so we can simplify the equation to:
      x < ((vs[j].x - vs[i].x) * (y - vs[i].y)) / (vs[j].y - vs[i].y) + vs[i].x;
    if (isIntersect) isInside = !isInside;
  }

  return isInside;
};

export const calculatePointsInsidePolygonStat = (
  points: Point[],
  polygon: Polygon
): PointsInsidePolygonStat => {
  const count = points.filter((point) =>
    checkIsPointInPolygon(point, polygon)
  ).length;
  return {
    percentage: (count / points.length) * 100,
    count,
  };
};
