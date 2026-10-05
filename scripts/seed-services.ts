import "./load-env";
import mongoose from "mongoose";
import { seedServicesToDb } from "../lib/seed-services";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI required");
  await mongoose.connect(uri);

  const titles = await seedServicesToDb();
  for (const t of titles) console.log(`Seeded: ${t}`);

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
