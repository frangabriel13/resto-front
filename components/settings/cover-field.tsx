"use client";

import { ImageUploadField } from "@/components/images/image-upload-field";
import { imageHints } from "@/components/merchant-page/image-hints";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { imageFormData } from "@/lib/images/image-file";

export function CoverField({ coverUrl, readOnly }: { coverUrl: string | null; readOnly: boolean }) {
  return (
    <ImageUploadField
      label="Portada"
      description={imageHints.cover}
      variant="cover"
      currentUrl={coverUrl}
      readOnly={readOnly}
      upload={(file) => callApi(api.PUT("/panel/settings/cover", { body: imageFormData(file) }))}
      remove={() => callApi(api.DELETE("/panel/settings/cover"))}
    />
  );
}
