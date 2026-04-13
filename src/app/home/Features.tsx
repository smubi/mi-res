import Image from "next/image";
import featureFreeSrc from "public/assets/feature-free.svg";
import featureUSSrc from "public/assets/feature-us.svg";
import featurePrivacySrc from "public/assets/feature-privacy.svg";
import featureOpenSourceSrc from "public/assets/feature-open-source.svg";
import { Link } from "components/documentation";
import { SparklesIcon, MagnifyingGlassIcon, ShieldCheckIcon, CodeBracketIcon } from "@heroicons/react/24/outline";

const FEATURES = [
  {
    icon: <SparklesIcon className="h-8 w-8 text-purple-600" />,
    title: "AI Optimization",
    text: "Automatically refine your bullet points with strong action verbs and impact-focused language inspired by ResumeFlow research.",
  },
  {
    icon: <MagnifyingGlassIcon className="h-8 w-8 text-sky-600" />,
    title: "JD Keyword Matching",
    text: "Paste any job description to see a real-time match score and identify missing keywords that recruiters are looking for.",
  },
  {
    icon: <ShieldCheckIcon className="h-8 w-8 text-green-600" />,
    title: "Privacy First",
    text: "Your data never leaves your browser. We don't use a database, ensuring your personal information stays 100% private.",
  },
  {
    icon: <CodeBracketIcon className="h-8 w-8 text-gray-600" />,
    title: "Open Source",
    text: (
      <>
        Built by the community for the community. View our source code on{" "}
        <Link href="https://github.com/xitanggg/open-resume">GitHub</Link>.
      </>
    ),
  },
];

export const Features = () => {
  return (
    <section className="py-16 lg:py-36 bg-white rounded-3xl my-12 shadow-sm border border-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-sky-600 uppercase tracking-widest">Powerful Tools</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to land the interview
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 ring-1 ring-gray-100">
                  {feature.icon}
                </div>
                <dt className="text-lg font-bold leading-7 text-gray-900">
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.text}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};