import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import * as schema from "../../../../../lib/db/schema";
import { getDb } from "../../../../../lib/db/db";

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

    const db = await getDb();
    const userConfig = await db
      .select()
      .from(schema.userConfigs)
      .where(eq(schema.userConfigs.user_id, userId));

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
