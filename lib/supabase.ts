import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase Storage — dedicated object storage for image uploads
 * (progress photos, squat-depth checks, custom machine setups).
 * Bucket: `gym-progress-photos` (public or signed-URL policy).
 */

/**
 * Normalize the project URL — strips any trailing path like `/rest/v1`
 * that gets pasted from the wrong field in the Supabase dashboard.
 * The storage client builds `${url}/storage/v1/...`, so a stray path
 * produces the "Invalid path specified in request URL" 404.
 */
function normalizeSupabaseUrl(raw?: string): string | undefined {
  if (!raw) return undefined;
  try {
    return new URL(raw.trim()).origin;
  } catch {
    return raw.replace(/\/+$/, "").split("/rest/v1")[0];
  }
}

const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "gym-progress-photos";

export const supabaseEnabled = Boolean(url && anonKey);
export const PHOTO_BUCKET = bucket;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseEnabled) return null;
  if (!client) client = createClient(url!, anonKey!);
  return client;
}

export interface UploadResult {
  ok: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload a photo to Supabase Storage and return its public URL.
 * Path layout: <userId>/<workoutId>/<timestamp>-<filename>
 */
export async function uploadProgressPhoto(
  userId: string,
  workoutId: string,
  file: File
): Promise<UploadResult> {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: "supabase-not-configured" };

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${workoutId}/${Date.now()}.${ext}`;

  const { error } = await sb.storage.from(PHOTO_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });
  if (error) return { ok: false, error: error.message };

  const { data } = sb.storage.from(PHOTO_BUCKET).getPublicUrl(path);
  return { ok: true, url: data.publicUrl, path };
}
