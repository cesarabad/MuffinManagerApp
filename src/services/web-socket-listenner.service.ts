import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client, over } from "stompjs";

let stompClient: Client | null = null;
let connectingPromise: Promise<Client> | null = null;

export const connectWebSocket = (): Promise<Client> => {
  if (stompClient && stompClient.connected) {
    return Promise.resolve(stompClient);
  }

  if (connectingPromise) {
    return connectingPromise;
  }

  const socket = new SockJS("http://localhost:8080/ws");
  stompClient = over(socket);

  connectingPromise = new Promise((resolve, reject) => {
    stompClient!.connect({}, () => {
      console.log("WebSocket connected");
      resolve(stompClient!);
    }, (error) => {
      console.error("WebSocket connection error:", error);
      connectingPromise = null;
      reject(error);
    });
  });

  return connectingPromise;
};

export function useWebSocketListener(
  topics: string | string[],
  onMessage: (message: string, topic: string) => void
) {
  const [isConnected, setIsConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    let subscriptions: any[] = [];

    const topicList = Array.isArray(topics) ? topics : [topics]; // <-- normalizamos a array
  
    connectWebSocket()
      .then(client => {
        subscriptions = topicList.map(topic =>
          client.subscribe(topic, (message) => {
            onMessageRef.current(message.body, topic);
          })
        );
        setIsConnected(true);
      })
      .catch((error) => {
        console.error("WebSocket connection failed:", error);
      });
  
    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe());
    };
  }, [Array.isArray(topics) ? topics.join(",") : topics]); // <-- dependency correcta

  return { isConnected };
}
