"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { approveBlockAction } from "@/app/workflow/actions";
import type { Section } from "@/lib/types";

/** Aprova a proposta de um bloco a partir do quadro de Workflow. */
export function ApproveBlockButton({
  section,
  slug,
}: {
  section: Section;
  slug: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await approveBlockAction(section, slug);
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="accent"
      className="w-full"
      onClick={handleClick}
      disabled={isPending}
    >
      <Check className="size-3.5" />
      {isPending ? "Aprovando..." : "Aprovar"}
    </Button>
  );
}
