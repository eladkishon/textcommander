"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export const useInitializationStatus = (userId: string | undefined) => {
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);

  // useEffect(() => {
  //   if (!userId) return;

  //   const fetchStatus = async () => {
  //     try {
  //       const response = await axios.get(
  //         `/api/userConfig`
  //       );
  //       setIsInitialized(response.data.is_initialized);
  //     } catch (error) {
  //       console.error("Failed to fetch initialization status:", error);
  //     }
  //   };

  //   fetchStatus();
  // }, [userId]);

  // return isInitialized;
  return true;
};
