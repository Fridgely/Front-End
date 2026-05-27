const fs = require("fs");
const path = require("path");
const { Buffer } = require("buffer");

const appJson = require("./app.json");

function ensureGoogleServicesJson() {
  const b64 =
    process.env.GOOGLE_SERVICES_JSON ?? process.env.GOOGLE_SERVICES_JSON_BASE64;

  if (!b64) return;

  const outPath = path.join(process.cwd(), "google-services.json");
  if (fs.existsSync(outPath)) return;

  const jsonText = Buffer.from(b64, "base64").toString("utf8");
  if (!jsonText.trim().startsWith("{")) {
    throw new Error("GOOGLE_SERVICES_JSON does not decode to JSON");
  }

  fs.writeFileSync(outPath, jsonText, { encoding: "utf8" });
}

module.exports = () => {
  ensureGoogleServicesJson();

  return appJson.expo;
};
