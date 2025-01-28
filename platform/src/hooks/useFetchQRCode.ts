"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useFetchQRCode = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["qr_code", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("userId is required");
      }

      const response = await axios.get(`/api/botAuth?userId=${userId}`);

      return response.data.qrCode;
    },
    enabled: !!userId,
  });
};
