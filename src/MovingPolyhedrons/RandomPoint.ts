import { Point, DEFAULT_RADIUS } from "./Point";
import type { RgbColor } from "./RgbColor";

const POSITIVE = 1;
const NEGATIVE = - 1;
const RANDOM_SPEED_MULTIPLIER = 2;

function generateRandomPositiveCoordinate(maxValue: number, pointRadius: number): number {
    let randomCoordinate = (Math.random() * (maxValue - pointRadius)) % (maxValue - pointRadius);
    if (randomCoordinate < pointRadius)  {
        randomCoordinate = pointRadius;
    }
    if (randomCoordinate > maxValue - pointRadius) {
        randomCoordinate = maxValue - pointRadius;
    }
    return randomCoordinate;
}

function generateRandomRelativeSpeed(): number {
    const positive = Math.random() < 0.5;
    return Math.abs(Math.random() * RANDOM_SPEED_MULTIPLIER) * (positive ? POSITIVE : NEGATIVE);
}

export class RandomPoint extends Point {

    constructor(xMax: number, yMax: number, color: RgbColor | undefined = undefined, radius: number | undefined = undefined) {        
        const pointRadius: number = (radius || DEFAULT_RADIUS) + 1;
        const randomX: number = generateRandomPositiveCoordinate(xMax, pointRadius);
        const randomY: number = generateRandomPositiveCoordinate(yMax, pointRadius);
        const randomDX: number = generateRandomRelativeSpeed();
        const randomDY: number = generateRandomRelativeSpeed();
        super(randomX, randomY, randomDX, randomDY, xMax, yMax, color, radius);
    }

}