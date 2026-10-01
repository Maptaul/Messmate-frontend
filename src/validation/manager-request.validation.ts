import z from "zod";
import { messAddressRule, messNameRule } from "./mess.validation";

// The same limits the mess gets once it is created; messages are dictionary keys.
export const managerRequestSchema = z.object({
  messName: messNameRule,
  messAddress: messAddressRule,
});

export const rejectRequestSchema = z.object({
  rejectionReason: z
    .string()
    .trim()
    .min(1, "validation.reasonRequired")
    .max(500, "validation.reasonMax"),
});
