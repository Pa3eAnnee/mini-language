import Jison from 'jison';
import { lexer } from './lexer.js';
import { expressions, conditionals, loops } from './grammarParts/index.js';

const { Parser } = Jison;

const grammar = {
    lex: {
        rules: lexer
    },
    start: 'program',
    operators: [
        ['left', '||'],
        ['left', '&&'],
        ['left', '==', '!='],
        ['left', '<=', '>=', '<', '>'],
        ['left', '+', '-'],
        ['left', '*', '/'],
        ['right', '!'],
        ['right', '[', ']'], // Priorité plus haute pour les accès aux tableaux
        ['right', '=']
    ],
    bnf: {
        program: [
            ['bloc EOF', 'return $1;']
        ],
        bloc: [
            ['delimited_statement bloc', '$$= {type: "BLOC", statement: $1, next: $2};'],
            ['delimited_statement', '$$= {type: "BLOC", statement: $1, next: null};']
        ],
        delimited_statement: [
            ['statement ;', '$$ = $1;'],
            ['conditional', '$$ = $1;'],
            ['loop', '$$ = $1;']
        ],
        statement: [
            ['VARNAME = expression', '$$ = { type: "ASSIGN", name: $1, value: $3 };'],
            ['e [ e ] = expression', '$$ = { type: "ARRAY_ASSIGN", array: $1, index: $3, value: $6 };'], // Assignation aux éléments des tableaux
            ['PUSH ( e , e )', '$$ = { type: "PUSH", array: $3, value: $5 };'],
            ['POP ( e )', '$$ = { type: "POP", array: $3 };'],
            ['SHIFT ( e )', '$$ = { type: "SHIFT", array: $3 };'],
            ['UNSHIFT ( e , e )', '$$ = { type: "UNSHIFT", array: $3, value: $5 };'],
            ['INSERT ( e , e , e )', '$$ = { type: "INSERT", array: $3, value: $5, index: $7 };'],
            ['REMOVE ( e , e )', '$$ = { type: "REMOVE", array: $3, index: $5 };'],
            ['SET_PROPERTY ( e , e , e )', '$$ = { type: "SET_PROPERTY", object: $3, key: $5, value: $7 };'],
            ['SAVE_AS_JSON ( e , STRING )', '$$ = { type: "SAVE_AS_JSON", data: $3, filePath: $5 };'],
            ['SAVE_AS_TEXT ( e , STRING )', '$$ = { type: "SAVE_AS_TEXT", data: $3, filePath: $5 };']
        ],
        ...loops,
        ...conditionals,
        ...expressions
    }
};

export const parser = new Parser(grammar);
