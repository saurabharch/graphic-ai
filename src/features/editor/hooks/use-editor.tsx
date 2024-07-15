import { fabric } from "fabric";
import { useCallback, useMemo, useState } from "react";
import { useAutoResize } from "./use-auto-resize";
import {
  BuildEditorProps,
  CIRCLE_OPTIONS,
  Editor,
  EditorHookProps,
  FILL_COLOR,
  RECTANGLE_OPTIONS,
  STROKE_COLOR,
  STROKE_WIDTH,
} from "../types";
import { UseCanvasEvents } from "./use-canvas-events";
import { isTextType } from "../utils";

const bulkEditor = ({
  canvas,

  fillColor,
  setFillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  selectObjects,
}: BuildEditorProps): Editor => {
  const getWorkspace = () => {
    return canvas?.getObjects().find((object) => object.name === "clip");
  };

  const center = (object: fabric.Object) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();

    if (!center) {
      return;
    }

    //@ts-ignore
    canvas?._centerObject(object, center);
  };

  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas?.add(object);
    canvas?.setActiveObject(object);
  };
  return {
    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas?.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
      canvas?.renderAll();
    },
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas?.getActiveObjects().forEach((object) => {
        //handling text types because they don't have the stroke
        if(isTextType(object.type)){
          object.set({ fill: value });
          return;
        }
        object.set({ stroke: value });
      });

      canvas?.renderAll();
    },

    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas?.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });

      canvas?.renderAll();
    },
    addCircle: () => {
      const circle = new fabric.Circle({
        ...CIRCLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });
      addToCanvas(circle);
    },
    addRectangle: () => {
      const rectangle = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 40,
        ry: 40,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });
      addToCanvas(rectangle);
    },

    addFullRectangle: () => {
      const rectangle = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });
      addToCanvas(rectangle);
    },

    addTriangle: () => {
      const triangle = new fabric.Triangle({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });
      addToCanvas(triangle);
    },

    addRotatedTriangle: () => {
      const triangle = new fabric.Triangle({
        ...RECTANGLE_OPTIONS,
        angle: 180,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });
      addToCanvas(triangle);
    },

    addDiamond: () => {
      const diamond = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 40,
        ry: 40,
        angle: 45,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });
      addToCanvas(diamond);
    },
    canvas,
    getActiveFillColor:()=>{
      const selectedObject = selectObjects[0];
      if(!selectedObject){
        return fillColor;
      }
      const value = selectedObject.get("fill") || fillColor;

      // Currently gradients and patterns are not supported thats why I have did this
      return value as string;
    },
    getActiveStrokeColor:()=>{
      const selectedObject = selectObjects[0];
      if(!selectedObject){
        return fillColor;
      }
      const value = selectedObject.get("stroke") || strokeColor;

      // Currently gradients and patterns are not supported thats why I have did this
      return value;
    },
    strokeWidth,
    selectObjects,
  };
};


export const useEditor = ({
  clearSelectionCallback
}:EditorHookProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectObjects, setSelectObjects] = useState<fabric.Object[]>([]);

  const [fillColor, setFillColor] = useState<string>(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState<string>(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState<number>(STROKE_WIDTH);

  useAutoResize({
    canvas,
    container,
  });

  UseCanvasEvents({
    canvas,
    setSelectObjects,
    clearSelectionCallback,
  });
  const editor = useMemo(() => {
    if (canvas) {
      return bulkEditor({
        canvas,
        fillColor,
        setFillColor,
        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
        selectObjects
      });
    }

    return undefined;
  }, [canvas, fillColor, strokeColor, strokeWidth, selectObjects]);

  const init = useCallback(
    ({
      intialCanvas,
      initialContainer,
    }: {
      intialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
    }) => {
      const initialWorkspace = new fabric.Rect({
        width: 900,
        height: 600,
        name: "clip",
        fill: "white",
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
          color: "rgba(0,0,0,0.8)",
          blur: 5,
        }),
      });
      intialCanvas.setWidth(initialContainer.offsetWidth);
      intialCanvas.setHeight(initialContainer.offsetHeight);
      intialCanvas.add(initialWorkspace);
      intialCanvas.centerObject(initialWorkspace);
      //This is because anything outside the workspace (White box centered - working space) will be clipped
      intialCanvas.clipPath = initialWorkspace;
      setCanvas(intialCanvas);
      setContainer(initialContainer);
    },
    []
  );
  return { init, editor };
};
