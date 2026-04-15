"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "lib/redux/hooks";
import { selectJobDescription } from "lib/redux/aiSlice";
import { selectResume } from "lib/redux/resumeSlice";
import { selectOpenAIApiKey, changeSettings } from "lib/redux/settingsSlice";

interface AIOptimizerProps {
  onOptimize: (suggestion: string) => void;
  currentText: string;
}

export const AIOptimizer = ({ onOptimize, currentText }: AIOptimizerProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempKey, setTempKey] = useState("");
  
  const jd = useAppSelector(selectJobDescription);
  const resume = useAppSelector(selectResume);
  const openAIApiKey = useAppSelector(selectOpenAIApiKey);
  const dispatch = useAppDispatch();

  const handleSaveKey = () => {
    if (tempKey.startsWith("sk-")) {
      dispatch(changeSettings({ field: "openAIApiKey", value: tempKey }));
      setShowKeyInput(false);
    } else {
      alert("Please enter a valid OpenAI API Key starting with 'sk-'");
    }
  };

  const handleOptimize = async () => {
    if (!currentText || isOptimizing) return;
    
    if (!openAIApiKey) {
      setShowKeyInput(true);
      return;
    }
    
    setIsOptimizing(true);
    
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAIApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an expert resume writer. Rewrite the user's bullet point to be extremely professional, action-oriented, and quantified. Keep it to one single bullet point sentence. Do not add introductory text."
            },
            {
              role: "user",
              content: `Original bullet point: "${currentText}"\n\nTarget Job Description elements (incorporate if relevant): "${jd || 'None'}"\n\nResume Context: "${JSON.stringify(resume.profile)}"`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error("API Request Failed");
      }

      const data = (await response.json()) as {
        choices: { message: { content: string } }[];
      };
      const suggestion = data.choices[0].message.content.replace(/^[-•]\s*/, "").trim();
      onOptimize(suggestion);
    } catch (e) {
      alert("Failed to optimize. Please check your API key or internet connection.");
    } finally {
      setIsOptimizing(false);
    }
  };

  if (showKeyInput) {
    return (
      <div className="flex gap-2 items-center">
        <input 
          type="password"
          placeholder="sk-..."
          value={tempKey}
          onChange={(e) => setTempKey(e.target.value)}
          className="border-b border-gray-300 px-1 py-0.5 text-xs text-gray-700 outline-none focus:border-sky-500 w-24"
        />
        <button 
          type="button" 
          onClick={handleSaveKey}
          className="rounded bg-sky-500 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-sky-600"
        >
          Save
        </button>
        <button 
          type="button" 
          onClick={() => setShowKeyInput(false)}
          className="text-[10px] text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleOptimize}
      disabled={!currentText || isOptimizing}
      className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-tighter transition-all ${
        isOptimizing 
          ? "bg-purple-100 text-purple-400 animate-pulse" 
          : "bg-purple-600 text-white hover:bg-purple-700 shadow-sm active:scale-95"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <SparklesIcon className="h-3 w-3" />
      {isOptimizing ? "Analyzing..." : "AI Optimize"}
    </button>
  );
};