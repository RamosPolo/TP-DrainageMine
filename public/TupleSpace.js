import { Tuple } from './Tuple.js';

export class TupleSpace {
    constructor() {
        this.tuples = [];
        this.waitingQueue = [];
    }

    // Ajoute un tuple à l'espace de tuples
    out(tuple) {
        this.tuples.push(tuple);
        this._notifyWaiters();
    }

    // Récupère et retire un tuple qui correspond au template (bloquant)
    async in(template) {
        return new Promise((resolve) => {
            const checkForTuple = () => {
                for (let i = 0; i < this.tuples.length; i++) {
                    if (template.matches(this.tuples[i])) {
                        const tuple = this.tuples.splice(i, 1)[0];
                        resolve(tuple);
                        return;
                    }
                }
                // Si aucun tuple ne correspond, on attend
                this.waitingQueue.push(checkForTuple);
            };
            checkForTuple();
        });
    }

    // Récupère un tuple qui correspond au template sans le retirer (bloquant)
    async rd(template) {
        return new Promise((resolve) => {
            const checkForTuple = () => {
                for (const tuple of this.tuples) {
                    if (template.matches(tuple)) {
                        resolve(tuple);
                        return;
                    }
                }
                // Si aucun tuple ne correspond, on attend
                this.waitingQueue.push(checkForTuple);
            };
            checkForTuple();
        });
    }

    // Récupère et retire un tuple qui correspond au template (non bloquant)
    inp(template) {
        for (let i = 0; i < this.tuples.length; i++) {
            if (template.matches(this.tuples[i])) {
                return this.tuples.splice(i, 1)[0];
            }
        }
        return null;
    }

    // Récupère un tuple qui correspond au template sans le retirer (non bloquant)
    rdp(template) {
        for (const tuple of this.tuples) {
            if (template.matches(tuple)) {
                return tuple;
            }
        }
        return null;
    }

    // Crée un tuple actif et l'évalue de manière concurrente
    eval(activeTuple) {
        const evaluateFields = async () => {
            const evaluatedValues = await Promise.all(
                activeTuple.getValues().map(async (value) => {
                    if (typeof value === 'function') {
                        return await value();
                    }
                    return value;
                })
            );
            const passiveTuple = new Tuple(evaluatedValues);
            this.out(passiveTuple);
        };
        evaluateFields();
    }

    // Notifie les agents en attente
    _notifyWaiters() {
        while (this.waitingQueue.length > 0 && this.tuples.length > 0) {
            const waiter = this.waitingQueue.shift();
            waiter();
        }
    }
}
