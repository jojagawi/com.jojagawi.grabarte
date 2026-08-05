-- CreateTable
CREATE TABLE "Faqs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "showInSite" INTEGER NOT NULL DEFAULT 1,
    "showInMcp" INTEGER NOT NULL DEFAULT 1,
    "priority" INTEGER NOT NULL DEFAULT 1
);

-- CreateIndex
CREATE UNIQUE INDEX "Faqs_question_key" ON "Faqs"("question");
