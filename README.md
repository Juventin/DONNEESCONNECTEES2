# Netflix but moyen chill

**lien vers le service déployé : https://netflixbutnochill.herokuapp.com/**


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
- Le taux de chômage et caractéristiques démographiques de chaque région
- etc. **A REMPLIR**

Son objectif est de metre à disposition des données permettant l'analyse de corrélations entre la popularité d'un film, de certains genres de films, ou du cinéma en général, et bien d'autres en fonction des caractéristiques démographiques de chaque région.

Les données peuvent être consultées depuis l'interface utilisateur, avec un formulaire en page d'accueil, ou en renseignant directement les paramètres dans l'adresse URL.

## Choix des données et méthodes de récupération
Sources de données :
- API BetaSeries
  - Permet de récupérer à la volée les informations relatives au film demandé
  - Données récupérées par un fetch depuis le endpoint du film et avec une clé API.
- API Google Trends :
  - Permet de récupérer la popularité d'un mot clé sur Google. Filtré en france et segmenté par régions.
  - Données récupérées par la librairire node 'google-trends-api' qui ne nécessite pas de clé API.
- Données INSEE :
  - Taux de chômage par région de France au second trimestre de 2020.
  - Données récupérées manuellement (fichier source au format excel), nettoyées, et stockées en json sur le serveur.
  - Source : https://www.insee.fr/fr/statistiques/2012804#graphique-TCRD_025_tab1_regions2016


## Jointure des données