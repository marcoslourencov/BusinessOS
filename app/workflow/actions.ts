"use server";

import { revalidatePath } from "next/cache";
import {
  moveCard,
  createCard,
  deleteCard,
  addStage,
  renameStage,
  deleteStage,
  readBoardStages,
  type CreateCardInput,
} from "@/lib/workflow";

function revalidateAll() {
  revalidatePath("/workflow");
}

export async function moveCardAction(cardId: string, toStageId: string, toIndex: number) {
  await moveCard(cardId, toStageId, toIndex);
  revalidateAll();
}

export async function createCardAction(input: CreateCardInput) {
  await createCard(input);
  if (input.type === "block") revalidatePath(`/${input.section}`);
  revalidateAll();
}

export async function deleteCardAction(cardId: string) {
  await deleteCard(cardId);
  revalidateAll();
}

export async function addStageAction(label: string) {
  await addStage(label);
  revalidateAll();
}

export async function renameStageAction(stageId: string, label: string) {
  await renameStage(stageId, label);
  revalidateAll();
}

export async function deleteStageAction(stageId: string) {
  await deleteStage(stageId);
  revalidateAll();
}

/** Aprovar = mover o card para a etapa de kind "validado". */
export async function approveCardAction(cardId: string) {
  const stages = await readBoardStages();
  const validado = stages.find((s) => s.kind === "validado");
  if (!validado) return;
  await moveCard(cardId, validado.id, 0);
  revalidateAll();
}
