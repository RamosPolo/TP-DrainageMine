export class Tuple {
    constructor(values) {
        this.values = values;
    }

    getValues() {
        return this.values;
    }

    toString() {
        return `Tuple${JSON.stringify(this.values)}`;
    }
}
