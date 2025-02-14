import { TupleSpace } from "../TupleSpace.js";
import { Tuple } from "../Tuple.js";
import { Template } from "../Template.js";

export function ventilateurAgent(ts, etat) {
    const templateActivationVentilateur = new Template(["activation-ventilateur"]);
    const templateDesactivationVentilateur = new Template(["désactivation-ventilateur"]);
    const actVentTuple = ts.inp(templateActivationVentilateur);
    if(actVentTuple){
        console.log("ventilateur actif")
    }
    const desVentTuple = ts.inp(templateDesactivationVentilateur);
    if(desVentTuple){
        console.log("ventilateur non_actif")
    }
}


export async function H20_haut(){

}
