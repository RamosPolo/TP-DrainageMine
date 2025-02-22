import { TupleSpace } from "./TupleSpace.js";
import { Tuple } from "./Tuple.js";
import { Template } from "./Template.js";
import { H2O_haut, Surveillance_gaz_haut, H2O_bas, ventilateurAgent } from "./Agents/agentsLeo.js";
import { Commande_Pompe_Ventilateur, Pompe, Gaz_bas } from "./Agents/agentsPaul.js";

// Création de l'espace de tuples
const ts = new TupleSpace();

// Seuils de détection
const seuil_H2O = 50;
const seuil_CH4 = 50;
const seuil_CO = 50;
const seuil_H2O_bas = 11;

let etat_pompe_Global = "off";
let etat_ventilateur_Global = "off";

// Ajout de tuples réels avec des valeurs initiales
ts.out(new Tuple(["niveau_H2O", 20.3]));
ts.out(new Tuple(["niveau_CH4", 10.1]));
ts.out(new Tuple(["niveau_CO", 13.6]));
ts.out(new Tuple(["detection_H2O_haut"]));

// Templates pour les niveaux
const templateEau = new Template(["niveau_H2O"]);
const templateCH4 = new Template(["niveau_CH4"]);
const templateCO = new Template(["niveau_CO"]);

// Booléens de suivi des agents
const agentState = {
    h2oAgentActive: false,
    pompeAgentActive: false,
    ventilateurAgentActive: false,
    surveillanceGazHautActive: false,
    h2oBasAgentActive: false,
    gazBasAgentActive: false,
    commandeAgentActive: false
};
/**
 * Modifie les niveaux d'eau et de gaz
 */
async function modifyLevels() {
    try {
        console.log("[Agent] Début de modifyLevels");

        // Récupération des valeurs actuelles
        const tupleH20 = await ts.rd(templateEau);
        const tupleCH4 = await ts.rd(templateCH4);
        const tupleCO = await ts.rd(templateCO);

        let newEau = tupleH20.values[1] + 5.2;
        let newGazCH4 = tupleCH4.values[1] + 2.4;
        let newGazCO = tupleCO.values[1] + 4.6;

        if (etat_pompe_Global === "on") {
            newEau = tupleH20.values[1] - 8.3;
        }

        if (etat_ventilateur_Global === "on") {
            newGazCH4 = tupleCH4.values[1] - 10.3;
            newGazCO = tupleCO.values[1] - 12.6;
        }

        await Promise.all([
            ts.addp(templateEau, newEau),
            ts.addp(templateCH4, newGazCH4),
            ts.addp(templateCO, newGazCO)
        ]);

        console.log("[Agent] Fin de modifyLevels");
    } catch (error) {
        console.error("Erreur dans modifyLevels :", error);
    }
}

/**
 * Affiche les niveaux de gaz et d'eau
 */
async function readNiveauAgent() {
    try {
        console.log("[Agent] Début de readNiveauAgent");

        let readEau = ts.rdp(templateEau);
        let readGaz = ts.rdp(templateCH4);
        let readGazCO = ts.rdp(templateCO);
        console.log("  - Niveau Eau H20:", readEau ? readEau.toString() : "Non trouvé");
        console.log("  - Niveau Gaz CH4:", readGaz ? readGaz.toString() : "Non trouvé");
        console.log("  - Niveau Gaz CO:", readGazCO ? readGazCO.toString() : "Non trouvé");

        console.log("[Agent] Fin de readNiveauAgent");
    } catch (error) {
        console.error("Erreur dans readNiveauAgent :", error);
    }
}

/**
 * Active les agents en parallèle
 */
async function activeAgents() {
    console.log("[Système] Activation des agents...");
    console.log(agentState);

    const tasks = [];

    if (!agentState.pompeAgentActive) {
        console.log("[Agent] Activation de Pompe");
        agentState.pompeAgentActive = true;
        tasks.push(
            Pompe(ts)
                .then(etat => {
                    if (etat) etat_pompe_Global = etat;
                    console.log("État de la pompe :", etat_pompe_Global);
                })
                .finally(() => (agentState.pompeAgentActive = false))
        );
    }

    if (!agentState.ventilateurAgentActive) {
        console.log("[Agent] Activation de Ventilateur");
        agentState.ventilateurAgentActive = true;
        tasks.push(
            ventilateurAgent(ts)
                .then(etat => {
                    if (etat) etat_ventilateur_Global = etat;
                    console.log("État du ventilateur :", etat_ventilateur_Global);
                })
                .finally(() => (agentState.ventilateurAgentActive = false))
        );
    }

    if (!agentState.surveillanceGazHautActive) {
        console.log("[Agent] Activation de Surveillance_gaz_haut");
        agentState.surveillanceGazHautActive = true;
        tasks.push(
            Surveillance_gaz_haut(ts, seuil_CH4, seuil_CO).finally(
                () => (agentState.surveillanceGazHautActive = false)
            )
        );
    }

    if (!agentState.h2oBasAgentActive) {
        console.log("[Agent] Activation de H2O_bas");
        agentState.h2oBasAgentActive = true;
        tasks.push(
            H2O_bas(ts, seuil_H2O_bas).finally(() => (agentState.h2oBasAgentActive = false))
        );
    }

    if (!agentState.gazBasAgentActive) {
        console.log("[Agent] Activation de Gaz_bas");
        agentState.gazBasAgentActive = true;
        tasks.push(
            Gaz_bas(ts, seuil_CH4, seuil_CO).finally(() => (agentState.gazBasAgentActive = false))
        );
    }

    if (!agentState.commandeAgentActive) {
        console.log("[Agent] Activation de Commande_Pompe_Ventilateur");
        agentState.commandeAgentActive = true;
        tasks.push(
            Commande_Pompe_Ventilateur(ts, seuil_CH4, seuil_CO).finally(
                () => (agentState.commandeAgentActive = false)
            )
        );
    }

    if (!agentState.h2oAgentActive) {
        console.log("[Agent] Activation de H2O_haut");
        agentState.h2oAgentActive = true;
        tasks.push(
            H2O_haut(ts, seuil_H2O).finally(() => (agentState.h2oAgentActive = false))
        );
    }

    await Promise.all(tasks);
    console.log("[Système] Tous les agents ont été activés.");
}


// Démarrage des intervalles
setInterval(modifyLevels, 2000);
setInterval(activeAgents, 1000);
setInterval(readNiveauAgent, 1999);
