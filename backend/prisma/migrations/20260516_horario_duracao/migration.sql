-- Feature 002: Horário e Duração de Tarefas
ALTER TABLE "tarefas" ADD COLUMN "horario_inicio" VARCHAR(5);
ALTER TABLE "tarefas" ADD COLUMN "duracao" INTEGER;

ALTER TABLE "tarefas"
  ADD CONSTRAINT "chk_horario_inicio"
    CHECK ("horario_inicio" IS NULL OR "horario_inicio" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$');

ALTER TABLE "tarefas"
  ADD CONSTRAINT "chk_duracao"
    CHECK ("duracao" IS NULL OR "duracao" >= 1);
