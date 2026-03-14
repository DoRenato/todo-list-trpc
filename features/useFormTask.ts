import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "./schema";

type UseFormTaskProps = {
  defaultValues?: Partial<FormValues>;
};

export function useFormTask({ defaultValues }: UseFormTaskProps = {}) {
  return useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: defaultValues?.titulo ?? "",
      descricao: defaultValues?.descricao ?? "",
    },
  });
}