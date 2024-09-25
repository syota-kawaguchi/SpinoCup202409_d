import { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styles from '../App.module.css'
import { timeMax } from '../const';

type ThermoGraphyCircleProps = {
    startTime : number
    text : string
}

export const ThermoGraphyCircle = (props:ThermoGraphyCircleProps) => {
  const [countTime, setCount] = useState<number>(props.startTime)

    useEffect(() => {
        const interval = setInterval(() => {
            if (timeMax <= countTime) {
                console.log(`will running clear interval`)
                clearInterval(interval)
            }
            else {
                setCount(prevTime => prevTime + 1)
                console.log(`countTime : ${countTime}`)
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [countTime]);

    return (
        <div >
            <div className={styles.thermo}></div>
            <div className={styles.circle}>
                <CircularProgressbar value={countTime} text={`${props.text}`}></CircularProgressbar>
            </div>
        </div>
    )
}
