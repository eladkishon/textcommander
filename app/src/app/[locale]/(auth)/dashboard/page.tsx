"use client";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import { TitleBar } from "@/features/dashboard/TitleBar";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { eq } from "drizzle-orm";
import { usePollInitializationStatus } from "@/hooks/usePollInitializationStatus";
import { useFetchQRCode } from "@/hooks/useFetchQRCode";
import { startBot } from "./api";
/** TODO: onClick connect - react mutation '/bots':
 * on success - start polling '/bots/:userId/qr-code' , display qr code when available
 * start polling isInitialized from userConfig in superbase // real time updates (subsciption do table change)
 * if initialized - display dashboard (isAuthenticated global state Zustand)
 *
 **/

const DashboardIndexPage = () => {
  const t = useTranslations("DashboardIndex");
  const { isSignedIn, user } = useUser();
  const [isPollingQrEnabled, setIsPollingQrEnabled] = useState(false);

  if (!isSignedIn || !user) {
    return null;
  }

  const isBotInitialized = usePollInitializationStatus(user.id);

  const {
    data: qrCode,
    isLoading: isQRCodeLoading,
    isFetching: isQRCodeFetching,
  } = useFetchQRCode(
    user.id,
    isPollingQrEnabled && !isBotInitialized // Disable if bot is initialized
  );

  const startBotMutate = useMutation({
    mutationFn: () => startBot(user.id),
    onSuccess: () => {
      setIsPollingQrEnabled(true);
    },
  });

  return (
    <>
      {isBotInitialized ? (
        <TitleBar title={t("title_bar")} />
      ) : (
        <div>
          <Button
            onClick={() => startBotMutate.mutate()}
            disabled={isQRCodeLoading || isQRCodeFetching}
          >
            Connect
          </Button>

          {qrCode && (
            <div className="pt-4">
              <QRCode size={100} value={qrCode} />
            </div>
          )}

          {(isQRCodeLoading || isQRCodeFetching) && <p>Loading QR code...</p>}
        </div>
      )}
    </>
  );
};

export default DashboardIndexPage;
