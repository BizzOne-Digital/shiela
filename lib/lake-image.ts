import fs from "fs";
import path from "path";

export function lakeImageExists(): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", "images", "lake-ontario.jpg"));
  } catch {
    return false;
  }
}
