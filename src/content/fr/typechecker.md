---
title: Algorithme d'inférence de types
description: Un guide étape par étape pour mettre en œuvre l'inférence de types à partir de zéro dans un langage de programmation fonctionnelle.
date: 2021-07-01
author: Thomas Vergne
image: /articles/typechecker.webp
---

Dans les langages modernes, nombreux sont ceux qui font appel à des solutions de typage strictes pour garantir à minima la sécurité des applications développées. Ces solutions sont souvent basées sur des algorithmes robustes et éprouvés, tels que l'algorithme de Hindley-Milner.

Cet article se propose de vous guider pas à pas dans la mise en œuvre d'un algorithme d'inférence de types, en utilisant un langage de programmation fonctionnel comme exemple.

## Notre langage

Nous allons utiliser le langage suivant pour illustrer notre algorithme d'inférence de types :

```bnf
<program> ::= <expr>*

<expr>    ::= <int>
           |  <bool>
           |  <var>
           |  <expr> <expr>
           |  if <expr> then <expr> else <expr>
           |  let x = <expr> in <expr>
           |  fun x -> <expr>

<int>     ::= [0-9]+
<bool>    ::= true | false
<var>     ::= [a-zA-Z_][a-zA-Z0-9_]*
```

Quelques notions de cette grammaire sont à expliciter pour ceux n'ayant jamais pratiqué de programmation fonctionnelle traditionnelle :
- `let x = <expr> in <expr>` : permet de définir une variable `x` dans le scope de l'expression suivante. Cela permet de séquencer des expressions et des définitions de variables à la fois.
- `fun x -> <expr>` : permet de définir une fonction anonyme prenant un argument `x` et retournant l'expression `<expr>`.
- `if <expr> then <expr> else <expr>` : permet de faire une conditionnelle, en retournant l'expression `<expr>` si la première expression est vraie, et l'autre sinon.
- `<expr> <expr>` : permet d'appliquer une fonction à un argument. Par exemple, `f x` appliquera la fonction `f` à l'argument `x`. Voyez cela comme si l'on avait `f(x)` dans d'autres langages. Dans le cas où nous avons `f x y`, cela signifie grosso modo que nous avons `f(x)(y)` dans d'autres langages.

## Types

Il est temps désormais de définir ce que sont les types dans notre langage. Nous allons définir une grammaire pour les types, qui nous permettra de représenter les types de nos expressions.

```bnf
<type> ::= int
        |  bool
        |  <var>
        |  <type> -> <type>

<var> ::= [a-zA-Z_][a-zA-Z0-9_]*
```
Nous avons volontairement défini un ensemble de types relativement simple afin de faciliter la compréhension des concepts. Ici, nous avons :
- `int` : le type entier
- `bool` : le type booléen
- `<var>` : un type générique, qui peut être utilisé pour représenter n'importe quel type
- `<type> -> <type>` : un type fonction, qui prend un argument de type `<type>` et retourne un résultat de type `<type>`. Par exemple, `int -> bool` est le type d'une fonction prenant un entier et retournant un booléen.

## Type généralisé

Un type généralisé est un type quantifié par aucune, une ou plusieurs variables. On le note généralement de la façon qui suit :

$$
\forall \alpha^k . \tau^k
$$

C'est sûrement incompréhensible pour vous, mais ne vous inquiétez pas, nous allons le voir en détail :

- le symbole $\forall$ est le quantificateur universel, qui signifie que la variable qui suit peut prendre n'importe quelle valeur.
- $\alpha^k$ est une variable de type, qui peut être utilisée pour représenter n'importe quel type, la puissance $k$ signifie que cette variable peut être déclinée en $k$ types différents. Grosso modo, elle sert à représenter une multitudes de variables dans le quantificateur.
- $\tau^k$ est un type, qui peut être utilisé pour représenter n'importe quel type, la puissance $k$ signifie que ce type utilise au moins $k$ variables de type. Grosso modo, il s'agit du type qui sera retourné par la fonction.

## Environnement

Pour typechecker nos programmes, nous avons le besoin de définir un environnement qui associe des variables à leur type généralisé.

Nous allons le définir comme une fonctio finie qui prend en entrée une variable et retourne son type généralisé :

$$
\text{VE} : x \mapsto \forall \alpha^k . \tau^k
$$

$\text{VE}$ signifie "Value Environment", c'est-à-dire l'environnement de nos valeurs et plus précisément ici, de nos variables.

## Nos règles de typechecking
