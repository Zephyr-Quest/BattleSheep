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
Le serveur se base sur le framework *express*, ainsi que *session* et *socket.io* principalement. D'autres framework sont également tels que *path*, *body-parser* ou *express-socket.io-session*.
Nous aborderons dans cette partie, le routage des pages du site, le système de session et redirections ainsi les requêtes POST pour, nécessairement, l'inscription et la connexion.

**Routage des pages**

Les pages du site s'obtiennent à travers un *app.get(...)* et sont renvoyés pour la plupart avec un *res.render*. Cela nous permet de passer en paramètre des modules *JavaScript* pour le front en *ejs* 

**Requêtes POST pour connexion, inscriptions**

L'inscription, la connexion et le logout passent par une requête POST. De cette manière, nous n'avons pas de */logout* dans l'url par exemple.
Cela nous permet également de pouvoir vérifier la longueur du nom d'utilisateur, de le *trim* et de l'*escape* afin d'éviter les injections SQL. Il en est de même avec le mot de passe.

Lorsque les vérifications de session par *express-validator* sont bonnes, le mot de passe est hashé avec *bcrypt*, une vérification de son bon encryptage a lieu puis le nom d'utilisateur et le mot de passe crypté sont envoyés à la base de donnée (via une callback défini dans l'index).  

**Session et redirection**

Lorsqu'un utilisateur s'inscrit ou se connecte, son nom d'utilisateur est enregistré dans la session (le système de token pour sécuriser la session est passé à la trappe...).

Ainsi, lorsque l'utilisateur essaie d'accéder à la page lobby ou game sans s'être connecté, il est automatiquement redirigé vers la page index.


### Serveur WebSocket
Le périple du back-end arrive à une partie rigolote : le serveur WebSocket (que nous abrégerons WS). Lorsque l'utilisateur arrive sur la page lobby, une connexion au WS est initialisée. Plusieurs vérifications sont alors faite afin de savoir s'il vient de la page de connexion ou s'il vient de quitter une partie.

Le WS utilise un système de room. Lorsqu'un joueur clique sur *host*, il crée une room. La room est nommée par un **id**, cet id est l'id + 1 de la room ayant le plus haut id. Lorsqu'un joueur clique sur une partie déjà créée, il *join* la room. L'id de la room est stocké dans la session des joueurs (je vous l'accorde, ce n'est pas la manière la plus sécurisée de procéder) pour récupérer plus simplement l'id de la room à laquelle il faut *emit* l'évènement.

Une fois qu'une room est pleine, c'est à dire que 2 joueurs sont dedans, l'évènement *timeToPlay* est envoyé aux 2 joueurs de la room, la partie démarre !

Les joueurs positionnent leurs moutons sur la grille et appuient sur le bouton de validation. L'évènement *checkGrid* est appelé afin de vérifier que la grille est correctement remplie. Si c'est le cas, celle ci est stocké en back (on évite les petits malins qui tenterait de modifier ou voir les moutons adverses). Lorsque les 2 grilles sont vérifiées, l'heure est venue de passer aux choses sérieuses.

A chaque coup, l'évènement *playerPlayed* est appelé, il permet au joueur de tirer sur une case avec une certaine arme. 
#
La déconnexion d'un joueur pendant la partie est elle aussi géré (et je peux vous dire que j'ai galéré). Lorsqu'un joueur rafraichit la page **game**, ou la quitte, l'évenement *disconnect* est appelé automatiquement. Cela entrainait des erreurs et bug lorsqu'il revenait sur le lobby.

Ainsi, le nom joueur se déconnectant est stocké dans un tableau de joueur en déconnexion. Lorsqu'il arrive sur la page lobby, ce tableau est parcouru. Si le nom du joueur se trouve dedans, il quitte la room dans laquelle il était et son id de room est remit à *undefined*. Ces deux étapes étaient impossible à faire dans l'event *disconnect* car par définition, le client n'est pllus connecté au WS, donc impossible de mettre à jour ses données. Enfin, un évènement *disconnection* est *emit* au joueur qui ne s'est pas déconnecté afin de le faire quitter la partie, le procédé de déconnexion pour ce joueur est exactement le même. Par principe de sécurité, l'événement *disconnection* est *emit* lorsque le joueur se déconnecte et lorsqu'il arrive sur la page *lobby*.
#
La mise en place du système de room a été également assez compliqué à mettre en place, liée en partie à la déconnexion (encore et toujours elle...). Hormis ces points, la principlae difficulté résidait dans le fait que  *Node.js* et le côté serveur était tout nouveau pour ma part.
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