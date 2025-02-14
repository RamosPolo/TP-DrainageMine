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


// Détection du franchissment à la hausse du niveau d'eau
export async function H2O_haut(ts, seuil_H20_haut){

    const templateDectectionH20Haut = new Template(["detection_H2O_haut"]);
    const templateNiveauH2O = new Template(["niveau_H2O"]);

    await ts.rd(templateDectectionH20Haut)

    const x = await ts.rd(templateNiveauH2O)

    if( x.values[1] >= seuil_H20_haut){
       ts.out(new Tuple(["H2O_haut_detecte"]))
       await ts.in(templateDectectionH20Haut)
       console.log("H2O élevé")
    } else {
        console.log("H2O correct", x.values[1])
    }
}
