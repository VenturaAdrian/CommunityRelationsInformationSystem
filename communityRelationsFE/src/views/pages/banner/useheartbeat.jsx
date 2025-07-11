// useHeartbeat.js
import { useEffect } from 'react';
import config from 'config';

const useHeartbeat = (userId) => {
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      navigator.sendBeacon(
        `${config.baseApi}/heartbeat`,
        JSON.stringify({ userId })
      );
    }, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, [userId]);
};

export default useHeartbeat;