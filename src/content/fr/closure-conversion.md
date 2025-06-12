---
title: Gérer la closure conversion non typée
description: Un guide étape par étape pour mettre en œuvre la conversion de closure non typée dans un langage de programmation fonctionnel.
date: 2021-07-01
author: Thomas Vergne
image: /articles/closure-conversion.webp
---

Comment représenter les closures dans un langage de programmation ? Qu'est-ce qu'une closure tout d'abord ? Pourquoi devrait-on s'en soucier ? 

Nous allons répondre à ces questions en implémentant la conversion de closure non typée (autrement appelée _untyped closure conversion_) dans un langage de programmation fonctionnel.

## Qu'est-ce qu'une closure ?

Une closure est une fonction qui capture d'une manière ou d'une autre un environnement :

```ts
export function makeCounter() {
  let count = 0;
  return function() {
    count += 1;
    return count;
  };
}
```

Dans la fonction `makeCounter`, nous avons une variable `count` qui est capturée par la fonction retournée. Chaque fois que nous appelons cette fonction, elle accède à la variable `count` et l'incrémente.

Pour notre cas, nous considérons que les closures ne sont pas forcément obligées de capturer des variables. Puisque dans certains cas, elles peuvent être utilisées sans capturer d'environnement :

```ts
export function add() {
  return function(a: number, b: number) {
    return a + b;
  };
}
```

Dans cet exemple, la closure retournée par `add` n'a pas besoin de capturer quoi que ce soit. Elle est simplement une fonction qui additionne deux nombres.

## Importance de l'algorithme

Dans tout langage moderne, on se retrouve avec la nécessité de représenter des closures. On pourrait procéder comme en C en passant des pointeurs de fonction, mais cela ne permet pas de capturer l'environnement, du moins pas de manière simple.

De plus, on peut ne pas vouloir de fonctions nestées. Ces dernières accroissent la complexité et impactent négativement les performances de l'exécution. En effet, le but ici est d'optimiser les fonctions anonymes et closures afin de les rendre comme des fonctions top-level normales.

Dans certains cas, on se retrouve même obligé d'avoir une passe comme celle-ci pour pouvoir représenter les closures. C'est le cas lorsqu'on compile vers un langage qui ne supporte pas les closures, comme C.

## Comment ça marche ?

Pour établir l'algorithme de closure conversion, nous allons avoir besoins d'états pour :

1. le compteur de nouvelles closures converties.
2. un map des noms des variables globales vers leur arité.
3. un map des noms des fonctions externes vers leur arité.
4. un set des variables locales à une fonction.

Globalement, l'algorithme va fonctionner de la manière suivante :

1. On va parcourir l'arbre syntaxique de la fonction.

2. Pour chaque closure rencontrée, on va :
    - Établir la liste des variables libres dans le corps de la closure (pour savoir quelles variables elle capture).
    - Retirer les arguments de la closure des variables globales et fonctions externes (pour éviter les collisions de noms).
    - Établir l'environnement de la closure en utilisant les variables libres en retirant les variables déterminées par l'étape précédente, les arguments de la closure et les potentiels noms réservés (par exemple le nom de la closure s'il s'agit d'une closure nommée).
    - Convertir le corps de la closure en ajoutant aux variables locales, les arguments de la closure.
    - Enfin, on va destructurer l'environnement de la closure en une liste de variables locales et on va créer une nouvelle fonction avec ces variables locales comme définitions dans le corps de la fonction.
    - Pour finir, on crée une nouvelle liste avec en première position la nouvelle closure créée et en seconde position l'environnement de la closure, lui-même sous forme de liste de variables locales.

Globalement, les étapes de l'algorithme ressemblent à ceci :

```ts
export function func(a: number) {
  return function(b: number) {
    return a + b;
  };
}
```

se transforme d'abord en :

```ts
export function func(a: number) {
  return function(b: number, env) {
    const [a] = env;
    return a + b;
  };
}
```

Puis, on va créer une nouvelle closure avec les variables locales :

```ts
export function func(a: number) {
  return [
    function(b: number, env) {
      const [a] = env;
      return a + b;
    },
    [a]
  ];
}
```

Enfin, on va placer la closure empactée au top-level :

```ts
export function func(a: number) {
  return [funcClosure, [a]];
}

function funcClosure(b: number, env) {
  const [a] = env;
  return a + b;
}
```

Et voilà, nous avons converti une closure en une fonction top-level avec un environnement passé en argument.

## Conclusion

En appliquant cet algorithme de manière récursive sur l'arbre syntaxique du programme, on peut ainsi convertir assez simplement les closures en fonctions top-level. Cela permet de simplifier la représentation des closures et de les rendre plus performantes dans l'exécution.

Cette technique est particulièrement utilisée dans les compilateurs pour des langages qui compilent vers des supports relativement bas niveau. Dans une VM par exemple, on peut ainsi se débarasser de toutes les fonctions nestées, en plus de ne plus devoir tracker les environnements de closure. 

On pourrait maintenant aller plus loin en intégrant et en préservant les types des variables capturées, mais cela nécessiterait l'introduction de nouveaux types plus complexes tels que les types existentiels (comme : $\exists \alpha. \ \tau$)