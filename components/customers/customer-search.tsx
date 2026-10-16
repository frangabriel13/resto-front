"use client";

import { ChevronRightIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FormAlert } from "@/components/form/form-alert";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { searchMode } from "@/lib/customers/search";
import { panelCustomerRoute } from "@/lib/staff/routes";
import type { PanelMembership } from "@/lib/stamps/types";

// TODO(api): el OpenAPI no publica el parámetro `query` de GET /panel/customers; sacar el cast
// cuando lo publique y se regeneren los tipos.
const searchParams = (query: string) => ({ params: { query: { query } } }) as Record<string, unknown>;

type Results = { query: string; items: PanelMembership[] } | { query: string; error: string };

const hints = {
  "too-short": "Escribí al menos 2 letras del nombre o 3 números del teléfono.",
  phone: "Buscando por teléfono.",
  name: "Buscando por nombre.",
};

export function CustomerSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Results | null>(null);
  const trimmed = query.trim();
  const mode = searchMode(query);

  useEffect(() => {
    if (searchMode(trimmed) === "too-short") return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const result = await callApi(api.GET("/panel/customers", searchParams(trimmed)));
      if (cancelled) return;
      setResults(
        result.ok ? { query: trimmed, items: result.data } : { query: trimmed, error: result.message },
      );
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed]);

  // Solo se muestran los resultados de lo que está escrito ahora.
  const current = mode !== "too-short" && results?.query === trimmed ? results : null;
  const searching = mode !== "too-short" && !current;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          aria-label="Buscar cliente"
          placeholder="Nombre o teléfono"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          className="h-12 pl-10 text-base"
        />
      </div>
      <p className="text-sm text-muted-foreground">{hints[mode]}</p>

      {searching && (
        <div className="flex justify-center py-6 text-muted-foreground">
          <Spinner className="size-6" />
        </div>
      )}
      {current && "error" in current && <FormAlert message={current.error} />}
      {current && "items" in current && <CustomerList items={current.items} />}
    </div>
  );
}

function CustomerList({ items }: { items: PanelMembership[] }) {
  if (items.length === 0) {
    return <p className="py-6 text-center text-muted-foreground">No encontramos clientes con esa búsqueda.</p>;
  }
  return (
    <ul className="flex flex-col gap-2">
      {items.map((membership) => (
        <li key={membership.id}>
          <Link
            href={panelCustomerRoute(membership.id)}
            className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 transition-colors hover:bg-muted"
          >
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-medium break-words text-primary">
                {membership.customer.name ?? "Cliente sin nombre"}
              </span>
              <span className="text-sm text-muted-foreground">{membership.customer.phone}</span>
            </span>
            <span className="text-right text-sm">
              {membership.canRedeem ? (
                <span className="font-medium text-brand">¡Premio listo!</span>
              ) : (
                `${membership.balance} de ${membership.stampsRequired}`
              )}
            </span>
            <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
