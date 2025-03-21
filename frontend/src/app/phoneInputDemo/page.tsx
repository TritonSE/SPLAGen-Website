import { PhoneInput } from "@/components/PhoneInput";

const PhoneDemo: React.FC = () => {
  return (
    <div>
      <h1> Phone Demo </h1>
      <div className="flex justify-center items-center h-full">
        <PhoneInput />
      </div>
    </div>
  );
};

export default PhoneDemo;
