import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getContentBySlug } from "@/lib/content";
import type { Section } from "@/lib/types";
import { ContentReport } from "@/components/content-report";
import { ContentOnboarding } from "@/components/content-onboarding";

const VALID_SECTIONS: readonly Section[] = [
  "founder",
  "direcao",
  "validacao",
  "caixa",
  "marca",
  "autoridade",
];

const SECTION_LABELS: Record<Section, string> = {
  founder: "Founder",
  direcao: "Direção",
  validacao: "Validação",
  caixa: "Caixa",
  marca: "Marca",
  autoridade: "Autoridade",
};

function isSection(value: string): value is Section {
  return (VALID_SECTIONS as readonly string[]).includes(value);
}

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;

  if (!isSection(section)) {
    notFound();
  }

  const item = await getContentBySlug(section, slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Link
          href={`/${section}`}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {SECTION_LABELS[section]}
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {item.frontmatter.title}
            </h1>
            <span className="inline-flex w-fit items-center rounded-full bg-muted px-3 py-1 font-mono text-xs text-muted-foreground">
              {item.filePath}
            </span>
          </div>
          <ContentOnboarding section={section} item={item} />
        </div>
      </div>
      <ContentReport section={section} item={item} />
    </div>
  );
}
