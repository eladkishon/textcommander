"use client";
import { Button } from "@/components/ui/button";
import { useConnectToBot } from "@/hooks/useConnectBot";
import { useFetchQRCodeMutation } from "@/hooks/useFetchQRCode";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";

export const AuthenticateBot = () => {
  const {user} = useUser();
  const queryClient = useQueryClient();
  const [qrcode, setQRCode] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const fetchQRCodeMutation = useFetchQRCodeMutation(user.id);

  const connectMutation = useConnectToBot(user.id, () => {
    queryClient.invalidateQueries({ queryKey: ["qr_code", user.id] });
  });

  function onConnect() {
    setQRCode(null);
    connectMutation.mutate();
    fetchQRCodeMutation.mutateAsync().then(({qrcode}) => {
      setQRCode(qrcode);
    });
  }


  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <h1 className="text-2xl">Setup TextCommander on your whatsapp</h1>

      <Button onClick={onConnect} isLoading={connectMutation.isPending} disabled={fetchQRCodeMutation.isPending}>
        {qrcode ? "Refresh QR Code" : "Connect"}
      </Button>

      {qrcode && (
        <div className="pt-4">
          <QRCode size={300} value={qrcode} />
        </div>
      )}

      {fetchQRCodeMutation.isPending && (
        <>
          <LoaderCircle />
          <p>Loading QR code...</p>
        </>
      )}
    </div>
  );
};

export default AuthenticateBot;
