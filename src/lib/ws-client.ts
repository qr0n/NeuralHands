export type WSMessageHandler = (data: any) => void;

export function makeWS(url: string, onMsg: WSMessageHandler) {
  const ws = new WebSocket(url);

  ws.onopen = () => {
    // console.log("WS connected", url);
  };

  ws.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      onMsg(data);
    } catch {
      // non-JSON message; ignore
    }
  };

  ws.onerror = () => {
    // console.warn("WS error", url);
  };

  return ws;
}
