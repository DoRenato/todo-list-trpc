"use client";

import { Button } from "@/components/ui/button";
import { FormProvider } from "react-hook-form";
import { useFormTask } from "@/features/useFormTask";
import { FormValues } from "@/features/schema";
import { TituloField } from "@/components/TituloField";
import { DescricaoField } from "@/components/DescricaoField";
import { useEffect } from "react";

type FormTaskProps = {
  initialData?: Partial<FormValues>;
  onSubmit: (data: FormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export default function FormTask({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Salvar",
}: FormTaskProps) {
  const form = useFormTask({ defaultValues: initialData });

  useEffect(() => {
    form.reset({
      titulo: initialData?.titulo ?? "",
      descricao: initialData?.descricao ?? "",
    });
  }, [initialData, form]);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <TituloField control={form.control} />
        </div>
        <br />
        <div>
          <DescricaoField control={form.control} />
        </div>
        <br />
        <br />
        <div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
