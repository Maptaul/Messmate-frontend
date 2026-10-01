import z from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "validation.nameMin")
    .max(120, "validation.nameMax"),
  email: z.string().trim().pipe(z.email("validation.emailInvalid")),
  subject: z
    .string()
    .trim()
    .min(3, "validation.subjectMin")
    .max(120, "validation.noteMax"),
  message: z
    .string()
    .trim()
    .min(20, "validation.messageMin")
    .max(2000, "validation.messageMax"),
});
