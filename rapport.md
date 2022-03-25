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

La partie commence par la sélection de la grille. 
On peut placer 10 groupes de moutons:
* 4 groupes de 1 mouton
* 3 groupes de 2 moutons
* 2 groupes de 3 moutons
* 1 groupe de 4 moutons

Les moutons qui ne sont pas encore placés sont situés dans une barre à gauche de l'écran à côté de la grille.

Le placement des moutons se fait par un système de drag and drop. Le joueur sélectionne un mouton dans la barre à gauche et le déplace jusqu'à la case du tableau voulu. Lorsqu'il le lâche, si le mouton a un placement convenable alors il est placé sur la grille, sinon il est remis à son ancienne position (dans la barre à gauche si le mouton n'était pas préalablement placé sur la grille, ou à son ancienne position sur la grille).

La mise en place du drag and drop (qui m'a fait perdre trop de temps à cause d'erreurs irrecevables, je ne pouvais pas me laisser faire insulter de la sorte par une banale console, je lui apprends pas mon métier, alors elle va me laisser faire le mien, c'est qui le patron !) a pris plus de temps que prévu, notamment à cause des différents conteneurs utilisés (td du tableau, div du mouton, div de la barre des moutons, le contenu de la div du mouton). J'ai eu beaucoup d'erreurs à cause de ces conteneurs qui n'étaient pas ceux que je souhaitais viser. Une autre erreur qui m'a pris du temps et le remplissage de la grille selon la taille du groupe de mouton. On place dans la grille un seul mouton et il faut créer et placer automatiquement à la suite le nombre de moutons correspondant à la taille du groupe placé. Il a fallu créer de nouveaux moutons, de nouveaux blocs à placer dans les bons conteneurs (encore des erreurs d'éléments visés) et lorsqu'on choisi un mouton du groupe à déplacer, les autres (du groupe séléctionné) sont enlevés pour pouvoir placer le mouton à un nouvel endroit. Si on choisit un mouton dans la grille et que celui est situé au milieu de son groupe, il devient alors le nouveau premier mouton du groupe quand on le place à nouveau.

Le joueur à 3 boutons à droite de la grille :
* le bouton **Rotate** qui permet de changer la direction des moutons (en ligne ou en colonne), le changement de direction est effectif lorsqu'on déplace un mouton (il faut donc déplacer le mouton pour le faire pivoter et non juste cliquer dessus).
* le bouton **Reset** qui permet au joueur de recommencer sa grille. Les moutons sont recréés dans la barre à gauche et la grille redevient vierge.
* le bouton **Valid** qui permet au joueur de soumettre sa grille à la validation. Si sa grille est jugée comme incorrecte, sa grille est réaffichée, remplie avec les moutons tels qu'il les avait placés et devra la modifier. Si sa grille est correcte, la guerre avec l'autre joueur peut commencer (à moins qu'il n'est pas fini sa grille, alors le joueur patiente, mais si l'autre joueur le fait exprès parce qu'il a peur de perdre, il sait que les patates sont cuites et qu'il retarde l'affrontement final, alors l'attente sera longue jusqu'à l'abandon...).


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

Pour que le jeu puisse fonctionner, il a fallu connecter le front et le back. Pour selon nous avons utilisé des requêtes http et des websockets. 
Il a donc fallu utiliser ces outils qui nous ont donné du fil à retordre. Le plus difficile a été de relier les joueurs avec le système de room et de récupérer les données de chaque afin de procéder au bon déroulement de la partie (avoir quand les 2 joueurs on leur grille valide pour commencer la partie, savoir quel joueur doit jouer).

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