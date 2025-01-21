import { fetchQRCode } from "@/app/[locale]/(auth)/dashboard/api";
import { useQuery } from "@tanstack/react-query";

export const useFetchQRCode = (userId: string | undefined, enabled: boolean) => {
  return useQuery({
    queryKey: ["qr_code", userId],
    queryFn: () => fetchQRCode(userId!),
    enabled: enabled && !!userId,
  });
};
