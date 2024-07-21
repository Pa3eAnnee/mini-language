import {evalExpr} from './evalExpr.js';

export const evalBloc = async (bloc) => {
    if (!bloc) {
        throw new Error("Bloc is undefined");
    }
    await evalExpr(bloc.statement);
    if (bloc.next) {
        await evalBloc(bloc.next);
    }
};