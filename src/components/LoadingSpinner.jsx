import React from 'react';
import { Dog } from 'lucide-react';

export default function LoadingSpinner({ text = "Loading PetZone...", type = "spinner" }) {
  if (type === "skeleton") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-stone-200/60 rounded-3xl h-96 flex flex-col justify-between p-5">
            <div className="bg-stone-300/80 rounded-2xl h-48 w-full" />
            <div className="space-y-3 mt-4">
              <div className="bg-stone-300/80 h-4 w-3/4 rounded-md" />
              <div className="bg-stone-300/80 h-4 w-1/2 rounded-md" />
            </div>
            <div className="flex items-center justify-between mt-6">
              <div className="bg-stone-300/80 h-6 w-24 rounded-md" />
              <div className="bg-stone-300/80 h-10 w-10 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-full border-4 border-[#E8EFEA] border-t-[#244B3B] animate-spin flex items-center justify-center" />
        <Dog className="w-7 h-7 text-[#244B3B] absolute inset-0 m-auto" />
      </div>
      <p className="text-sm font-semibold text-stone-600 animate-pulse">{text}</p>
    </div>
  );
}
