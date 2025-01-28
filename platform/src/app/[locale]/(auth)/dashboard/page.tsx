"use client";
import { useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import { TitleBar } from "@/features/dashboard/TitleBar";
import Shortcuts from "./(features)/(shortcuts)";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { use, useState } from "react";
import { useFetchQRCode } from "@/hooks/useFetchQRCode";
import { useConnectToBot } from "@/hooks/useConnectBot";
import { useQueryClient } from "@tanstack/react-query";
import { useInitializationStatus } from "@/hooks/useInitializationStatus";

/** TODO: onClick connect - react mutation '/bots':
 * on success - start polling '/bots/:userId/qr-code' , display qr code when available
 * start polling isInitialized from userConfig in superbase // real time updates (subsciption do table change)
 * if initialized - display dashboard (isAuthenticated global state Zustand)
 *
 **/

const DashboardIndexPage = () => {
  const t = useTranslations("DashboardIndex");
  const { isSignedIn, user } = useUser();

  if (!isSignedIn || !user) {
    return null;
  }

  const queryClient = useQueryClient();

  console.log(user.id);

  const { data: qrCode, isLoading: isQrCodeLoading } = useFetchQRCode(user.id);

  const connectMutation = useConnectToBot(user.id, () => {
    queryClient.invalidateQueries({ queryKey: ["qr_code", user.id] });
  });

  // Connect to the bot when button is clicked
  const handleConnect = () => {
    connectMutation.mutate();
  };

  const isBotInitialized = true; //useInitializationStatus(user.id);

  if (isBotInitialized === null) {
    return <p>Loading...</p>;
  }
  return (
    <div className="h-screen">
      {isBotInitialized ? (
        <div>
          <TitleBar title={t("title_bar")} />
          <Shortcuts />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-8">
          <p>Connect our bot to your whatsapp</p>
          <Button onClick={handleConnect}>connect</Button>
          {connectMutation.isError && (
            <p className="text-red-500 text-sm">{connectMutation.error}</p>
          )}
          {qrCode && (
            <div className="pt-4">
              <QRCode size={100} value={qrCode} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardIndexPage;
