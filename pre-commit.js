import { execSync } from "node:child_process";

try {
  console.log("🔍 Running lint check...");
  execSync("nr lint:check", { stdio: "inherit" });

  console.log("🔍 Running svelte check...");
  execSync("nr check", { stdio: "inherit" });

  console.log("🔍 Running format check...");
  execSync("nr format:check", { stdio: "inherit" });

  console.log("✅ Checks passed. Applying fixes...");
  execSync("nr lint:write", { stdio: "inherit" });
  execSync("nr format:write", { stdio: "inherit" });

  console.log("✅ Auto-fixes applied. Re-adding changes...");
  execSync("git add .", { stdio: "inherit" });
} catch {
  console.error("❌ Lint or format check failed. Commit aborted.");
  process.exit(1);
}
