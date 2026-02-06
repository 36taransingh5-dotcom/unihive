import type { ReactNode } from 'react';

interface TimelineWrapperProps {
  children: ReactNode;
}

export function TimelineWrapper({ children }: TimelineWrapperProps) {
  return (
    <div className="relative">
      {/* Timeline dashed line - runs down the center-left */}
      <div 
        className="absolute left-6 top-0 bottom-0 border-l-2 border-dashed border-gray-300 z-0"
        aria-hidden="true"
      />
      {/* Content with proper z-index */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

interface TimelinePinProps {
  children: ReactNode;
}

export function TimelinePin({ children }: TimelinePinProps) {
  return (
    <div className="relative">
      {/* Push Pin circle */}
      <div 
        className="absolute left-6 -top-2 w-4 h-4 rounded-full bg-black border-2 border-white z-20 -translate-x-1/2"
        aria-hidden="true"
      />
      {/* The actual card content with left margin to account for timeline */}
      <div className="pl-10">
        {children}
      </div>
    </div>
  );
}
