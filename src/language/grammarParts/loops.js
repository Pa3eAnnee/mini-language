export const loops = {
    
    loop: [
        ['for', '$$ = {type: "loop", loop: $1};'],
        ['while', '$$ = {type: "loop", loop: $1};'],
    ],

    for: [
        ['FOR ( statement ; expression ; statement ) { bloc }', '$$ = { type: "FOR", init: $3, condition: $5, increment: $7, statement: $10 };']
    ],
    while: [
        ['WHILE ( expression ) { bloc }', '$$ = { type: "WHILE", condition: $3, statement: $6 };']
    ]
}