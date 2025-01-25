// export const startBot = async (userId: string) => {
//     if (!userId) throw new Error("User ID is required");
//     const response = await axios.post(
//       `${process.env.NEXT_PUBLIC_BOT_URL}/bots/${userId}`
//     );
//     return response.data.message;
//   };