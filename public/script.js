import { TupleSpace } from "./TupleSpace.js";
import { Tuple } from "./Tuple.js";
import { Template } from "./Template.js";
import { H2O_haut } from "./Agents/agentsLeo.js"
import { Commande_Pompe_Ventilateur, Pompe } from "./Agents/agentsPaul.js"


// Création de l'espace de tuples
const ts = new TupleSpace();

// seuils de detections
const seuil_H2O = 90.0;
const seuil_CH4 = 89.0;
const seuil_CO = 88.6;

// Ajout de tuples réels avec des valeurs variables
ts.out(new Tuple(["niveau_H2O", 20.3]));
ts.out(new Tuple(["niveau_CH4", 10.1]));
ts.out(new Tuple(["niveau_CO", 13.6]));
ts.out(new Tuple(["detection_H2O_haut"]));


// Templates pour les niveaux d'eau et de gaz
const templateEau = new Template(["niveau_H2O"]);
const templateCH4 = new Template(["niveau_CH4"]);
const templateCO = new Template(["niveau_CO"]);

const templatePompeActive = new Template(["activation_pompe"]);
const templateVentilateurActive = new Template(["activation_ventilateur"]);

/**
 * Modifie les niveaux d'eau et de gaz
 * La fonction change les valeurs de manière dynamique
 */
async function modifyLevels() {
    // Récupération des valeurs
    const tupleH20 = await  ts.rd(templateEau);
    const tupleCH4 = await ts.rd(templateCH4);
    const tupleCO = await ts.rd(templateCO);

    // activations des ventilateurs et pompes
    const pompe_Active = ts.rdp(templatePompeActive);
    const ventilateur_Active = ts.rdp(templateVentilateurActive);

    // Génère des nouvelles valeurs pour les niveaux d'eau et gaz
    let newEau = tupleH20.values[1] + 5.2;
    let newGazCH4 = tupleCH4.values[1] + 2.4;
    let newGazCO = tupleCO.values[1] + 4.6;

    // si la pompe est activé
    if(pompe_Active != null && newEau >= 5.3){
        newEau = tupleH20.values[1] - 8.3;
    }
    // si le ventilateur est activé
    if(ventilateur_Active != null && (newGazCH4 >= 5.0 || newGazCO > 5.0)){
        newGazCH4 = tupleCH4.values[1] - 10.3;
        newGazCO = tupleCO.values[1] -12.6;
    }

    // Modifie les niveaux en parallèle
    await Promise.all([
        ts.addp(templateEau, newEau),
        ts.addp(templateCH4, newGazCH4),
        ts.addp(templateCO, newGazCO)
    ]);
}

async function readNiveauAgent(){
    let readEau = ts.rdp(templateEau);
    let readGaz = ts.rdp(templateCH4);
    let readGazCO = ts.rdp(templateCO);
    console.log("  - Niveau Eau H20:", readEau ? readEau.toString() : "Non trouvé");
    console.log("  - Niveau Gaz CH4:", readGaz ? readGaz.toString() : "Non trouvé");
    console.log("  - Niveau Gaz CO:", readGazCO ? readGazCO.toString() : "Non trouvé");
}

let h2oAgentActive = false;
let pompeAgentActive = false;
let ventilateurAgentActive = false;

async function activeAgents() {
    console.log(h2oAgentActive, pompeAgentActive, ventilateurAgentActive);

    // Vérifie si l'agent H2O_haut est déjà en cours d'exécution, sinon l'active
    if (!h2oAgentActive) {
        console.log("Activation de l'agent H2O_haut", h2oAgentActive);
        h2oAgentActive = true;
        H2O_haut(ts, 30).finally(() => {
            h2oAgentActive = false; // L'agent est terminé, on réinitialise l'état
        });
    }

    // Vérifie si l'agent Commande_Pompe_Ventilateur est déjà en cours d'exécution, sinon l'active
    if (!pompeAgentActive) {
        console.log("Activation de l'agent Commande_Pompe_Ventilateur");
        pompeAgentActive = true;
        Commande_Pompe_Ventilateur(ts, seuil_CH4, seuil_CO).finally(() => {
            pompeAgentActive = false; // L'agent est terminé, on réinitialise l'état
        });
    }

    // Vérifie si l'agent Pompe est déjà en cours d'exécution, sinon l'active
    if (!ventilateurAgentActive) {
        console.log("Activation de l'agent Pompe");
        ventilateurAgentActive = true;
        Pompe(ts).finally(() => {
            ventilateurAgentActive = false; // L'agent est terminé, on réinitialise l'état
        });
    }
    
}

// Démarre l'intervalle de modification des niveaux toutes les 2 secondes
setInterval(modifyLevels, 2000);

// Vérification après 0.5 secondes pour voir si les tuples ont bien été modifiés
setInterval(activeAgents, 1000);

// Lecture des niveaux après 1.999 secondes
setInterval(readNiveauAgent, 1999);




