import { useUser } from "@clerk/nextjs";
import { supabase } from "../../../lib/db/supabase";
import { useMutation } from "@tanstack/react-query";

export const trackContact = async (userId: string, contactId: string) => {
  const { data, error } = await supabase.from("user_contacts").update({
    tracked: true,
  }).eq("user_id", userId).eq("contact_id", contactId);
};

export const useTrackContact = (contactId: string) => {
  const { user } = useUser();

  return useMutation({
    mutationFn: async () => {
      await trackContact(user?.id || "", contactId);
    },
    onSuccess: () => {
      return { success: true };
    },
    onError: () => {
      return { success: false };
    },
  });
};


