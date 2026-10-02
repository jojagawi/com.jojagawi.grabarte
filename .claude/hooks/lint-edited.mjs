// PostToolUse (Edit|Write):
// - .ts/.tsx/.js/.jsx/.mjs → ESLint --fix
// - .css/.scss → Stylelint --fix + Prettier
// - prisma/schema.prisma → prisma generate
// Los errores que quedan se devuelven a Claude como contexto.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { basename, extname, join } from "node:path";

const input = JSON.parse(readFileSync(0, "utf8") || "{}");
const file = input.tool_response?.filePath ?? input.tool_input?.file_path;
if (!file) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const bin = (name) => join(root, "node_modules", ".bin", process.platform === "win32" ? `${name}.cmd` : name);
const run = (name, args) =>
  spawnSync(`"${bin(name)}" ${args.join(" ")}`, { cwd: root, encoding: "utf8", shell: true });

const report = (tool, res) => {
  if (res.status === 0) return;
  const out = `${res.stdout}${res.stderr}`.trim();
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext: `${tool} reporta problemas en ${file}:\n${out}`,
    },
  }));
};

const ext = extname(file).toLowerCase();

if ([".ts", ".tsx", ".js", ".jsx", ".mjs"].includes(ext)) {
  report("ESLint", run("eslint", ["--fix", "--no-warn-ignored", `"${file}"`]));
} else if ([".css", ".scss"].includes(ext)) {
  const res = run("stylelint", ["--fix", `"${file}"`]);
  run("prettier", ["--write", `"${file}"`]);
  report("Stylelint", res);
} else if (basename(file) === "schema.prisma") {
  report("prisma generate", run("prisma", ["generate"]));
}
