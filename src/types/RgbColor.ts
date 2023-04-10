export class RgbColor {

    private red: number = 0;
    private green: number = 0;
    private blue: number = 0;

    constructor(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    getRgba(alpha: number = 1.0): string {
        return `rgba(
            ${this.red},
            ${this.green}, 
            ${this.blue},
            ${alpha})`;
    }
}