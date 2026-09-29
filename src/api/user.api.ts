import apiClient from "@/lib/apiClient";
import { uploadWithProgress } from "@/utils/upload.util";
import type { ApiResponse, UpdateProfilePayload, User } from "@/types";

/** Changing the name kills the current access token — refresh afterwards. */
export function updateProfile(payload: UpdateProfilePayload) {
  return apiClient<ApiResponse<User>>("/user/update-profile", {
    method: "PATCH",
    body: payload,
  });
}

export function uploadAvatar({
  file,
  onProgress,
}: {
  file: File;
  onProgress?: (percent: number) => void;
}) {
  const form = new FormData();
  form.append("avatar", file);
  return uploadWithProgress<ApiResponse<User>>("/user/profile-image", form, {
    method: "PATCH",
    onProgress,
  });
}

export function removeAvatar() {
  return apiClient<ApiResponse<User>>("/user/profile-image", {
    method: "DELETE",
  });
}
