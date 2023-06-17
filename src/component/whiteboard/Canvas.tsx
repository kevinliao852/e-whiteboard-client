import { useRef, useEffect, useCallback, useState } from "react";
import { useParams } from "react-router";
import { Label } from "semantic-ui-react";
import { useAppSelecter } from "../../app/hooks";
import "../../css/style.css";
import { useWhiteboardWebSocket } from "../../hooks/useWhiteboard";

type DrawingLineData = {
  start: Array<number>;
  end: Array<number>;
};

export const Canvas = (): JSX.Element => {
  const id = useParams<{ id: string }>().id;
  const { wsRef } = useWhiteboardWebSocket(id);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const status = useAppSelecter((state) => state.whiteboard.status);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const sendDrawingData = useCallback(
    function (data: DrawingLineData) {
      if (!wsRef.current) {
        return;
      }

      const ws = wsRef.current;

      if (ws.readyState === ws.OPEN && data) {
        ws.send(JSON.stringify(data));
      }
    },
    [wsRef]
  );

  useEffect(() => {
    console.log("here", canvasRef);
    if (!canvasRef.current) {
      return;
    }
    setCtx(canvasRef.current?.getContext("2d"));
  }, []);

  useEffect(
    function syncDrawingData() {
      const onmessage = function (event: CustomEvent) {
        if (!ctx) return;
        if (!event?.detail?.data) return;

        const line = JSON.parse(event.detail.data);

        const { start, end } = line;
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();
      } as EventListener;

      window.addEventListener("whiteboard-ws-onmessage", onmessage);
    },
    [ctx]
  );

  useEffect(
    function setupDrawing() {
      if (!canvasRef || !canvasRef.current || !ctx) {
        return;
      }

      canvasRef.current.width = 1920;
      canvasRef.current.height = 1080;

      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#ac0000";

      let isDrawing = false;

      let lastX = 0;
      let lastY = 0;

      function draw(e: MouseEvent) {
        if (!isDrawing || !ctx) return;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

        const drawingContent = {
          start: [lastX, lastY],
          end: [e.offsetX, e.offsetY],
        };
        sendDrawingData(drawingContent);

        [lastX, lastY] = [e.offsetX, e.offsetY];
      }

      canvasRef.current.addEventListener("mousedown", (e: MouseEvent) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
      });

      canvasRef.current.addEventListener("mousemove", draw);
      canvasRef.current.addEventListener("mouseup", () => (isDrawing = false));
      canvasRef.current.addEventListener("mouseout", () => (isDrawing = false));
    },
    [ctx, sendDrawingData]
  );

  return (
    <>
      <Label color={status === "disconnected" ? "red" : "green"} attached="top">
        {status === "disconnected" ? "Error" : "Connected"}
      </Label>
      <canvas
        ref={canvasRef}
        id="canvas"
        style={{ border: "solid 2px red" }}
      ></canvas>
    </>
  );
};
