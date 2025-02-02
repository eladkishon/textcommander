import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchUserContacts = async (userId: string) => {
  const { data } = await axios.get(`/api/userContacts?userId=${userId}`);
  return data;
};

export const useContacts = (userId: string) => {
  return useQuery({
    queryKey: ["userContacts", userId],
    queryFn: () => fetchUserContacts(userId),
  });
};
