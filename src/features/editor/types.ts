import { fabric } from "fabric";
import * as material from "material-colors"

export interface EditorHookProps {
  clearSelectionCallback?:()=>void;

}

export const seelectionDependantTools = [
  "fill",
  "stroke-color",
  "stroke-width",
  "font",
  "opacity",
  "filter",
  "remove-bg",
]

export type ActiveTool =
  | "select"
  | "images"
  | "text"
  | "shapes"
  | "ai"
  | "settings"
  | "draw"
  | "fill"
  | "stroke-color"
  | "stroke-width"
  | "font"
  | "opacity"
  | "filter"
  | "remove-bg"
  | "templates";

export const FILL_COLOR = "rgba(0,0,0,1)";
export const STROKE_COLOR = "rgba(0,0,0,1)";
export const STROKE_WIDTH = 1;

export const CIRCLE_OPTIONS = {
  radius: 50,
  fill: FILL_COLOR,
  height: 100,
  width: 100,
  stroke:STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
}

export const RECTANGLE_OPTIONS = {
  left:100,
  top:100,
  fill: FILL_COLOR,
  height: 400,
  width: 400,
  stroke:STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  angle: 0,
};

export const TRIANGLE_OPTIONS = {
  fill: FILL_COLOR,
  height: 400,
  width: 400,
  stroke:STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
}

export type BuildEditorProps = {
  canvas: fabric.Canvas;
  fillColor: string;
  setFillColor: (value: string) => void;
  strokeColor: string;
  setStrokeColor: (value: string) => void;
  strokeWidth: number;
  setStrokeWidth: (value: number) => void;
  selectObjects: fabric.Object[];

}

export interface Editor {
  changeFillColor: (value: string) => void;
  changeStrokeColor: (value: string) => void;
  changeStrokeWidth: (value: number) => void;
  addCircle: () => void;
  addRectangle: () => void;
  addFullRectangle: () => void;
  addTriangle: () => void;
  addRotatedTriangle: () => void;
  addDiamond: () => void;
  canvas: fabric.Canvas;
  getActiveFillColor:()=>string
  getActiveStrokeColor:()=>string
  strokeWidth: number;
  selectObjects: fabric.Object[];
}

export const colors = [
  material.red["500"],
  material.pink["500"],
  material.purple["500"],
  material.deepPurple["500"],
  material.indigo["500"],
  material.blue["500"],
  material.lightBlue["500"],
  material.cyan["500"],
  material.teal["500"],
  material.green["500"],
  material.lightGreen["500"],
  material.lime["500"],
  material.yellow["500"],
  material.amber["500"],
  material.orange["500"],
  material.deepOrange["500"],
  material.brown["500"],
  material.blueGrey["500"],
  "transparent",
];