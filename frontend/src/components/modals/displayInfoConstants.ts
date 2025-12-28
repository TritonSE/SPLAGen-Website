export type ValidService =
  | "other"
  | "pediatrics"
  | "cardiovascular"
  | "neurogenetics"
  | "rareDiseases"
  | "cancer"
  | "biochemical"
  | "prenatal"
  | "adult"
  | "psychiatric"
  | "reproductive"
  | "ophthalmic"
  | "research"
  | "pharmacogenomics"
  | "metabolic";

export const languages = ["english", "spanish", "portuguese", "other"] as const;

export const serviceLabelToKeyMap: Record<string, ValidService> = {
  "Pediatric Genetics": "pediatrics",
  "Cardiovascular Genetics": "cardiovascular",
  Neurogenetics: "neurogenetics",
  "Rare Diseases": "rareDiseases",
  "Cancer Genetics": "cancer",
  "Biochemical Genetics": "biochemical",
  "Prenatal Genetics": "prenatal",
  "Adult Genetics": "adult",
  "Psychiatric Genetics": "psychiatric",
  "Assisted Reproductive Technologies and Preimplantation Genetic Testing": "reproductive",
  "Ophthalmic Genetics": "ophthalmic",
  Research: "research",
  Pharmacogenomics: "pharmacogenomics",
  "Metabolic Genetics": "metabolic",
  Other: "other",
};

export const serviceKeyToLabelMap: Record<ValidService, string> = Object.entries(
  serviceLabelToKeyMap,
).reduce<Record<string, string>>((acc, [label, key]) => {
  acc[key] = label;
  return acc;
}, {}) as Record<ValidService, string>;

export const educationTypeOptions = [
  {
    label: "Master's Degree in Genetic Counseling",
    value: "masters",
  },
  {
    label: "Diploma in Genetic Counseling",
    value: "diploma",
  },
  {
    label: "Medical Fellowship in Genetics",
    value: "fellowship",
  },
  {
    label: "Other",
    value: "other",
  },
];
