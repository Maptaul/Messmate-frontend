import {
  environmentManager,
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage, getErrorStatus } from "./errors";

declare module "@tanstack/react-query" {
  interface Register {
    // `silent` opts a query or mutation out of the global error toast when the
    // component shows the error itself (e.g. inline under a form field).
    queryMeta: { silent?: boolean };
    mutationMeta: { silent?: boolean };
  }
}

const makeQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (!environmentManager.isServer() && !query.meta?.silent) {
          toast.error(getErrorMessage(error));
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _vars, _ctx, mutation) => {
        if (!mutation.meta?.silent) toast.error(getErrorMessage(error));
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        // Retry a dropped connection once; an HTTP error won't fix itself.
        retry: (count, error) =>
          count < 1 && getErrorStatus(error) === undefined,
      },
    },
  });

let browserQueryClient: QueryClient | undefined;

/** A fresh client per server request; one shared client in the browser. */
export function getQueryClient(): QueryClient {
  if (environmentManager.isServer()) return makeQueryClient();

  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
