import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

// Publica el índice de Agent Skills (Agent Skills Discovery RFC v0.2.0):
//   public/.well-known/agent-skills/index.json   lista de skills con su digest SHA-256
// Cada skill es public/.well-known/agent-skills/{name}/SKILL.md. El nombre y la descripción salen
// de su frontmatter y el digest de los bytes tal cual se suben a S3, así que el índice no se
// desincroniza si alguien edita un SKILL.md: basta con volver a correr el build.

const SCHEMA_URL = "https://schemas.agentskills.io/discovery/0.2.0/schema.json";
const SKILLS_PATH = "/.well-known/agent-skills/";
const SKILLS_DIR = resolve(process.cwd(), "public", SKILLS_PATH.replace(/^\/+/u, ""));
const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const MAX_DESCRIPTION_LENGTH = 1024;

type SkillEntry = {
  name: string;
  type: "skill-md";
  description: string;
  url: string;
  digest: string;
};

// Frontmatter sencillo de una línea por clave (name, description); no hace falta un parser YAML.
function readFrontmatter(source: string, file: string): Record<string, string> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/u.exec(source);
  if (!match) {
    throw new Error(`${file}: falta el frontmatter YAML al inicio`);
  }

  const fields: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/u)) {
    const field = /^([a-z-]+):\s*(.*)$/u.exec(line);
    if (field) {
      fields[field[1]] = field[2].trim().replace(/^(["'])(.*)\1$/u, "$2");
    }
  }
  return fields;
}

async function readSkill(dirName: string): Promise<SkillEntry> {
  const file = resolve(SKILLS_DIR, dirName, "SKILL.md");
  const bytes = await readFile(file);
  const { name, description } = readFrontmatter(bytes.toString("utf8"), file);

  if (!name || !NAME_PATTERN.test(name) || name.length > 64) {
    throw new Error(`${file}: name "${name ?? ""}" debe tener 1 a 64 caracteres en minúsculas, dígitos y guiones`);
  }
  if (name !== dirName) {
    throw new Error(`${file}: name "${name}" debe coincidir con la carpeta "${dirName}"`);
  }
  if (!description || description.length > MAX_DESCRIPTION_LENGTH) {
    throw new Error(`${file}: description es obligatoria y de máximo ${MAX_DESCRIPTION_LENGTH} caracteres`);
  }

  return {
    name,
    type: "skill-md",
    description,
    url: `${SKILLS_PATH}${name}/SKILL.md`,
    digest: `sha256:${createHash("sha256").update(bytes).digest("hex")}`,
  };
}

async function main(): Promise<void> {
  const entries = await readdir(SKILLS_DIR, { withFileTypes: true });
  const skills = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
      .map(readSkill),
  );

  const index = { $schema: SCHEMA_URL, skills };
  await writeFile(resolve(SKILLS_DIR, "index.json"), `${JSON.stringify(index, null, 2)}\n`, "utf8");
  console.log(`build:agent-skills: ${skills.length} skills en ${SKILLS_PATH}index.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
