import { useEffect, useState } from "react";
import axios from "axios";

const useBotInitializationStatus = (userId: string | undefined) => {
  const [isBotInitialized, setIsBotInitialized] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    if (!userId) return; // Don't do anything if there is no user ID

    const fetchInitializationStatus = async () => {
      try {
        const response = await axios.get(`/api/userConfig?userId=${userId}`);
        if (response.data?.is_initialized !== undefined) {
          setIsBotInitialized(response.data.is_initialized);
        }
      } catch (error) {
        console.error("Error fetching bot initialization status:", error);
      }
    };

    // Fetch on mount and set up polling (every 5 seconds)
    fetchInitializationStatus();
    const interval = setInterval(() => {
      if (isBotInitialized) {
        // Stop polling once initialized
        clearInterval(interval);
      } else {
        fetchInitializationStatus();
      }
    }, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [userId]);

  return isBotInitialized;
};

export default useBotInitializationStatus;
