import { useUser } from "@clerk/nextjs";
import { supabase } from "../../../lib/db/supabase";
import { useMutation } from "@tanstack/react-query";

export const trackContact = async (userId: string, contactId: string, tracked: boolean) => {
  const { data, error } = await supabase
    .from("user_contacts")
    .update({
      tracked: tracked,
    })
    .eq("contact_id", contactId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const useTrackContact = () => {
  const { user } = useUser();
  return useMutation({
    mutationFn: async ({ contactId, tracked }: { contactId: string; tracked: boolean }) => {
      if (user?.id && contactId) {
        await trackContact(user.id, contactId, tracked);
      }
    },
    onSuccess: () => {
      return { success: true };
    },
    onError: () => {
      return { success: false };
    },
  });
};


