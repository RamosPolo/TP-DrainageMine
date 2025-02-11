export class Tuple {
    private values: any[]; // Utilisez `any[]` si les types des valeurs sont variés

    constructor(values: any[]) {
        this.values = values;
    }

    getValues(): any[] {
        return this.values;
    }

    toString(): string {
        return `Tuple${JSON.stringify(this.values)}`;
    }
}
