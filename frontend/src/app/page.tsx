import LanguageSwitcher from "./components/languageSwitcher";
import FormWrapper from "./components/onboardingForm/formWrapper";
import External from "./components/translationDemo";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center min-h-screen">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <LanguageSwitcher />
        <External />
        <FormWrapper />
      </main>
    </div>
  );
}
