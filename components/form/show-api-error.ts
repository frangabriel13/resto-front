import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { validationIssues, type ApiError } from "@/lib/api/errors";

// Muestra cada error de la API debajo de su campo; lo que no corresponde a un campo va arriba del formulario.
export function showApiError<T extends FieldValues>(
  form: UseFormReturn<T>,
  failure: { message: string; error?: ApiError },
) {
  const fields = Object.keys(form.getValues());
  const issues = validationIssues(failure.error).filter((issue) => fields.includes(issue.path));
  if (issues.length === 0) {
    form.setError("root", { message: failure.message });
    return;
  }
  for (const issue of issues) {
    form.setError(issue.path as FieldPath<T>, { message: issue.message }, { shouldFocus: true });
  }
}
