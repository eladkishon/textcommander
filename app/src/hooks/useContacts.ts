
// const { data, error } = await supabase.from("user_contacts").select("*").eq("user_id", user?.id);
// if (error) {
//   console.error("Error fetching data:", error);
// } else {
//   setData(data);
// }

import { useUser } from "@clerk/nextjs";
import { supabase } from "../../../lib/db/supabase";
import { useQuery } from "@tanstack/react-query";

export const useContacts = () => {
  const { user } = useUser();

  const query = useQuery({
    queryKey: ["userContacts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_contacts").select("*").eq("user_id", user?.id);
      if (error) {
        console.error("Error fetching data:", error);
        return [];
      } else {
        return data;
      }
    }
  })

  return query;
}