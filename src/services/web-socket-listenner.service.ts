import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client, over } from "stompjs";

let stompClient: Client | null = null;

const connectWebSocket = (): Promise<Client> => {
  return new Promise((resolve, reject) => {
    if (stompClient && stompClient.connected) {
      return resolve(stompClient);
    }

    const socket = new SockJS("http://localhost:8080/ws"); // Cambia la URL si es necesario
    
    stompClient = over(socket);
    stompClient.connect({}, () => {
      console.log("WebSocket connected");
      resolve(stompClient!);
    }, (error) => {
      console.error("Error connecting WebSocket", error);
      reject(error);
    });
  });
};

export function useWebSocketListener(
  topic: string,
  onMessage: (message: string) => void
) {
  const [isConnected, setIsConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    let subscription: any;

    // Intentar establecer la conexión del WebSocket
    connectWebSocket().then(client => {
      // Al conectarse, se establece la suscripción al tema (topic)
      subscription = client.subscribe(topic, (message) => {
        try {
          // Si el mensaje es un JSON, puedes hacer un parse
          const parsedMessage = JSON.parse(message.body);
          onMessageRef.current(parsedMessage);
        } catch (e) {
          // Si el mensaje no es JSON, solo se pasa como está
          onMessageRef.current(message.body);
        }
      });
      setIsConnected(true); // Marcamos como conectado
    }).catch((error) => {
      console.error("WebSocket connection failed:", error);
    });

    // Limpiar suscripción y desconectar cuando el componente se desmonte
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
          console.log("WebSocket disconnected");
          setIsConnected(false); // Desmarcamos como desconectado
        });
      }
    };
  }, [topic]);

  return { isConnected };
}
