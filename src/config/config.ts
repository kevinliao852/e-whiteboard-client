export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID ?? "";
export const API_SERVER_HOST = process.env.REACT_APP_API_SERVER_HOST ?? "";
export const WEBSOCKET_DRAW_HOST =
  process.env.REACT_APP_WEBSOCKET_DRAW_HOST ?? "";
export const WEBSOCKET_CHAT_HOST =
  process.env.REACT_APP_WEBSOCKET_CHAT_HOST ?? "";

export function isMockApiServerHost(apiServerHost: string): boolean {
  try {
    const { port } = new URL(apiServerHost);
    return port === "3001";
  } catch {
    return false;
  }
}

export function getWebSocketHostErrorMessage(
  websocketHost: string,
  envName: string,
): string | null {
  if (!websocketHost) {
    return `${envName} is not set. Point it to your websocket server, for example ws://localhost:8080, then restart the React dev server.`;
  }

  return null;
}
