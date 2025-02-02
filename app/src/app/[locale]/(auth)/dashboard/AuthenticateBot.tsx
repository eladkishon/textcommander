"use client";
import { Button } from "@/components/ui/button";
import { useConnectToBot } from "@/hooks/useConnectBot";
import { useFetchQRCode } from "@/hooks/useFetchQRCode";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import QRCode from "react-qr-code";

export const AuthenticateBot = ({ userId }: { userId: string }) => {
  const [isStartingBotEnabled, setIsStartingBotEnabled] = useState(true);
  const queryClient = useQueryClient();

  const { data: qrCode, isLoading: isQRCodeLoading } = useFetchQRCode(userId);

  const connectMutation = useConnectToBot(userId, () => {
    queryClient.invalidateQueries({ queryKey: ["qr_code", userId] });
  });

  // Connect to the bot when button is clicked
  const handleConnect = () => {
    setIsStartingBotEnabled(false);
    connectMutation.mutate();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <p>Connect our bot to your whatsapp</p>

      <Button onClick={handleConnect} disabled={!isStartingBotEnabled}>
        Connect
      </Button>

      {qrCode && (
        <div className="pt-4">
          <QRCode size={100} value={qrCode} />
        </div>
      )}

      {isQRCodeLoading && <p>Loading QR code...</p>}
    </div>
  );
};

export default AuthenticateBot;
