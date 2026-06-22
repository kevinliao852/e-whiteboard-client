import { useRef, useEffect, useCallback, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { API_SERVER_HOST } from "../../config/config";
import { useWhiteboardWebSocket } from "../../hooks/useWhiteboard";
import { getApiHostErrorMessage, parseJsonResponse } from "../../utils/api";

type DrawingLineData = {
  start: [number, number];
  end: [number, number];
};

type CursorPointData = {
  x: number;
  y: number;
  active?: boolean;
};

type CursorBroadcast = CursorPointData & {
  connection_id: string;
  sender_id: number;
  sender_name: string;
};

type WhiteboardPoint = DrawingLineData & {
  id: number;
  whiteboard_id: number | string;
};

type RemoteCursor = CursorBroadcast;

const DEFAULT_WIDTH = 960;
const DEFAULT_HEIGHT = 540;

const CanvasFrame = styled.div`
  position: relative;
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
  position: relative;
  z-index: 1;
`;

const CursorLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
`;

const CursorMark = styled.div<{ $x: number; $y: number; $accent: string }>`
  position: absolute;
  left: ${(props) => props.$x}px;
  top: ${(props) => props.$y}px;
  transform: translate(8px, 8px);
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.55rem;
  border-radius: 999px;
  background: rgba(24, 36, 61, 0.88);
  color: #fff;
  font-size: 0.75rem;
  line-height: 1;
  white-space: nowrap;
  box-shadow: 0 12px 22px rgba(24, 36, 61, 0.18);

  &::before {
    content: "";
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 999px;
    background: ${(props) => props.$accent};
    box-shadow: 0 0 0 0.24rem rgba(255, 255, 255, 0.12);
    flex: 0 0 auto;
  }
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

const setCursorData = (ws: WebSocket, data: CursorPointData) => {
  const shouldSend = ws.readyState === ws.OPEN && data;

  if (shouldSend) {
    ws.send(
      JSON.stringify({
        scope: "cursor",
        data,
      }),
    );
  }
};

export const Canvas = (): JSX.Element => {
  const id = useParams<{ id?: string }>().id;
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [remoteCursors, setRemoteCursors] = useState<Record<string, RemoteCursor>>(
    {},
  );
  const { wsRef } = useWhiteboardWebSocket(id, historyLoaded);
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

  const sendCursorData = useCallback(
    (data: CursorPointData) => {
      if (!wsRef.current) {
        return;
      }

      setCursorData(wsRef.current, data);
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
      storeCursorCallback: sendCursorData,
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
    if (!id) {
      controllerRef.current?.replaceLines([]);
      setHistoryLoaded(false);
      return;
    }

    const configError = getApiHostErrorMessage(API_SERVER_HOST);

    if (configError) {
      console.error(configError);
      return;
    }

    let isActive = true;

    fetch(`${API_SERVER_HOST}/v1/whiteboards/${id}/points`, {
      credentials: "include",
    })
      .then((response) => parseJsonResponse<WhiteboardPoint[]>(response))
      .then((points) => {
        if (!isActive) {
          return;
        }

        controllerRef.current?.replaceLines(
          points.map(({ start, end }) => ({ start, end })),
        );
        setHistoryLoaded(true);
      })
      .catch((error: Error) => {
        if (!isActive) {
          return;
        }

        setHistoryLoaded(false);
        console.error(`Failed to load whiteboard points for ${id}:`, error);
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  useEffect(() => {
    const onmessage = ((event: CustomEvent) => {
      const payload =
        typeof event.detail === "string" ? JSON.parse(event.detail) : event.detail;
      const scope = payload?.scope;

      if (scope === "cursor") {
        const cursor = payload?.data as CursorBroadcast | undefined;

        if (!cursor?.connection_id) {
          return;
        }

        setRemoteCursors((prev) => {
          if (cursor.active === false) {
            const next = { ...prev };
            delete next[cursor.connection_id];
            return next;
          }

          return {
            ...prev,
            [cursor.connection_id]: cursor,
          };
        });

        return;
      }

      const { start, end } = payload?.data || {};

      if (!start || !end) {
        return;
      }

      controllerRef.current?.appendLine(start, end);
    }) as EventListener;

    window.addEventListener("whiteboard-ws-onmessage", onmessage);

    return () => {
      window.removeEventListener("whiteboard-ws-onmessage", onmessage);
    };
  }, []);

  return (
    <CanvasFrame ref={frameRef}>
      <StyledCanvas ref={canvasRef} id="canvas" />
      <CursorLayer>
        {Object.values(remoteCursors).map((cursor) => (
          <CursorMark
            key={cursor.connection_id}
            $x={cursor.x}
            $y={cursor.y}
            $accent={cursor.sender_id % 2 === 0 ? "#0f9d8a" : "#ff6b3d"}
          >
            {cursor.sender_name}
          </CursorMark>
        ))}
      </CursorLayer>
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
  storeCursorCallback: (data: CursorPointData) => void;
};

class CanvasController {
  private lastX = 0;
  private lastY = 0;
  private isDrawing = false;
  private displayWidth: number;
  private displayHeight: number;
  private lineSegments: DrawingLineData[] = [];
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
    this.redraw();
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing) {
      return;
    }

    const startPoint: [number, number] = [this.lastX, this.lastY];
    const nextPoint: [number, number] = [event.offsetX, event.offsetY];
    this.appendLine(startPoint, nextPoint);
    [this.lastX, this.lastY] = nextPoint;

    this.canvasMetaData.storeCallback({
      start: startPoint,
      end: nextPoint,
    });
  }

  appendLine(start: [number, number], end: [number, number]) {
    this.lineSegments.push({ start, end });
    this.drawLine(start, end);
  }

  replaceLines(lines: DrawingLineData[]) {
    this.lineSegments = [...lines];
    this.redraw();
  }

  private redraw() {
    this.ctx.clearRect(0, 0, this.displayWidth, this.displayHeight);

    this.lineSegments.forEach(({ start, end }) => {
      this.drawLine(start, end);
    });
  }

  private drawLine(start: [number, number], end: [number, number]) {
    this.ctx.beginPath();
    this.ctx.moveTo(start[0], start[1]);
    this.ctx.lineTo(end[0], end[1]);
    this.ctx.stroke();
  }

  setIsDraw(isDrawing: boolean) {
    this.isDrawing = isDrawing;
  }

  updateCursor(x: number, y: number) {
    this.canvasMetaData.storeCursorCallback({
      x,
      y,
      active: true,
    });
  }

  hideCursor(x: number, y: number) {
    this.canvasMetaData.storeCursorCallback({
      x,
      y,
      active: false,
    });
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
      this.controller.updateCursor(event.offsetX, event.offsetY);
    };

    const mouseMoveFunc = (event: MouseEvent) => {
      this.controller.updateCursor(event.offsetX, event.offsetY);
      this.controller.draw(event);
    };

    const mouseUpFunc = () => this.controller.setIsDraw(false);
    const mouseOutFunc = (event: MouseEvent) => {
      this.controller.setIsDraw(false);
      this.controller.hideCursor(event.offsetX, event.offsetY);
    };

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
