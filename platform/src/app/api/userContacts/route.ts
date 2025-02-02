import axios from "axios";
import { NextRequest } from "next/server";
import { getUserContacts } from "../../../../../shared/db/utils";

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
    const userContacts = await getUserContacts(userId);
    console.log("userContacts", userContacts);
    return new Response(JSON.stringify({ userContacts }), {
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
