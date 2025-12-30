import { useState } from "react";
import CompleteCompanyProfile from "./CompleteCompanyProfile";
import styles from "./EmpresaProfile.module.css";

export default function EmpresaProfile() {
  // ⚠️ MOCK STATE (depois ligamos ao backend)
  const [hasProfile] = useState(false);

  return (
    <div className={styles.wrapper}>
      {!hasProfile ? (
        <CompleteCompanyProfile />
      ) : (
        <div className={styles.card}>
          <h2 className={styles.title}>Company Profile</h2>
          <p className={styles.text}>
            Your company profile has been submitted and is currently under
            review.
          </p>
        </div>
      )}
    </div>
  );
}
