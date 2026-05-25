"use client";

import dynamic from "next/dynamic";

export const AuthClientOnly = dynamic(
  () => import("./AuthExperience").then((mod) => mod.AuthExperience),
  {
    ssr: false,
  },
);
