import axios from "axios";

export const fetchQRCode = async (userId: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BOT_URL}/bots/${userId}/qrcode`
  );
  return response.data.qrCode;
};

export const startBot = async (userId: string) => {
  if (!userId) throw new Error("User ID is required");
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BOT_URL}/bots/${userId}`
  );
  return response.data.message;
};

export const fetchUserConfig = async (userId: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_config?user_id=eq.${userId}`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data[0];
};