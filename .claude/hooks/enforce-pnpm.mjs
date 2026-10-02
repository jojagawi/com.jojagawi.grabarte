// PreToolUse (Bash|PowerShell): bloquea npm/yarn/bun para instalar o correr scripts; este repo usa pnpm.
// `npx` se permite porque los scripts de package.json lo usan (npx prisma ...).
import { readFileSync } from "node:fs";

const input = JSON.parse(readFileSync(0, "utf8") || "{}");
const command = input.tool_input?.command ?? "";

const pattern = /(^|[\s;&|(])(npm|yarn|bun)(\.cmd)?\s+(i|install|add|ci|remove|rm|uninstall|un|update|up|upgrade|run|run-script|exec|dlx|x)\b/;
const match = command.match(pattern);
if (match) {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: `Este proyecto usa pnpm. Usa \`pnpm ${match[4]}\` en lugar de \`${match[2]} ${match[4]}\`.`,
    },
  }));
}
