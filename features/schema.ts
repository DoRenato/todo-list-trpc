import * as z from "zod";

export const formSchema = z.object({
  titulo: z.string().trim().min(1, "O Título é obrigatório"),
  descricao: z
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .optional(),
});

export type FormValues = z.infer<typeof formSchema>;
