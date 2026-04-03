import type { PlatformType } from "../api/types";

export function redirectUriFor(platform: PlatformType): string {
  return `${window.location.origin}/app/oauth/callback/${platform}`;
}
