import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        FullSync Club
      </h1>
      <p className="max-w-sm text-muted-foreground">
        Juntá sellos en tus locales favoritos y llevate tu premio.
      </p>
      <Button size="lg">Empezar</Button>
    </main>
  );
}
