import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (!userInfo) return;

    const newSocket = io(HOST, {
      withCredentials: true,
      query: { userId: userInfo.id },
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
    });

    // Store the socket in ref and state
    socketRef.current = newSocket;
    setSocket(newSocket);

    const handleReceiveMessage = (message) => {
      if (!socketRef.current) {
        console.error("Socket is not connected");
        return;
      }

      console.log("Raw received message:", message);

      if (!message || typeof message !== "object") {
        console.error("Invalid message format:", message);
        return;
      }

      const senderId = message?.sender?._id;
      const recipientId = message?.recipient?._id;

      if (!senderId || !recipientId) {
        console.warn("Message is missing sender or recipient:", message);
        return;
      }

      const { selectedChatData, selectedChatType, addMessage } =
        useAppStore.getState();

      if (
        selectedChatType !== undefined &&
        (selectedChatData._id === senderId || selectedChatData._id === recipientId)
      ) {
        console.log("Message received:", message);
        addMessage(message);
      }
    };

    newSocket.on("recieveMessage", handleReceiveMessage);

    return () => {
      newSocket.off("recieveMessage", handleReceiveMessage);
      newSocket.disconnect();
    };
  }, [userInfo]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
