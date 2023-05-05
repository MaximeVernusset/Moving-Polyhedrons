export class RgbColor {

    private red = 0;
    private green = 0;
    private blue = 0;

    constructor(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    getRgba(alpha = 1.0): string {
        return `rgba(
            ${this.red},
            ${this.green}, 
            ${this.blue},
            ${alpha})`;
    }
}