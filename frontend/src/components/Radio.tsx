import styles from "./Radio.module.css";

type RadioProps = {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
};

export const Radio = ({ id, name, value, label, checked, onChange }: RadioProps) => {
  return (
    <label className={`${styles.radioLabel} ${checked ? styles.checked : ""}`} htmlFor={id}>
      {/* Visually hidden native input */}
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => {
          onChange(value);
        }}
        className={styles.radioInput}
      />
      <span className={styles.customRadio} />
      {label}
    </label>
  );
};
