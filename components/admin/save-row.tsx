import { SubmitButton } from "@/components/form/submit-button";

export function SaveRow({ pending, saved }: { pending: boolean; saved: boolean }) {
  return (
    <div className="flex flex-col gap-2 sm:w-56">
      <SubmitButton pending={pending}>Guardar cambios</SubmitButton>
      {saved && (
        <p role="status" className="text-center text-sm text-emerald-700">
          Cambios guardados.
        </p>
      )}
    </div>
  );
}
