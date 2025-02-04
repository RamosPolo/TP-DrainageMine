import {TupleSpace} from "./TupleSpace";
import {Tuple} from "./Tuple";
import {Template} from "./Template"

// Création de l'espace de tuples
const ts = new TupleSpace();

// Exemple de tuple
const tuple = new Tuple([1, "Hello", 3.14]);
ts.out(tuple);

// Exemple de template
const template = new Template(["number", "string", "number"]);

// Utilisation de in() (bloquant)
(async () => {
    const matchedTuple = await ts.in(template);
    console.log("Tuple récupéré:", matchedTuple.toString());
})();

// Utilisation de eval() pour un tuple actif
const activeTuple = new Tuple([
    () => new Promise((resolve) => setTimeout(() => resolve("Evaluated"), 1000)),
    "Passive Value",
]);
ts.eval(activeTuple);

// Utilisation de inp() (non bloquant)
const nonBlockingTuple = ts.inp(template);
if (nonBlockingTuple) {
    console.log("Tuple récupéré (non bloquant):", nonBlockingTuple.toString());
}

// Utilisation de rdp() (non bloquant)
const readTuple = ts.rdp(template);
if (readTuple) {
    console.log("Tuple lu (non bloquant):", readTuple.toString());
}
