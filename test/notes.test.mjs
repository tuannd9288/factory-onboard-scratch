import assert from "node:assert/strict";
import { test } from "node:test";
import { SHEET_WIDTH, countDelivered, summarize } from "../src/notes.mjs";
import * as notes from "../src/notes.mjs";

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

test("a leading Note label is dropped regardless of case", () => {
  assert.equal(summarize("Note: left at door"), "left at door");
  assert.equal(summarize("NOTE:  left at door"), "left at door");
});

test("a Note label inside a note is kept", () => {
  assert.equal(summarize("left at door. Note: gate code 12"), "left at door. Note: gate code 12");
});

test("a Note label alone is an empty note", () => {
  assert.equal(summarize("Note:"), "(empty note)");
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

test("a note returned after delivery is no delivery", () => {
  assert.equal(
    countDelivered(["Delivered, then returned to sender", "delivered but RETURNED", "Delivered to desk"]),
    1,
  );
});

test("returned parcels are counted regardless of case", () => {
  assert.equal(notes.countReturned(["Returned to sender", "RETURNED", "returned", "Delivered to desk"]), 3);
  assert.equal(notes.countReturned([]), 0);
  assert.equal(notes.countReturned(["unreturned", "returnedness"]), 0);
});

test("not returned is excluded regardless of spacing or case", () => {
  assert.equal(notes.countReturned(["Not returned", "NOT  RETURNED", "not\treturned", "Not\n returned"]), 0);
});

test("the morning sheet counts returns after delivery", () => {
  assert.equal(
    notes.countReturned(["Returned to sender", "Delivered, then returned", "Not  returned, held at depot", "Delivered to desk"]),
    2,
  );
});
