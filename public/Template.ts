import {Tuple} from "./Tuple";

export class Template {
    private types: string[]; // Les types sont représentés par des chaînes (ex: "number", "string")

    constructor(types: string[]) {
        this.types = types;
    }

    matches(tuple: Tuple): boolean {
        if (tuple.getValues().length !== this.types.length) {
            return false;
        }
        for (let i = 0; i < this.types.length; i++) {
            if (typeof tuple.getValues()[i] !== this.types[i]) {
                return false;
            }
        }
        return true;
    }

    toString(): string {
        return `Template${JSON.stringify(this.types)}`;
    }
}
