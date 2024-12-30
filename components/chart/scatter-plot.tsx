"use client";

import React from "react";
import * as d3 from "d3";
import { TypographyH2 } from "@/components/ui/typography";

interface ScatterPlotProps {
  title: string;
  width: number;
  height: number;
  labelX: string;
  labelY: string;
  data: { x: number; y: number }[];
}

export const ScatterPlot = ({
  title,
  width,
  height,
  labelX,
  labelY,
  data,
}: ScatterPlotProps) => {
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

      // draw y label
      // using ctx.save() and ctx.restore() to make sure the rotation only applies to this operation
      // source: https://juejin.cn/post/6844903879599996942
      ctx.save();
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(labelY, -innerHeight / 2, (margin.left - 20) * -1);
      ctx.restore();
    },
    [innerHeight, innerWidth, labelX, labelY, margin.top, margin.left]
  );

  const drawScatterPlot = React.useCallback(
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

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.translate(margin.left, margin.top);

    drawCanvasAxes(ctx);
    ctx.save();
    drawCanvasLabels(ctx);
    ctx.restore();
    drawScatterPlot(ctx);
  }, [
    drawCanvasAxes,
    drawCanvasLabels,
    drawScatterPlot,
    height,
    margin.left,
    margin.top,
    width,
  ]);

  return (
    <div>
      <TypographyH2>{title}</TypographyH2>
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};
