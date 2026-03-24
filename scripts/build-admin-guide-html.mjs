import fs from "node:fs";
import path from "node:path";

const inputPath = path.resolve("docs/admin-dashboard-user-guide.md");
const outputPath = path.resolve("docs/admin-dashboard-user-guide.html");

const md = fs.readFileSync(inputPath, "utf8");
const lines = md.split(/\r?\n/);

const esc = (s) =>
	s
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");

let html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>IGIL Admin Dashboard User Guide</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.5; margin: 28px; color: #111; }
    h1, h2, h3 { color: #111; }
    h1 { font-size: 30px; margin-top: 0; }
    h2 { font-size: 22px; margin-top: 26px; page-break-after: avoid; }
    h3 { font-size: 18px; margin-top: 20px; page-break-after: avoid; }
    p, li { font-size: 13px; }
    ul, ol { margin: 8px 0 10px 22px; }
    code { background: #f4f4f4; padding: 1px 4px; border-radius: 4px; }
    img { max-width: 100%; border: 1px solid #ddd; border-radius: 6px; margin: 8px 0 16px; page-break-inside: avoid; }
    .small { color: #555; font-size: 12px; }
  </style>
</head>
<body>
`;

let inUl = false;
let inOl = false;

const closeLists = () => {
	if (inUl) {
		html += "</ul>\n";
		inUl = false;
	}
	if (inOl) {
		html += "</ol>\n";
		inOl = false;
	}
};

for (const raw of lines) {
	const line = raw.trim();
	if (!line) {
		closeLists();
		continue;
	}

	const img = line.match(/^!\[(.*?)\]\((.*?)\)$/);
	if (img) {
		closeLists();
		const [, alt, src] = img;
		html += `<img src="${esc(src)}" alt="${esc(alt)}" />\n`;
		continue;
	}

	if (line.startsWith("### ")) {
		closeLists();
		html += `<h3>${esc(line.slice(4))}</h3>\n`;
		continue;
	}
	if (line.startsWith("## ")) {
		closeLists();
		html += `<h2>${esc(line.slice(3))}</h2>\n`;
		continue;
	}
	if (line.startsWith("# ")) {
		closeLists();
		html += `<h1>${esc(line.slice(2))}</h1>\n`;
		continue;
	}

	if (line.startsWith("- ")) {
		if (inOl) {
			html += "</ol>\n";
			inOl = false;
		}
		if (!inUl) {
			html += "<ul>\n";
			inUl = true;
		}
		html += `<li>${esc(line.slice(2)).replaceAll("**", "")}</li>\n`;
		continue;
	}

	if (/^\d+\.\s+/.test(line)) {
		if (inUl) {
			html += "</ul>\n";
			inUl = false;
		}
		if (!inOl) {
			html += "<ol>\n";
			inOl = true;
		}
		html += `<li>${esc(line.replace(/^\d+\.\s+/, "")).replaceAll("**", "")}</li>\n`;
		continue;
	}

	closeLists();
	html += `<p>${esc(line).replaceAll("**", "")}</p>\n`;
}

closeLists();
html += "</body></html>\n";

fs.writeFileSync(outputPath, html, "utf8");
console.log(`Wrote ${outputPath}`);
