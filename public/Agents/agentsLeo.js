import { TupleSpace } from "../TupleSpace.js";
import { Tuple } from "../Tuple.js";
import { Template } from "../Template.js";

export function ventilateurAgent(ts, etat) {
    const templateActivationVentilateur = new Template(["activation_ventilateur"]);
    const templateDesactivationVentilateur = new Template(["desactivation_ventilateur"]);
    const actVentTuple = ts.inp(templateActivationVentilateur);
    if(actVentTuple){
        console.log("ventilateur actif")
    }
    const desVentTuple = ts.inp(templateDesactivationVentilateur);
    if(desVentTuple){
        console.log("ventilateur non_actif")
    }
}

// Détection du franchissment haut de l'eau
export async function H2O_haut(ts, seuil_H20_haut) {
    const templateDectectionH20Haut = new Template(["detection_H2O_haut"]);
    const templateNiveauH2O = new Template(["niveau_H2O"]);

    await ts.rd(templateDectectionH20Haut);

    const x = await ts.rd(templateNiveauH2O);

    if (x.values[1] >= seuil_H20_haut) {
        console.log("avant H2O élevé");
        ts.out(new Tuple(["H2O_haut_detecte"]));
        // await ts.in(new Template(["detection_H2O_haut"])); // recherche infini attendre la creation de l'agent H2O_bas
        console.log("H2O élevé");
    } else {
        console.log("H2O correct", x.values[1]);
    }
}



// Détection du franchissment à la hausse du niveau pour au moins un des deux gaz
export async function Surveillance_gaz_haut(ts, seuil_CH4, seuil_CO) {
    const templateDectectionGazHaut = new Template(["detection_gaz_haut"]);
    const templateNiveauCH4 = new Template(["niveau_CH4"]);
    const templateNiveauCO = new Template(["niveau_CO"]);

    const detectionGazHautTuple = await ts.rdp(templateDectectionGazHaut);

    // Récupère les niveaux de gaz sans bloquer
    const y = await ts.rd(templateNiveauCH4);
    console.log("Niveau CH4: ", y.values[1]);

    const z = await ts.rd(templateNiveauCO);
    console.log("Niveau CO: ", z.values[1]);

    if (y.values[1] < seuil_CH4 && z.values[1] < seuil_CO) {
        console.log("Ok : Les deux gaz sont en dessous des seuils");
    } else {
        console.log("Au moins un des deux gaz est au-dessus des seuils");
        ts.out(new Tuple(["activation_ventilateur"]));
        await ts.in(new Template(["detection_gaz_haut"]));
    }
}




