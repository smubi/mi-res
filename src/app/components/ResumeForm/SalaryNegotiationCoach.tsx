"use client";

import { useState } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectJobTitle } from "lib/redux/aiSlice";
import { selectProfile } from "lib/redux/resumeSlice";
import { 
  BanknotesIcon, 
  ChatBubbleLeftRightIcon, 
  LightBulbIcon,
  ClipboardIcon,
  CheckIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { BaseForm } from "components/ResumeForm/Form";

type Scenario = "initial_offer" | "counter_offer" | "benefits_focus";

export const SalaryNegotiationCoach = () => {
  const jobTitle = useAppSelector(selectJobTitle) || "the position";
  const profile = useAppSelector(selectProfile);
  const [activeScenario, setActiveScenario] = useState<Scenario>("initial_offer");
  const [copied, setCopied] = useState(false);

  const getScript = (scenario: Scenario) => {
    const name = profile.name || "[Your Name]";
    
    switch (scenario) {
      case "initial_offer":
        return `Thank you so much for the offer! I'm very excited about the possibility of joining the team as a ${jobTitle}. I'd like to take a day or two to review the full details of the offer and the benefits package. When would be a good time for us to reconnect and discuss the next steps?`;
      case "counter_offer":
        return `I'm very enthusiastic about this role. Based on my research for ${jobTitle} roles in ${profile.location || "this market"} and my specific experience with ${profile.summary.split('.')[0]}, I was expecting a base salary in the range of $[X] to $[Y]. Is there any flexibility in the budget to move closer to these numbers?`;
      case "benefits_focus":
        return `While the base salary is a bit lower than I anticipated, I'm still very interested in the role. If there isn't room to move on the salary, could we explore other areas of the package, such as a signing bonus, additional PTO, or a professional development budget?`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getScript(activeScenario));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <BaseForm>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BanknotesIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
            <h1 className="text-lg font-semibold tracking-wide text-gray-900">
              Negotiation Coach
            </h1>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
          >
            {copied ? <CheckIcon className="h-3 w-3 text-green-500" /> : <ClipboardIcon className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy Script"}
          </button>
        </div>

        <div className="rounded-xl bg-green-50 p-4 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheckIcon className="h-4 w-4 text-green-600" />
            <span className="text-xs font-bold text-green-800 uppercase">Golden Rule</span>
          </div>
          <p className="text-xs text-green-700 leading-relaxed">
            Never accept an offer on the spot. Always express gratitude and ask for time to review the details. This gives you leverage and time to prepare your counter.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "initial_offer", label: "Receiving Offer" },
            { id: "counter_offer", label: "Countering" },
            { id: "benefits_focus", label: "Negotiating Benefits" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveScenario(tab.id as Scenario)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                activeScenario === tab.id 
                  ? "bg-green-600 text-white shadow-sm" 
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative rounded-xl bg-gray-50 p-4 border border-gray-100">
          <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-gray-700 italic">
            "{getScript(activeScenario)}"
          </pre>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2 p-3 rounded-lg border border-gray-100 bg-white">
            <LightBulbIcon className="h-4 w-4 text-amber-500 shrink-0" />
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-900">Know Your Value</p>
              <p className="text-[9px] text-gray-500">Research sites like Levels.fyi or Glassdoor for ${jobTitle} roles.</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg border border-gray-100 bg-white">
            <ChatBubbleLeftRightIcon className="h-4 w-4 text-sky-500 shrink-0" />
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-900">Focus on Impact</p>
              <p className="text-[9px] text-gray-500">Remind them of the specific value you'll bring to the team.</p>
            </div>
          </div>
        </div>
      </div>
    </BaseForm>
  );
};