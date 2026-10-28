import assert from "node:assert/strict";
import { test } from "node:test";
import { SHEET_WIDTH, countDelivered, summarize } from "../src/notes.mjs";

test("a short note is kept, with its spaces folded", () => {
  assert.equal(summarize("  left   with\nneighbour "), "left with neighbour");
});

test("a note longer than the sheet is cut to the sheet's width", () => {
  const out = summarize("x".repeat(SHEET_WIDTH + 20));
  assert.equal(out.length, SHEET_WIDTH);
  assert.ok(out.endsWith("…"));
});

test("an empty note says so", () => {
  assert.equal(summarize("   "), "(empty note)");
});

test("only notes that say delivered are counted as deliveries", () => {
  assert.equal(countDelivered(["Delivered to desk", "no answer", "DELIVERED, signed"]), 2);
});

test("a note that says not delivered is no delivery", () => {
  assert.equal(countDelivered(["Not delivered, gate locked", "not  delivered", "Delivered to desk"]), 1);
});

test("a note that says not yet delivered is no delivery", () => {
  assert.equal(countDelivered(["Not yet delivered, van late", "not  YET delivered", "Delivered to desk"]), 1);
});
