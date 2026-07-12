"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { reportIsAvailable } from "@/lib/report";
import { generateReportAction } from "@/app/[section]/[slug]/actions";
import type { Section } from "@/lib/types";

/**
 * Aciona a geração de dados reais (com fontes) do bloco. Enquanto a IA/web
 * search não está conectada (`reportIsAvailable() === false`), o botão fica
 * desabilitado e apenas sinaliza que a integração vem em breve — nunca dispara
 * uma escrita destrutiva. Ver lib/report.ts e a memória reports-real-data.
 */
export function GenerateReportButton({
  section,
  slug,
  hasReport,
}: {
  section: Section;
  slug: string;
  hasReport: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const available = reportIsAvailable();

  function handleClick() {
    startTransition(async () => {
      await generateReportAction(section, slug);
      router.refresh();
    });
  }

  if (!available) {
    return (
      <Button
        type="button"
        variant="outline"
        disabled
        title="Geração por IA em breve — os dados são pesquisados sob demanda."
      >
        <Sparkles className="size-4" />
        Gerar dados · IA em breve
      </Button>
    );
  }

  return (
    <Button type="button" variant="outline" onClick={handleClick} disabled={isPending}>
      <RefreshCw className={isPending ? "size-4 animate-spin" : "size-4"} />
      {isPending
        ? "Buscando dados..."
        : hasReport
          ? "Atualizar dados"
          : "Gerar dados"}
    </Button>
  );
}
