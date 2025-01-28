"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useInitializationStatus = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["is_initialized", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("userId is required");
      }

      const response = await axios.get(`/api/userConfig?userId=${userId}`);

      return response.data.is_initialized;
    },
    enabled: !!userId,
  });
};
