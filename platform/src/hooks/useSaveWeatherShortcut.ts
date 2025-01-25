import { useState } from "react";
import axios from "axios";

export const useSaveWeatherShortcut = (userId: string, location: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setIsLoading(true);
    try {
      await axios.post(`/api/shortcuts?userId=${userId}`, {
        location,
      });
      console.log("Saved");
    } catch (err) {
      setError("Failed to save");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { save, isLoading, error };
};
