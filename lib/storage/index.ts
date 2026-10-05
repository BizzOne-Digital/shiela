import path from "path";
import fs from "fs/promises";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
  if (driver === "s3") {
    adapter = new S3StorageAdapter();
  } else {
    adapter = new LocalStorageAdapter(process.env.STORAGE_LOCAL_PATH ?? ".data/private-uploads");
  }
  return adapter;
}

export function buildStorageKey(referenceNumber: string, filename: string): string {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `requests/${referenceNumber}/${Date.now()}-${safe}`;
}
