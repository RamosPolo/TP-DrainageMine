export class Template {
    constructor(pattern) {
        this.pattern = pattern;
    }

    matches(tuple) {
        const values = tuple.getValues();

        // Vérifier qu'il y a bien au moins un élément dans le tuple
        if (values.length === 0) {
            return false;
        }

        // Comparer seulement le premier élément (le "titre")
        return this.pattern[0] === values[0];
    }
}
