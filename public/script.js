import { TupleSpace } from "./TupleSpace.js";
import { Tuple } from "./Tuple.js"
import { Template } from "./Template.js";

// Création de l'espace de tuples
const ts = new TupleSpace();

// Exemple de tuple
const tuple = new Tuple([1, "Hello", 3.14]);
const tuple2 = new Tuple(["tuple2","hello"])
ts.out(tuple);
ts.out(tuple2);

// Exemple de template
const template = new Template(["number", "string", "number"]);
const template2 = new Template(["string", "string"]);

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
const nonBlockingTuple = ts.inp(template2);
if (nonBlockingTuple) {
    console.log("Tuple récupéré (non bloquant):", nonBlockingTuple.toString());
}

// Utilisation de rdp() (non bloquant)
const readTuple = ts.rdp(template2);
if (readTuple) {
    console.log("Tuple lu (non bloquant):", readTuple.toString());
}
