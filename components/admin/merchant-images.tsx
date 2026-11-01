"use client";

import { ImageUploadField } from "@/components/images/image-upload-field";
import { imageHints } from "@/components/merchant-page/image-hints";
import type { AdminMerchant } from "@/lib/admin/types";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { imageFormData } from "@/lib/images/image-file";

type ImageKind = "logo" | "cover";

const pathOf = (id: string, kind: ImageKind) => ({ params: { path: { id, kind } } });

export function uploadMerchantImage(id: string, kind: ImageKind, file: File) {
  return callApi(api.PUT("/admin/merchants/{id}/images/{kind}", { ...pathOf(id, kind), body: imageFormData(file) }));
}

function removeMerchantImage(id: string, kind: ImageKind) {
  return callApi(api.DELETE("/admin/merchants/{id}/images/{kind}", pathOf(id, kind)));
}

export function MerchantImages({ merchant, readOnly }: { merchant: AdminMerchant; readOnly: boolean }) {
  return (
    <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
      <ImageUploadField
        label="Portada"
        description={imageHints.cover}
        variant="cover"
        currentUrl={merchant.page.coverUrl}
        readOnly={readOnly}
        upload={(file) => uploadMerchantImage(merchant.id, "cover", file)}
        remove={() => removeMerchantImage(merchant.id, "cover")}
      />
      <div className="sm:w-56">
        <ImageUploadField
          label="Logo"
          description={imageHints.logo}
          variant="logo"
          currentUrl={merchant.logoUrl}
          readOnly={readOnly}
          upload={(file) => uploadMerchantImage(merchant.id, "logo", file)}
          remove={() => removeMerchantImage(merchant.id, "logo")}
        />
      </div>
    </div>
  );
}
