import { useState, useEffect } from 'react';
import socket from '../services/socket';

const useSocket = (eventName) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const handler = (eventData) => {
            setData(eventData);
        };

        socket.on(eventName, handler);

        return () => {
            socket.off(eventName, handler);
        };
    }, [eventName]);

    return data;
};

export default useSocket;