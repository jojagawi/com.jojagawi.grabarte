import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import ts from "typescript";

const sourcePath = resolve(process.cwd(), "src/sw/service-worker.ts");
const outputPath = resolve(process.cwd(), "public/service-worker.js");

const source = readFileSync(sourcePath, "utf8");
const result = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.None,
    lib: ["ES2020", "WebWorker"],
    removeComments: false,
  },
  reportDiagnostics: true,
  fileName: sourcePath,
});

if (result.diagnostics && result.diagnostics.length > 0) {
  const errors = ts.formatDiagnosticsWithColorAndContext(result.diagnostics, {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => process.cwd(),
    getNewLine: () => "\n",
  });

  throw new Error(errors);
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, result.outputText, "utf8");

