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

`POST /users/register`

**Body**: `username` | `email`| `password`

**Response**:

```
{
    result: boolean,
    data: {
        firstConnection: boolean,
        username: string,
        email: string,
        token: string,
        level: string,
        totalSavedCo2: number,
        favorites: array
    }
}
```

**Erreurs**

- 400 fields missing: []
- 400 email already used
- 500 internal servor error

### Route pour se connecter + récupérer les informations de l'utilisateur : username, email, favorites, token (pour LoginScreen)

`POST /users/login`

**Body**: `email`| `password`

**Response**:

```
{
    result: boolean,
    data: {
        firstConnection: boolean,
        username: string,
        email: string,
        token: string,
        level: string,
        totalSavedCo2: number,
        favorites: array
    }
}
```

**Erreurs**

- 400 fields missing: []
- 400 user not found
- 401 invalid password
- 500 internal servor error

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
