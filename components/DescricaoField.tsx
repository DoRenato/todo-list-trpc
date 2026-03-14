import { Control, Controller } from "react-hook-form";
import { FormValues } from "@/features/schema";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Textarea } from "./ui/textarea";

type NameFieldProps = {
  control: Control<FormValues>;
};

export function DescricaoField({ control }: NameFieldProps) {
  return (
    <Controller
      name="descricao"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
          <Textarea
            {...field}
            id="descricao"
            aria-invalid={fieldState.invalid}
            placeholder="Digite a descrição"
            autoComplete="off"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
