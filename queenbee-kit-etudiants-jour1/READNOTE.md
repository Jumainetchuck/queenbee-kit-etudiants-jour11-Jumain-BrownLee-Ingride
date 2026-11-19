###  TP1 - A LIRE POUR POUVOIR BIEN COMMENCER LE TP ET DEMARRER LE SERVEUR

### installer les dépendances du projet
 npm init -y
 npm install express
 npm install csv-parse

####  Pour démarrer le serveur, il faut lancer la commande suivante dans le terminal :
 npm run dev

### faire ces modifications dans le fichier package.json pour que le serveur démarre correctement
 "type": "module",
 "main": "tp/tp1-lecture/serveur-depart.js",
 "dev": "node --watch tp/tp1-lecture/serveur-depart.js",

### port d'ecoute du serveur 
 PORT = 4000

### test de la route POST /test
 curl -X POST http://localhost:4000/test