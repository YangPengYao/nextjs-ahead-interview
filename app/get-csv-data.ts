"use server";

import fs from "fs";
import path from "path";
import Papa from "papaparse";

type HeaderCol =
  | "FS INT LIN"
  | "SS INT LIN"
  | "Kappa-FITC"
  | "Lambda-PE,CD10-ECD"
  | "CD5-PC5.5"
  | "CD200-PC7"
  | "CD34-APC"
  | "CD38-APC-A700"
  | "CD20-APC-A750"
  | "CD19-PB"
  | "CD45-KrO"
  | "TIME"
  | "FS PEAK LIN"
  | "SS PEAK LIN";

export const getCSVData = async () => {
  // Why use process.cwd()
  // https://nextjs.org/docs/pages/api-reference/functions/get-static-props#reading-files-use-processcwd
  const csvFilePath = path.join(process.cwd(), "data", "CD45_pos.csv");
  const csvFile = await fs.promises.readFile(csvFilePath, "utf8");
  const result = Papa.parse(csvFile, { header: true, dynamicTyping: true });
  return result;
};

export const get2DChartData = async (
  coordinateObj: { x: HeaderCol; y: HeaderCol },
  data: Record<HeaderCol, number>[]
) => {
  const { x, y } = coordinateObj;
  return {
    x: x,
    y: y,
    list: data.map((item) => {
      return {
        x: item[x],
        y: item[y],
      };
    }),
  };
};

export const get3DChartData = async (
  coordinateObj: { x: HeaderCol; y: HeaderCol; z: HeaderCol },
  data: Record<HeaderCol, number>[]
) => {
  const { x, y, z } = coordinateObj;
  return {
    x: x,
    y: y,
    z: z,
    list: data.map((item) => {
      return {
        x: item[x],
        y: item[y],
        z: item[z],
      };
    }),
  };
};
