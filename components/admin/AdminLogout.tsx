"use client";

import { signOut } from "next-auth/react";

export default function AdminLogout() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
    >
      Sign out
    </button>
  );
}
