import test from "node:test";
import assert from "node:assert/strict";
import {
  t,
  resolveUserLanguagePreferences,
  getLanguageName,
  getLevelName,
  SUPPORTED_INTERFACE_LANGUAGES,
  SUPPORTED_LEARNING_LANGUAGES,
  SUPPORTED_LEARNING_LEVELS,
  TRANSLATIONS
} from "./i18n.js";

test("i18n - supported languages and levels are defined", () => {
  assert.deepEqual(SUPPORTED_INTERFACE_LANGUAGES, ["en", "ko"]);
  assert.deepEqual(SUPPORTED_LEARNING_LANGUAGES, ["en", "ko"]);
  assert.deepEqual(SUPPORTED_LEARNING_LEVELS, ["beginner", "intermediate", "advanced"]);
  assert.ok(TRANSLATIONS.en);
  assert.ok(TRANSLATIONS.ko);
});

test("t() - retrieves English translation correctly", () => {
  assert.equal(t("common.ok", {}, "en"), "OK");
  assert.equal(t("auth.signInBtn", {}, "en"), "Sign In");
  assert.equal(t("hud.openSettings", {}, "en"), "Settings");
});

test("t() - retrieves Korean translation correctly", () => {
  assert.equal(t("common.ok", {}, "ko"), "확인");
  assert.equal(t("auth.signInBtn", {}, "ko"), "로그인");
  assert.equal(t("hud.openSettings", {}, "ko"), "설정");
});

test("t() - interpolates parameters correctly", () => {
  const enWelcome = t("onboarding.welcomeStudent", { name: "Bob" }, "en");
  assert.equal(enWelcome, "Welcome, Bob");

  const koWelcome = t("onboarding.welcomeStudent", { name: "철수" }, "ko");
  assert.equal(koWelcome, "환영합니다, 철수님");

  const stepEn = t("onboarding.stepIndicator", { current: 1, total: 4 }, "en");
  assert.equal(stepEn, "Step 1 of 4");
});

test("t() - falls back to English when Korean key is missing", () => {
  // Save original and delete a key temporarily
  const original = TRANSLATIONS.ko.common.temporaryKey;
  delete TRANSLATIONS.ko.common.temporaryKey;
  TRANSLATIONS.en.common.temporaryKey = "English Fallback Value";

  const result = t("common.temporaryKey", {}, "ko");
  assert.equal(result, "English Fallback Value");

  delete TRANSLATIONS.en.common.temporaryKey;
  if (original !== undefined) TRANSLATIONS.ko.common.temporaryKey = original;
});

test("t() - converts completely missing translation key to human-readable fallback", () => {
  assert.equal(t("nonexistent.nested.key", {}, "en"), "Key");
  assert.equal(t("nonexistent.nested.key", {}, "ko"), "Key");
  assert.equal(t("settings.interfaceLangLabel", {}, "en"), "Interface Language");
  assert.equal(t("settings.interfaceLangLabel", {}, "ko"), "인터페이스 언어");
  assert.ok(!t("nonexistent.nested.key", {}, "en").includes("."));
});

test("t() - handles invalid or empty inputs gracefully", () => {
  assert.equal(t(null), "");
  assert.equal(t(undefined), "");
  assert.equal(t(""), "");
  assert.equal(t(123), "");
});

test("resolveUserLanguagePreferences - defaults for null or empty profile", () => {
  const result = resolveUserLanguagePreferences(null);
  assert.deepEqual(result, {
    interfaceLanguage: "en",
    learningLanguage: "en",
    learningLevel: "beginner"
  });

  const emptyResult = resolveUserLanguagePreferences({});
  assert.deepEqual(emptyResult, {
    interfaceLanguage: "en",
    learningLanguage: "en",
    learningLevel: "beginner"
  });
});

test("resolveUserLanguagePreferences - migrates existing user with legacy learningPreferences.language", () => {
  const existingProfile = {
    displayName: "Student",
    learningPreferences: {
      language: "ko",
      level: "intermediate",
      goals: ["conversational"]
    },
    totalXP: 550,
    streak: { currentStreak: 5 }
  };

  const resolved = resolveUserLanguagePreferences(existingProfile);
  assert.equal(resolved.interfaceLanguage, "en", "Default interfaceLanguage is 'en' for legacy profile");
  assert.equal(resolved.learningLanguage, "ko", "Retains legacy learning language 'ko'");
  assert.equal(resolved.learningLevel, "intermediate", "Retains level 'intermediate'");
});

test("resolveUserLanguagePreferences - respects configured interfaceLanguage and new learningLanguage", () => {
  const configuredProfile = {
    interfaceLanguage: "ko",
    learningPreferences: {
      learningLanguage: "en",
      level: "advanced"
    }
  };

  const resolved = resolveUserLanguagePreferences(configuredProfile);
  assert.equal(resolved.interfaceLanguage, "ko");
  assert.equal(resolved.learningLanguage, "en");
  assert.equal(resolved.learningLevel, "advanced");
});

test("getLanguageName - formats labels in English and Korean", () => {
  assert.equal(getLanguageName("en", "en"), "English");
  assert.equal(getLanguageName("ko", "en"), "Korean");
  assert.equal(getLanguageName("en", "ko"), "영어");
  assert.equal(getLanguageName("ko", "ko"), "한국어");
});

test("getLevelName - formats levels in English and Korean", () => {
  assert.equal(getLevelName("beginner", "en"), "Beginner");
  assert.equal(getLevelName("intermediate", "en"), "Intermediate");
  assert.equal(getLevelName("advanced", "en"), "Advanced");

  assert.equal(getLevelName("beginner", "ko"), "초급");
  assert.equal(getLevelName("intermediate", "ko"), "중급");
  assert.equal(getLevelName("advanced", "ko"), "고급");
});
