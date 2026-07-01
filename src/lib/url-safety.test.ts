import test from "node:test";
import assert from "node:assert/strict";
import { isSafeHttpUrl, sanitizeTextContent } from "./url-safety";

test("rejects insecure external http links", () => {
  assert.equal(isSafeHttpUrl("http://example.com"), false);
});

test("allows localhost over http for local previews", () => {
  assert.equal(isSafeHttpUrl("http://localhost:3000"), true);
  assert.equal(isSafeHttpUrl("http://127.0.0.1:3000"), true);
});

test("strips control characters from user-generated text", () => {
  assert.equal(sanitizeTextContent("My \u0000Project"), "My Project");
  assert.equal(sanitizeTextContent("  Hello  "), "Hello");
});
