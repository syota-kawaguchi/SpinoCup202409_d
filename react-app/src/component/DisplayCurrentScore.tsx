import "react-circular-progressbar/dist/styles.css";
import styles from "./displayCurrentScore.module.css";
import { Manager } from "../class";
import { useEffect, useState } from "react";

export const DisplayCurrentScore = ({
  managerObj,
}: {
  managerObj: Manager;
}) => {
  // Reactでstateとしてscoreを保持する
  const [currentScore, setCurrentScore] = useState(managerObj.score);

  useEffect(() => {
    // スコアが更新されたかどうかを監視するためにintervalを設定
    const interval = setInterval(() => {
      if (managerObj.score !== currentScore) {
        setCurrentScore(managerObj.score); // stateに新しいスコアを反映
      }
    }, 100); // 100msごとにチェック (必要に応じて調整)

    return () => clearInterval(interval); // コンポーネントのアンマウント時にクリーンアップ
  }, [managerObj, currentScore]);

  return (
    <div className={styles.container}>
      <p className={styles.score}>{currentScore}</p>
    </div>
  );
};
