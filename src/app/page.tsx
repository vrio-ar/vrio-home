import { HeroScene } from "@/components/Experience/HeroScene";
import { BusinessSolutionsHUD } from "@/components/UI/BusinessSolutionsHUD";
import { SoftwareManifesto } from "@/components/UI/SoftwareManifesto";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-void-blue text-holographic-white selection:bg-industrial-gold selection:text-void-blue flex flex-col md:block">
      {/* 3D Background - Fixed position to stay behind everything */}
      <div className="fixed inset-0 z-0">
        <HeroScene />
      </div>

      {/* UI Overlay Container - Z 10 to float above 3D */}
      <div className="relative z-10 w-full grow flex flex-col justify-between md:absolute md:inset-0 md:block pointer-events-none">
        <BusinessSolutionsHUD />
        <SoftwareManifesto />
      </div>

      {/* Vignette / Grain overlay if not handled by post-processing, but it is. */}
      {/* Branding Corner */}
      <div className="absolute top-6 left-6 z-20 mix-blend-difference pointer-events-none">
        <span className="font-bold text-xl tracking-widest text-industrial-gold">VRIO._</span>
      </div>
    </main>
  );
}
