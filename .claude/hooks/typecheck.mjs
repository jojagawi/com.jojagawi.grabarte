// Stop: corre `tsc --noEmit` solo si hay .ts/.tsx modificados en el working tree.
// Si falla, bloquea el cierre del turno para que Claude corrija los errores (una sola vez).
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const input = JSON.parse(readFileSync(0, "utf8") || "{}");
if (input.stop_hook_active) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const opts = { cwd: root, encoding: "utf8" };

const status = spawnSync("git", ["status", "--porcelain"], opts).stdout ?? "";
if (!/\.tsx?$/m.test(status)) process.exit(0);

const tsc = join(root, "node_modules", ".bin", process.platform === "win32" ? "tsc.cmd" : "tsc");
const res = spawnSync(`"${tsc}" --noEmit --pretty false`, { ...opts, shell: true });
if (res.status !== 0) {
  const out = `${res.stdout}${res.stderr}`.trim().split("\n").slice(0, 40).join("\n");
  console.log(JSON.stringify({ decision: "block", reason: `Errores de TypeScript:\n${out}` }));
}
