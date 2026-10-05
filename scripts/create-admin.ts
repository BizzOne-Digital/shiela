import "./load-env";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import readline from "readline";
import { Admin } from "../models/Admin";

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI required");

  const reset = process.argv.includes("--reset");
  const args = process.argv.filter((a) => a !== "--reset");
  const email = args[2] ?? (await prompt("Admin email: "));
  const password = args[3] ?? (await prompt("Password (min 8 chars): "));

  if (!email || !password || password.length < 8) {
    throw new Error("Valid email and password (min 8 characters) required.");
  }

  await mongoose.connect(uri);
  const normalized = email.toLowerCase();
  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await Admin.findOne({ email: normalized });

  if (existing) {
    if (!reset) {
      console.log("Admin already exists for this email. Run with --reset to update the password.");
      await mongoose.disconnect();
      return;
    }
    existing.passwordHash = passwordHash;
    await existing.save();
    console.log("Admin password updated.");
  } else {
    await Admin.create({ email: normalized, passwordHash, role: "admin" });
    console.log("Admin created successfully.");
  }
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
