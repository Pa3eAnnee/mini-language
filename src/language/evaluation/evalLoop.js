import { evalExpr } from './evalExpr.js';
import { evalBloc } from './evalBloc.js';
import { newScope, endScope } from '../variables.js';

export const evalLoop = async (loop) => {
    if(!loop) {
        throw new Error('Loop is undefined');
    }
    switch(loop.type) {
        case 'loop':
            newScope();
            return await evalLoop(loop.loop);
        case 'FOR':
            await evalExpr(loop.init);
            while(await evalExpr(loop.condition)) {
                await evalBloc(loop.statement);
                await evalExpr(loop.increment);
            }
            endScope();
            return true;
        case 'WHILE':
            while(await evalExpr(loop.condition)) {
                await evalBloc(loop.statement);
            }
            endScope();
            return true;
    }
    return false;
}