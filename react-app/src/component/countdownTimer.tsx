import { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar/dist/index.esm.js';
import 'react-circular-progressbar/dist/styles.css';
import styles from '../App.module.css'
import { timeMax } from '../const';
import { FinishPageModal } from './FinishPage';

type ThermoGraphyCircleProps = {
    startTime : number
    text : string
    onGameFinish: () => void
}

export const ThermoGraphyCircle = (props:ThermoGraphyCircleProps) => {
  const [countTime, setCount] = useState<number>(props.startTime)
  const isGameFinished = countTime >= timeMax

    useEffect(() => {
        const interval = setInterval(() => {
            if (timeMax <= countTime) {
                props.onGameFinish()
                clearInterval(interval)
            }
            else {
                setCount(prevTime => prevTime + 1)
            }
        }, 1000);
        return () => {
            clearInterval(interval)
        };
    }, [countTime]);

    const backgroundColor = colorMapJet(countTime, timeMax)

    return (
        <div >
            <div className={styles.thermo} style={{backgroundColor : `${backgroundColor}`}}></div>
            <div className={styles.circle}>
                <CircularProgressbar value={countTime} text={`${props.text}`}></CircularProgressbar>
            </div>
            <FinishPageModal isGameFinished={isGameFinished} />
        </div>
    )
}

type Color = {
    red : number
    green : number
    blue: number
}

const getColor = (v:number, vMin: number, vMax:number) => {

    const c : Color = {red : 1.0, green : 1.0, blue : 1.0}

    if (v < vMin) {
        v = vMin
    }
    if (vMax < v) {
        v = vMax
    }
    const dv = vMax - vMin
    if (v < (vMin + 0.25 * dv)) {
        c.red = 0
        c.green = 4 * (v - vMin) / dv
    }
    else if (v < (vMin + 0.5 * dv)) {
        c.red = 0
        c.blue = 1 + 4 * (vMin + 0.25 * dv - v) / dv
    }
    else if (v < (vMin + 0.75 * dv)) {
        c.red = 4 * (v - vMin - 0.5 * dv) / dv
        c.blue = 0
    }
    else {
        c.green = 1 + 4 * (vMin + 0.75 * dv - v) / dv
        c.blue = 0
    }

    const color8bit : Color = {red : c.red * 255, green : c.green * 255, blue : c.blue * 255}

    return color8bit
}

const colorMapJet = (x:number, xMax:number) => {
    const max = xMax - 1.0;
    if (x <= xMax / 2) {
        const c = getColor(x / max, 0.0, 0.5);
        return `rgba(${c.red}, ${c.green}, ${c.blue})` 
    }
    else {
        const c = getColor((xMax - x) / max, 0.0, 0.5);
        return `rgba(${c.red}, ${c.green}, ${c.blue})`
    }
}