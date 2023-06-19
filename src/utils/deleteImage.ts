import { storage } from "../uploads/storage";
import env from "./dotEnvConfig/dotEnvConfig";

export default async function deleteImage(fileName: string) {
    const name = fileName.split("/").pop() || "";
    await storage.bucket(env.GCLOUD_STORAGE_BUCKET).file(name).delete();
  }