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
import useBotInitializationStatus from "@/hooks/useInitializationStatus";
import AuthenticateBot from "./AuthenticateBot";

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

  const isBotInitialized = useBotInitializationStatus(user.id);


  return (
    <div className="h-screen">
      {isBotInitialized ? (
        <div>
          <TitleBar title={t("title_bar")} />
          <Shortcuts />
        </div>
      ) : (
        <AuthenticateBot userId={user.id} />
      )}
    </div>
  );
};

export default DashboardIndexPage;
