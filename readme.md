# Routes


## indexRouter

### Récupérer les défis
GET /challenges
Pas de req
Res = tous les challenges

### Consulter les quiz
GET /quiz
Pas de req
Res = tous les quiz


## usersRouter

### Route pour s'inscrire
POST /users/register
- Req.body = username, email, password
- Traitement : vérification des informations, enregistrement dans la collection, renvoi d'erreurs
- Res = première connexion (pour les tutoriels), username

### Route pour se connecter + récupérer les informations de l'utilisateur
POST /users/login
- Req.body = email, password
- Res =
    - username
    - favorites
    - totalSavedCo2 (calculé en fonction de history)
    - niveau (calculé en fonction de quizResults)

### Récupérer l'historique des quêtes de l'utilisateur
GET /users/history
Req.params = token
Res = history

### Récupérer les résultats des quiz de l'utilisateur
GET /users/quizResults
Req.params = token
Res = quizResults






## favoritesRouter

### Route pour ajouter un restaurant aux favoris
POST /favorites
Req.body = id
Traitement = Mettre à jour User
Res = result

### Route pour supprimer un restaurant des favoris
DELETE /favorites
Req.body = id
Traitement = Mettre à jour User
Res = result

### Route pour récupérer les favoris ???
A priori pas besoin si récupéré au moment de la connexion


## searchRouter

### Routes pour afficher les restaurants trouvés en fonction des différents filtres de recherche et du "niveau de zoom" de la carte
- Route de recherche d'un restaurant par son nom
- Route de recherche d'un restaurant par ses coordonnées
- Route de 

Il va falloir qu'on fasse des appels à l'API data géo pour convertir les villes en coordonnées et inversement
Récupérer ce qu'on a fait sur autocomplete pour ça

### Route pour récupérer les informations d'un restaurant (pas sûr que ce soit nécessaire ???)



Route pour sauvegarder le résultat d'un quiz
Router pour mettre à jour l'historique