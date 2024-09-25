import "react-circular-progressbar/dist/styles.css";
import styles from "./displayCurrentScore.module.css";
import { Manager } from "../class";

export const DisplayCurrentScore = ({
  managerObj,
}: {
  managerObj: Manager;
}) => {
  return (
    <div className={styles.container}>
      <p className={styles.score}>{managerObj.score}</p>
    </div>
  );
};
