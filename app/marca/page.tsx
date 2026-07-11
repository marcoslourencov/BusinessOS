import { SectionView } from "@/components/section-view";
import { getContentBySection } from "@/lib/content";
import { toContentGridItems } from "@/lib/content-view";

export default async function MarcaPage() {
  const items = await getContentBySection("marca");

  return (
    <SectionView
      section="marca"
      title="Marca"
      description="A identidade: o que a marca defende, como se posiciona e como soa."
      items={toContentGridItems(items, "marca")}
    />
  );
}
