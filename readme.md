# Routes


## indexRouter ('/') -- Laura
(Routes pour récupérer les données en dur)

### Récupérer les défis (sur RestaurantScreen)
GET /challenges
Pas de req
Res = tous les challenges

### Consulter les quiz (sur QuizScreen)
GET /quiz
Pas de req
Res = tous les quiz


## usersRouter ('/users') -- Nathan

### Route pour s'inscrire (pour RegisterScreen)
POST /users/register
Req.body = username, email, password
Traitement : vérification des informations, enregistrement dans la collection, renvoi d'erreurs
Res = en fonction du result =>
    true = première connexion (pour les tutoriels), username, email, token (pas encore d'historique et de favoris)
    false = message d'erreur

### Route pour se connecter + récupérer les informations de l'utilisateur : username, email, favorites, token (pour LoginScreen)
POST /users/login
Req.body = email, password
Traitement: vérification des informations, calcul du niveau/level (en fonction de quizResults) et du totalSavedCo2 (en fonction de history) de l'utilisateur
Res = en fonction du result =>
    true = username, email, token, favorites, totalSavedCo2, level
    false = message d'erreur


## historyRouter ('/history') -- Morgan

### Récupérer l'historique des quêtes de l'utilisateur (pour HistoryScreen)
GET /history
Req.params = token
Res = history

### Mettre à jour l'historique après validation d'une quête (pour RestaurantScreen)
PUT /history
Req.body = token, id du restaurant, id des défis validés, date de validation
Res = result


## quizResultsRouter ('/quizResults') -- Nathan

### Récupérer les résultats aux quiz de l'utilisateur (pour QuizScreen)
GET /quizResults
Req.params = token
Res = quizResults

### Mettre à jour les résultats aux quiz après avoir fini un quiz (pour QuestionScreen)
PUT /quizResults
Req.body = token, id du quiz, id des défis validés, date de validation
Res = result


## favoritesRouter ('/favorites') -- Laura

### Route pour ajouter un restaurant aux favoris
POST /favorites
Req.body = id du restaurant
Traitement : Mettre à jour User
Res = result

### Route pour supprimer un restaurant des favoris
DELETE /favorites
Req.body = id du restaurant
Traitement : Mettre à jour User
Res = result


## searchRouter ('/search') -- Morgan

### Routes pour afficher les restaurants trouvés en fonction des différents filtres de recherche et du "niveau de zoom" de la carte
- Route de recherche d'un restaurant par son nom
- Route de recherche d'un restaurant par ses coordonnées
Il va falloir qu'on fasse des appels à l'API data géo pour convertir les villes en coordonnées et inversement
Récupérer ce qu'on a fait sur autocomplete pour ça

NOTE: A priori pas besoin d'une route pour récupérer les informations d'un restaurant en particulier, on peut communiquer ça dans le frontend