import { useUser } from "@clerk/nextjs";
import { supabase } from "../../../lib/db/supabase";
import { useMutation } from "@tanstack/react-query";

export const trackContacts = async (userId: string, contactIds: string[]) => {
  const { data, error } = await supabase
    .from("user_contacts")
    .update({
      tracked: true,
    })
    .in("contact_id", contactIds)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const useTrackContact = () => {
  const { user } = useUser();

  return useMutation({
    mutationFn: async (contactIds: string[]) => {
      if (user?.id && contactIds.length > 0) {
        await trackContacts(user.id, contactIds);
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


