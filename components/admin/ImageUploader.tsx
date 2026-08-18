"use client";

import { useRef, useState } from "react";

export function ImageUploader({ currentImageUrl }: { currentImageUrl: string | null }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayImage = preview ?? (!removed ? currentImageUrl : null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setRemoved(false);
  }

  function handleRemove() {
    setPreview(null);
    setRemoved(true);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-espresso">Photo</label>
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-sand bg-cream">
          {displayImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displayImage} alt="Meal preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-espresso-muted">
              No photo
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm text-espresso-muted file:mr-3 file:rounded-full file:border-0 file:bg-sand file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-espresso hover:file:bg-paprika hover:file:text-white"
          />
          {displayImage && (
            <button
              type="button"
              onClick={handleRemove}
              className="w-fit text-xs font-medium text-brick hover:underline"
            >
              Remove photo
            </button>
          )}
          <p className="text-xs text-espresso-muted">
            Leave empty to keep the default photo for this category.
          </p>
        </div>
      </div>
      <input type="hidden" name="removeImage" value={removed ? "true" : "false"} />
    </div>
  );
}
