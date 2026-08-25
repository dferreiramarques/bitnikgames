import type { CollectionEntry } from "astro:content";
import type { Locale } from "../i18n/routes";
import { t } from "../i18n/ui";

export type BadgeVariant = "free" | "paid" | "pwyw" | "soon" | "external";
export interface BadgeInfo {
  variant: BadgeVariant;
  label: string;
}

export function gameBadge(locale: Locale, status: CollectionEntry<"games">["data"]["status"]): BadgeInfo {
  const badges = t(locale).badges;
  const badgeByStatus: Record<typeof status, BadgeInfo> = {
    "buy-now": { variant: "paid", label: badges.buyNow },
    "buy-external": { variant: "external", label: badges.buyExternal },
    "coming-soon": { variant: "soon", label: badges.comingSoon },
  };
  return badgeByStatus[status];
}

export function pnpBadge(
  locale: Locale,
  access: CollectionEntry<"pnp">["data"]["access"],
  price?: string
): BadgeInfo {
  const badges = t(locale).badges;
  const badgeByAccess: Record<typeof access, BadgeInfo> = {
    free: { variant: "free", label: badges.free },
    paid: { variant: "paid", label: price ?? badges.paid },
    pwyw: { variant: "pwyw", label: badges.pwyw },
  };
  return badgeByAccess[access];
}
