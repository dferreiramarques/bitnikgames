import type { CollectionEntry } from "astro:content";
import type { Locale } from "../i18n/routes";
import { t } from "../i18n/ui";

export type BadgeVariant = "free" | "paid" | "pwyw" | "soon" | "external";
export interface BadgeInfo {
  variant: BadgeVariant;
  label: string;
}

type Status = CollectionEntry<"games">["data"]["status"] | CollectionEntry<"pnp">["data"]["status"];

export function entryBadge(locale: Locale, status: Status, price?: string): BadgeInfo {
  const badges = t(locale).badges;
  const badgeByStatus: Record<Status, BadgeInfo> = {
    "buy-now": { variant: "paid", label: badges.buyNow },
    "buy-external": { variant: "external", label: badges.buyExternal },
    "coming-soon": { variant: "soon", label: badges.comingSoon },
    free: { variant: "free", label: badges.free },
    paid: { variant: "paid", label: price ?? badges.paid },
    pwyw: { variant: "pwyw", label: badges.pwyw },
  };
  return badgeByStatus[status];
}
