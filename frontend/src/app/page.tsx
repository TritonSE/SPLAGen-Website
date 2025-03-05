"use client";

import React, { useContext } from "react";

import { UserContext } from "../contexts/userContext";

import LanguageSwitcher from "./components/languageSwitcher";
import External from "./components/translationDemo";

export default function Home() {
  const { user } = useContext(UserContext);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center min-h-screen">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        {/* Added the LanguageSwitcher component */}
        <LanguageSwitcher />
        {user && (
          <p>
            {user.personal.firstName} {user.display.workEmail}
          </p>
        )}
        {/* External is my text component */}
        <External></External>
      </main>
    </div>
  );
}
