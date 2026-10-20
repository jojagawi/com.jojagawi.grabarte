import type { ReactNode } from "react";
import Link from "next/link";

// Markdown acotado para las guías de /catalogos (sin dependencias ni HTML crudo): ## y ###,
// párrafos, listas con "-" o "1.", tablas con "|", **negritas** y [enlaces](/ruta/).
// Se arma con elementos de React, así que el texto del panel nunca se inyecta como HTML.

type GuideBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; header: string[]; rows: string[][] };

const ORDERED_ITEM = /^\d+\.\s+/u;
const UNORDERED_ITEM = /^[-*]\s+/u;

function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\||\|$/gu, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableSeparator(line: string): boolean {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?$/u.test(line.trim());
}

export function parseGuide(markdown: string): GuideBlock[] {
  const lines = markdown.replace(/\r\n/gu, "\n").split("\n");
  const blocks: GuideBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.+)$/u);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length as 2 | 3, text: heading[2].trim() });
      index += 1;
      continue;
    }

    if (line.startsWith("|") && isTableSeparator(lines[index + 1] ?? "")) {
      const header = splitTableRow(line);
      const rows: string[][] = [];
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }
      blocks.push({ type: "table", header, rows });
      continue;
    }

    if (UNORDERED_ITEM.test(line) || ORDERED_ITEM.test(line)) {
      const ordered = ORDERED_ITEM.test(line);
      const marker = ordered ? ORDERED_ITEM : UNORDERED_ITEM;
      const items: string[] = [];
      while (index < lines.length && marker.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(marker, ""));
        index += 1;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    // Un párrafo junta líneas seguidas hasta una línea en blanco o el inicio de otro bloque.
    const paragraph: string[] = [];
    while (index < lines.length) {
      const current = lines[index].trim();
      if (!current || /^#{2,3}\s/u.test(current) || current.startsWith("|") || UNORDERED_ITEM.test(current) || ORDERED_ITEM.test(current)) {
        break;
      }
      paragraph.push(current);
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

const INLINE_TOKEN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/gu;

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(INLINE_TOKEN)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    const [, bold, label, href] = match;
    if (bold) {
      nodes.push(<strong key={start} className="font-semibold text-foreground">{renderInline(bold)}</strong>);
    } else if (href.startsWith("/")) {
      nodes.push(
        <Link key={start} href={href} className="font-medium text-primary underline underline-offset-4 hover:text-inspirarte-petroleum-deep">
          {label}
        </Link>,
      );
    } else if (/^https:\/\//u.test(href)) {
      nodes.push(
        <a key={start} href={href} rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-4 hover:text-inspirarte-petroleum-deep">
          {label}
        </a>,
      );
    } else {
      // Enlaces con otro esquema (javascript:, mailto:…) se muestran como texto.
      nodes.push(label);
    }

    lastIndex = start + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

interface GuideContentProps {
  markdown: string;
  className?: string;
}

export function GuideContent({ markdown, className }: GuideContentProps) {
  return (
    <div className={`space-y-5 text-base leading-relaxed text-muted-foreground ${className ?? ""}`}>
      {parseGuide(markdown).map((block, index) => {
        switch (block.type) {
          case "heading":
            return block.level === 2 ? (
              <h2 key={index} className="pt-6 font-serif text-2xl font-bold text-foreground text-balance sm:text-3xl">
                {renderInline(block.text)}
              </h2>
            ) : (
              <h3 key={index} className="pt-2 text-xl font-semibold text-foreground text-balance">
                {renderInline(block.text)}
              </h3>
            );
          case "paragraph":
            return <p key={index}>{renderInline(block.text)}</p>;
          case "list": {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag key={index} className={`space-y-2 pl-6 ${block.ordered ? "list-decimal" : "list-disc"}`}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{renderInline(item)}</li>
                ))}
              </ListTag>
            );
          }
          case "table":
            return (
              <div key={index} className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-120 border-collapse text-left text-sm">
                  <thead className="bg-muted/60 text-foreground">
                    <tr>
                      {block.header.map((cell, cellIndex) => (
                        <th key={cellIndex} scope="col" className="px-4 py-3 font-semibold">
                          {renderInline(cell)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-t border-border">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-3 align-top">
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}
