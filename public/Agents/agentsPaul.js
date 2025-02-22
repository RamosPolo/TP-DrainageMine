import { Template } from '../Template.js'
import { Tuple } from "../Tuple.js";

export async function Pompe(ts) {
    let tempActivPompe = new Template(["activation_pompe"]);
    let tempDesactivPompe = new Template(["desactivation_pompe"]);

    let valActive = await ts.inp(tempActivPompe);
    let valDesac = await ts.inp(tempDesactivPompe);

    if (valActive != null) {
        console.log("Agent_Pompe : Activation de la pompe");
        return "on"; 
    }

    if (valDesac != null) {
        console.log("Agent_Pompe : Désactivation de la pompe");
        return "off"; 
    }
}




export async function Commande_Pompe_Ventilateur(ts, seuil_CH4, seuil_CO) {
    let tempH20_haut_detecte = new Template(["H2O_haut_detecte"]);

    const H20_haut_detecte = await ts.in(tempH20_haut_detecte);

    let tempNiveau_CH4 = new Template(["niveau_CH4"]);
    const y = await ts.rd(tempNiveau_CH4);      // valeur du niveau de gaz CH4

    let tempNiveau_CO = new Template(["niveau_CO"]);
    const z = await ts.rd(tempNiveau_CO);        // valeur du niveau de CO

    if (y.values[1] < seuil_CH4 && z.values[1] < seuil_CO) {
        ts.out(new Tuple(["activation_pompe"]));
        ts.out(new Tuple(["detection_H2O_bas"]));
        ts.out(new Tuple(["detection_gaz_haut"]));
    }
    if (y.values[1] >= seuil_CH4 || z.values[1] >= seuil_CO) {
        console.log("Agent Commande_Pompe : Activation du ventilateur");
        ts.out(new Tuple(["activation_ventilateur"]));
        ts.out(new Tuple(["detection_gaz_bas"]));
    }

}

export async function Gaz_bas(ts, seuil_CH4, seuil_CO) {

    // detection de gaz bas
    const templateDetectionGazBas = new Template(["detection_gaz_bas"]);
    const detectGazBas = await ts.rd(templateDetectionGazBas);

    // valeurs du niveau
    let templateNiveauCH4 = new Template(["niveau_CH4"]);
    const y = await ts.rd(templateNiveauCH4);

    let templateNiveauCO = new Template(["niveau_CO"]);
    const z = await ts.rd(templateNiveauCO);

    if (y.values[1] < seuil_CH4 && z.values[1] < seuil_CO) {
        ts.out(new Tuple(["activation_pompe"]));
        ts.out(new Tuple(["detection_H2O_bas"]));
        await ts.in(new Template(["detection_gaz_bas"]));
    }
    if (y.values[1] >= seuil_CH4 || z.values[1] >= seuil_CO) {
        // rien
    }
}
