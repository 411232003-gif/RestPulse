"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, X, CloudUpload, HardDrive } from "lucide-react";
import { uploadProgressPhoto, supabaseEnabled } from "@/lib/supabase";
import { DEFAULT_USER_ID } from "@/lib/data";
import { haptics } from "@/lib/haptics";

interface Props {
  workoutId: string;
  onAttached: (url: string) => void;
}

/**
 * Photo attachment: post-set pump, squat-depth check, machine setup.
 * Uploads to Supabase Storage (`gym-progress-photos`) when configured;
 * otherwise keeps a local object-URL preview.
 */
export default function PhotoUploader({ workoutId, onAttached }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [remoteUrl, setRemoteUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    if (!supabaseEnabled) {
      // offline mode — keep local preview, attach local URL to the set
      setRemoteUrl(localUrl);
      onAttached(localUrl);
      return;
    }

    setUploading(true);
    const res = await uploadProgressPhoto(DEFAULT_USER_ID, workoutId, file);
    setUploading(false);
    if (res.ok && res.url) {
      setRemoteUrl(res.url);
      onAttached(res.url);
      haptics.confirm();
    } else {
      setError(res.error ?? "Upload gagal");
      onAttached(localUrl); // still attach locally
    }
  }

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = "";
        }}
      />

      {preview ? (
        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/15">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Lampiran set" className="w-full h-full object-cover" />
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-ocean" />
            </div>
          )}
          <button
            aria-label="Hapus foto"
            onClick={() => {
              setPreview(null);
              setRemoteUrl(null);
              onAttached("");
            }}
            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center"
          >
            <X className="w-3 h-3 text-white" />
          </button>
          <div className="absolute bottom-0.5 left-0.5">
            {remoteUrl && remoteUrl.startsWith("http") ? (
              <CloudUpload className="w-3.5 h-3.5 text-ocean" />
            ) : (
              <HardDrive className="w-3.5 h-3.5 text-cyber" />
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-16 h-16 rounded-xl border border-dashed border-white/20 bg-white/[0.03]
            flex flex-col items-center justify-center gap-1 text-white/45
            hover:border-ocean/50 hover:text-ocean transition-colors"
          aria-label="Lampirkan foto"
        >
          <Camera className="w-5 h-5" />
          <span className="text-[8px] tracking-widest uppercase">Foto</span>
        </button>
      )}

      {error && <span className="text-[10px] text-infra">{error}</span>}
    </div>
  );
}
