"use client";

import { ReactNode } from "react";

type CardProps = {
  title?: string;
  content?: string;
  icon?: ReactNode;
  className?: string;
};

export function Card({ title, icon, content, className }: CardProps) {
  return (
    <div
      className={`
        w-full
        rounded-xl bg-white
        shadow-md hover:shadow-lg
        transition
        p-2 sm:p-4
      `}
    >
      {(title || icon) && (
        <div className="flex items-center gap-3 sm:gap-4">
          {icon && (
            <span
              className={`
                grid size-9 sm:size-10 place-items-center
                rounded-lg ${className}
              `}
            >
              {icon}
            </span>
          )}
          <div className="flex flex-col min-w-0">
            {title && (
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                {title}
              </h3>
            )}
            {content && (
              <h4 className="text-sm sm:text-base font-semibold text-gray-500 truncate">
                {content}
              </h4>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
