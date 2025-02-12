import {Template} from '../Template.js'

let etatPompe = "off"

export async function AgentPompe(ts) {
    // Templates pour les valeurs de la pompe
    let tempActivPompe = new Template(["activation_pompe"]);
    let tempDesactivPompe = new Template(["desactivation_pompe"]);
    // tuples récupérés ou pas
    let valActive = ts.inp(tempActivPompe);
    let valDesac = ts.inp(tempDesactivPompe);

    console.log("AGENT POMPE ACTIF")

    // activation ou desactivation de la pompe
    if(valActive){
        console.log("activation de la pompe");
        etatPompe = "on"
    }
    if(valDesac){
        console.log("desactivation de la pompe");
        etatPompe = "off"
    }
}
