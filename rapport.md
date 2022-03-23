# Rapport BattleSheep

## Introduction

La vie de berger c'est plus ce que c'était ! La guerre fait rage désormais et vous n'y échapperez pas. L'attaque étant la meilleur défense, éliminez les troupeaux de votre adversaire jusque pénurie de laine s'en suive. Pour cela voici vos armes :

* La **tondeuse**, disponible en permanence, est une arme simple mais efficace. Elle atteint une seul case mais ne la rate pas;
* La **débroussailleuse**, disponible une seule fois dans la partie, affiche les moutons qui se cachent sous les 9 cases autour de celle cliquée;
* L'**épidémie de calvitie**, le fléau de l'homme moderne. Disponible une seule fois dans la partie, elle provoque une chute de laine sur les 5 cases autour de celle cliquée;
* Le **loup**, prédateur par excellence, est lui aussi disponible une seul fois dans la partie. Il s'occupe d'achever un troupeau de taille inférieur ou égale à 2. Cette arme fonctionne également sur les troupeaux plus grand qui ont perdu une partie de leur effectif.

Ce jeu est signé ZephyrStudio et évidement on ne fait pas les choses à moitié. Histoire de vous en mettre plein la vue, on a choisit de proposer de la 3D en lowpoly comme style graphique (on espère que ça a marché 😅️).

En parlant de ZephyrStudio, voici une petite présentation de l'équipe et de la répartition du travail :

