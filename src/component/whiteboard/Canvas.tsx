import { useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { useWhiteboardWebSocket } from "../../hooks/useWhiteboard";

type DrawingLineData = {
  start: Array<number>;
  end: Array<number>;
};

const DEFAULT_WIDTH = 960;
const DEFAULT_HEIGHT = 540;

const CanvasFrame = styled.div`
  width: 100%;
  max-width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 1rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.52);
  box-shadow: inset 0 0 0 1px rgba(24, 36, 61, 0.06);
`;

const StyledCanvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
  border: none;
  cursor: crosshair;
`;

const setDrawingLineData = (ws: WebSocket, data: DrawingLineData) => {
  const shouldSend = ws.readyState === ws.OPEN && data;

  if (shouldSend) {
    ws.send(
      JSON.stringify({
        scope: "whiteboard",
        data,
      }),
    );
  }
};

export const Canvas = (): JSX.Element => {
  const id = useParams<{ id: string }>().id;
  const { wsRef } = useWhiteboardWebSocket(id);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<CanvasController>();

  const sendDrawingData = useCallback(
    (data: DrawingLineData) => {
      if (!wsRef.current) {
        return;
      }

      setDrawingLineData(wsRef.current, data);
    },
    [wsRef],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;

    if (!canvas || !frame) {
      return;
    }

    const controller = new CanvasController({
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      lineJoin: "round",
      lineCap: "round",
      lineWidth: 5,
      strokeStyle: "#ac0000",
      canvas,
      storeCallback: sendDrawingData,
    });
    controllerRef.current = controller;

    const resizeCanvas = () => {
      controller.resize(frame.clientWidth, frame.clientHeight);
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(frame);

    const eventHub = new CanvasEventHub(controller, canvas);
    const cleanupEvents = eventHub.subscrubeEvent();

    return () => {
      resizeObserver.disconnect();
      cleanupEvents();
    };
  }, [sendDrawingData]);

  useEffect(() => {
    if (!wsRef.current) {
      return;
    }

    const onmessage = ((event: CustomEvent) => {
      const rawData = event.detail?.data;
      const data = JSON.parse(rawData);
      const { start, end } = data?.data || {};

      if (!start || !end) {
        return;
      }

      controllerRef.current?.drawLine(start, end);
    }) as EventListener;

    window.addEventListener("whiteboard-ws-onmessage", onmessage);

    return () => {
      window.removeEventListener("whiteboard-ws-onmessage", onmessage);
    };
  }, [wsRef]);

  return (
    <CanvasFrame ref={frameRef}>
      <StyledCanvas ref={canvasRef} id="canvas" />
    </CanvasFrame>
  );
};

type CanvasMetaData = {
  width: number;
  height: number;
  lineJoin: "round";
  lineCap: "round";
  lineWidth: number;
  strokeStyle: "#ac0000";
  canvas: HTMLCanvasElement;
  storeCallback: (data: DrawingLineData) => void;
};

class CanvasController {
  private lastX = 0;
  private lastY = 0;
  private isDrawing = false;
  private displayWidth: number;
  private displayHeight: number;
  ctx: CanvasRenderingContext2D;

  constructor(private canvasMetaData: CanvasMetaData) {
    this.ctx = canvasMetaData.canvas.getContext("2d")!;
    this.displayWidth = canvasMetaData.width;
    this.displayHeight = canvasMetaData.height;
    this.applyContextStyle();
  }

  resize(width: number, height: number) {
    if (!width || !height) {
      return;
    }

    this.displayWidth = width;
    this.displayHeight = height;
    this.canvasMetaData.canvas.width = width;
    this.canvasMetaData.canvas.height = height;
    this.applyContextStyle();
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing) {
      return;
    }

    const startPoint = [this.lastX, this.lastY];
    const nextPoint = [event.offsetX, event.offsetY];
    this.drawLine(startPoint, nextPoint);
    [this.lastX, this.lastY] = nextPoint;

    this.canvasMetaData.storeCallback({
      start: startPoint,
      end: nextPoint,
    });
  }

  drawLine(start: Array<number>, end: Array<number>) {
    this.ctx.beginPath();
    this.ctx.moveTo(start[0], start[1]);
    this.ctx.lineTo(end[0], end[1]);
    this.ctx.stroke();
  }

  setIsDraw(isDrawing: boolean) {
    this.isDrawing = isDrawing;
  }

  setXY(x: number, y: number) {
    this.lastX = x;
    this.lastY = y;
  }

  private applyContextStyle() {
    this.ctx.lineWidth = this.canvasMetaData.lineWidth;
    this.ctx.lineJoin = this.canvasMetaData.lineJoin;
    this.ctx.lineCap = this.canvasMetaData.lineCap;
    this.ctx.strokeStyle = this.canvasMetaData.strokeStyle;
  }
}

class CanvasEventHub {
  constructor(
    private controller: CanvasController,
    private canvas: HTMLCanvasElement,
  ) {}

  subscrubeEvent(): () => void {
    const mouseDownFunc = (event: MouseEvent) => {
      this.controller.setXY(event.offsetX, event.offsetY);
      this.controller.setIsDraw(true);
    };

    const mouseMoveFunc = (event: MouseEvent) => {
      this.controller.draw(event);
    };

    const mouseUpFunc = () => this.controller.setIsDraw(false);
    const mouseOutFunc = () => this.controller.setIsDraw(false);

    this.canvas.addEventListener("mousedown", mouseDownFunc);
    this.canvas.addEventListener("mousemove", mouseMoveFunc);
    this.canvas.addEventListener("mouseup", mouseUpFunc);
    this.canvas.addEventListener("mouseout", mouseOutFunc);

    return () => {
      this.canvas.removeEventListener("mousedown", mouseDownFunc);
      this.canvas.removeEventListener("mousemove", mouseMoveFunc);
      this.canvas.removeEventListener("mouseup", mouseUpFunc);
      this.canvas.removeEventListener("mouseout", mouseOutFunc);
    };
  }
}
