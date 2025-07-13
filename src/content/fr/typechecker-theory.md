---
title: "Algorithme d'inférence de types : la théorie"
description: Un guide étape par étape pour mettre en œuvre l'inférence de types à partir de zéro dans un langage de programmation fonctionnelle.
date: 2021-07-01
author: Thomas Vergne
image: /articles/typechecker-theory.webp
color: white
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

On peut d'ores et déjà le traduire dans notre langage source, Haskell, en utilisant l'énumération suivante :

```hs
data Expr
  = Int Int
  | Bool Bool
  | Var String
  | App Expr Expr
  | If Expr Expr Expr
  | Let String Expr Expr
  | Fun String Expr
  deriving (Show, Eq)
```

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

On peut de même traduire encore une fois cela en Haskell, en utilisant l'énumération suivante :

```hs
data Type
  = TInt
  | TBool
  | TVar String
  | TFun Type Type
  deriving (Show, Eq)
```

## Type généralisé

Un type généralisé est un type quantifié par aucune, une ou plusieurs variables. On le note généralement de la façon qui suit :

$$
\forall \alpha^k . \tau^k
$$

C'est sûrement incompréhensible, mais ne vous inquiétez pas, nous allons le voir en détail :

- le symbole $\forall$ est le quantificateur universel, qui signifie que la variable qui suit peut prendre n'importe quelle valeur.
- $\alpha^k$ est une variable de type, qui peut être utilisée pour représenter n'importe quel type, la puissance $k$ signifie que cette variable peut être déclinée en $k$ types différents. Grosso modo, elle sert à représenter une multitudes de variables dans le quantificateur.
- $\tau^k$ est un type, qui peut être utilisé pour représenter n'importe quel type, la puissance $k$ signifie que ce type utilise au moins $k$ variables de type. Grosso modo, il s'agit du type qui sera retourné par la fonction.

Pour notre code, on l'encodera de la façon suivante :

```hs
data Scheme
  = Forall [String] Type
  deriving (Show, Eq)
```

## Environnement

Pour typechecker nos programmes, nous avons le besoin de définir un environnement qui associe des variables à leur type généralisé.

Nous allons le définir comme une fonction finie qui prend en entrée une variable et retourne son type généralisé :

$$
\text{VE} : x \mapsto \forall \alpha^k . \tau^k
$$

$\text{VE}$ signifie "Value Environment", c'est-à-dire l'environnement de nos valeurs et plus précisément ici, de nos variables.

Dans notre code, cela correspondra a un map associant des variables à leur type généralisé :

```hs
type Env = Map String Scheme
```

## Nos règles de typechecking

Il est important de comprendre ce que nous allons réellement typer, et plus particulièrement inférer. Pour ce fait, nous nous devons de définir un ensemble de règles de typechecking, qui nous permettront de vérifier si une expression est bien typée ou non.

### Variables

Dans un premier temps, définissons la règle de typage pour nos variables :

$$
\frac{x : \sigma \in \text{VE} \qquad \sigma \sqsubseteq \tau}{\text{VE} \vdash x : \tau}
$$

Pour mieux comprendre cette règle, décortiquons-la : 

Il faut lire le trait de cette règle comme un "si ... alors ..." où la condition est en haut et la conclusion en bas.

La condition est que la variable $x$ doit être présente dans l'environnement $\text{VE}$, et doit avoir le type généralisé $\sigma$. De plus, cette règle nous impose que le type généralisé $\sigma$ soit un type plus général que le type $\tau$. La notion de "plus général" est très importante, car elle nous permet de dire que $\tau$ est un type plus spécifique que $\sigma$ ou équivalent. 

Par exemple `int -> int` est plus spécifique que `a -> a`, car il ne peut être utilisé que pour des fonctions prenant un entier et retournant un entier. En revanche, `a -> a` peut être utilisé pour n'importe quel type, donc il est plus général.

La conclusion est que l'on peut dire que l'environnement $\text{VE}$ est bien typé pour la variable $x$ et le type $\tau$.

### Application

La règle d'application est la suivante :

$$
\frac{\text{VE} \vdash f : \tau \to \tau' \qquad \text{VE} \vdash x : \tau }{ \text{VE} \vdash f \ x : \tau' }
$$

Cette fois-ci, nous avons deux conditions :
1. L'environnement $\text{VE}$ doit être bien typé pour la variable $f$ et le type $\tau \to \tau'$. Cela signifie que $f$ est une fonction prenant un argument de type $\tau$ et retournant un résultat de type $\tau'$.
2. L'environnement $\text{VE}$ doit être bien typé pour la variable $x$ et le type $\tau$. Cela signifie que $x$ est un argument de type $\tau$.

La conclusion est que l'on peut dire que l'environnement $\text{VE}$ est bien typé pour l'application de la fonction $f$ à l'argument $x$, et que le résultat de cette application est de type $\tau'$.

Cela permet de vérifier que l'on peut bien appliquer une fonction à un argument, et que le résultat de cette application est bien typé.

### Conditionnelle

