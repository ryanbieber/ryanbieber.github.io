import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = new URL(process.argv[2] ?? "http://127.0.0.1:8000/");
const htmlPaths = [
    "index.html",
    "resume.html",
    "projects.html",
    "blog.html",
    "blog/prophet-rust-rewrite.html"
];
const requestUrls = new Set(htmlPaths.map((file) => new URL(file, baseUrl).href));

const isLocalReference = (reference) => (
    reference
    && !/^(?:https?:|mailto:|tel:|data:|#)/i.test(reference)
);

for (const htmlPath of htmlPaths) {
    const html = await readFile(path.join(root, htmlPath), "utf8");
    const documentUrl = new URL(htmlPath, baseUrl);

    for (const match of html.matchAll(/<(?:a|link|script|img)\b[^>]*(?:href|src)="([^"]+)"/gi)) {
        const reference = match[1].replace(/&amp;/g, "&");
        if (isLocalReference(reference)) {
            const resolved = new URL(reference, documentUrl);
            resolved.hash = "";
            requestUrls.add(resolved.href);
        }
    }
}

for (const cssPath of ["styles.css", "vendor/psone/psone.css"]) {
    const css = await readFile(path.join(root, cssPath), "utf8");
    const stylesheetUrl = new URL(cssPath, baseUrl);

    for (const match of css.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gi)) {
        const reference = match[2];
        if (isLocalReference(reference)) {
            const resolved = new URL(reference, stylesheetUrl);
            resolved.hash = "";
            requestUrls.add(resolved.href);
        }
    }
}

const results = await Promise.all([...requestUrls].sort().map(async (url) => {
    try {
        const response = await fetch(url, { redirect: "follow" });
        if (response.body) {
            await response.body.cancel();
        }
        return {
            ok: response.status === 200,
            status: response.status,
            type: response.headers.get("content-type") ?? "",
            url
        };
    } catch (error) {
        return { ok: false, status: null, type: "", url, error: error.message };
    }
}));

for (const result of results) {
    console.log(`${result.ok ? "OK" : "FAIL"} ${result.status ?? "ERR"} ${result.type || "-"} ${result.url}${result.error ? ` (${result.error})` : ""}`);
}

const failures = results.filter((result) => !result.ok);
if (failures.length > 0) {
    console.error(`Local response validation failed for ${failures.length} of ${results.length} routes/assets.`);
    process.exitCode = 1;
} else {
    console.log(`Local response validation passed for ${results.length} routes/assets.`);
}
