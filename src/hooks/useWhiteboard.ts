import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  changeStatus,
  WhiteBoardStatus,
} from "../features/whiteboard/whiteboard-slice";

function useStatusChecker() {
  const dispatch = useDispatch();

  const setStatus = useCallback(
    (status: WhiteBoardStatus) => {
      dispatch(changeStatus(status));
    },
    [dispatch]
  );

  useEffect(() => {
    const onerror = () => {
      setStatus("disconnected");
    };
    const onopen = () => {
      setStatus("connected");
    };
    const onclose = () => {
      setStatus("disconnected");
    };
    const onmessage = () => {};
    window.addEventListener("whiteboard-ws-onerror", onerror);
    window.addEventListener("whiteboard-ws-onclose", onclose);
    window.addEventListener("whiteboard-ws-onopen", onopen);
    window.addEventListener("whiteboard-ws-onmessage", onmessage);
  }, [setStatus]);
}

function whiteboardWebSocket() {
  const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_DRAW_HOST!);

  ws.onerror = (event: Event) => {
    const customEvent = new CustomEvent("whiteboard-ws-onerror", {
      detail: event,
    });
    window.dispatchEvent(customEvent);
  };

  ws.onopen = function (event: Event) {
    const customEvent = new CustomEvent("whiteboard-ws-onopen", {
      detail: event,
    });
    window.dispatchEvent(customEvent);
  };

  ws.onclose = function (event: CloseEvent) {
    const customEvent = new CustomEvent("whiteboard-ws-onclose", {
      detail: event,
    });
    window.dispatchEvent(customEvent);
  };

  ws.onmessage = function (event: MessageEvent) {
    const customEvent = new CustomEvent("whiteboard-ws-onmessage", {
      detail: event,
    });
    window.dispatchEvent(customEvent);
  };

  return ws;
}

export function useWhiteboardWebSocket() {
	const _ = useStatusChecker()
  const wsRef = useRef<WebSocket>();

  useEffect(() => {
    wsRef.current = whiteboardWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { wsRef };
}
