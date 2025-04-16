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

**Body:** `username` | `email` | `password`

**Response:**

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

**Errors:**

- 400 fields missing: []
- 400 email already used
- 500 internal servor error

### Route pour se connecter et récupérer les informations de l'utilisateur (pour LoginScreen)

`POST /users/login`

**Body:** `email`| `password`

**Response:**

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

**Errors:**

- 400 fields missing: []
- 400 user not found
- 401 invalid password
- 500 internal servor error


## historyRouter ('/history') -- Morgan

### Route pour récupérer l'historique des quêtes de l'utilisateur (pour HistoryScreen)

`GET /history`

**Response:**

```
{
    result: boolean,
    data: [{
        restaurant: ObjectId,
        savedCo2: Number,
        achievedChallenges: [ObjectId]
    }]
}
```

**Errors:**

- 500 internal server error


### Route pour mettre à jour l'historique après validation d'une quête (pour RestaurantScreen)

`POST /history`

**Body:** `restaurant` (ObjectId) | `achievedChallenges` ([ObjectId])

**Response:**

```
{
    result: Boolean,
    totalSavedCo2: Number
}
```

**Errors:**

- 500 internal server error


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

Routes pour afficher les restaurants trouvés en fonction des différents filtres de recherche et du "niveau de zoom" de la carte

**A documenter**