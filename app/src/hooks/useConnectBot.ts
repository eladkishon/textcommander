"use client"
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export const useConnectToBot = (userId: string, onSuccess: () => void) => {
  return useMutation({
    mutationFn: () => {
        return axios.post(`/api/botAuth?userId=${userId}`);
    },
    onSuccess: () => {
      console.log("Connected to bot successfully!");
      onSuccess();
    },
    onError: (error: string) => {
      console.error("Error connecting to bot:", error);
    },
  });
};
