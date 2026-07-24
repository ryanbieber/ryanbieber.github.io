import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(path.join(root, "projects.html"), "utf8");
const script = await readFile(path.join(root, "projects.js"), "utf8");
const dom = new JSDOM(html, {
    runScripts: "outside-only",
    url: "https://example.test/projects.html"
});

dom.window.eval(script);

const document = dom.window.document;
const search = document.querySelector("[data-archive-search]");
const clear = document.querySelector("[data-clear]");
const resultCount = document.querySelector("[data-result-count]");
const emptyState = document.querySelector("[data-empty-state]");
const items = [...document.querySelectorAll("[data-archive-item]")];

const visibleItems = () => items.filter((item) => !item.hidden);
const representedCount = () => visibleItems().reduce(
    (total, item) => total + Number(item.dataset.count ?? 0),
    0
);

assert.equal(items.length, 34, "The enhanced archive should have 33 public cards and one private vault card.");
assert.equal(visibleItems().length, 34, "Every card should be visible initially.");
assert.equal(representedCount(), 58, "Initial represented-project count should be 58.");
assert.equal(resultCount.textContent, "58 represented repositories");
assert.equal(emptyState.hidden, true);

search.value = "typescript";
search.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
assert.equal(visibleItems().length, 3, "TypeScript search should match three public cards.");
assert.equal(representedCount(), 3);
assert.equal(resultCount.textContent, "3 represented repositories");

clear.click();
assert.equal(visibleItems().length, 34, "Clear should restore the complete archive.");
assert.equal(representedCount(), 58);
assert.equal(document.activeElement, search, "Clear should return keyboard focus to search.");
assert.equal(document.querySelector('input[name="visibility"][value="all"]').checked, true);

const privateFilter = document.querySelector('input[name="visibility"][value="private"]');
privateFilter.checked = true;
privateFilter.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
assert.equal(visibleItems().length, 1, "Private filter should show only the vault panel.");
assert.equal(representedCount(), 25, "Private vault represents 25 repositories.");
assert.equal(resultCount.textContent, "25 represented repositories");

search.value = "forecasting";
search.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
assert.equal(visibleItems().length, 1, "Private broad-summary search should retain the vault.");
assert.equal(representedCount(), 25);

search.value = "definitely-no-match";
search.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
assert.equal(visibleItems().length, 0);
assert.equal(representedCount(), 0);
assert.equal(resultCount.textContent, "0 represented repositories");
assert.equal(emptyState.hidden, false, "Empty state should be shown when nothing matches.");

clear.click();
assert.equal(visibleItems().length, 34);
assert.equal(emptyState.hidden, true);

console.log("Archive control tests passed.");
