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
  const [isBotInitialized, setIsBotInitialized] = useState(false);

  if (!isSignedIn) {
    return null;
  }

  const startBotMutate = useMutation({
    mutationFn: (userId: string) => startBot(userId),
    onSuccess: () => {
      setIsPollingQrEnabled(true);
    },
  });

  // Poll the database for 'is_initialized' field for the user
  useEffect(() => {
    if (!user) return;
    const pollInitializationStatus = async () => {
      const intervalId = setInterval(async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_config?user_id=eq.${user.id}`,
            {
              headers: {
                apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );

          const userConfig = response.data[0];
          if (userConfig && userConfig.is_initialized) {
            setIsBotInitialized(true); // Update the state when initialized
            clearInterval(intervalId); // Stop polling once initialized
          }
        } catch (e) {
          console.error("Failed to poll initialization status", e);
        }
      }, 5000); // Poll every 5 seconds

      return () => clearInterval(intervalId); // Clean up polling on component unmount
    };

    pollInitializationStatus();
  }, [user]);

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

  return (
    <>
      {isBotInitialized ? (
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
