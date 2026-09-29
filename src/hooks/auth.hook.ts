import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
} from "@/api";
import { useLocalePath } from "@/i18n/i18n-provider";
import type { ApiClient } from "@/lib/api-client";

export const meQuery = (client?: ApiClient) =>
  queryOptions({
    queryKey: ["me"],
    queryFn: () => getMe(client),
    select: (res) => res.data,
    // The auth routes share a tight rate limit; the profile rarely changes.
    staleTime: 5 * 60 * 1000,
  });

export const useMe = () => useQuery(meQuery());

export const useLogin = () =>
  useMutation({ mutationFn: login, meta: { silent: true } });

export const useRegister = () =>
  useMutation({ mutationFn: register, meta: { silent: true } });

export const useVerifyEmail = () =>
  useMutation({ mutationFn: verifyEmail, meta: { silent: true } });

export const useForgotPassword = () =>
  useMutation({ mutationFn: forgotPassword, meta: { silent: true } });

export const useResetPassword = () =>
  useMutation({ mutationFn: resetPassword, meta: { silent: true } });

/** Clears the cookies, drops every cached query, and lands on /login. */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const href = useLocalePath();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      router.replace(href("/login"));
      router.refresh();
    },
  });
};
