import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";

const workspaceRoot = process.cwd();
const localTmpDir = resolve(workspaceRoot, ".lhci", "tmp");
const maxAttempts = 3;

function sleep(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

function cleanupLighthouseTemp() {
  mkdirSync(localTmpDir, { recursive: true });

  for (const entry of readdirSync(localTmpDir)) {
    if (!entry.startsWith("lighthouse.")) {
      continue;
    }

    const fullPath = join(localTmpDir, entry);
    try {
      rmSync(fullPath, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors; retry logic will handle transient locks.
    }
  }
}

function runCommand(command, args, env) {
  return new Promise((resolvePromise) => {
    const child = spawn(command, args, {
      cwd: workspaceRoot,
      env,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let combinedOutput = "";

    child.stdout.on("data", (chunk) => {
      const text = String(chunk);
      combinedOutput += text;
      process.stdout.write(text);
    });

    child.stderr.on("data", (chunk) => {
      const text = String(chunk);
      combinedOutput += text;
      process.stderr.write(text);
    });

    child.on("close", (code) => {
      resolvePromise({ code: code ?? 1, output: combinedOutput });
    });
  });
}

async function main() {
  const env = {
    ...process.env,
    TEMP: localTmpDir,
    TMP: localTmpDir,
  };

  const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

  const healthcheck = await runCommand(command, ["exec", "lhci", "healthcheck"], env);
  if (healthcheck.code !== 0) {
    process.exit(healthcheck.code);
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    cleanupLighthouseTemp();

    const result = await runCommand(command, ["exec", "lhci", "collect"], env);
    if (result.code === 0) {
      break;
    }

    const shouldRetry = /EPERM, Permission denied/iu.test(result.output);
    if (!shouldRetry && attempt === maxAttempts) {
      process.exit(result.code);
    }

    if (!shouldRetry) {
      process.exit(result.code);
    }

    if (attempt === maxAttempts) {
      console.warn("\n[lhci-stable] EPERM persistente en collect; continuo con assert/upload si hay resultados generados.");
      break;
    }

    const waitMs = 1000 * attempt;
    console.warn(`\n[lhci-stable] Reintentando por EPERM (${attempt}/${maxAttempts}) en ${waitMs}ms...`);
    await sleep(waitMs);
  }

  const assertStep = await runCommand(command, ["exec", "lhci", "assert"], env);
  if (assertStep.code !== 0) {
    process.exit(assertStep.code);
  }

  const uploadStep = await runCommand(command, ["exec", "lhci", "upload"], env);
  process.exit(uploadStep.code);
}

main();



