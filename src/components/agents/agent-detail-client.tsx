"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Calendar, Code2, Database, ExternalLink, FileText, Globe, Headphones, MessageCircle, Mic, PlugZap, Settings, TestTube2, Trash2, Workflow } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { IntegrationCard } from "@/components/integration-card";
import { PageHeader } from "@/components/layout/page-header";
import { Modal } from "@/components/modals/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface AgentDetailView {
  id: string;
  name: string;
  description: string;
  model: string;
  communicationStyle: string;
  behavior: string;
  status: string;
  trainings: Array<{
    id: string;
    title: string;
    type: string;
    content: string;
    status: string;
    fileName?: string | null;
    fileMimeType?: string | null;
    fileSizeBytes?: number | null;
    fileUrl?: string | null;
    uploadedAt?: string | null;
  }>;
  intents: Array<{ id: string; name: string; description: string; triggers: string[]; action: string; webhookUrl?: string | null; method?: string | null }>;
  knowledgeBases: Array<{ id: string; name: string; itemsCount: number }>;
}

interface TrainingPreview {
  title: string;
  type: string;
  content: string;
  fileName: string;
  fileMimeType: string;
  fileSizeBytes: number;
}

const menu = ["Perfil", "Trabalho", "Treinamentos", "Intenções", "Integrações", "Servidores MCP", "Canais", "Configurações"];
const integrations = [
  ["ElevenLabs", "Permite que seu agente responda em áudio com voz humanizada.", Mic],
  ["Google Calendar", "Permite que o agente crie eventos, reuniões e agendamentos.", Calendar],
  ["Plug Chat", "Permite transferir conversas para atendimento humano.", Headphones],
  ["E-vendi", "Permite acessar produtos da loja, consultar preços e enviar links.", Database],
  ["Webhook", "Permite enviar eventos para APIs próprias.", Code2],
  ["Zapier", "Conecte automações externas sem código.", PlugZap],
  ["Make", "Crie fluxos visuais para integrações.", Workflow],
  ["N8N", "Permite conectar automações externas por webhook.", Globe]
] as const;

function formatFileSize(bytes?: number | null): string {
  if (!bytes) return "Tamanho desconhecido";

  const units = ["B", "KB", "MB", "GB"] as const;
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatUploadDate(value?: string | null): string {
  if (!value) return "Sem data de upload";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function getFileKey(file: File) {
  return `${file.name}:${file.size}`;
}

function buildPreviewContent(file: File, extractedText: string): string {
  return [
    `Nome do arquivo: ${file.name}`,
    `Tipo MIME: ${file.type || "desconhecido"}`,
    `Tamanho: ${file.size} bytes`,
    "",
    "Conteúdo extraído:",
    extractedText || "Nenhum texto foi extraído deste arquivo."
  ].join("\n");
}

async function recognizeImageFile(file: File): Promise<string> {
  let worker: Awaited<ReturnType<typeof import("tesseract.js")["createWorker"]>> | null = null;

  try {
    const { createWorker } = await import("tesseract.js");
    worker = await createWorker("eng");
    const result = await Promise.race([
      worker.recognize(file),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("OCR_TIMEOUT")), 60_000);
      })
    ]);

    return result.data.text.trim() || "Nenhum texto foi reconhecido na imagem via OCR.";
  } catch (error) {
    if (error instanceof Error && error.message === "OCR_TIMEOUT") {
      return "OCR demorou mais que o limite seguro no navegador. O arquivo original ainda pode ser salvo e reprocessado depois.";
    }

    return "Não foi possível concluir o OCR desta imagem. O arquivo original ainda pode ser salvo no treinamento.";
  } finally {
    await worker?.terminate();
  }
}

async function previewImageFile(file: File): Promise<TrainingPreview> {
  const extractedText = await recognizeImageFile(file);

  return {
    title: file.name,
    type: "Imagem",
    content: buildPreviewContent(file, extractedText),
    fileName: file.name,
    fileMimeType: file.type || "application/octet-stream",
    fileSizeBytes: file.size
  };
}

