import { NextRequest } from "next/server";
import { db } from "../../../../../shared/db/db";
import { weatherShortcutTable } from "../../../../../shared/db/schema";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    console.log(userId);
    console.log("db: ", db);

    if (!userId) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters: shortcut or userId",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return new Response(
        JSON.stringify({ error: "No fields provided to update" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    console.log("location", body.location);

    await db
      .insert(weatherShortcutTable)
      .values({
        user_id: userId,
        location: body.location,
      })
      .onConflictDoUpdate({
        target: weatherShortcutTable.user_id,
        set: { location: body.location },
      });

    return new Response(
      JSON.stringify({ message: "Shortcut updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
