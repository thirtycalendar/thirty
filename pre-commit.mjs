import { execSync } from "node:child_process";


try {
  console.log("🔍 Running lint check...");
  execSync("npm run lint:check", { stdio: "inherit" });

  console.log("🔍 Running format check...");
  execSync("npm run format:check", { stdio: "inherit" });

  console.log("✅ Checks passed. Applying fixes...");
  execSync("npm run lint:write", { stdio: "inherit" });
  execSync("npm run format:write", { stdio: "inherit" });

  console.log("✅ Auto-fixes applied. Re-adding changes...");
  execSync("git add .", { stdio: "inherit" });
} catch {
  console.error("❌ Lint or format check failed. Commit aborted.");
  process.exit(1);
}
