export const conditionals = {
        conditional: [
            ['if', '$$ = { type: "cond", statement: $1, next: null, last: null};'],
            ['if else', '$$ = { type: "cond", statement: $1, next: $2, last:null};'],
            ['if else_if', '$$ = { type: "cond", statement: $1, next: $2, last: null};'],
            ['if else_if else', '$$ = { type: "cond", statement: $1, next: $2, last: $3};']
        ],
        if: [
            ['IF ( expression ) { bloc }', '$$ = { type: "IF", condition: $3, statement: $6 };']
        ],
        else: [
            ['ELSE { bloc }', '$$ = { type: "ELSE", statement: $3 };']
        ],
        else_if: [
            ['ELIF ( expression ) { bloc }', '$$ = { type: "ELIF", condition: $3, statement: $6, next: null };'],
            ['ELIF ( expression ) { bloc } else_if', '$$ = { type: "ELIF", condition: $3, statement: $6, next: $7 };']
        ],
}