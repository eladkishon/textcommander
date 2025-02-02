import { eq } from "drizzle-orm";
import { db } from "../../../../../shared/db/db";
import { userConfigTable } from "../../../../../shared/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url!);
    const userId = searchParams.get("userId");
    console.log("userId:", userId);
    if (!userId) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters: userId",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const userConfig = await db
      .select()
      .from(userConfigTable)
      .where(eq(userConfigTable.user_id, userId));

    console.log("Query result:", userConfig);

    if (!userConfig.length) {
      return new Response(
        JSON.stringify({
          error: `User config not found for userId: ${userId}`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        is_initialized: userConfig[0]!.is_initialized,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to fetch user config:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
