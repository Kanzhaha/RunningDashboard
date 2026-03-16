import { useCallback, useEffect, useRef, useState } from 'react';

interface ESPWebSocketState {
  isConnected: boolean;
  lastMessage: string | null;
  error: string | null;
}

const WS_URL = process.env.REACT_APP_ESP_WS_URL || '';

export const useESPWebSocket = () => {
  const socketRef = useRef<WebSocket | null>(null);

  const [wsState, setWsState] = useState<ESPWebSocketState>({
    isConnected: false,
    lastMessage: null,
    error: null,
  });

  const connect = useCallback(() => {
    if (!WS_URL) {
      setWsState((prev) => ({
        ...prev,
        error: 'REACT_APP_ESP_WS_URL belum diisi di .env',
      }));
      return;
    }

    // Cegah HTTPS page membuka ws:// yang insecure
    if (window.location.protocol === 'https:' && WS_URL.startsWith('ws://')) {
      setWsState((prev) => ({
        ...prev,
        error: 'Blocked: HTTPS page cannot open insecure ws:// connection',
        isConnected: false,
      }));
      return;
    }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const socket = new WebSocket(WS_URL);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('[WS] connected');
        setWsState({
          isConnected: true,
          lastMessage: null,
          error: null,
        });
      };

      socket.onmessage = (event) => {
        console.log('[WS] message:', event.data);
        setWsState((prev) => ({
          ...prev,
          lastMessage: String(event.data),
        }));
      };

      socket.onerror = () => {
        console.log('[WS] error');
        setWsState((prev) => ({
          ...prev,
          isConnected: false,
          error: 'WebSocket error. Cek IP ESP / Wi-Fi',
        }));
      };

      socket.onclose = () => {
        console.log('[WS] closed');
        setWsState((prev) => ({
          ...prev,
          isConnected: false,
        }));
      };
    } catch (err) {
      console.log('[WS] failed to create socket', err);
      setWsState((prev) => ({
        ...prev,
        isConnected: false,
        error: 'Failed to create WebSocket connection',
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    setWsState((prev) => ({
      ...prev,
      isConnected: false,
    }));
  }, []);

  const sendSpeed = useCallback((speed: number) => {
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN &&
      Number.isFinite(speed)
    ) {
      socketRef.current.send(String(speed));
      console.log('[WS] sent speed:', speed);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return {
    wsState,
    connect,
    disconnect,
    sendSpeed,
  };
};