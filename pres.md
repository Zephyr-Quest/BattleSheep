# Répartition de la parole (présentation)

## Diapo 1 (Martin)

Bonjour à tous

Présentation de notre jeu : BattleSheep

Pour cela :
- Suivre un joueur lambda sur notre site
- Détailler la logique et l'organisation qu'il y a derrière chaque action

## Diapo 2 (Martin)

Présentation de l'équipe

## Diapo 3 (Rémi)

Page d'accueil
Joli mouton en 3D

## Diapo 4 (Rémi)

Changement des noms des armes

* Tondeuse (missile)
* Débroussaileuse (radar)
* Épidémie de calvitie (bombe à fragment)
* Loup (torpille)

## Diapo 5 (Tom)

Formulaire de connexion et d'inscription
Envoi de requêtes *POST* avec *fetch* pour envoyer les données au serveur

## Diapo 6 (Tom)

Réception + vérification des données côté serveur
Sécurisation (hashage) avec *bcrypt*

Stockage dans la BDD

* Comment elle est structurée ?
* Comment on envoi les données ?
* Comment on les récupères ?
* Module ? Classe ?

## Diapo 7 (Eng)

Le joueur vient de se connecter

Récupération des scores via la BDD
Affichage avec *EJS* (qu'est ce que c'est *EJS*)

Cheminement d'évenements WS pour l'affichage des parties en attente
Fonctionnement des rooms

## Diapo 8-9 (Eng)

Le joueur vient de rejoindre une partie (host ou join)

Méli Mélo d'événement WS pour afficher la grille de départ

## Diapo 10 (Maxime)

Sélection de la grille

* 4 troupeaux de 1 mouton
* 3 troupeaux de 2 moutons
* 2 troupeaux de 3 moutons
* 1 troupeau de 4 moutons

* *Drag-and-drop*
* Vérifications
* Rotations
* Problèmes

## Diapo 11 (Maxime)

Le joueur vient de sélectionné sa grille

Interface 2D affiché au-dessus de l'interface 3D

* Affichage des armes déjà utilisées
* Nombre de moutons déjà touchés (/20)
* Chrono (se lance après la sélection de la grille)

## Diapo 12 (Martin)

3D avec ThreeJS
Modélisation avec *Blender* (on fait pas les choses à moitié)
Description de la scène
3 angles de caméra pour avoir une vision d'ensemble de la grille

## Diapo 13 (Martin)

Intéractions possibles du joueur :

* Choix de l'arme (HUD)
* Raycaster (comment ça marche ?)
* Clique (simple) et survol (qu'est ce que ça affiche ? calcul ?)

## Diapo 14 (Rémi)

Le joueur vient de jouer un coup...

... qu'est ce qu'il voit ?

* Les cases touchés sont actualisées (vide, mouton visible ou tondu)
* Les armes du joueurs sont mises à jour (bloque celle qui vient d'utiliser si ce n'est pas la *tondeuse*)
* Le chrono est re-synchronisé (pk on synchronise ?)
* Une annonce pop pour dire à l'autre joueur de jouer
* SI :
  * L'arme *débroussailleuse* est utilisée : **CAPILLOTRACTOM**
  * Un nouveau mouton est trouvé : son de mouton
  * Le joueur vient de perdre ou rasé un troupeau : GIF

... qu'est ce qu'il ne voit pas ?

* Vérifications anti-triche (C'est le tour du joueur ? Il a le droit d'utiliser cette arme ? ...) (Pk cette vérification ?)
* Calcul des cases touchées (en fonction de l'arme)
* Score du joueur calculé au fur et à mesure (en fonction du temps et du nombre de moutons trouvés)
* Données de la partie mises à jour (Qui doit jouer ? Qui a touché quoi ? ...)
* Lancement de l'actualisation chez les 2 joueurs connectés

## Diapo 15 (Enguerrand)

Le joueur vient de gagner (ou de perdre cheh)
We did it ! (doraaa)

Une annonce donne le score du joueur
Annonce personnalisé en fonction de si il gagne ou perd
Magnifique musique fait par Maxime ce boss à la guitare (oui oui)

## Diapo 16 (Martin)

Conclusion

Voir rapport
