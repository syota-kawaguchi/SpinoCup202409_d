import "react-circular-progressbar/dist/styles.css";
import styles from "./displayCurrentScore.module.css";
import { Manager } from "../class";
import { useEffect, useState } from "react";
import { foodScore } from "../const";

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
  const [marukogeCount, setMarukogeCount] = useState<number>(
    managerObj.marukogeUUIDs.length
  );

  console.log(addScore);

  useEffect(() => {
    // スコアが更新されたかどうかを監視するためにintervalを設定
    const interval = setInterval(() => {
      const newAddScore = addScore.filter((score) => score.time < 1); // 1秒経過した加点分を削除

      if (managerObj.score !== currentScore) {
        setCurrentScore(managerObj.score); // stateに新しいスコアを反映
        console.log("score updated", managerObj.score);
        newAddScore.push({
          additionalScore: managerObj.score - currentScore,
          time: 0,
        });
      }

      if (managerObj.marukogeUUIDs.length !== marukogeCount) {
        // managerObj.marukogeUUIDs.length - marukogeCount 分だけ加点分を追加
        newAddScore.push(
          ...Array.from(
            { length: managerObj.marukogeUUIDs.length - marukogeCount },
            (_) => {
              return {
                additionalScore: foodScore[3],
                time: 0,
              };
            }
          )
        );

        setMarukogeCount(managerObj.marukogeUUIDs.length);
      }

      newAddScore.forEach((score) => {
        score.time += 0.03; // 加点分の表示時間を更新
      });

      setAddScore([...newAddScore]); // 加点分をstateに追加
    }, 10); // 100msごとにチェック (必要に応じて調整)

    return () => clearInterval(interval); // コンポーネントのアンマウント時にクリーンアップ
  }, [managerObj, currentScore, marukogeCount]);

  const color = (score: AddScore) => {
    switch (score.additionalScore) {
      case 30:
        return "red";
      case 20:
        return "green";
      case 10:
        return "blue";
      default:
        return "black";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.score}>{currentScore}</div>
      <div className={styles.addScore}>
        {addScore.map((score, index) => (
          <p
            key={index}
            className={styles.additionalScore}
            style={{
              color: `${color(score)}`,
              bottom: `${score.time * 20}px`,
              opacity: `${1 - score.time}`,
            }}
          >
            {score.additionalScore > 0 ? "+" : ""}
            {score.additionalScore}
          </p>
        ))}
      </div>
    </div>
  );
};
