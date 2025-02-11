import {Tuple} from "./Tuple";
import {Template} from "./Template";

type Waiter = () => void;

export class TupleSpace {
    private tuples: Tuple[];
    private waitingQueue: Waiter[];

    constructor() {
        this.tuples = [];
        this.waitingQueue = [];
    }

    out(tuple: Tuple): void {
        this.tuples.push(tuple);
        this._notifyWaiters();
    }

    async in(template: Template): Promise<Tuple> {
        return new Promise((resolve) => {
            const checkForTuple = () => {
                for (let i = 0; i < this.tuples.length; i++) {
                    if (template.matches(this.tuples[i])) {
                        const tuple = this.tuples.splice(i, 1)[0];
                        resolve(tuple);
                        return;
                    }
                }
                this.waitingQueue.push(checkForTuple);
            };
            checkForTuple();
        });
    }

    async rd(template: Template): Promise<Tuple> {
        return new Promise((resolve) => {
            const checkForTuple = () => {
                for (const tuple of this.tuples) {
                    if (template.matches(tuple)) {
                        resolve(tuple);
                        return;
                    }
                }
                this.waitingQueue.push(checkForTuple);
            };
            checkForTuple();
        });
    }

    inp(template: Template): Tuple | null {
        for (let i = 0; i < this.tuples.length; i++) {
            if (template.matches(this.tuples[i])) {
                return this.tuples.splice(i, 1)[0];
            }
        }
        return null;
    }

    rdp(template: Template): Tuple | null {
        for (const tuple of this.tuples) {
            if (template.matches(tuple)) {
                return tuple;
            }
        }
        return null;
    }

    eval(activeTuple: Tuple): void {
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

    private _notifyWaiters(): void {
        while (this.waitingQueue.length > 0 && this.tuples.length > 0) {
            const waiter = this.waitingQueue.shift();
            if (waiter) {
                waiter();
            }
        }
    }
}
