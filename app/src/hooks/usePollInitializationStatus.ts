import { fetchUserConfig } from "@/app/[locale]/(auth)/dashboard/api";
import { useEffect, useState } from "react";

export const usePollInitializationStatus = (userId: string | undefined) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const pollStatus = async () => {
      const intervalId = setInterval(async () => {
        try {
          const userConfig = await fetchUserConfig(userId);
          if (userConfig && userConfig.is_initialized) {
            setIsInitialized(true);
            clearInterval(intervalId); // Stop polling once initialized
          }
        } catch (e) {
          console.error("Failed to poll initialization status", e);
        }
      }, 5000);

      return () => clearInterval(intervalId); // Cleanup on unmount
    };

    pollStatus();
  }, [userId]);

  return isInitialized;
};
