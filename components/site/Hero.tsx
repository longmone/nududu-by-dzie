import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-espresso">
      <Image
        src="/images/branding/hero-banner.jpg"
        alt="Spicy Ghanaian jollof rice, a signature dish at Nududu by Dzie"
        fill
        priority
        className="object-cover opacity-50"
        sizes="100vw"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-24 sm:px-6 sm:py-32">
        <span className="w-fit rounded-full bg-turmeric px-4 py-1.5 text-sm font-semibold text-espresso">
          Home-cooked &middot; Made to order
        </span>
        <h1 className="max-w-xl font-heading text-4xl font-semibold text-white sm:text-5xl">
          Bold, spicy Ghanaian flavors, cooked with love
        </h1>
        <p className="max-w-lg text-lg text-white/85">
          From fiery jollof and grilled chicken to comforting banku with okro soup,
          Nududu by Dzie brings rich, satisfying local and continental meals straight
          to your door.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Button href="/menu" variant="primary">
            Browse the menu
          </Button>
          <Button href="/menu" variant="secondary" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
            See today&apos;s specials
          </Button>
        </div>
      </div>
    </section>
  );
}
