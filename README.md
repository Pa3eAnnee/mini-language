# Documentation du Mini-Langage

## Introduction

Bienvenue dans la documentation du Mini-Langage ! Ce langage a été conçu pour simplifier les opérations de manipulation et d'analyse de données, en particulier pour le traitement des pages web et le stockage de données dans des fichiers JSON et texte.

## Installation

Assurez-vous d'avoir Node.js installé sur votre machine. Clonez ensuite le dépôt du Mini-Langage et installez les dépendances :

```sh
git clone <url_du_dépôt>
cd <nom_du_dépôt>
npm install
```

## Utilisation
### Exécution d'un script
Pour exécuter un script, utilisez la commande suivante :

```sh
node src/main.js <chemin_du_script>
```

### Exemple de script

```js
data = getFrom("https://quotes.toscrape.com/");
filteredByTag = [];
filteredByAttr = [];
textContent = [];
filteredByAttrValue = [];
divs = [];
splitted = [];
joined = [];
isDiv = [];
hasClassAttr = [];
isContainer = [];

for (i = 0; i < length(data); i = i + 1) {
    html = getHtml(data[i]);
    push(filteredByTag, onlyTag(html, "h1"));
    push(filteredByAttr, onlyHasAttr(filteredByTag[i], "href"));
    push(textContent, extractContent(filteredByAttr[i]));
    push(filteredByAttrValue, onlyIsAttr(filteredByAttr[i], "href", "/"));
    push(divs, onlyTag(html, "div"));
    push(splitted, splitHtml(divs[i]));
    for (j = 0; j < length(splitted[i]); j = j + 1) {
        if (isTag(splitted[i][j], "div")) {
            push(isDiv, splitted[i][j]);
            if (hasAttr(splitted[i][j], "class")) {
                push(hasClassAttr, splitted[i][j]);
            }
            if (isAttr(splitted[i][j], "class", "container")) {
                push(isContainer, splitted[i][j]);
            }
        }
    }
    push(joined, joinHtml(splitted[i]));
}

obj = createObject();
setProperty(obj, "name", "Quotes");
setProperty(obj, "url", "https://quotes.toscrape.com/");
saveAsJson(obj, "output.json");

str = "Hello, ";
str2 = "World!";
greeting = concat(str, str2);
substring_greeting = substring(greeting, 0, 5);
replaced_greeting = replace(greeting, "World", "Mini-Language");
saveAsText(replaced_greeting, "greeting.txt");
```

## Syntaxe et Fonctions
### Opérateurs de base
- `+`, `-`, `*`, `/`
- `<`, `>`, `<=`, `>=`, `==`, `!=`
- `&&`, `||`, `!`

### Manipulation de données
- `length(array)`: Retourne la longueur d'un tableau.
- `getFrom(url)`: Récupère les données d'une URL.
- `onlyTag(array, tag)`: Filtre les éléments contenant un tag spécifique.
- `onlyHasAttr(array, attr)`: Filtre les éléments ayant un attribut spécifique.
- `onlyIsAttr(array, attr, value)`: Filtre les éléments ayant un attribut avec une valeur spécifique.
- `onlyContainsText(array, text)`: Filtre les éléments contenant un texte spécifique.
- `extractContent(array)`: Extrait le contenu texte des éléments.
- `splitHtml(array)`: Divise le HTML en sous-éléments.
- `joinHtml(array)`: Joint les sous-éléments HTML en une chaîne.
- `getHtml(page)`: Retourne le HTML d'une page.
- `getUrl(page)`: Retourne l'URL d'une page.
- `isTag(element, tag)`: Vérifie si un élément est d'un type de tag spécifique.
- `hasAttr(element, attr)`: Vérifie si un élément possède un attribut spécifique.
- `isAttr(element, attr, value)`: Vérifie si un attribut d'un élément a une valeur spécifique.
- `containsText(element, text)`: Vérifie si un élément contient un texte spécifique.

### Manipulation de chaînes de caractères
- `concat(string1, string2)`: Concatène deux chaînes de caractères.
- `substring(string, start, end)`: Extrait une sous-chaîne d'une chaîne.
- `replace(string, searchValue, replaceValue)`: Remplace une sous-chaîne par une autre dans une chaîne.

### Manipulation de tableaux
- `push(array, value)`: Ajoute un élément à la fin d'un tableau.
- `pop(array)`: Retire et retourne le dernier élément d'un tableau.
- `shift(array)`: Retire et retourne le premier élément d'un tableau.
- `unshift(array, value)`: Ajoute un élément au début d'un tableau.
- `insert(array, index, value)`: Insère un élément à un index spécifique dans un tableau.
- `remove(array, index)`: Retire l'élément à un index spécifique dans un tableau.
- `arrayContains(array, value)`: Vérifie si un tableau contient une valeur spécifique.

### Création et manipulation d'objets
- `createObject()`: Crée un nouvel objet vide.
- `setProperty(object, key, value)`: Définit une propriété d'un objet.
- `getProperty(object, key)`: Retourne la valeur d'une propriété d'un objet.

### Sauvegarde de données
- `saveAsJson(data, filePath)`: Sauvegarde des données au format JSON dans un fichier.
- `saveAsText(data, filePath)`: Sauvegarde des données au format texte dans un fichier.

## Structures de contrôle
### Conditionnelles
```js
if (condition) {
    // Code à exécuter si la condition est vraie
} else if (condition) {
    // Code à exécuter si la condition else_if est vraie
} else {
    // Code à exécuter si aucune des conditions précédentes n'est vraie
}
```

### Boucles
#### For
```js
for (initialisation; condition; incrémentation) {
    // Code à exécuter
}
```

#### While
```js
while (condition) {
    // Code à exécuter
}
```

## Exemple complet
```js
data = getFrom("https://quotes.toscrape.com/");
filteredByTag = [];
filteredByAttr = [];
textContent = [];
filteredByAttrValue = [];
divs = [];
splitted = [];
joined = [];
isDiv = [];
hasClassAttr = [];
isContainer = [];

for (i = 0; i < length(data); i = i + 1) {
    html = getHtml(data[i]);
    push(filteredByTag, onlyTag(html, "h1"));
    push(filteredByAttr, onlyHasAttr(filteredByTag[i], "href"));
    push(textContent, extractContent(filteredByAttr[i]));
    push(filteredByAttrValue, onlyIsAttr(filteredByAttr[i], "href", "/"));
    push(divs, onlyTag(html, "div"));
    push(splitted, splitHtml(divs[i]));
    for (j = 0; j < length(splitted[i]); j = j + 1) {
        if (isTag(splitted[i][j], "div")) {
            push(isDiv, splitted[i][j]);
            if (hasAttr(splitted[i][j], "class")) {
                push(hasClassAttr, splitted[i][j]);
            }
            if (isAttr(splitted[i][j], "class", "container")) {
                push(isContainer, splitted[i][j]);
            }
        }
    }
    push(joined, joinHtml(splitted[i]));
}

obj = createObject();
setProperty(obj, "name", "Quotes");
setProperty(obj, "url", "https://quotes.toscrape.com/");
saveAsJson(obj, "output.json");

str = "Hello, ";
str2 = "World!";
greeting = concat(str, str2);
substring_greeting = substring(greeting, 0, 5);
replaced_greeting = replace(greeting, "World", "Mini-Language");
saveAsText(replaced_greeting, "greeting.txt");
```

## Conclusion
Ce mini-langage offre une variété d'outils pour manipuler les données web et les sauvegarder dans des formats populaires. Utilisez cette documentation comme guide pour explorer les différentes fonctionnalités et les appliquer à vos propres projets.
