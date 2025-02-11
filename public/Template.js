export class Template {
    constructor(types) {
        this.types = types;
    }

    matches(tuple) {
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

    toString() {
        return `Template${JSON.stringify(this.types)}`;
    }
}
