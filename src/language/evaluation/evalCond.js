import { evalBloc } from './evalBloc.js';
import { evalExpr } from './evalExpr.js';
import { newScope, endScope } from '../variables.js';

export const evalCond = async (cond) => {
    if (!cond) {
        throw new Error("Condition is undefined");
    }
    switch (cond.type) {
        case 'cond':
            newScope();
            let stop = false;
            stop = await evalCond(cond.statement);
            if(cond.next && !stop) {
                stop = await evalCond(cond.next);
            }
            if(cond.last && stop) {
                stop = await evalCond(cond.last);
            }
            endScope();
            return stop;
        case 'IF':
            if (await evalExpr(cond.condition)) {
                await evalBloc(cond.statement);
                return true;
            }

            return false;
        case 'ELSE':
            await evalBloc(cond.statement);
            return true;
        case 'ELIF':
            if (await evalExpr(cond.condition)) {
                await evalBloc(cond.statement);
                return true;
            }
            if (cond.next) {
                return await evalCond(cond.next);
            }
            return false;
        default:
            throw new Error(`Unknown conditional type: ${cond.type}`);
    }
};
