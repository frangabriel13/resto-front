import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { validationIssues, type ApiError } from "@/lib/api/errors";

// Muestra cada error de la API debajo de su campo; lo que no corresponde a un campo va arriba del formulario.
export function showApiError<T extends FieldValues>(
  form: UseFormReturn<T>,
  failure: { message: string; error?: ApiError },
) {
  const fields = fieldPaths(form.getValues());
  const issues = validationIssues(failure.error).filter((issue) => fields.includes(issue.path));
  if (issues.length === 0) {
    form.setError("root", { message: failure.message });
    return;
  }
  for (const issue of issues) {
    form.setError(issue.path as FieldPath<T>, { message: issue.message }, { shouldFocus: true });
  }
}

// Campos anidados como `profile.address`, igual que los `path` de la API.
function fieldPaths(values: object, prefix = ""): string[] {
  return Object.entries(values).flatMap(([key, value]) =>
    value !== null && typeof value === "object" && !Array.isArray(value)
      ? fieldPaths(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );
}
