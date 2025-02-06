import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = (serverUrl) => {
  console.log("Connecting to socket server at:", serverUrl);
  
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(serverUrl, {
    
      forceNew: true,
    });
    
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    
    setSocket(newSocket);
    
    return () => newSocket.disconnect();
  }, [serverUrl]);

  return socket;
};

export default useSocket;