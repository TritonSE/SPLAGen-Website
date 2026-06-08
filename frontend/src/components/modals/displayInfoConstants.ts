export type ValidService =
  | "other"
  | "pediatrics"
  | "cardiovascular"
  | "neurogenetics"
  | "rareDiseases"
  | "cancer"
  | "biochemicalMetabolic"
  | "prenatal"
  | "adult"
  | "psychiatric"
  | "reproductive"
  | "ophthalmic"
  | "research"
  | "pharmacogenomics";

export const languages = ["english", "spanish", "portuguese"] as const;

export const serviceLabelToKeyMap: Record<string, ValidService> = {
  "Pediatric Genetics": "pediatrics",
  "Cardiovascular Genetics": "cardiovascular",
  Neurogenetics: "neurogenetics",
  "Rare Diseases": "rareDiseases",
  "Cancer Genetics": "cancer",
  "Biochemical or Metabolic Genetics": "biochemicalMetabolic",
  "Prenatal Genetics": "prenatal",
  "Adult Genetics": "adult",
  "Psychiatric Genetics": "psychiatric",
  "Assisted Reproductive Technologies and Preimplantation Genetic Testing": "reproductive",
  "Ophthalmic Genetics": "ophthalmic",
  Research: "research",
  Pharmacogenomics: "pharmacogenomics",
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
    label: "education-masters-degree-counseling",
    value: "masters",
  },
  {
    label: "education-diploma-counseling",
    value: "diploma",
  },
  {
    label: "education-medical-fellowship-genetics",
    value: "fellowship",
  },
  {
    label: "other",
    value: "other",
  },
];
