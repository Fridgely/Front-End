const fs = require("fs");
const path = require("path");
const { Buffer } = require("buffer");

function fail(message) {
  console.error(message);
  process.exit(1);
}

const outPath = path.join(process.cwd(), "google-services.json");

// Dashboard/secret 변수명이 혼용될 수 있어서 둘 다 지원
const b64 =
  process.env.GOOGLE_SERVICES_JSON ??
  process.env.GOOGLE_SERVICES_JSON_BASE64;

if (!b64) {
  fail(
    [
      "[eas] Missing base64 for google-services.json.",
      "Set EAS env var GOOGLE_SERVICES_JSON (or GOOGLE_SERVICES_JSON_BASE64).",
    ].join("\n"),
  );
}

let jsonText;
try {
  jsonText = Buffer.from(b64, "base64").toString("utf8");
} catch (e) {
  fail(`[eas] Failed to decode base64: ${String(e)}`);
}

if (!jsonText.trim().startsWith("{")) {
  fail("[eas] Decoded google-services.json does not look like JSON.");
}

try {
  fs.writeFileSync(outPath, jsonText, { encoding: "utf8" });
  console.log(`[eas] Wrote ${outPath}`);
} catch (e) {
  fail(`[eas] Failed to write ${outPath}: ${String(e)}`);
}

