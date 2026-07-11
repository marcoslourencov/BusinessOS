import { notFound } from "next/navigation";
import { getContentBySlug } from "@/lib/content";
import type { Section } from "@/lib/types";
import { ContentEditForm } from "@/components/content-edit-form";

const VALID_SECTIONS: readonly Section[] = [
  "founder",
  "direcao",
  "validacao",
  "caixa",
  "marca",
  "autoridade",
];

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
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {item.frontmatter.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {item.filePath}
        </p>
      </div>
      <ContentEditForm section={section} item={item} />
    </div>
  );
}
