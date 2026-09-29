/**
 * Query keys. Everything that belongs to one billing cycle sits under
 * ["cycle", id] and everything that belongs to one mess under ["mess", id],
 * so a write can refresh the whole month (or mess) with one invalidation.
 */
export const keys = {
  me: ["me"] as const,

  myMesses: (params?: object) => ["messes", "mine", params ?? {}] as const,
  mess: (messId: string) => ["mess", messId] as const,
  messMembers: (messId: string, params: object) =>
    ["mess", messId, "members", params] as const,
  messCycles: (messId: string, params: object) =>
    ["mess", messId, "cycles", params] as const,
  messAudit: (messId: string, params: object) =>
    ["mess", messId, "audit", params] as const,
  messUnread: (messId: string) => ["mess", messId, "unread"] as const,

  cycle: (cycleId: string) => ["cycle", cycleId] as const,
  cyclePart: (cycleId: string, part: string, params: object = {}) =>
    ["cycle", cycleId, part, params] as const,

  myMemberships: ["my", "memberships"] as const,
  myBills: (params: object) => ["my", "bills", params] as const,
  myPayments: (params: object) => ["my", "payments", params] as const,
  payment: (paymentId: string) => ["payment", paymentId] as const,

  finance: ["finance"] as const,
  financeCategories: ["finance", "categories"] as const,
  financeEntries: (params: object) => ["finance", "entries", params] as const,
  financeSummary: (params: object) => ["finance", "summary", params] as const,
};
