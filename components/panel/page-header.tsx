export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-1">
      <h1 className="font-heading text-2xl font-semibold text-primary">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
