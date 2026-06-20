'use client';

export function ChatSkeleton() {
  return (
    <div className="flex-grow flex flex-col p-6 space-y-6 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`flex flex-col gap-2 ${i % 2 === 0 ? 'items-end' : 'items-start'}`}>
          <div className="w-24 h-2 bg-armor-light rounded opacity-50"></div>
          <div className={`w-2/3 max-w-md h-12 bg-armor/20 border border-armor-light p-4 ${i % 2 === 0 ? 'rounded-l-lg' : 'rounded-r-lg'}`}>
            <div className="h-2 bg-armor-light rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-armor-light rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-4 h-4 bg-armor/20 rounded"></div>
          <div className="flex-grow h-3 bg-armor/20 rounded"></div>
        </div>
      ))}
    </div>
  );
}
