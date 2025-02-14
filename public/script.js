import { TupleSpace } from "./TupleSpace.js";
import { Tuple } from "./Tuple.js";
import { Template } from "./Template.js";
import { H2O_haut } from "./Agents/agentsLeo.js"
import { Commande_Pompe } from "./Agents/agentsPaul.js"


// Création de l'espace de tuples
const ts = new TupleSpace();

// Ajout de tuples réels avec des valeurs variables
ts.out(new Tuple(["pompe-activation", "on"]));
ts.out(new Tuple(["ventillateur-activation", "off"]));
ts.out(new Tuple(["temperature", 22.5]));
ts.out(new Tuple(["niveau_H2O", 75.3]));
ts.out(new Tuple(["niveau-gaz", 40.2])); //TODO : a changer de nom
ts.out(new Tuple(["H2O_haut_detecte", false]));
ts.out(new Tuple(["detection_H2O_haut", false]));

// Templates pour les niveaux d'eau et de gaz
const templateEau = new Template(["niveau_H2O"]);
const templateGaz = new Template(["niveau-gaz"]);

/**
 * Modifie les niveaux d'eau et de gaz
 * La fonction change les valeurs de manière dynamique
 */
async function modifyLevels() {
    // Génère des nouvelles valeurs pour les niveaux d'eau et gaz
    const newEau = Math.random() * 100; // Nouveau niveau d'eau entre 0 et 100
    const newGaz = Math.random() * 50;  // Nouveau niveau de gaz entre 0 et 50

    console.log(`Modification des niveaux: Eau = ${newEau.toFixed(2)}, Gaz = ${newGaz.toFixed(2)}`);

    // Modifie les niveaux en parallèle
    await Promise.all([
        ts.addp(templateEau, newEau),
        ts.addp(templateGaz, newGaz)
    ]);
}

async function readNiveauAgent(){
    let readEau = ts.rdp(templateEau)
    let readGaz = ts.rdp(templateGaz)
    console.log("Tuple après plusieurs modifications:")
    console.log("  - Niveau Eau:", readEau ? readEau.toString() : "Non trouvé")
    console.log("  - Niveau Gaz:", readGaz ? readGaz.toString() : "Non trouvé")

    await H2O_haut(ts,30)
    await Commande_Pompe(ts, 40, 30)
}

// Mettre les fonctions agents ici
async function activeAgents(){

    await Promise.all([
        await readNiveauAgent()
    ]);
    
}

// 🔵 Démarre l'intervalle de modification des niveaux toutes les 2 secondes
setInterval(modifyLevels, 2000);

// 🔵 Vérification après 0.5 secondes pour voir si les tuples ont bien été modifiés
setInterval(activeAgents, 500);


