import path from "path";
import fs from "fs/promises";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";
import mongoose from "mongoose";
import { connectMongo } from "@/lib/mongodb";

export interface StoredObject {
  storageKey: string;
  sizeBytes: number;
}

export interface StorageAdapter {
  put(key: string, body: Buffer, contentType: string): Promise<StoredObject>;
  getStream(key: string): Promise<NodeJS.ReadableStream>;
  delete(key: string): Promise<void>;
  getSignedDownloadUrl?(key: string, expiresInSeconds: number): Promise<string>;
}

class LocalStorageAdapter implements StorageAdapter {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = path.resolve(basePath);
  }

  private resolve(key: string) {
    const safe = key.replace(/[/\\]/g, "_");
    return path.join(this.basePath, safe);
  }

  async put(key: string, body: Buffer, contentType: string): Promise<StoredObject> {
    void contentType;
    const filePath = this.resolve(key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, body);
    return { storageKey: key, sizeBytes: body.length };
  }

  async getStream(key: string): Promise<NodeJS.ReadableStream> {
    const filePath = this.resolve(key);
    await fs.access(filePath); // throws if missing, so callers get a clean error instead of a broken response
    const { createReadStream } = await import("fs");
    return createReadStream(filePath);
  }

  async delete(key: string): Promise<void> {
    const filePath = this.resolve(key);
    try {
      await fs.unlink(filePath);
    } catch {
      /* ignore missing */
    }
  }
}

/** Stores files in MongoDB GridFS — works on serverless hosts where the disk is read-only. */
class GridFsStorageAdapter implements StorageAdapter {
  private async bucket() {
    await connectMongo();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB not connected");
    return new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });
  }

  async put(key: string, body: Buffer, contentType: string): Promise<StoredObject> {
    const bucket = await this.bucket();
    await new Promise<void>((resolve, reject) => {
      const upload = bucket.openUploadStream(key, { metadata: { contentType } });
      upload.on("error", reject);
      upload.on("finish", () => resolve());
      Readable.from(body).pipe(upload);
    });
    return { storageKey: key, sizeBytes: body.length };
  }

  async getStream(key: string): Promise<NodeJS.ReadableStream> {
    const bucket = await this.bucket();
    if (!(await bucket.find({ filename: key }).limit(1).hasNext())) {
      throw new Error("Object not found");
    }
    return bucket.openDownloadStreamByName(key);
  }

  async delete(key: string): Promise<void> {
    const bucket = await this.bucket();
    const files = await bucket.find({ filename: key }).toArray();
    for (const f of files) await bucket.delete(f._id).catch(() => undefined);
  }
}

class S3StorageAdapter implements StorageAdapter {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET!;
    this.client = new S3Client({
      region: process.env.S3_REGION ?? "auto",
      endpoint: process.env.S3_ENDPOINT || undefined,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });
  }

  async put(key: string, body: Buffer, contentType: string): Promise<StoredObject> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
    return { storageKey: key, sizeBytes: body.length };
  }

  async getStream(key: string): Promise<NodeJS.ReadableStream> {
    const res = await this.client.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
    );
    if (!res.Body) throw new Error("Object not found");
    return res.Body as NodeJS.ReadableStream;
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  async getSignedDownloadUrl(key: string, expiresInSeconds: number): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }
}

let adapter: StorageAdapter | null = null;

export function getStorage(): StorageAdapter {
  if (adapter) return adapter;
  const driver = process.env.STORAGE_DRIVER ?? "local";
  // Serverless hosts have a read-only disk, so "local" falls back to MongoDB there.
  const serverless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);
  if (driver === "s3") {
    adapter = new S3StorageAdapter();
  } else if (driver === "mongo" || (driver === "local" && serverless)) {
    adapter = new GridFsStorageAdapter();
  } else {
    adapter = new LocalStorageAdapter(process.env.STORAGE_LOCAL_PATH ?? ".data/private-uploads");
  }
  return adapter;
}

export function buildStorageKey(referenceNumber: string, filename: string): string {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `requests/${referenceNumber}/${Date.now()}-${safe}`;
}
