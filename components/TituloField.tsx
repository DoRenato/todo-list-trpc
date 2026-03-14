import { Control, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormValues } from "@/features/schema";
import { Field, FieldError, FieldLabel } from "./ui/field";

type NameFieldProps = {
  control: Control<FormValues>;
};

export function TituloField({ control }: NameFieldProps) {
  return (
    <Controller
      name="titulo"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="titulo">Título</FieldLabel>
          <Input
            {...field}
            id="titulo"
            aria-invalid={fieldState.invalid}
            placeholder="Digite o título"
            autoComplete="off"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
