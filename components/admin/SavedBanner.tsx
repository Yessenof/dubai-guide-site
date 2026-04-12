"use client";

import { useEffect, useState } from "react";

export default function SavedBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="mb-5 flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-xl">
      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
      Guide saved successfully.
    </div>
  );
}
