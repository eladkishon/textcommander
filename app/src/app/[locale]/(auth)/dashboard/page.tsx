"use client";
import { useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import { TitleBar } from "@/features/dashboard/TitleBar";
import Shortcuts from "./features/shortcuts";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { use, useState } from "react";
import useBotInitializationStatus from "@/hooks/useInitializationStatus";
import AuthenticateBot from "./AuthenticateBot";
import FriendsKeeper from "./features/friendsKeeper/friends-keeper-view";
import { supabase } from "../../../../../../lib/db/supabase";

/** TODO: onClick connect - react mutation '/bots':
 * on success - start polling '/bots/:userId/qr-code' , display qr code when available
 * start polling isInitialized from userConfig in superbase // real time updates (subsciption do table change)
 * if initialized - display dashboard (isAuthenticated global state Zustand)
 *
 **/

const DashboardIndexPage = () => {
  const t = useTranslations("DashboardIndex");
  const { isSignedIn, user } = useUser();
  const { isBotInitialized } = useBotInitializationStatus(user?.id);

  if (!isSignedIn || !user) {
    return null;
  }


  return (
    <div className="h-screen">
      {isBotInitialized ? (
        <div className="flex flex-col gap-4 md:w-2/3 mx-auto" >
          <Shortcuts />
          <FriendsKeeper />
        </div>
      ) : (
        <AuthenticateBot/>
      )}
    </div>
  );
};

export default DashboardIndexPage;
