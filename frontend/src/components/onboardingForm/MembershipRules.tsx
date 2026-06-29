import { useStateMachine } from "little-state-machine";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";

import styles from "./MembershipRules.module.css";

import { Button, Checkmark } from "@/components";
import { onboardingState } from "@/state/stateTypes";

type MembershipRulesProps = {
  onNext: (data: onboardingState["data"]) => void;
  onBack: () => void;
};

export const MembershipRules = ({ onNext, onBack }: MembershipRulesProps) => {
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [markdownContent, setMarkdownContent] = useState("");
  const { t } = useTranslation();
  const [loadError, setLoadError] = useState<string | null>(null);
  const { state } = useStateMachine();

  const loadRules = useCallback(async () => {
    setLoadError(null);

    try {
      const response = await fetch(t("rules-path"));
      if (!response.ok) {
        setLoadError(
          `${t("rules-failed")}: HTTP ${String(response.status)} ${response.statusText}`,
        );
        return;
      }
      const text = await response.text();
      setMarkdownContent(text);
    } catch (error) {
      setLoadError(`${t("rules-failed")}: ${String(error)}`);
    }
  }, [t]);

  useEffect(() => {
    void loadRules();
  }, [loadRules]);

  return (
    <div className={styles.container}>
      <div className="prose">
        <Markdown>{markdownContent}</Markdown>
      </div>

      {loadError && <p className={styles.errorText}>{loadError}</p>}

      <div className="flex items-center text-base mb-2">
        <Checkmark
          checked={acceptedRules}
          onChange={() => {
            setAcceptedRules((prevAccepted) => !prevAccepted);
          }}
          label={t("i-accept-rules")}
        />
      </div>

      <div className={styles.buttonContainer}>
        <button type="button" onClick={onBack} className={styles.backButton}>
          <Image src="/icons/ic_caretleft.svg" alt="Back Icon" width={24} height={24} />
          {t("back")}
        </button>

        <Button
          onClick={() => {
            onNext(state.onboardingForm);
          }}
          disabled={!acceptedRules}
          label={t("continue")}
        />
      </div>
    </div>
  );
};
