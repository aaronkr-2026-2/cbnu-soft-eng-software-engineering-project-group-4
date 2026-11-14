import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  MAX_CHAT_INPUT_LENGTH,
  isDevAuthBypassAllowed,
  sanitizeUserInputText
} from "./securityLogic.js";

import * as progressLogic from "./progressLogic.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("SEC-03: isDevAuthBypassAllowed - Development Bypass Access Control", () => {
  it("strictly denies authentication bypass in production environment", () => {
    // Under no circumstances should production builds allow bypass
    assert.equal(isDevAuthBypassAllowed(false, "?dev=true"), false);
    assert.equal(isDevAuthBypassAllowed(false, "?dev=true&admin=1"), false);
    assert.equal(isDevAuthBypassAllowed(false, "dev=true"), false);
    assert.equal(isDevAuthBypassAllowed(false, ""), false);
    assert.equal(isDevAuthBypassAllowed(false, null), false);
    assert.equal(isDevAuthBypassAllowed(false, undefined), false);
  });

  it("denies authentication bypass in development if ?dev=true is missing or invalid", () => {
    assert.equal(isDevAuthBypassAllowed(true, ""), false);
    assert.equal(isDevAuthBypassAllowed(true, "?dev=false"), false);
    assert.equal(isDevAuthBypassAllowed(true, "?dev=1"), false);
    assert.equal(isDevAuthBypassAllowed(true, "?mode=dev"), false);
    assert.equal(isDevAuthBypassAllowed(true, "?other=true"), false);
    assert.equal(isDevAuthBypassAllowed(true, null), false);
    assert.equal(isDevAuthBypassAllowed(true, undefined), false);
  });

  it("permits authentication bypass only when isDevEnv is true AND ?dev=true is present", () => {
    assert.equal(isDevAuthBypassAllowed(true, "?dev=true"), true);
    assert.equal(isDevAuthBypassAllowed(true, "?foo=bar&dev=true"), true);
    assert.equal(isDevAuthBypassAllowed(true, "?dev=true&lang=en"), true);
  });
});

describe("SEC-05: sanitizeUserInputText - Dialogue Input Length Clamping & Sanitization", () => {
  it("enforces MAX_CHAT_INPUT_LENGTH constant value of 300", () => {
    assert.equal(MAX_CHAT_INPUT_LENGTH, 300);
  });

  it("handles non-string or empty inputs safely", () => {
    assert.equal(sanitizeUserInputText(null), "");
    assert.equal(sanitizeUserInputText(undefined), "");
    assert.equal(sanitizeUserInputText(12345), "");
    assert.equal(sanitizeUserInputText({}), "");
    assert.equal(sanitizeUserInputText(""), "");
    assert.equal(sanitizeUserInputText("   \t\n   "), "");
  });

  it("trims leading and trailing whitespace from input", () => {
    assert.equal(sanitizeUserInputText("   Hello barista!   "), "Hello barista!");
  });

  it("preserves inputs at or below 300 characters intact", () => {
    const normalInput = "Could I please order an iced Americano and one croissant?";
    assert.equal(sanitizeUserInputText(normalInput), normalInput);

    const exact300 = "A".repeat(300);
    assert.equal(sanitizeUserInputText(exact300), exact300);
    assert.equal(sanitizeUserInputText(exact300).length, 300);
  });

  it("strictly truncates inputs exceeding 300 characters to exactly 300 characters", () => {
    const longInput = "B".repeat(500);
    const sanitized = sanitizeUserInputText(longInput);
    assert.equal(sanitized.length, 300);
    assert.equal(sanitized, "B".repeat(300));
  });

  it("respects custom maxLength thresholds when specified", () => {
    const text = "1234567890abcdef";
    assert.equal(sanitizeUserInputText(text, 10), "1234567890");
    assert.equal(sanitizeUserInputText(text, 5), "12345");
  });
});

describe("A11Y-03: MiniMap Contrast Improvement Verification", () => {
  it("verifies MiniMap.jsx contains high-contrast text color tokens instead of low-contrast rgba", () => {
    const minimapPath = path.resolve(__dirname, "../components/ui/MiniMap.jsx");
    const content = fs.readFileSync(minimapPath, "utf-8");

    // Ensure the deprecated low-contrast colors are no longer present
    assert.ok(
      !content.includes('color: "rgba(255,255,255,0.5)"'),
      "MiniMap should not use low-contrast rgba(255,255,255,0.5) for PARK label"
    );
    assert.ok(
      !content.includes('color: "rgba(226, 232, 240, 0.65)"'),
      "MiniMap should not use low-contrast rgba(226, 232, 240, 0.65) for MAIN STREET label"
    );

    // Ensure the high-contrast accessible tokens are in place
    assert.ok(
      content.includes('color: "#f1f5f9"'),
      "MiniMap should use high-contrast #f1f5f9 for street/park text"
    );
    assert.ok(
      content.includes('color: "#bae6fd"'),
      "MiniMap should use high-contrast #bae6fd for district header"
    );
  });
});

describe("CODE-03: progressService.js Clean Module Re-exporting", () => {
  it("re-exports all progressLogic functions cleanly without duplicate imports", () => {
    const servicePath = path.resolve(__dirname, "./progressService.js");
    const content = fs.readFileSync(servicePath, "utf-8");

    // Ensure no duplicate 'import ... from "./progressLogic.js"' blocks exist
    const importMatches = content.match(/from "\.\/progressLogic\.js"/g);
    assert.equal(
      importMatches ? importMatches.length : 0,
      1,
      "progressService.js should only have a single import from progressLogic.js"
    );

    // Verify all expected helper functions are listed in export
    const expectedHelpers = [
      "calculateMissionXP",
      "deriveFacilityName",
      "getLocalDateString",
      "getCalendarDayDiff",
      "calculateUpdatedStreak",
      "evaluateAchievements",
      "calculateProgressUpdate"
    ];

    for (const helper of expectedHelpers) {
      assert.ok(
        content.includes(helper),
        `progressService.js should export ${helper}`
      );
      assert.equal(
        typeof progressLogic[helper],
        "function",
        `progressLogic.${helper} should be a function`
      );
    }

    assert.ok(
      content.includes("export async function recordMissionProgress"),
      "progressService.js should declare and export recordMissionProgress"
    );
  });
});
