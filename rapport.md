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

## Front-end

### Navigation

Afin de faciliter le design du site, on a choisit de travailler avec le pré-processeur *LESS* (parce que le CSS natif ça va cinq minutes).

**Insérer des screens des pages (sauf page de jeu)**

* Schéma de navigation (@RemiVan-Boxem)
* Pages
	* Accueil
	* Règles
	* Connexion / Inscription
	* Lobby
	* Jeu

### Séléction de la grille
@MaximeDeclemy

### Page de jeu

#### HUD

Sur la page de jeu, le joueur a besoin de plusieurs informations comme le nombre de moutons restant de son adversaire, le temps depuis le début de la partie, ses différentes armes, etc. Pour cela nous avons mis en place un **HUD**, c'est à dire une interface en 2D affichée par dessus le jeu.

Il est manipulable via un module *JavaScript* qui permet de modifier le score, les armes utilisées ou celle selectionnée, démarrer le chrono, afficher des annonces ou des GIFs (oui oui des gifs 😏️).

#### 3D
@MartDel

* ThreeJS (j'en parle pas trop pour pas faire exploser la tête de Béquart)
* Class `View` (intéraction avec la vue 3D)
* Raycaster (Gestion du clique et du survol)
* Sprite et animations (**Capillotractom dans la plaaaace**)
* Modélisation sur *Blender* (aled)

#### Sound Design
@MartDel

Mdrrrr **INTERNET** (*et Audacity*) 

### Mise en relation avec le back-end (HTTP + WebSocket)
@MaximeDeclemy

* Modules fait pour intéragir avec le back (`http` + `SocketManager`)
* Difficultés rencontrées

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

## Conclusion
@MartDel

* C'était chaud niveau timing mais ptn on est trop fort
* Je vous laisse vous enjailler sur les petits gifs et easter eggs ;)
* Hésitez pas si vous voulez essayer de lancer le serveur et que vous galérez avec docker (hihi je maitrise un outil que le prof maitrise pas jss trop un bg)