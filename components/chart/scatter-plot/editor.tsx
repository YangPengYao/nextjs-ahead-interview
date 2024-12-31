import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import type { Polygon } from "./types";

interface EditorProps {
  polygon: Polygon;
  onUpdatePolygon: (polygon: Polygon) => void;
  onDeletePolygon: (id: string) => void;
}

export const Editor = ({
  polygon,
  onUpdatePolygon,
  onDeletePolygon,
}: EditorProps) => {
  const handleLabelUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdatePolygon({ ...polygon, label: e.target.value });
  };

  const handleColorUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdatePolygon({ ...polygon, color: e.target.value });
  };

  const handleStyleUpdate = (value: "solid" | "dashed") => {
    onUpdatePolygon({ ...polygon, style: value });
  };

  const handleLineWidthUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 1 || value > 6) return;
    onUpdatePolygon({ ...polygon, lineWidth: Number(e.target.value) });
  };

  const handleDisplayTrigger = () => {
    onUpdatePolygon({ ...polygon, isVisible: !polygon.isVisible });
  };

  const handleDelete = () => {
    onDeletePolygon(polygon.id);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" value={polygon.label} onChange={handleLabelUpdate} />

        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          type="color"
          value={polygon.color}
          onChange={handleColorUpdate}
        />

        <div className="space-y-2">
          <Label htmlFor="style">Line Style</Label>
          <Select value={polygon.style} onValueChange={handleStyleUpdate}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lineWidth">Line Width</Label>
          <Input
            id="lineWidth"
            type="number"
            min="1"
            max="6"
            value={polygon.lineWidth}
            onChange={handleLineWidthUpdate}
          />
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleDisplayTrigger}>
            {polygon.isVisible ? "Hide" : "Show"}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
