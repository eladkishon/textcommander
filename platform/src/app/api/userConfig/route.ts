import { db } from "@/libs/DB";
import { usersConfigTable } from "@/models/Schema";
import axios from "axios";
import { eq } from "drizzle-orm";

import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { searchParams } = new URL(req.url!);
    const userId = searchParams.get("userId");
    console.log("userId:", userId);
    if (!userId) {
      return res.json({ error: "Missing userId parameter" });
    }

    try {
      async () => {
        const userConfig = await db
          .select()
          .from(usersConfigTable)
          .where(eq(usersConfigTable.user_id, userId));

        console.log("Query result:", userConfig);

        if (!userConfig.length) {
          return res.json({
            error: `User config not found for userId: ${userId}`,
          });
        }

        return res.json({
          is_initialized: userConfig[0]!.is_initialized,
        });
      };
    } catch (error) {
      console.error("Failed to fetch user config:", error);
      return res.json({ error: "Internal Server Error" });
    }
  }
}
