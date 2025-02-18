import LanguageSwitcher from "./components/languageSwitcher";
import External from "./components/translationDemo";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Result from "./components/form/Result";
import Step1 from "./components/form/Step1";
import "./state/store";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center min-h-screen">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <LanguageSwitcher />
        <External />
      </main>
    </div>
  );
}
