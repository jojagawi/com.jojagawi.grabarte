import Link from "next/link";
import type { ComponentType } from "react";
import { FaInstagram } from "@react-icons/all-files/fa/FaInstagram";
import { FaFacebookF } from "@react-icons/all-files/fa/FaFacebookF";
import { SiTiktok } from "@react-icons/all-files/si/SiTiktok";

export type SocialNetwork = {
  name: string;
  href: string;
  /** Usuario tomado de la URL ("@inspiraarte"), para mostrarlo impreso. */
  handle: string;
  Icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

function toHandle(href: string): string {
  try {
    const user = new URL(href).pathname.split("/").filter(Boolean)[0] ?? "";
    return user ? `@${user.replace(/^@/u, "")}` : href;
  } catch {
    return href;
  }
}

// Redes configuradas en NEXT_PUBLIC_INSTAGRAM / NEXT_PUBLIC_FACEBOOK / NEXT_PUBLIC_TIKTOK.
export function getSocialNetworks(): SocialNetwork[] {
  const networks = [
    { name: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM, Icon: FaInstagram },
    { name: "Facebook", href: process.env.NEXT_PUBLIC_FACEBOOK, Icon: FaFacebookF },
    { name: "TikTok", href: process.env.NEXT_PUBLIC_TIKTOK, Icon: SiTiktok },
  ];

  return networks.flatMap((network) =>
    network.href ? [{ ...network, href: network.href, handle: toHandle(network.href) }] : [],
  );
}

interface SocialLinksProps {
  /** Clase de cada enlace (el círculo con el ícono). */
  linkClassName: string;
}

export function SocialLinks({ linkClassName }: SocialLinksProps) {
  return (
    <div className="flex gap-4">
      {getSocialNetworks().map(({ name, href, Icon }) => (
        <Link
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
          aria-label={name}
        >
          <Icon aria-hidden={true} className="w-5 h-5" />
        </Link>
      ))}
    </div>
  );
}
