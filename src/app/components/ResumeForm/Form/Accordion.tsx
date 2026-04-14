"use client";

import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { cx } from "lib/cx";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const AccordionItem = ({
  title,
  children,
  isOpen,
  onToggle,
}: AccordionItemProps) => {
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 last:border-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
      >
        <span className="text-sm font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">
          {title}
        </span>
        <ChevronDownIcon
          className={cx(
            "h-5 w-5 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cx(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isOpen ? "max-h-[2000px] pb-6 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  );
};

interface AccordionProps {
  children: React.ReactNode;
}

export const Accordion = ({ children }: AccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const childrenArray = React.Children.toArray(children);

  return (
    <div className="flex flex-col">
      {childrenArray.map((child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isOpen: openIndex === index,
            onToggle: () => setOpenIndex(openIndex === index ? null : index),
          });
        }
        return child;
      })}
    </div>
  );
};
