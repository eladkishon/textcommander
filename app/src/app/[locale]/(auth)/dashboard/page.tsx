"use client";
import { useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import { TitleBar } from "@/features/dashboard/TitleBar";
import { usePollInitializationStatus } from "@/hooks/usePollInitializationStatus";
import AuthenticateBot from "../onboarding/AuthenticateBot/page";
import ShortcutsConfig from "./featuresConfig/ShortcutsConfig/page";
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

  const isBotInitialized = usePollInitializationStatus(user.id);

  if (isBotInitialized === null) {
    return <p>Loading...</p>;
  }
  return (
    <>
      {isBotInitialized ? (
        <div>
          <TitleBar title={t("title_bar")} />
            <ShortcutsConfig />
        </div>
      ) : (
        <AuthenticateBot userId={user.id} />
      )}
    </>
  );
};

export default DashboardIndexPage;