* *Front-end*
	* **Maxime** : Il s'occupe de la sélection de la grille  du joueur au début de la partie et connecte le jeu au serveur;
	* **Martin (chef d'équipe)** : Il crée les pages web et les modèles 3D puis les mets en relation via la librairie *ThreeJS*;
* *Back-end*
	* **Enguerrand** : Il met en place le serveur *NodeJS* en capturant les requêtes *HTTP* et les connexions *WebSocket*;
	* **Tom** : Il crée la base de données et le module *NodeJS* permettant d'intéragir facilement avec elle;
	* **Rémi** : Il s'occupe des différentes sécurités et du déroulement du jeu;

#

## Front-end

### Navigation

Afin de faciliter le design du site, on a choisit de travailler avec le pré-processeur *LESS* (parce que le CSS natif ça va cinq minutes).

* Schéma de navigation (@RemiVan-Boxem)
	* Accueil
	* Règles
	* Connexion / Inscription
	* Lobby
	* Jeu

**Insérer des screens des pages (sauf page de jeu)**

### Séléction de la grille
@MaximeDeclemy

### Page de jeu

#### HUD

Sur la page de jeu, le joueur a besoin de plusieurs informations comme le nombre de moutons restant de son adversaire, le temps depuis le début de la partie, ses différentes armes, etc. Pour cela nous avons mis en place un **HUD**, c'est à dire une interface en 2D affichée par dessus le jeu.

Il est manipulable via un module *JavaScript* qui permet de modifier le score, les armes utilisées ou celle selectionnée, démarrer le chrono, afficher des annonces ou des GIFs (oui oui des gifs 😏️).

#### 3D

Ah, on arrive à la partie intéressante (bien sûr les autres ne sont pas inintéressante mais booon). Pour manipuler la 3D, on utilise la librairie *ThreeJS* qui permet d'intéragir avec *WebGL*, le système 3D des navigateurs. La mise en place d'une interface se fait donc via la création d'une scène, d'un moteur de rendu, d'une caméra, d'une ou plusieurs lumières et de tout ce que vous souhaitez y mettre. On peut y ajouter donc les modèles 3D, les textures, les formes *ThreeJS* (comme les cubes par exemple), etc.

Pour gérer tout ce joli foutoir, on a créé une classe `View` qui représente toute la vue 3D (et donc les éléments qui la compose). Comme la grille est représentée dans cette vue, il fallait obligatoirement un moyen de la manipuler facilement. Cette classe permet de :

* Charger les éléments de la scène (modèles et textures)
* Afficher la grille du joueur (après la sélection du début de partie)
* Ajouter / supprimer un élément de la grille
* Récupérer un élément de la grille à partir de sa position

**Photo de la grille en 3D**

En bref, cette classe fournit tout le nécéssaire pour l'intéraction avec la grille. On peut retrouver dans cette grille :

* De l'herbe, cache un mouton... ou pas;
* Des moutons classiques, ceci n'ont pas encore été touchés... Pour l'instant;
* Des moutons rasés, dommage pour eux, l'adversaire est passé par là.

Jusqu'à présent on peut donc la manipuler mais on ne peut pas encore détecter lorsque le joueur sélectionne une case. Pour cela on utilise un outil mis à disposition par la librairie : le **Raycaster**.

Comment ça marche ? C'est simple, ça trace un "rayon" là où le joueur clique puis renvoie tous les éléments que le rayon a traversé. On peut donc facilement en déduire la case cliquée (via un petit calcul mathématique des familles) et **PAF ça fait des chocapics**. Évidement on ne s'est pas arrété là... Le simple clique n'étant pas assez ergonomique à notre gout, on a décidé de rajouter un affichage au survol. À chaque passage sur une case différente, on calcul l'impact de l'arme sélectionnée sur la case visée en affichant une cible (en 3D, évidement) au dessus des cases impactées et une croix au dessus des moutons déjà touchés.

**Photo d'un exemple de survol (épidémie)**

Vous trouvez que ça manque d'animation ? De fun ? De tracteur ? Vous n'allez pas être déçu. Je vous présente le ***CAPILLOTRACTOM*** :

![Capillotractom](public/img/textures/capillotractom.png "Capillotractom")

Nommé ainsi pour sa belle cheveulure et son joli visage, le *Capillotractom* vous fera passer de bons moments, seul ou en famille. D'un point de vue plus technique, cette belle texture est implémenter dans le jeu via une *sprite*. Il s'agit d'un élément 3D permettant d'afficher une texture 2D dans l'environnement *ThreeJS*. L'image est donc toujours orientée vers la caméra mais peut se déplacer sur tous les axes. Grâce à cela nous avons pu ajouter une animation faisant translater le *Capillotractom* à travers la grille lorsqu'un des joueurs utilise l'arme *débroussailleuse*.

**Photo du Capillotractom dans le jeu**

Hm ! 🤔️ Je sens que vous n'êtes pas encore satisfait... Eh bien sachez qu'il sagit tout de même d'un jeu **Made by ZephyrStudio**. On ne fait jamais les choses à moitié ici :

**Tous les éléments 3D que vous pouvez admirer dans notre jeu ont été concoctés par nos soins** sur le logiciel *Blender* (RIP Martin).

*Bon ok c'est moche mais chuuut faut pas le dire...*

#### Sound Design

Alors... Euh... Comment dire ? On avait plus trop le temps 😅️. Petites recherches internet + un petit tour sur *Audacity* et hop le tour est joué ! Mais ça ne nous a pas empêché de faire les choses bien. Il y a donc un module appelé `SoundDesign` qui permet de lancer au moment souhaité les différents sons enregistrés :

* Un son de tracteur pour le *Capillotractom*;
* 3 sons différents pour la découverte d'un mouton qui sont joués aléatoirement à chaque fois (ils sont **très fortement** inspiré de ceux de Minecraft).

### Mise en relation avec le back-end (HTTP + WebSocket)
@MaximeDeclemy

* Modules fait pour intéragir avec le back (`http` + `SocketManager`)
* Difficultés rencontrées

#

## Back-end

### Base de données
@TomMullier

### Docker
@MartDel

### Serveur HTTP
@EnguerrandMQT

* Le routage des pages du site
* Système de session et redirections
* Requêtes POST pour connexion, inscriptions, etc...
* Vérifications des données à la volée (`body`)

### Serveur WebSocket
@EnguerrandMQT

* Système de *room*
* Wallah la deconnexion jlui pisse dessus
* Difficultés rencontrées (autres que la deconnexion)

### Logique du jeu + Sécurités
@RemiVan-Boxem

* Vérification grille
* Calcul impact des armes
* Représentation / Stockage d'une partie (la class `BattlesheepGame`)

#

## Conclusion
@MartDel

* C'était chaud niveau timing mais ptn on est trop fort
* Je vous laisse vous enjailler sur les petits gifs et easter eggs ;)
* Hésitez pas si vous voulez essayer de lancer le serveur et que vous galérez avec docker (hihi je maitrise un outil que le prof maitrise pas jss trop un bg)