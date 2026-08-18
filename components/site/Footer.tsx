import { SOCIAL_LINKS } from "@/lib/site-config";
import { FacebookIcon, InstagramIcon, TiktokIcon, WhatsAppIcon } from "@/components/site/SocialIcons";

const SOCIAL_ICONS = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  TikTok: TiktokIcon,
  WhatsApp: WhatsAppIcon,
} as const;

export function Footer() {
  return (
    <footer className="border-t border-sand bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="flex flex-col gap-2">
          <span className="font-heading text-lg font-semibold text-espresso">
            Nududu <span className="text-paprika">by Dzie</span>
          </span>
          <p className="max-w-md text-sm text-espresso-muted">
            Home-cooked spicy Ghanaian dishes and continental meals, made to order for
            pickup or delivery.
          </p>
          <p className="mt-4 text-xs text-espresso-muted">
            &copy; {new Date().getFullYear()} Nududu by Dzie. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <h3 className="font-heading text-sm font-semibold text-espresso">Follow Us</h3>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => {
              const Icon = SOCIAL_ICONS[social.name];
              return (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-espresso transition-colors hover:bg-paprika hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
