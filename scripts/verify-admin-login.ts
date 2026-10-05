import "./load-env";
import bcrypt from "bcryptjs";
import { connectMongo } from "../lib/mongodb";
import { Admin } from "../models/Admin";

async function main() {
  const email = process.argv[2] ?? "admin@angelonedocuments.com";
  const password = process.argv[3] ?? "admin@123";

  await connectMongo();
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  console.log("MONGODB_URI set:", !!process.env.MONGODB_URI);
  console.log("SESSION_SECRET length:", process.env.SESSION_SECRET?.length ?? 0);
  console.log("Admin found:", !!admin);
  if (admin) {
    console.log("Stored email:", admin.email);
    console.log("Has passwordHash:", !!admin.passwordHash);
    console.log("Password matches:", await bcrypt.compare(password, admin.passwordHash));
  }
  console.log("Total admins:", await Admin.countDocuments());
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
