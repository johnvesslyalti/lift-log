"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const IMAGES = [
  { src: "/dashboard.png", alt: "Dashboard Preview" },
  { src: "/exercise.png", alt: "Exercise Selection" },
  { src: "/liftlog.png", alt: "Lift Logging UI" },
  { src: "/progress.png", alt: "Progress Tracking" },
  { src: "/workout.png", alt: "Workout Session Screen" },
];

export default function CTASection() {
  return (
    <section className="py-28">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Your progress deserves to be{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-teal-500 bg-clip-text text-transparent">
            seen.
          </span>
        </h2>
        <p className="mt-4 text-white/70 max-w-md mx-auto">
          LiftLog turns your training into measurable progress — so you can see
          exactly how far you’ve come.
        </p>
      </div>

      <Carousel opts={{ loop: true }} className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {IMAGES.map((img, index) => (
            <CarouselItem key={index} className="basis-full">
              <Card className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover hover:scale-[1.02] transition"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="border-white/20 hover:bg-white/10" />
        <CarouselNext className="border-white/20 hover:bg-white/10" />
      </Carousel>

      <div className="mt-14 flex justify-center">
        <a
          href="/app"
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold bg-gradient-to-r from-emerald-400 via-teal-300 to-teal-500 text-black hover:opacity-90 transition"
        >
          Start Your Journey →
        </a>
      </div>
    </section>
  );
}
