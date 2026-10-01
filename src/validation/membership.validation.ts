import z from "zod";

// The API's shape: six hex characters. People paste codes from a chat
// message, so case, spaces and dashes don't matter.
export const JOIN_CODE_PATTERN = /^[0-9A-F]{6}$/;

export const normalizeJoinCode = (code: string) =>
  code.replace(/[\s-]/g, "").toUpperCase();

export const requestToJoinSchema = z.object({
  joinCode: z
    .string()
    .transform(normalizeJoinCode)
    .pipe(z.string().regex(JOIN_CODE_PATTERN, "validation.joinCodeInvalid")),
  note: z.string().trim().max(300, "validation.noteMax"),
});

export const inviteMemberSchema = z.object({
  email: z.string().trim().pipe(z.email("validation.emailInvalid")),
});
