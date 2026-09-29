import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addMember,
  createMess,
  getMess,
  getMessMembers,
  getMyMemberships,
  getMyMesses,
  removeMember,
  updateMess,
} from "@/api";
import { useT } from "@/i18n/i18n-provider";
import type { ApiClient } from "@/lib/api-client";
import type { MemberListParams, MessListParams } from "@/types";
import { keys } from "./keys";

export const myMessesQuery = (
  params: MessListParams = {},
  client?: ApiClient,
) =>
  queryOptions({
    queryKey: keys.myMesses(params),
    queryFn: () => getMyMesses(params, client),
  });

export const messQuery = (messId: string, client?: ApiClient) =>
  queryOptions({
    queryKey: keys.mess(messId),
    queryFn: () => getMess(messId, client),
  });

export const messMembersQuery = (
  messId: string,
  params: MemberListParams,
  client?: ApiClient,
) =>
  queryOptions({
    queryKey: keys.messMembers(messId, params),
    queryFn: () => getMessMembers(messId, params, client),
    placeholderData: keepPreviousData,
  });

export const myMembershipsQuery = (client?: ApiClient) =>
  queryOptions({
    queryKey: keys.myMemberships,
    queryFn: () => getMyMemberships({ limit: 100 }, client),
  });

export const useMyMesses = (params?: MessListParams) =>
  useQuery(myMessesQuery(params));
export const useMess = (messId: string) => useQuery(messQuery(messId));
export const useMessMembers = (messId: string, params: MemberListParams) =>
  useQuery(messMembersQuery(messId, params));
export const useMyMemberships = () => useQuery(myMembershipsQuery());

/** The wizard adds members itself, so this stays quiet on success. */
export const useCreateMess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMess,
    meta: { silent: true },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messes"] });
      queryClient.invalidateQueries({ queryKey: keys.me });
    },
  });
};

export const useUpdateMess = () => {
  const queryClient = useQueryClient();
  const t = useT();

  return useMutation({
    mutationFn: updateMess,
    meta: { silent: true },
    onSuccess: ({ data }) => {
      toast.success(t("toast.messUpdated"));
      queryClient.invalidateQueries({ queryKey: keys.mess(data.id) });
      queryClient.invalidateQueries({ queryKey: ["messes"] });
    },
  });
};

export const useAddMember = ({ quiet = false } = {}) => {
  const queryClient = useQueryClient();
  const t = useT();

  return useMutation({
    mutationFn: addMember,
    meta: { silent: true },
    onSuccess: ({ data }) => {
      if (!quiet)
        toast.success(t("toast.memberAdded", { name: data.user.name }));
      queryClient.invalidateQueries({ queryKey: keys.mess(data.mess.id) });
    },
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();
  const t = useT();

  return useMutation({
    mutationFn: removeMember,
    onSuccess: ({ data }) => {
      toast.success(t("toast.memberRemoved", { name: data.user.name }));
      queryClient.invalidateQueries({ queryKey: keys.mess(data.mess.id) });
    },
  });
};