La règle de la conditionnelle est la suivante :
$$
\frac{\text{VE} \vdash e_1 : \tau \qquad \tau \sqsubseteq \text{TBool} \qquad \text{VE} \vdash e_2 : \tau' \qquad \text{VE} \vdash e_3 : \tau'}{\text{VE} \vdash \text{if}\ e_1\ \text{then}\ e_2\ \text{else}\ e_3 : \tau'}
$$

Maintenant compte de la conditionnelle, nous avons trois conditions :
1. L'environnement $\text{VE}$ doit être bien typé pour la variable $e_1$ et le type $\tau$. Cela signifie que $e_1$ est une expression de type $\tau$.
2. Le type $\tau$ doit être un type booléen. Cela signifie que $e_1$ est une expression booléenne.
3. L'environnement $\text{VE}$ doit être bien typé pour la variable $e_2$ et le type $\tau'$. Cela signifie que $e_2$ est une expression de type $\tau'$.
4. L'environnement $\text{VE}$ doit être bien typé pour la variable $e_3$ et le type $\tau'$. Cela signifie que $e_3$ est une expression de type $\tau'$.

La conclusion est que l'on peut dire que l'environnement $\text{VE}$ est bien typé pour la conditionnelle, et que le résultat de cette conditionnelle est de type $\tau'$.

### Déclaration de variable

La règle de la déclaration de variable est la suivante :

$$
\frac
  {\text{VE} \vdash e_1 : \tau \qquad \text{VE}, x : \text{GEN}(\tau) \vdash e_2 : \tau' }
  {\text{VE} \vdash \text{let}\ x = e_1\ \text{in}\ e_2 : \tau'}
$$

Un peu plus complexe que les précédentes, cette règle a pour but de vérifier que l'on peut bien déclarer une variable dans un environnement donné.
Nous avons deux conditions :
1. L'environnement $\text{VE}$ doit être bien typé pour la variable $e_1$ et le type $\tau$. Cela signifie que $e_1$ est une expression de type $\tau$.
2. Étant donné l'environnement $\text{VE}$, on doit être capable d'inclure en plus dans cet environnement la variable $x$ et son type généralisé $\text{GEN}(\tau)$. Cela signifie que l'on doit être capable de généraliser le type $\tau$ pour la variable $x$.
3. L'environnement $\text{VE}$ doit être bien typé pour la variable $e_2$ et le type $\tau'$. Cela signifie que $e_2$ est une expression de type $\tau'$.

La conclusion est que l'on peut dire que l'environnement $\text{VE}$ est bien typé pour la déclaration de variable, et que le résultat de cette déclaration est de type $\tau'$.

Ici, la fonction $\text{GEN}$ est une fonction qui permet de généraliser un type, c'est-à-dire de le transformer en un type généralisé. Par exemple, si l'on a un type `a -> a`, et qu'il n'y a pas d'autres variables de type `a` dans l'environnement, on peut le généraliser en $\forall \alpha . \alpha \to \alpha$. Cela signifie que le type est valable pour n'importe quel type $\alpha$.

On définit plus précisément la fonction $\text{GEN}$ comme suit :
$$
\text{GEN}(\tau) = \forall \alpha^k . \tau^k
\alpha^k = \text{FV}(\tau) \setminus \text{FV}(\text{VE})
$$

Où $\text{FV}(\tau)$ est l'ensemble des types (resp. variables) libres de $\tau$ et $\text{FV}(\text{VE})$ est l'ensemble des types (resp. variables) libres de l'environnement $\text{VE}$.
Cela signifie que l'on doit être capable de généraliser le type $\tau$ pour toutes les types (resp. variables) libres de $\tau$ qui ne sont pas présentes dans l'environnement $\text{VE}$.

On définit la fonction $\text{FV}$ comme suit :
$$
\text{FV}(\tau) = \begin{cases}
  \emptyset & \text{si } \tau \text{ est un type de base} \\
  \{x\} & \text{si } \tau = x \\
  \text{FV}(\tau_1) \cup \text{FV}(\tau_2) & \text{si } \tau = (\tau_1 \to \tau_2)
\end{cases}
$$

### Fonction anonyme

En dernier lieu, la règle de la fonction anonyme est la suivante :

$$
\frac
  {\text{VE}, x : \tau \vdash e : \tau'}
  {\text{VE} \vdash \text{fun}\ x \to e : \tau \to \tau'}
$$

Avec toutes ces règles, nous pouvons désormais mieux comprendre cette dernière qui nous permet de vérifier que l'on peut bien déclarer une fonction anonyme dans un environnement donné.
Nous avons deux conditions :
1. Étant donné l'environnement $\text{VE}$, on doit être capable d'inclure en plus dans cet environnement la variable $x$ et son type $\tau$. Cela signifie que l'on doit être capable de généraliser le type $\tau$ pour la variable $x$.
2. L'environnement $\text{VE}$ doit être bien typé pour la variable $e$ et le type $\tau'$. Cela signifie que $e$ est une expression de type $\tau'$.

La conclusion est que l'on peut dire que l'environnement $\text{VE}$ est bien typé pour la déclaration de fonction anonyme, et que le résultat de cette déclaration est de type $\tau \to \tau'$.

## Conclusion

Nous avons vu dans cet article les bases de l'algorithme d'inférence de types, ainsi que les règles de typechecking qui nous permettent de vérifier si une expression est bien typée ou non. Nous avons également vu comment généraliser un type pour une variable donnée, et comment utiliser cet algorithme pour vérifier la validité d'un programme.

Dans le prochain article, nous allons voir comment implémenter cet algorithme en Haskell, et comment l'utiliser pour vérifier la validité d'un programme.
