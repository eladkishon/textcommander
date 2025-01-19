"use client";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import { TitleBar } from "@/features/dashboard/TitleBar";
import QRCodeScanner from "../onboarding/QRCodeScanner/page";

const DashboardIndexPage = () => {
  const t = useTranslations("DashboardIndex");
  const { user, isLoaded, isSignedIn } = useUser();
  console.log("user", user);
  const startBot = async () => {
    try {
      if (!user) {
        console.error("User not found");
        return;
      }
      const response = await axios.post(
        process.env.NEXT_PUBLIC_APP_URL + "/start-bot",
        {
          userId: user.id,
        }
      );
      console.log(response);
      const data = await response.data.message;
      console.log(data); // Log bot start status
    } catch (e) {
      console.error("Failed to start bot", e);
    }
  };

  return (
    <>
      <TitleBar title={t("title_bar")} />
      <div>
        <button onClick={startBot}>Start WhatsApp Bot</button>
      </div>
      <QRCodeScanner />
    </>
  );
};

export default DashboardIndexPage;
