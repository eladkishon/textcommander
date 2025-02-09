import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/db/supabase";

const getUserConfig = async (userId: string) => {
  console.log("getUserConfig", userId);
  const { data, error } = await supabase
    .from("user_configs")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) {
    throw error;
  }
  return data.is_initialized;
};

const useBotInitializationStatus = (userId: string | undefined) => {
  // Call useQuery regardless of userId value
  const { data, isLoading, error } = useQuery({
    queryKey: ["userConfig", userId],
    queryFn: () => {
      // If userId is undefined, return a default value
      if (!userId) return Promise.resolve(false);
      return getUserConfig(userId);
    },
    // Disable query when userId is not provided
    enabled: Boolean(userId),
    refetchInterval: ({ state }) => {
      if (state.data) {
        return false;
      }
      return 5000;
    },
  });

  // Optionally handle the loading or error state if needed
  if (isLoading) {
    // You might want to return a loading state here
  }
  if (error) {
    // Optionally handle error state
  }

  return { isBotInitialized: data };
};

export default useBotInitializationStatus;
