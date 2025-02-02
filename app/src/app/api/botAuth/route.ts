// export const startBot = async (userId: string) => {
//     if (!userId) throw new Error("User ID is required");
//     const response = await axios.post(
//       `${process.env.NEXT_PUBLIC_BOT_URL}/bots/${userId}`
//     );
//     return response.data.message;
//   };

import { NextRequest } from "next/server";
import { db } from "../../../../../shared/db/db";
import { weatherShortcutTable } from "../../../../../shared/db/schema";
import axios from "axios";
import { QrCode } from "lucide-react";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters: userId",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BOT_URL}/bots/${userId}`
    );

    console.log(response);

    return new Response(
      JSON.stringify({
        message: "connect to bot successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters: userId",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BOT_URL}/bots/${userId}/qrcode`
    );
    console.log("data", response.data);
    return new Response(JSON.stringify({ qrCode: response.data.qrCode }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch QR code." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
