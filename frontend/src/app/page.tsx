import { CountrySelector } from "./components"; // Import CountrySelector
import LanguageSwitcher from "./components/languageSwitcher";
import External from "./components/translationDemo";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center min-h-screen">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        {/* Added the LanguageSwitcher component */}
        <LanguageSwitcher />
        {/* External is my text component */}
        <External></External>
        {/* Added the CountrySelector component */}
        <CountrySelector />
      </main>
    </div>
  );
}
