import { useRef, useEffect, useState } from 'react'
import { Label } from 'semantic-ui-react'
import '../css/style.css';
interface DrawingLineData {
    start: Array<number>;
    end: Array<number>;
}

export const Canvas = (): JSX.Element => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [data, setData] = useState<DrawingLineData>();
    const [socket, setSocket] = useState<WebSocket>();
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [status, setStatus] = useState<'red' | 'green'>('red');


    useEffect(function initWebsocketAndCanvas() {
        if (!canvasRef || !canvasRef.current) {
            return
        }
        const host = process.env.REACT_APP_WEBSOCKET_DRAW_HOST as string
        const sockInstance = new WebSocket(host)
        sockInstance.onerror = (event) => {
            setStatus('red');
            setSocket(new WebSocket(host))
        }
        sockInstance.onopen = function (event) {
            setStatus('green');
        };
        sockInstance.onclose = function (event) {
            setStatus('red');

        };
        setCtx(canvasRef.current.getContext('2d'));
        setSocket(sockInstance);
    }, []);

    useEffect(function syncDrawingData() {
        if (!socket) return;

        socket.onmessage = function (event: MessageEvent) {

            if (!ctx) return;
            if (!event?.data) return;

            const line = JSON.parse(event.data);

            const { start, end } = line;
            ctx.moveTo(start[0], start[1]);
            ctx.lineTo(end[0], end[1]);
            ctx.stroke();
        };
    }, [socket, ctx]);

    useEffect(function sendDrawingData() {
        if (socket?.readyState === 1 && data) {
            socket.send(JSON.stringify(data))
        }
    }, [data, socket]);

    useEffect(function setupDrawing() {
        if (!canvasRef || !canvasRef.current || !ctx) {
            return;
        }

        canvasRef.current.width = 1920
        canvasRef.current.height = 1080;

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#ac0000';

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
                end: [e.offsetX, e.offsetY]
            };
            setData(drawingContent);

            [lastX, lastY] = [e.offsetX, e.offsetY];
        }

        canvasRef.current.addEventListener('mousedown', (e: MouseEvent) => {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];

        });

        canvasRef.current.addEventListener('mousemove', draw);
        canvasRef.current.addEventListener('mouseup', () => isDrawing = false);
        canvasRef.current.addEventListener('mouseout', () => isDrawing = false);

    }, [ctx]);

    return (
        <>
            <Label color={status} attached='top'>
                {status === 'red' ? 'Error' : 'Connected'}
            </Label>
            <canvas ref={canvasRef} id="canvas" width="100%" height="100%" style={{ border: "solid 2px red" }}></canvas >
        </>
    );
}