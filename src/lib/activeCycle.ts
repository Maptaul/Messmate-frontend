import "server-only";
import { cache } from "react";
import { getCycle, getMessCycles } from "@/api";
import type { Cycle, CycleStatus } from "@/types";
import { getErrorStatus } from "@/utils/error.util";
import { OPEN_CYCLE_PARAMS } from "@/utils/params.util";
import serverApi from "./serverApi";

export type ActiveCycle = Pick<Cycle, "id" | "year" | "month" | "status">;

/**
 * The month a ledger page works on: the one named by `?cycle=` (if it belongs
 * to this mess), otherwise the newest month with `prefer` status (the open
 * month for meals, expenses and deposits; a closed one for bills, since bills
 * only exist once a month is closed), otherwise the open month. Null means the
 * mess has no month at all; a failed call (rate limit, outage) throws to the
 * error page instead of offering to open a month that already exists.
 */
export const getActiveCycle = cache(
  async (
    messId: string,
    cycleId?: string,
    prefer: CycleStatus = "OPEN",
  ): Promise<ActiveCycle | null> => {
    const client = await serverApi();

    if (cycleId) {
      // A `?cycle=` that is malformed, missing or another mess's falls back
      // to the default month below.
      const named = await getCycle(cycleId, client).catch((error) => {
        const status = getErrorStatus(error);
        if (status === 400 || status === 403 || status === 404) return null;
        throw error;
      });
      if (named?.data.mess.id === messId) return named.data;
    }

    const { data } = await getMessCycles(
      messId,
      { status: prefer, limit: 1 },
      client,
    );
    if (data[0] || prefer === "OPEN") return data[0] ?? null;

    const open = await getMessCycles(messId, OPEN_CYCLE_PARAMS, client);
    return open.data[0] ?? null;
  },
);