export function AgentDetailClient({ agent }: { agent: AgentDetailView }) {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: agent.name,
    description: agent.description,
    communicationStyle: agent.communicationStyle,
    behavior: agent.behavior
  });
  const [trainingContent, setTrainingContent] = useState("");
  const [trainingType, setTrainingType] = useState("Texto");
  const [intentOpen, setIntentOpen] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [testMessage, setTestMessage] = useState("Olá, quais serviços vocês oferecem?");
  const [testAnswer, setTestAnswer] = useState("");
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState(agent.knowledgeBases[0]?.id ?? "");
  const [intentForm, setIntentForm] = useState({ name: "", description: "", triggers: "", action: "", webhookUrl: "" });
  const [pendingTrainingFiles, setPendingTrainingFiles] = useState<File[]>([]);
  const [trainingPreviews, setTrainingPreviews] = useState<TrainingPreview[]>([]);
  const [editingPreviewKeys, setEditingPreviewKeys] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deletingTraining, setDeletingTraining] = useState<string | null>(null);
  const [deletingIntent, setDeletingIntent] = useState<string | null>(null);
  const [loading, setLoading] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function saveProfile() {
    setLoading("profile");
    setError("");
    const response = await fetch(`/api/agents/${agent.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });
    setLoading("");

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível salvar o agente.");
      return;
    }

    setNotice("Agente salvo com sucesso.");
    router.refresh();
  }

  async function createTraining() {
    if (!trainingContent.trim()) return;
    setLoading("training");
    setError("");
    const response = await fetch(`/api/agents/${agent.id}/trainings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: trainingContent.slice(0, 80),
        type: trainingType,
        content: trainingContent,
        status: "trained"
      })
    });
    setLoading("");

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível criar o treinamento.");
      return;
    }

    setTrainingContent("");
    router.refresh();
  }

  async function uploadTrainingFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files?.length) return;

    const selectedFiles = Array.from(files);
    const imageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"));
    const serverPreviewFiles = selectedFiles.filter((file) => !file.type.startsWith("image/"));
    const formData = new FormData();
    serverPreviewFiles.forEach((file) => formData.append("files", file));

    setLoading("preview-training");
    setError("");

    try {
      const [imagePreviews, serverPreviews] = await Promise.all([
        Promise.all(imageFiles.map(previewImageFile)),
        serverPreviewFiles.length > 0
          ? fetch(`/api/agents/${agent.id}/trainings/upload?mode=preview`, {
            method: "POST",
            body: formData
          }).then(async (response) => {
            if (!response.ok) {
              const body = await response.json().catch(() => null);
              throw new Error(body?.error ?? "Não foi possível gerar a prévia dos arquivos.");
            }

            const body = await response.json() as { previews?: TrainingPreview[] };
            return body.previews ?? [];
          })
          : Promise.resolve([])
      ]);

      const previewsByKey = new Map([...imagePreviews, ...serverPreviews].map((preview) => [`${preview.fileName}:${preview.fileSizeBytes}`, preview]));
      setPendingTrainingFiles(selectedFiles);
      setTrainingPreviews(selectedFiles.map((file) => previewsByKey.get(getFileKey(file))).filter((preview): preview is TrainingPreview => Boolean(preview)));
      setPreviewOpen(true);
    } catch (previewError) {
      setError(previewError instanceof Error ? previewError.message : "Não foi possível gerar a prévia dos arquivos.");
    } finally {
      setLoading("");
      event.target.value = "";
    }
  }

  async function confirmTrainingUpload() {
    if (pendingTrainingFiles.length === 0) return;

    const formData = new FormData();
    pendingTrainingFiles.forEach((file) => formData.append("files", file));
    formData.append("previews", JSON.stringify(trainingPreviews));

    setLoading("upload-training");
    setError("");
    const response = await fetch(`/api/agents/${agent.id}/trainings/upload`, {
      method: "POST",
      body: formData
    });
    setLoading("");

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível salvar os arquivos.");
      return;
    }

    setPreviewOpen(false);
    setPendingTrainingFiles([]);
    setTrainingPreviews([]);
    setEditingPreviewKeys([]);
    setNotice("Arquivo confirmado e adicionado ao treinamento do agente.");
    router.refresh();
  }

  function cancelTrainingPreview() {
    setPreviewOpen(false);
    setPendingTrainingFiles([]);
    setTrainingPreviews([]);
    setEditingPreviewKeys([]);
  }

  function togglePreviewEdit(preview: TrainingPreview) {
    const key = `${preview.fileName}:${preview.fileSizeBytes}`;
    setEditingPreviewKeys((current) => (
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    ));
  }

  function updatePreviewContent(preview: TrainingPreview, content: string) {
    const key = `${preview.fileName}:${preview.fileSizeBytes}`;
    setTrainingPreviews((current) => current.map((item) => (
      `${item.fileName}:${item.fileSizeBytes}` === key ? { ...item, content } : item
    )));
  }

  async function attachKnowledgeBase() {
    if (!selectedKnowledgeBaseId) return;

    setLoading("knowledge-base");
    setError("");
    const response = await fetch(`/api/agents/${agent.id}/knowledge-bases/${selectedKnowledgeBaseId}`, {
      method: "POST"
    });
    setLoading("");

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível vincular a base.");
      return;
    }

    setNotice("Base de conhecimento vinculada como treinamento do agente.");
    router.refresh();
  }

  async function deleteTraining() {
    if (!deletingTraining) return;
    setLoading("delete-training");
    const response = await fetch(`/api/agents/${agent.id}/trainings/${deletingTraining}`, { method: "DELETE" });
    setLoading("");
    if (response.ok) {
      setDeletingTraining(null);
      router.refresh();
    }
  }

  async function createIntent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading("intent");
    setError("");
    const response = await fetch(`/api/agents/${agent.id}/intents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: intentForm.name,
        description: intentForm.description,
        triggers: intentForm.triggers.split(",").map((trigger) => trigger.trim()).filter(Boolean),
        action: intentForm.action,
        webhookUrl: intentForm.webhookUrl
      })
    });
    setLoading("");

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Não foi possível criar a intenção.");
      return;
    }

    setIntentOpen(false);
    setIntentForm({ name: "", description: "", triggers: "", action: "", webhookUrl: "" });
    router.refresh();
  }

  async function deleteIntent() {
    if (!deletingIntent) return;
    setLoading("delete-intent");
    const response = await fetch(`/api/agents/${agent.id}/intents/${deletingIntent}`, { method: "DELETE" });
    setLoading("");
    if (response.ok) {
      setDeletingIntent(null);
      router.refresh();
    }
  }

  async function testAgent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading("test");
    setTestAnswer("");
    setError("");
    const response = await fetch(`/api/agents/${agent.id}/test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: testMessage })
    });
    const body = await response.json().catch(() => null);
    setLoading("");

    if (!response.ok) {
      setError(body?.error ?? "Não foi possível testar a IA.");
      return;
    }

    setTestAnswer(body.answer);
  }

  return (
    <div className="space-y-6">
      <PageHeader title={agent.name} subtitle="Configure perfil, treinamentos, intenções, integrações e canais do agente" />
      {notice ? <p className="rounded-lg border border-primary/20 bg-primary/10 p-3 text-sm text-primary">{notice}</p> : null}
      {error ? <p className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit">
          <div className="grid place-items-center text-center">
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-primary to-accent text-2xl font-black text-slate-950">{agent.name.slice(0, 2).toUpperCase()}</div>
            <h2 className="mt-4 text-xl font-semibold text-white">{agent.name}</h2>
            <p className="text-sm text-slate-400">{agent.description}</p>
            <Badge className="mt-3">{agent.model}</Badge>
          </div>
          <div className="mt-6 space-y-1">
            {menu.map((item, index) => (
              <a key={item} href={`#${item.toLowerCase().replaceAll("ç", "c").replaceAll("õ", "o")}`} className={index === 0 ? "flex rounded-lg bg-primary/15 px-3 py-2 text-sm font-medium text-primary" : "flex rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10"}>{item}</a>
            ))}
          </div>
          <Button className="mt-6 w-full" onClick={() => setTestOpen(true)}><TestTube2 className="mr-2 h-4 w-4" />Teste sua IA</Button>
        </Card>
        <div className="space-y-5">
          <Card id="perfil">
            <h2 className="text-lg font-semibold text-white">Perfil</h2>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm text-slate-300">Nome do agente<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} /></label>
              <label className="grid gap-2 text-sm text-slate-300">Descrição<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={profile.description} onChange={(event) => setProfile((current) => ({ ...current, description: event.target.value }))} /></label>
              <div>
                <p className="mb-2 text-sm text-slate-300">Comunicação</p>
                <div className="flex flex-wrap gap-2">{["Formal", "Normal", "Descontraida"].map((item) => <Button key={item} variant={profile.communicationStyle === item ? "primary" : "secondary"} onClick={() => setProfile((current) => ({ ...current, communicationStyle: item }))}>{item}</Button>)}</div>
              </div>
              <label className="grid gap-2 text-sm text-slate-300">Comportamento do agente<textarea className="min-h-80 rounded-xl border border-white/10 bg-panel p-3 leading-relaxed outline-none" value={profile.behavior} onChange={(event) => setProfile((current) => ({ ...current, behavior: event.target.value }))} /></label>
              <div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setNotice("Histórico de alterações será exibido em uma próxima versão.")}>Histórico</Button><Button onClick={saveProfile} disabled={loading === "profile"}>{loading === "profile" ? "Salvando..." : "Salvar"}</Button></div>
            </div>
          </Card>
          <Card id="treinamentos">
            <h2 className="text-lg font-semibold text-white">Treinamentos</h2>
            <div className="mt-4 flex flex-wrap gap-2">{["Texto", "Website", "Vídeo", "Documento", "Base de conhecimento"].map((tab) => <Button key={tab} variant={trainingType === tab ? "primary" : "secondary"} onClick={() => setTrainingType(tab)}>{tab}</Button>)}</div>
            <div className="mt-5 flex flex-col gap-3 md:flex-row">
              <input className="min-w-0 flex-1 rounded-xl border border-white/10 bg-panel p-3 outline-none" placeholder="Escreva uma afirmação para cadastrar..." value={trainingContent} onChange={(event) => setTrainingContent(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void createTraining(); } }} />
              <Button variant="secondary" onClick={createTraining} disabled={loading === "training"}><FileText className="mr-2 h-4 w-4" />{loading === "training" ? "Salvando..." : "Cadastrar"}</Button>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-panel px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                <Bot className="mr-2 h-4 w-4" />
                {loading === "preview-training" ? "Analisando..." : "Upload"}
                <input className="sr-only" multiple type="file" accept="image/*,.txt,.md,.csv,.pdf,.doc,.docx" onChange={uploadTrainingFiles} />
              </label>
            </div>
            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-end">
              <label className="grid flex-1 gap-2 text-sm text-slate-300">
                Base de conhecimento
                <select className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={selectedKnowledgeBaseId} onChange={(event) => setSelectedKnowledgeBaseId(event.target.value)}>
                  <option value="">Selecione uma base</option>
                  {agent.knowledgeBases.map((base) => <option key={base.id} value={base.id}>{base.name} ({base.itemsCount} itens)</option>)}
                </select>
              </label>
              <Button variant="secondary" onClick={attachKnowledgeBase} disabled={!selectedKnowledgeBaseId || loading === "knowledge-base"}>{loading === "knowledge-base" ? "Vinculando..." : "Vincular base"}</Button>
            </div>
            <div className="mt-5 space-y-3">
              {agent.trainings.length === 0 ? <p className="rounded-xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-slate-400">Nenhum treinamento cadastrado.</p> : null}
              {agent.trainings.map((training) => (
                <div key={training.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{training.title}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge>{training.type}</Badge>
                      <Badge className="border-primary/30 bg-primary/10 text-primary">{training.status}</Badge>
                      {training.fileMimeType ? <Badge>{training.fileMimeType}</Badge> : null}
                    </div>
                    {training.fileName ? (
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span>{formatFileSize(training.fileSizeBytes)}</span>
                        <span>{formatUploadDate(training.uploadedAt)}</span>
                        {training.fileUrl ? (
                          <a className="inline-flex items-center gap-1 text-primary hover:underline" href={training.fileUrl} target="_blank" rel="noreferrer">
                            Abrir original
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-amber-200">Original sem storage externo</span>
                        )}
                      </div>
                    ) : null}
                  </div>
                  <Button variant="danger" className="px-3" onClick={() => setDeletingTraining(training.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </Card>
          <Card id="intencoes">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold text-white">Intenções</h2><p className="text-sm text-slate-400">Comandos que acionam ações externas.</p></div><Button onClick={() => setIntentOpen(true)}>Cadastrar intenção</Button></div>
            <div className="mt-5 space-y-3">
              {agent.intents.length === 0 ? <p className="rounded-xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-slate-400">Nenhuma intenção cadastrada.</p> : null}
              {agent.intents.map((intent) => <div key={intent.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 p-4"><div><p className="font-semibold text-white">{intent.name}</p><p className="text-sm text-slate-400">{intent.description}</p><p className="mt-1 text-xs text-primary">{intent.triggers.join(", ") || "Sem gatilhos"}</p></div><Button variant="danger" className="px-3" onClick={() => setDeletingIntent(intent.id)}><Trash2 className="h-4 w-4" /></Button></div>)}
            </div>
          </Card>
          <div id="integrações" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{integrations.map(([name, description, Icon]) => <IntegrationCard key={name} name={name} description={description} icon={Icon} />)}</div>
          <Card id="canais" className="text-center"><MessageCircle className="mx-auto h-10 w-10 text-primary" /><h2 className="mt-4 text-xl font-semibold text-white">Os canais mudaram de lugar!</h2><p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">Agora você pode gerenciar todos os seus canais de atendimento em um único lugar, direto do menu principal.</p><div className="my-5 grid gap-3 md:grid-cols-2"><div className="rounded-xl bg-white/5 p-4 text-slate-400">Antes: Dentro de cada agente &gt; Canais</div><div className="rounded-xl bg-primary/10 p-4 text-primary">Agora: Menu Principal &gt; Canais</div></div><Link href="/channels"><Button>Ir para Canais</Button></Link></Card>
        </div>
      </div>

      <Modal open={intentOpen} onClose={() => setIntentOpen(false)} title="Cadastrar intenção">
        <form className="grid gap-4" onSubmit={createIntent}>
          <label className="grid gap-2 text-sm text-slate-300">Nome<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={intentForm.name} onChange={(event) => setIntentForm((current) => ({ ...current, name: event.target.value }))} required /></label>
          <label className="grid gap-2 text-sm text-slate-300">Descrição<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={intentForm.description} onChange={(event) => setIntentForm((current) => ({ ...current, description: event.target.value }))} required /></label>
          <label className="grid gap-2 text-sm text-slate-300">Gatilhos<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={intentForm.triggers} onChange={(event) => setIntentForm((current) => ({ ...current, triggers: event.target.value }))} placeholder="boleto, segunda via" /></label>
          <label className="grid gap-2 text-sm text-slate-300">Ação<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={intentForm.action} onChange={(event) => setIntentForm((current) => ({ ...current, action: event.target.value }))} required /></label>
          <label className="grid gap-2 text-sm text-slate-300">Webhook opcional<input className="rounded-xl border border-white/10 bg-panel p-3 outline-none" value={intentForm.webhookUrl} onChange={(event) => setIntentForm((current) => ({ ...current, webhookUrl: event.target.value }))} /></label>
          <Button className="justify-self-end" disabled={loading === "intent"}>{loading === "intent" ? "Salvando..." : "Salvar intenção"}</Button>
        </form>
      </Modal>

      <Modal open={testOpen} onClose={() => setTestOpen(false)} title="Teste sua IA">
        <form className="grid gap-4" onSubmit={testAgent}>
          <label className="grid gap-2 text-sm text-slate-300">Mensagem de teste<textarea className="min-h-24 rounded-xl border border-white/10 bg-panel p-3 outline-none" value={testMessage} onChange={(event) => setTestMessage(event.target.value)} /></label>
          <Button className="justify-self-end" disabled={loading === "test"}>{loading === "test" ? "Testando..." : "Enviar teste"}</Button>
          {testAnswer ? <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm text-slate-100">{testAnswer}</div> : null}
        </form>
      </Modal>

      <Modal open={previewOpen} onClose={cancelTrainingPreview} title="Prévia do treinamento">
        <div className="grid max-h-[70vh] gap-4 overflow-y-auto pr-1">
          {trainingPreviews.map((preview) => (
            <div key={`${preview.fileName}:${preview.fileSizeBytes}`} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="min-w-0 flex-1 truncate text-sm font-semibold text-white">{preview.title}</p>
                <Badge>{preview.type}</Badge>
                <Badge>{formatFileSize(preview.fileSizeBytes)}</Badge>
                <Button variant="secondary" className="px-3 py-1 text-xs" onClick={() => togglePreviewEdit(preview)}>
                  {editingPreviewKeys.includes(`${preview.fileName}:${preview.fileSizeBytes}`) ? "Concluir edição" : "Editar conteúdo"}
                </Button>
              </div>
              <p className="mt-2 text-xs text-slate-400">{preview.fileMimeType}</p>
              {editingPreviewKeys.includes(`${preview.fileName}:${preview.fileSizeBytes}`) ? (
                <textarea
                  className="mt-3 min-h-72 w-full rounded-lg border border-white/10 bg-slate-950/70 p-3 text-xs leading-relaxed text-slate-200 outline-none focus:border-primary/60"
                  value={preview.content}
                  onChange={(event) => updatePreviewContent(preview, event.target.value)}
                />
              ) : (
                <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-950/70 p-3 text-xs leading-relaxed text-slate-200">{preview.content}</pre>
              )}
            </div>
          ))}
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="secondary" onClick={cancelTrainingPreview} disabled={loading === "upload-training"}>Cancelar</Button>
            <Button onClick={confirmTrainingUpload} disabled={loading === "upload-training"}>
              {loading === "upload-training" ? "Salvando..." : "Confirmar treinamento"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={Boolean(deletingTraining)} onClose={() => setDeletingTraining(null)} title="Excluir treinamento?" onConfirm={deleteTraining} loading={loading === "delete-training"} />
      <ConfirmDialog open={Boolean(deletingIntent)} onClose={() => setDeletingIntent(null)} title="Excluir intenção?" onConfirm={deleteIntent} loading={loading === "delete-intent"} />
    </div>
  );
}
