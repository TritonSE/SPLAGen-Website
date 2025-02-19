import Image from "next/image";
import React from "react";

type CheckmarkProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

const Checkmark: React.FC<CheckmarkProps> = ({ checked, onChange, label }) => {
  const checkedIcon = "/icons/ic_round-check-box.svg";
  const uncheckedIcon = "/icons/ic_round-check-box-outline-blank.svg";
  return (
    <div
      onClick={() => {
        onChange(!checked);
      }}
      style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
    >
      <Image
        src={checked ? checkedIcon : uncheckedIcon}
        alt={checked ? "Checked" : "Unchecked"}
        width={24}
        height={24}
      />
      <span style={{ marginLeft: "8px" }}>{label}</span>
    </div>
  );
};

export default Checkmark;
