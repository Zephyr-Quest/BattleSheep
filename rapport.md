# Rapport BattleSheep

## Introduction
@MartDel

* Rahlala on est trop drôle ya des moutons
* 3d dans ta gueule pour avoir des points en plus
* Répartition du travail parce que wallah je vais pas faire ça tout seul

## Front-end

### Navigation
@MartDel

* HTML / LESS / (JS / ThreeJS)
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
@MartDel

* Module
	* Score
	* Timer
	* Armes
	* Annonces / Gifs

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