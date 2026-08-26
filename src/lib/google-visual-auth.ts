export const GOOGLE_VISUAL_STORAGE_KEY = "inspiraarte.google.visual.user";

export const PRIVILEGED_EMAIL_PREFIXES = ["jojagawi", "alinalvarez6"] as const;

export function hasPrivilegedEmailPrefix(email: string): boolean {
  const normalizedEmail = email.trim().toLowerCase();
  return PRIVILEGED_EMAIL_PREFIXES.some((prefix) =>
    normalizedEmail.startsWith(prefix),
  );
}

