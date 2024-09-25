import "react-circular-progressbar/dist/styles.css";
import styles from "./displayCurrentScore.module.css";
import { Manager } from "../class";
import { useEffect, useState } from "react";

interface AddScore {
  additionalScore: number;
  time: number;
}

export const DisplayCurrentScore = ({
  managerObj,
}: {
  managerObj: Manager;
}) => {
  // Reactでstateとしてscoreを保持する
  const [currentScore, setCurrentScore] = useState(managerObj.score);
  //   加点があった場合に加点分を下に表示するためのstate
  const [addScore, setAddScore] = useState<AddScore[]>([]);
  console.log(addScore);

  useEffect(() => {
    // スコアが更新されたかどうかを監視するためにintervalを設定
    const interval = setInterval(() => {
      const newAddScore = addScore.filter((score) => score.time < 1); // 1秒経過した加点分を削除

      if (managerObj.score !== currentScore) {
        setCurrentScore(managerObj.score); // stateに新しいスコアを反映
        newAddScore.push({
          additionalScore: managerObj.score - currentScore,
          time: 0,
        });
      }
      newAddScore.forEach((score) => {
        score.time += 0.1; // 加点分の表示時間を更新
      });

      setAddScore([...newAddScore]); // 加点分をstateに追加
    }, 100); // 100msごとにチェック (必要に応じて調整)

    return () => clearInterval(interval); // コンポーネントのアンマウント時にクリーンアップ
  }, [managerObj, currentScore]);

  return (
    <div className={styles.container}>
      <p className={styles.score}>{currentScore}</p>
      <div className={styles.addScore}>
        {addScore.map((score, index) => (
          <p key={index} className={styles.addScoreText}>
            {score.additionalScore}
          </p>
        ))}
      </div>
    </div>
  );
};
