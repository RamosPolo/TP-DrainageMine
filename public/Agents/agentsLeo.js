import { TupleSpace } from "../TupleSpace.js";
import { Tuple } from "../Tuple.js";
import { Template } from "../Template.js";

export async function ventilateurAgent(ts) {
    const templateActivationVentilateur = new Template(["activation_ventilateur"]);
    const templateDesactivationVentilateur = new Template(["desactivation_ventilateur"]);
    const actVentTuple = await ts.inp(templateActivationVentilateur);
    const desVentTuple = await ts.inp(templateDesactivationVentilateur);

    if(actVentTuple != null){
        console.log("Agent_Ventilateur : Activation de la pompe");
        return "on";
    }
    if(desVentTuple != null){
        console.log("Agent_Ventilateur : désactivation du ventilateur");
        return "off";
    }
}

// Détection du franchissment haut de l'eau
export async function H2O_haut(ts, seuil_H20_haut) {
    const templateDectectionH20Haut = new Template(["detection_H2O_haut"]);
    const templateNiveauH2O = new Template(["niveau_H2O"]);

    const dectectionH20HautTupleawait = await ts.rdp(templateDectectionH20Haut);

    const x = await ts.rd(templateNiveauH2O);

    if(dectectionH20HautTupleawait != null){
        if (x.values[1] >= seuil_H20_haut) {
            console.log("va ajouter ") 
            ts.out(new Tuple(["H2O_haut_detecte"])); // beug ici
            ts.in(new Template(["detection_H2O_haut"]));
            console.log("H2O élevé");
        } else {
            console.log("H2O correct", x.values[1]);
        }
    }
}


// Détection du franchissment à la hausse du niveau pour au moins un des deux gaz
export async function Surveillance_gaz_haut(ts, seuil_CH4, seuil_CO) {
    const templateDectectionGazHaut = new Template(["detection_gaz_haut"]);
    const templateNiveauCH4 = new Template(["niveau_CH4"]);
    const templateNiveauCO = new Template(["niveau_CO"]);
    const detectionGazHautTuple = await ts.rdp(templateDectectionGazHaut);

    // Récupère les niveaux de gaz 
    const y = await ts.rd(templateNiveauCH4);
    const z = await ts.rd(templateNiveauCO);

    if(detectionGazHautTuple){
        if (y.values[1] < seuil_CH4 && z.values[1] < seuil_CO) {
            console.log("Ok : Les deux gaz sont en dessous des seuils");
        } else {
            console.log("Au moins un des deux gaz est au-dessus des seuils");
            ts.printTuples()
            ts.out(new Tuple(["activation_ventilateur"]));
            console.log("ajout du tuple activation vent");
            await ts.in(new Template(["detection_gaz_haut"]));
        }
    }
}


// Détection du niveau d'eau bas lorsque la pompe fonctionne
export async function H2O_bas(ts, seuil_H2O_bas) {
    const templateDectectionH2OBas = new Template(["detection_H2O_bas"]);
    const templateNiveauH2O = new Template(["niveau_H2O"]);
    
    const detectionH20BasTuple = await ts.rdp(templateDectectionH2OBas);
    console.log("salut", detectionH20BasTuple)
    const x = await ts.rd(templateNiveauH2O);

    if(detectionH20BasTuple != null){
        if (x.values[1] >= seuil_H2O_bas) {
            console.log("Continuer d'utiliser la pompe");
        } else {
            console.log("H20 bas problème")
            ts.out(new Tuple(["desactivation_pompe"])); // beug par la
            ts.out(new Tuple(["desactivation_ventilateur"]));
            await ts.in(new Template(["detection_H2O_bas"]));
            ts.out(new Tuple(["detection_H2O_haut"]));
            console.log("Arreter d'uliser d'utiliser la pompe");
        }
    }
}
