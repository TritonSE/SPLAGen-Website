import FormWrapper from "./formWrapper";

export default function OnboardingForm() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center min-h-screen">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <FormWrapper />
      </main>
    </div>
  );
}
