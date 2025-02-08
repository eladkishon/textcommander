import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/db/supabase";
import { useUser } from "@clerk/nextjs";

const getShortcuts = async (userId: string) => {
  const { data, error } = await supabase
    .from("shortcuts")
    .select("*")
    .eq("user_id", userId);
  return data;
};

export const useShortcuts = () => {
  const { user } = useUser();
  const query = useQuery({
    queryKey: ["shortcuts"],
    queryFn: () => getShortcuts(user?.id || ""),
  });

  return query;
};
