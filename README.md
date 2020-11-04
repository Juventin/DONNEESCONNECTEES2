# Netflix but moyen chill

**lien vers le service déployé : https://netflixbutnochill.herokuapp.com/**

**lien vers la présentation : https://docs.google.com/presentation/d/1fCM2Ldpqu3CH53UTrz0MDr0l8LxQL9NJo8QfuZu9_0s/edit?usp=sharing**


## Présentation du groupe
Le goupe est composé de :
- Mathéo DALY (matheodaly.md@gmail.com)
- Jeremy JUVENTIN (jeremy.juv@gmail.com)
- Gaël MULLIER (gael.mullier@gmail.com)
- Gaëlle NOVALES (gaelle.novales@gmail.com)
- Sarah RAMIREZ (raamirezsaarah@gmail.com)

Au sein du groupe, les tâches étaient réparties selon les compétences de chacun.
Chaque membre a cependant travaillé sur la recherche de données ouvertes pertinentes pour le sujet et a codé leur récupération par un fetch. A l'issue de cet exercice, le groupe s'est réuni pour choisir les données les plus cohérentes et les lier entre elles.

## Présentation du projet
Le projet Netflix But No Chill consiste à créer une api offrant, pour un titre de film donné : 
- Les informations relatives au film (date de sortie, réalisateur, durée, genre, etc.)
- Sa popularité sur Google par régions françaises 
- Le taux de chômage et les caractéristiques démographiques de chaque région
- Les prévisions méteo par région

Son objectif est de metre à disposition des données permettant l'analyse de corrélations entre la popularité d'un film, de certains genres de films, ou du cinéma en général, et bien d'autres en fonction des caractéristiques démographiques et des prévisions météorologique de chaque région.

Les données peuvent être consultées depuis l'interface utilisateur, avec un formulaire en page d'accueil, ou en renseignant directement le titre du film dans l'adresse URL.

## Routes
  - **GET /trends/:film/:region** :renvoie la popularité sur Google du film choisi pour chaque région.
  - **GET /movie/:film** :renvoie les informations relatives à un film choisi.
  - **GET /region/:region** :renvoie le taux de chômage ainsi que la météo pour la région choisie.

Contraintes: 
  - Tous les parametres placés en URL sont encodés. 

## Choix des données et méthodes de récupération
Sources de données :
- API **BetaSeries**:
  - Permet de récupérer à la volée les informations relatives au film demandé
  - Données récupérées par un fetch depuis le endpoint du film et avec une clé API.
  - Sources : https://api.betaseries.com/movies/search?key=c3796994ef78&title=avatar
- API **GoogleTrends** :
  - Permet de récupérer la popularité d'un mot clé sur Google. Filtré en france et segmenté par régions.
  - Les données récupérées sont celles des dernières 48H. 
  - Sources : données récupérées par la librairire node 'google-trends-api' qui ne nécessite pas de clé API.
- Données **INSEEchomage** :
  - Taux de chômage par région de France au second trimestre de 2020.
  - Données récupérées manuellement (fichier source au format excel), nettoyées, et stockées en json sur le serveur.
  - Source : https://www.insee.fr/fr/statistiques/2012804#graphique-TCRD_025_tab1_regions2016
- Données **Méteo** : 
  - Renvoie les données de la méteo en cours et sa prévision ainsi que des quatres prochains jours en fonction de la région. 
  - Source : https://www.prevision-meteo.ch/services/json/lat=48.8499198lng=2.6370411


## Jointure des données
Les données sont liées à l'aide d'une fonction javascript permettant de joindre deux listes sur une valeur commune (les champs utilisés comme clé peuvent être nommés différemment).
L'objectif de ces liaisons va etre de ne créer qu'une seule table qui repertorie toutes nos données. La table de references qui va être prise va être : **INSEEchomage**. 
  - Jointure entre **BetaSeries** et **GoogleTrends**, utilisation du champs titre du film pour la liaison. 
  - Jointure entre **INSEE** et **GoogleTrends**, utilisation du champs région pour la liaison.
  - Jointure entre **Méteo** et **INSEE**, utilisation du champs longitude/latitude pour la liaison.

Détail du travail réalisé pour adapter les champs de jointure: 
 - La longitude et la latitude a du être ajouté sur **INSEE** de manière manuelle afin de faire la liaison avec les données **Méteo**.L'objectif serait d'automatisé la récupération de ces données. 
