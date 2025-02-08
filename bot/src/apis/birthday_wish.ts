// import { db } from "../../../shared/db/db";
// import { weatherShortcutTable } from "../../../shared/db/schema";

export const getBirthdayWish = async (userId: string, contactName: string) => {
  console.log("getBirthdayWish");
  // const birthdayRecord = await db
  //   .select()
  //   .from(birthdayShortcut)
  //   .where({ user_id: userId, contact: contactName })
  //   .limit(1)
  //   .execute();
  // if (birthdayRecord.length === 0) {
  //   console.log("No birthday shortcut found for this contact.");
  //   return;
  // }
  // const nickname = birthdayRecord[0].nickname;
  // const wish = birthdayRecord[0].wish;

  // const birthdayWish = `Happy birthday ${nickname} !!\n ${wish}`;

  const birthdayWish = `Happy birthday ${contactName} !!`;
  return birthdayWish;
};
