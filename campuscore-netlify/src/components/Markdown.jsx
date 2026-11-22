import { useMemo, useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { copyText, cx } from "../lib/utils";

/* ------------------------------------------------------------------
   Lightweight, dependency-free Markdown renderer tuned for AI replies.
   Supports headings, lists, tables, blockquotes, links, inline code,
   bold/italic emphasis and copyable fenced code blocks.
   ------------------------------------------------------------------ */

function renderInline(text, keyBase = "in") {
  const nodes = [];
  const pattern =
    /(`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\n]+\*|\[[^\]\n]+\]\(https?:\/\/[^)\s]+\))/g;
  let lastIndex = 0;
  let match;
  let index = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    const key = `${keyBase}-${index++}`;

    if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11.5px] text-cyan-200"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-bold text-white">
          {renderInline(token.slice(2, -2), key)}
        </strong>
      );
    } else if (token.startsWith("*")) {
      nodes.push(
        <em key={key} className="italic text-slate-200">
          {token.slice(1, -1)}
        </em>
      );
    } else {
      const link = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
      if (link) {
        nodes.push(
          <a
            key={key}
            href={link[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 font-medium text-cyan-300 underline decoration-cyan-400/30 underline-offset-2 transition hover:text-cyan-200 hover:decoration-cyan-300"
          >
            {link[1]}
            <ExternalLink className="h-3 w-3" />
          </a>
        );
      } else {
        nodes.push(token);
      }
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length ? nodes : [text];
}

function CodeBlock({ code, lang }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyText(code);
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-white/10 bg-[#04060B]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3 py-1.5">
        <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          {lang || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-300" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-[12px] leading-relaxed text-slate-200">{code}</code>
      </pre>
    </div>
  );
}

function isBlockStart(line) {
  return (
    /^```/.test(line) ||
    /^#{1,4}\s/.test(line) ||
    /^\s*[-*]\s+/.test(line) ||
    /^\s*\d+\.\s+/.test(line) ||
    /^>\s?/.test(line) ||
    /^\s*(---|\*\*\*|___)\s*$/.test(line)
  );
}

function splitRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableLine(line) {
  return typeof line === "string" && line.includes("|");
}

function isTableDivider(line) {
  return /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(line) && line.includes("-");
}

function parseBlocks(source) {
  const lines = String(source || "")
    .replace(/\r\n/g, "\n")
    .split("\n");
  const blocks = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    /* Fenced code */
    if (/^```/.test(line.trim())) {
      const lang = line.trim().slice(3).trim();
      const buffer = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        buffer.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push(<CodeBlock key={`code-${key++}`} code={buffer.join("\n")} lang={lang} />);
      continue;
    }

    /* Headings */
    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2];
      const styles = {
        1: "font-display text-xl font-bold tracking-tight text-white",
        2: "mt-2 border-b border-white/10 pb-2 font-display text-[17px] font-bold tracking-tight text-white",
        3: "mt-1 font-display text-[14.5px] font-bold text-indigo-200",
        4: "mt-1 text-[13px] font-bold text-slate-200",
      };
      blocks.push(
        <div key={`h-${key++}`} className={styles[level]}>
          {renderInline(text, `h-${key}`)}
        </div>
      );
      i += 1;
      continue;
    }

    /* Horizontal rule */
    if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) {
      blocks.push(<div key={`hr-${key++}`} className="divider my-4" />);
      i += 1;
      continue;
    }

    /* Table */
    if (isTableLine(line) && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      const header = splitRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && isTableLine(lines[i]) && lines[i].trim()) {
        rows.push(splitRow(lines[i]));
        i += 1;
      }
      blocks.push(
        <div key={`table-${key++}`} className="my-4 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full border-collapse text-left text-[12px]">
            <thead className="bg-white/[0.05] text-slate-300">
              <tr>
                {header.map((cell, index) => (
                  <th key={index} className="px-3 py-2 font-semibold">
                    {renderInline(cell, `th-${key}-${index}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="text-slate-400">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-3 py-2 align-top">
                      {renderInline(cell, `td-${key}-${rowIndex}-${cellIndex}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    /* Unordered list */
    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i += 1;
      }
      blocks.push(
        <ul key={`ul-${key++}`} className="my-2 space-y-1.5 pl-5 text-[12.5px] leading-relaxed text-slate-300">
          {items.map((item, index) => (
            <li key={index} className="list-disc marker:text-indigo-400/70">
              {renderInline(item, `li-${key}-${index}`)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    /* Ordered list */
    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i += 1;
      }
      blocks.push(
        <ol key={`ol-${key++}`} className="my-2 space-y-1.5 pl-5 text-[12.5px] leading-relaxed text-slate-300">
          {items.map((item, index) => (
            <li key={index} className="list-decimal marker:font-mono marker:text-indigo-400/70">
              {renderInline(item, `oli-${key}-${index}`)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    /* Blockquote */
    if (/^>\s?/.test(line)) {
      const quote = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push(
        <blockquote
          key={`quote-${key++}`}
          className="my-3 rounded-r-lg border-l-2 border-indigo-400/60 bg-indigo-500/[0.06] py-2.5 pl-4 pr-3 text-[12.5px] leading-relaxed text-slate-300"
        >
          {renderInline(quote.join(" "), `quote-${key}`)}
        </blockquote>
      );
      continue;
    }

    /* Paragraph */
    const paragraph = [];
    while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) {
      if (isTableLine(lines[i]) && i + 1 < lines.length && isTableDivider(lines[i + 1])) break;
      paragraph.push(lines[i].trim());
      i += 1;
    }
    if (paragraph.length) {
      blocks.push(
        <p key={`p-${key++}`} className="text-[12.5px] leading-relaxed text-slate-300">
          {renderInline(paragraph.join(" "), `p-${key}`)}
        </p>
      );
    } else {
      i += 1;
    }
  }

  return blocks;
}

export default function Markdown({ content, className }) {
  const blocks = useMemo(() => parseBlocks(content), [content]);
  return <div className={cx("space-y-2.5", className)}>{blocks}</div>;
}
