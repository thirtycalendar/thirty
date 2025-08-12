import { execSync } from "node:child_process";

try {
  console.log("🔍 Running lint check...");
  execSync("pnpm lint:check", { stdio: "inherit" });

  console.log("🔍 Running format check...");
  execSync("pnpm format:check", { stdio: "inherit" });

  console.log("✅ Checks passed. Applying fixes...");
  execSync("pnpm lint:write", { stdio: "inherit" });
  execSync("pnpm format:write", { stdio: "inherit" });

  console.log("✅ Auto-fixes applied. Re-adding changes...");
  execSync("git add .", { stdio: "inherit" });
} catch {
  console.error("❌ Lint or format check failed. Commit aborted.");
  process.exit(1);
}
