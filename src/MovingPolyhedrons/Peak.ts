export class Peak {

    private _id: string;
    private marked: boolean;

    constructor() {
        this._id = crypto.randomUUID();
    }

    public get id(): string {
        return this._id;
    }

    public isMarked(): boolean {
        return this.marked;
    }

    public mark(): void {
        this.marked = true;
    }

    public unmark(): void {
        this.marked = false;
    }

}