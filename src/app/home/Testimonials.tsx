"use client";
import React from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import testimonialSpiegelSrc from "public/assets/testimonial-spiegel.jpg";
import testimonialSantiSrc from "public/assets/testimonial-santi.jpg";
import testimonialVivianSrc from "public/assets/testimonial-vivian.jpg";

const TESTIMONIALS = [
  {
    src: testimonialSpiegelSrc,
    quote:
      "CareerCraft's auto-formatting is a game changer. It ensures my students' resumes are perfectly consistent and professional every time.",
    name: "Ms. Spiegel",
    title: "Career Educator",
  },
  {
    src: testimonialSantiSrc,
    quote:
      "I landed interviews at Google and Amazon using CareerCraft. The AI suggestions helped me highlight my impact in a way I couldn't do alone.",
    name: "Santi",
    title: "Software Engineer",
  },
  {
    src: testimonialVivianSrc,
    quote:
      "The easiest resume builder I've ever used. No more fighting with margins or fonts. It's fast, intuitive, and the results are stunning.",
    name: "Vivian",
    title: "Product Designer",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">Loved by job seekers</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Join thousands of professionals who have accelerated their careers with CareerCraft.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map(({ src, quote, name, title }, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 relative">
              <Quote className="absolute top-6 right-8 h-8 w-8 text-indigo-100 dark:text-slate-700" />
              <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed italic">
                "{quote}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <Image
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-white dark:ring-slate-700"
                  src={src}
                  alt={name}
                />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{name}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-500">{title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
