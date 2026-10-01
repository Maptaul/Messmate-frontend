import type { AuditAction } from "@/types";

/** The design colours an audit action by its verb: closes are blue, removals red… */
export function auditTone(action: AuditAction) {
  if (/CLOSED|REOPENED/.test(action)) return "tone-b";
  if (/UNBLOCKED/.test(action)) return "tone-g";
  if (/BLOCKED|REMOVED|DELETED|REJECTED/.test(action)) return "tone-r";
  if (/APPROVED|JOINED/.test(action)) return "tone-g";
  if (/ROLE/.test(action)) return "tone-v";
  if (/SETTLED|ADDED|RECORDED/.test(action)) return "tone-g";
  if (/UPDATED/.test(action)) return "tone-a";
  return "tone-n";
}
