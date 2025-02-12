import { TupleSpace } from "./TupleSpace.js";
import { Tuple } from "./Tuple.js";
import { Template } from "./Template.js";

// Création de l'espace de tuples
const ts = new TupleSpace();

// Ajout de tuples réels avec des valeurs variables
ts.out(new Tuple(["pompe-activation", "on"]));
ts.out(new Tuple(["ventillateur-activation", "off"]));
ts.out(new Tuple(["temperature", 22.5]));
ts.out(new Tuple(["niveau-eau", 75.3]));

// Templates ne contenant que le titre
const templatePompe = new Template(["pompe-activation"]);
const templateVentilo = new Template(["ventillateur-activation"]);
const templateTemp = new Template(["temperature"]);
const templateEau = new Template(["niveau-eau"]);

// 🔵 Test `in()` (bloquant) sur pompe-activation
(async () => {
    const matchedTuple = await ts.in(templatePompe);
    console.log("Tuple récupéré:", matchedTuple.toString()); // Peut être ["pompe-activation", "on"] ou ["pompe-activation", "off"]
})();

// 🔵 Test `inp()` (non bloquant) sur ventillateur-activation
const nonBlockingTuple = ts.inp(templateVentilo);
if (nonBlockingTuple) {
    console.log("Tuple récupéré (non bloquant):", nonBlockingTuple.toString()); // Peut être ["ventillateur-activation", "on"] ou ["ventillateur-activation", "off"]
} else {
    console.log("Aucun tuple trouvé pour ventillateur-activation");
}

// 🔵 Test `rdp()` (lecture non bloquante) sur temperature
const readTuple = ts.rdp(templateTemp);
if (readTuple) {
    console.log("Tuple lu (non bloquant):", readTuple.toString()); // Peut être ["temperature", 22.5] ou ["temperature", 18]
} else {
    console.log("Aucun tuple trouvé pour temperature");
}
