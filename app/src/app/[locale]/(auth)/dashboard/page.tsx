"use client";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import { TitleBar } from "@/features/dashboard/TitleBar";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import QRCode from "react-qr-code";

/** TODO: onClick connect - react mutation '/bots':
 * on success - start polling '/bots/:userId/qr-code' , display qr code when available
 * start polling isInitialized from userConfig in superbase // real time updates (subsciption do table change)
 * if initialized - display dashboard (isAuthenticated global state Zustand)
 *
 **/

const fetchQRCode = async (userId: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BOT_URL}/bots/${userId}/qrcode`
  );
  console.log(response);
  const qrCode = response.data.qrCode;
  return qrCode;
};

const startBot = async (userId: string) => {
  try {
    if (!userId) {
      console.error("User not found");
      return;
    }
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BOT_URL}/bots/${userId}`
    );
    console.log(response);
    const data = await response.data.message;
    console.log(data); // Log bot start status
  } catch (e) {
    console.error("Failed to start bot", e);
  }
};

const DashboardIndexPage = () => {
  const t = useTranslations("DashboardIndex");
  const { isSignedIn, user } = useUser();
  const [isPollingQrEnabled, setIsPollingQrEnabled] = useState(false);

  console.log("user", user);

  const startBotMutate = useMutation({
    mutationFn: (userId: string) => startBot(userId),
    onSuccess: () => {
      setIsPollingQrEnabled(true);
    },
  });

  if (!isSignedIn) {
    return null;
  }

  const {
    isLoading: isQRCodeLoading,
    data: qrCode,
    refetch: refetchQRCode,
    isFetching: isQRCodeFetching,
    isSuccess,
  } = useQuery({
    queryKey: ["qr_code", user.id],
    queryFn: () => fetchQRCode(user.id),
    enabled: isPollingQrEnabled && !!user,
  });

  const isBotAuthenticated = false;

  return (
    <>
      {isBotAuthenticated ? (
        <TitleBar title={t("title_bar")} />
      ) : (
        <div>
          <Button
            onClick={() => {
              startBotMutate.mutate(user!.id);
            }}
            disabled={isQRCodeLoading || isQRCodeFetching}
          >
            Connect
          </Button>
          {qrCode && (
            <div className="pt-4">
              <QRCode
                size={100}
                // style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={qrCode}
                // viewBox={`0 0 256 256`}
              />
            </div>
          )}
          {(isQRCodeLoading || isQRCodeFetching) && <p>Loading QR code...</p>}
        </div>
      )}
    </>
  );
};

export default DashboardIndexPage;
