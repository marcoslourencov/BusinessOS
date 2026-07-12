"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Agent } from "@/lib/agents";
import { saveAgentAction } from "@/app/agentes/actions";

/**
 * Dialog para editar um agente (nome, descrição e system prompt). Mesmo
 * padrão de components/content-onboarding.tsx: server action + useTransition
 * + router.refresh(). O system prompt é o insumo da geração por IA futura.
 */
export function AgentEditor({ agent }: { agent: Agent }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(agent.name);
  const [description, setDescription] = useState(agent.description);
  const [systemPrompt, setSystemPrompt] = useState(agent.systemPrompt);
  const [isSaving, startSaveTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      // Ao reabrir, ressincroniza com o estado salvo.
      setName(agent.name);
      setDescription(agent.description);
      setSystemPrompt(agent.systemPrompt);
    }
  }

  function handleSave() {
    startSaveTransition(async () => {
      await saveAgentAction({ id: agent.id, name, description, systemPrompt });
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Pencil className="size-3.5" />
        Editar
      </DialogTrigger>
      <DialogContent className="flex max-h-[88vh] flex-col gap-0 p-0 sm:max-w-2xl">
        <div className="flex flex-col gap-1 border-b p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm text-muted-foreground">
              {agent.id}
            </DialogTitle>
            <DialogDescription>
              Edite o nome, a descrição e o system prompt deste agente.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="agent-name">Nome</Label>
            <Input
              id="agent-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do agente"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="agent-description">Descrição</Label>
            <Input
              id="agent-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="O que este agente faz, em uma linha."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="agent-prompt">System prompt</Label>
            <Textarea
              id="agent-prompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={16}
              className="min-h-64 font-mono text-sm leading-relaxed"
              placeholder="Instruções que definem o comportamento do agente."
            />
            <p className="text-xs text-muted-foreground">
              Markdown é permitido. Este texto será o system prompt quando a
              geração por IA for ligada.
            </p>
          </div>
        </div>

        <DialogFooter className="items-center gap-2 border-t p-4 sm:justify-end">
          <DialogClose render={<Button variant="ghost" type="button" />}>
            Cancelar
          </DialogClose>
          <Button
            variant="accent"
            type="button"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Check className="size-4" />
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
