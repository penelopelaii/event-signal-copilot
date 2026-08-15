import Disclaimer from "@/components/Disclaimer";
import Hero from "@/components/Hero";
import Methodology from "@/components/Methodology";
import Toolkit from "@/components/Toolkit";
import Workbench from "@/components/Workbench";

export default function Home() {
  return (
    <main className="mx-auto max-w-[1180px] px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-24">
      <Hero />
      <Workbench />
      <Methodology />
      <Toolkit />
      <Disclaimer />
    </main>
  );
}
