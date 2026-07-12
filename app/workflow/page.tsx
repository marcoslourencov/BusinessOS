import { getResolvedBoard } from "@/lib/workflow";
import { WorkflowBoard } from "@/components/workflow-board";

export default async function WorkflowPage() {
  const { columns, activeAgents } = await getResolvedBoard();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Workflow
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Quem está trabalhando em quê. Arraste os cards entre as etapas, crie
          novos cards e novas colunas. Propostas da IA param em “Aguardando você”.
        </p>
      </header>

      <WorkflowBoard initialColumns={columns} activeAgents={activeAgents} />
    </div>
  );
}
