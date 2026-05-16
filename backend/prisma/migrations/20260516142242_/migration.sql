-- CreateEnum
CREATE TYPE "StatusTarefa" AS ENUM ('PENDENTE', 'EM_PLANEJAMENTO', 'EM_EXECUCAO', 'CONCLUIDA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarefas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "data" TIMESTAMP(3),
    "status" "StatusTarefa" NOT NULL DEFAULT 'PENDENTE',
    "usuario_id" TEXT NOT NULL,
    "pai_id" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tarefas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "tarefas_usuario_id_idx" ON "tarefas"("usuario_id");

-- CreateIndex
CREATE INDEX "tarefas_data_idx" ON "tarefas"("data");

-- CreateIndex
CREATE INDEX "tarefas_status_idx" ON "tarefas"("status");

-- AddForeignKey
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_pai_id_fkey" FOREIGN KEY ("pai_id") REFERENCES "tarefas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
