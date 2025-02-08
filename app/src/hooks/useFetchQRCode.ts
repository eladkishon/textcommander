"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useFetchQRCodeMutation = (userId: string | undefined) => {
  const mutation =  useMutation({
    mutationKey: ["qr_code", userId],
    mutationFn: async () => {
      if (!userId) {
        throw new Error("userId is required");
      }

      const response = await axios.get(`/api/botAuth?userId=${userId}`);

      return {qrcode: response.data.qrCode}
    },
    retry: 10,
    retryDelay: 4000,
  });

  return mutation;
};
