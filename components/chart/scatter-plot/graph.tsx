"use client";

import React from "react";
import * as d3 from "d3";
import { TypographyH2, TypographyH3 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

import type { Point, Polygon, PointsInsidePolygonStat } from "./types";
import { generateRandomColor, calculatePointsInsidePolygonStat } from "./utils";
import { Editor } from "./editor";

interface ScatterPlotProps {
  title: string;
  width: number;
  height: number;
  labelX: string;
  labelY: string;
  data: Point[];
}

export const ScatterPlot = ({
  title,
  width,
  height,
  labelX,
  labelY,
  data,
}: ScatterPlotProps) => {
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [currentPolygon, setCurrentPolygon] = React.useState<Point[]>([]);
  const [polygons, setPolygons] = React.useState<Polygon[]>([]);
  const [pointsInsidePolygonStats, setPointsInsidePolygonStats] =
    React.useState<Record<string, PointsInsidePolygonStat>>({});

  // canvas configuration
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // scale x
  const minX = d3.min(data, (d) => d.x) ?? 0;
  const maxX = d3.max(data, (d) => d.x) ?? 0;
  const scaleX = React.useMemo(
    () => d3.scaleLinear().domain([minX, maxX]).range([0, innerWidth]),
    [minX, maxX, innerWidth]
  );

  // scale y
  const minY = d3.min(data, (d) => d.y) ?? 0;
  const maxY = d3.max(data, (d) => d.y) ?? 0;
  const scaleY = React.useMemo(
    () => d3.scaleLinear().domain([minY, maxY]).range([innerHeight, 0]),
    [minY, maxY, innerHeight]
  );

  const drawCanvasAxes = React.useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // axes configuration
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.font = "12px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      const tickLength = 6;
      const spaceBetweenTextAndTick = 20;

      // draw x axis
      ctx.beginPath();
      ctx.moveTo(0, scaleY(minY));
      ctx.lineTo(innerWidth, scaleY(minY));
      ctx.stroke();

      // draw x axis' ticks
      ctx.textBaseline = "bottom";
      const xTicks = scaleX.ticks(8);
      xTicks.forEach((d) => {
        ctx.beginPath();
        ctx.moveTo(scaleX(d), scaleY(minY));
        ctx.lineTo(scaleX(d), scaleY(minY) + tickLength);
        ctx.fillText(
          d.toString(),
          scaleX(d),
          scaleY(minY) + spaceBetweenTextAndTick
        );
        ctx.stroke();
      });

      // draw y axis
      ctx.beginPath();
      ctx.moveTo(scaleX(minX), 0);
      ctx.lineTo(scaleX(minX), innerHeight);
      ctx.stroke();

      // draw y axis' ticks
      ctx.textBaseline = "middle";
      const yTicks = scaleY.ticks(8);
      yTicks.forEach((d) => {
        ctx.beginPath();
        ctx.moveTo(scaleX(minX), scaleY(d));
        ctx.lineTo(scaleX(minX) - tickLength, scaleY(d));
        ctx.fillText(
          d.toString(),
          scaleX(minX) - spaceBetweenTextAndTick,
          scaleY(d)
        );
        ctx.stroke();
      });
    },
    [innerHeight, innerWidth, minX, minY, scaleY, scaleX]
  );

  const drawCanvasLabels = React.useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.font = "16px Arial";
      ctx.fillStyle = "black";

      // draw x label
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(labelX, innerWidth / 2, innerHeight + margin.top + 24);

      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(labelY, -innerHeight / 2, (margin.left - 20) * -1);
    },
    [innerHeight, innerWidth, labelX, labelY, margin.top, margin.left]
  );

  const drawPoints = React.useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = "#cccccc";
      data.forEach((d) => {
        ctx.beginPath();
        ctx.arc(scaleX(d.x), scaleY(d.y), 1, 0, 2 * Math.PI);
        ctx.fill();
      });
    },
    [data, scaleX, scaleY]
  );

  const drawCurrentPolygon = React.useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (currentPolygon.length > 1) {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.beginPath();
        currentPolygon.forEach((d, i) => {
          if (i === 0) {
            ctx.moveTo(scaleX(d.x), scaleY(d.y));
          } else {
            ctx.lineTo(scaleX(d.x), scaleY(d.y));
          }
        });
        ctx.stroke();
      }
    },
    [currentPolygon, scaleX, scaleY]
  );

  const drawCompletedPolygons = React.useCallback(
    (ctx: CanvasRenderingContext2D) => {
      polygons.forEach((polygon) => {
        if (!polygon.isVisible) return;

        ctx.strokeStyle = polygon.color;
        ctx.lineWidth = polygon.lineWidth;

        if (polygon.style === "dashed") {
          ctx.setLineDash([5, 5]);
        } else {
          ctx.setLineDash([]);
        }

        ctx.beginPath();
        polygon.points.forEach((d, i) => {
          if (i === 0) {
            ctx.moveTo(scaleX(d.x), scaleY(d.y));
          } else {
            ctx.lineTo(scaleX(d.x), scaleY(d.y));
          }
        });
        ctx.closePath();
        ctx.stroke();

        // draw label
        ctx.font = "14px Arial";
        ctx.fillStyle = polygon.color;
        const centerX = d3.mean(polygon.points, (d) => d.x) ?? 0;
        const centerY = d3.mean(polygon.points, (d) => d.y) ?? 0;
        const { count = 0, percentage = 0 } =
          pointsInsidePolygonStats[polygon.id] ?? {};
        const percentageDisplay = `${percentage.toFixed(1)}%`;
        const text = `${polygon.label} (${count} cells, ${percentageDisplay})`;
        ctx.fillText(text, scaleX(centerX), scaleY(centerY));
      });
    },
    [polygons, pointsInsidePolygonStats, scaleX, scaleY]
  );

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // clear canvas
    ctx.clearRect(0, 0, width, height);

    // apply transformation matrix
    ctx.translate(margin.left, margin.top);

    // using ctx.save() and ctx.restore() to make sure the rotation only applies to this operation
    // source: https://juejin.cn/post/6844903879599996942
    ctx.save();
    drawCanvasAxes(ctx);
    ctx.restore();

    ctx.save();
    drawCanvasLabels(ctx);
    ctx.restore();

    ctx.save();
    drawPoints(ctx);
    ctx.restore();

    ctx.save();
    drawCurrentPolygon(ctx);
    ctx.restore();

    ctx.save();
    drawCompletedPolygons(ctx);
    ctx.restore();

    // reset transformation matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, [
    width,
    height,
    margin.left,
    margin.top,
    drawCanvasAxes,
    drawCanvasLabels,
    drawPoints,
    drawCurrentPolygon,
    drawCompletedPolygons,
  ]);

  const handlePolygonDraw = () => {
    setIsDrawing(!isDrawing);
    if (!isDrawing) {
      setCurrentPolygon([]);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = scaleX.invert(e.clientX - rect.left - margin.left);
    const y = scaleY.invert(e.clientY - rect.top - margin.top);

    // check if clicking point near the start point to close the polygon
    if (currentPolygon.length > 2) {
      const startPoint = currentPolygon[0];
      const distance = Math.sqrt(
        (startPoint.x - x) ** 2 + (startPoint.y - y) ** 2
      );
      if (distance < 6) {
        const newPolygon: Polygon = {
          id: Date.now().toString(),
          points: currentPolygon,
          label: `Polygon-${polygons.length + 1}`,
          color: generateRandomColor(),
          isVisible: true,
          style: "solid",
          lineWidth: 2,
        };
        setPolygons([...polygons, newPolygon]);
        setCurrentPolygon([]);
        setIsDrawing(false);
        return;
      }
    }

    setCurrentPolygon([...currentPolygon, { x, y }]);
  };

  // recalculate points inside polygon stats
  React.useEffect(() => {
    const newPointsInsidePolygonStats: Record<string, PointsInsidePolygonStat> =
      {};
    polygons.forEach((polygon) => {
      newPointsInsidePolygonStats[polygon.id] =
        calculatePointsInsidePolygonStat(data, polygon);
    });
    setPointsInsidePolygonStats(newPointsInsidePolygonStats);
  }, [polygons, data]);

  const handlePolygonUpdate = React.useCallback((updatedPolygon: Polygon) => {
    setPolygons((prevPolygons) =>
      prevPolygons.map((polygon) =>
        polygon.id === updatedPolygon.id ? updatedPolygon : polygon
      )
    );
  }, []);

  const handlePolygonDelete = React.useCallback((id: string) => {
    setPolygons((prevPolygons) =>
      prevPolygons.filter((polygon) => polygon.id !== id)
    );
  }, []);

  return (
    <div>
      <div className="flex space-x-7">
        <TypographyH2>{title}</TypographyH2>
        <Button
          variant={isDrawing ? "secondary" : "default"}
          onClick={handlePolygonDraw}
        >
          {isDrawing ? "Cancel Drawing" : "Arbitrary Polygon"}
        </Button>
      </div>
      <div className="flex space-x-6">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onClick={handleCanvasClick}
        />
        <div className="self-start w-64">
          <TypographyH3>Polygon Group</TypographyH3>
          <div className="space-y-6 max-h-[600px] overflow-y-auto mt-6">
            {polygons.map((polygon) => (
              <Editor
                key={polygon.id}
                polygon={polygon}
                onUpdatePolygon={handlePolygonUpdate}
                onDeletePolygon={handlePolygonDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
