import { createRef, useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  changeStatus,
  WhiteBoardStatus,
} from "../features/whiteboard/whiteboardSlice";
import {
  WEBSOCKET_DRAW_HOST,
  getWebSocketHostErrorMessage,
} from "../config/config";

function useStatusChecker() {
  const dispatch = useDispatch();

  const setStatus = useCallback(
    (status: WhiteBoardStatus) => {
      dispatch(changeStatus(status));
    },
    [dispatch],
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

    return () => {
      window.removeEventListener("whiteboard-ws-onerror", onerror);
      window.removeEventListener("whiteboard-ws-onclose", onclose);
      window.removeEventListener("whiteboard-ws-onopen", onopen);
      window.removeEventListener("whiteboard-ws-onmessage", onmessage);
    };
  }, [setStatus]);
}

function whiteboardWebSocket(id: string) {
  const wsUrl = `${WEBSOCKET_DRAW_HOST}/${id}`;
  console.info("opening whiteboard websocket", { id, wsUrl });
  const ws = new WebSocket(wsUrl);

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
    try {
      const payload = JSON.parse(event.data);

      const customEvent = new CustomEvent("whiteboard-ws-onmessage", {
        detail: payload,
      });
      window.dispatchEvent(customEvent);
    } catch {
      const customEvent = new CustomEvent("whiteboard-ws-onmessage", {
        detail: event.data,
      });
      window.dispatchEvent(customEvent);
    }
  };

  return ws;
}

export function useWhiteboardWebSocket(id?: string, enabled = true) {
  useStatusChecker();
  const wsRef = useRef<WebSocket>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id || !enabled) {
      dispatch(changeStatus("disconnected"));
      return;
    }

    const configError = getWebSocketHostErrorMessage(
      WEBSOCKET_DRAW_HOST,
      "REACT_APP_WEBSOCKET_DRAW_HOST",
    );

    if (configError) {
      console.error(configError);
      dispatch(changeStatus("disconnected"));
      return;
    }

    dispatch(changeStatus("connecting"));
    wsRef.current = whiteboardWebSocket(id);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = undefined;
      }
    };
  }, [dispatch, enabled, id]);

  return { wsRef };
}
