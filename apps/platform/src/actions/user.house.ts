"use server";

import { db } from "~/db/connect";
import { eq } from "drizzle-orm";
import { getSession } from "~/auth/server";
import { users } from "~/db/schema/auth-schema";

/**
 * Fetches the user's assigned Hogwarts house and sorting status.
 * This is a read-only server action to be used across the application
 * for server-authoritative display of the user's state.
 *
 * @returns {Promise<{ house: string | null; isSorted: boolean }>}
 */
export async function getUserHouse() {
  const session = await getSession();
  if (!session?.user?.id) {
    // Return a default state for unauthenticated users
    return { house: null, isSorted: false };
  }

  const user = await db
    .select({
      house: users.house,
      isSorted: users.hasCompletedSorting,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user || user.length === 0) {
    // Should not happen for an authenticated user, but handle defensively
    return { house: null, isSorted: false };
  }

  return {
    house: user[0].house,
    isSorted: user[0].isSorted,
  };
}
