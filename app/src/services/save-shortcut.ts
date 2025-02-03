import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../../lib/db/supabase";
import { useUser } from "@clerk/nextjs";


const saveShortcut = async (userId: string, shortcutName: string, updates: {settings?: any, is_enabled?: boolean}) => {
const { data, error } = await supabase
    .from("shortcuts")
    .upsert({ user_id: userId, shortcut_name: shortcutName, ...updates }, {
      onConflict: "user_id,shortcut_name",
      
    })
    .select();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
};

export const useSaveShortcut = () => {
  const { user } = useUser();
  return useMutation({
    mutationFn: async (variables: { shortcutName: string; updates: {settings?: any, is_enabled?: boolean} }) => {
      return saveShortcut(user?.id || "", variables.shortcutName, variables.updates);
    }
  });
};
