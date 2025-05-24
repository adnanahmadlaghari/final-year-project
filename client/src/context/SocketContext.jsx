import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { io } from "socket.io-client";

import { createContext, useRef, useEffect, useContext } from "react";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();


  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });
      socket.current.on("connect", () => {
        console.log("connected to socket server");
      });

      const handleReceiveMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage, addContactInContactList } = useAppStore.getState();
        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
            addMessage(message)
        }
        addContactInContactList(message)
      };

    const  handleRecieveChannelMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage, addChannelInChannelList } = useAppStore.getState();
        if(selectedChatType !== undefined && selectedChatData._id === message.channelId){
          addMessage(message)
        }
        addChannelInChannelList(message)
      }

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("recieve-channel-message", handleRecieveChannelMessage)
      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
