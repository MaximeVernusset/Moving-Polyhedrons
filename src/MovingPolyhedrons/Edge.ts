import type { Peak } from "./Peak";

export class Edge {

    protected startPeak: Peak;
    protected endPeak: Peak;

    constructor(startPoint: Peak, endPoint: Peak) {
        this.startPeak = startPoint;
        this.endPeak = endPoint;
    }

}