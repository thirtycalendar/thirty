import { Client } from "pg";

// Grab --url argument
const args = process.argv;
const urlIndex = args.indexOf("--url");
const dbUrl = urlIndex !== -1 ? args[urlIndex + 1] : null;

if (!dbUrl) {
  console.error("❌ Missing --url argument. Usage: --url <DATABASE_URL>");
  process.exit(1);
}

const client = new Client({ connectionString: dbUrl });

await client.connect();

await client.query(`
DO $$ DECLARE
    r RECORD;
BEGIN
    -- Drop all tables
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;

    -- Drop all enum types
    FOR r IN (SELECT typname FROM pg_type WHERE typcategory = 'E') LOOP
        EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
    END LOOP;
END $$;
`);

await client.end();

console.log("✅ DB reset completed.");
