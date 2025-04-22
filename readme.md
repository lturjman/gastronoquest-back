# Routes

## indexRouter ('/')

### Récupérer les défis

`GET /challenges`

**Response:**

```
{
    result: Boolean,
    challenges: [{
        title: String,
        savedCo2: Number
    }]
}
```

### Consulter les quizz

`GET /quizzes`

**Response:**

```
{
    result: Boolean,
    quizzes: [{
        quizNumber: Number,
        title: String,
        difficulty: String,
        questions: [{
            questionNumber: Number,
            question: String,
            answers: [String],
            rightAnswer: String,
            comment: String,
            articleUrl: String
        }]
    }]       
}
```

### Récupérer les informations d'un quizz

`GET /quiz/quizId`

**Response:**

```
...
```


## usersRouter ('/users')

### Route pour s'inscrire (pour RegisterScreen)

`POST /users/register`

**Body:** 

```
{
    username: String,
    email: String,
    password: String
}
```

**Response:**

```
{
    result: Boolean,
    data: {
        firstConnection: Boolean,
        username: String,
        email: String,
        token: String,
        level: String,
        totalSavedCo2: Number,
        favorites: [ObjectId]
    }
}
```

**Errors:**

- 400 fields missing: []
- 400 email already used
- 500 internal server error

### Route pour se connecter et récupérer les informations de l'utilisateur (pour LoginScreen)

`POST /users/login`

**Body:**

```
{
    email: String,
    password: String
}
```

**Response:**

```
{
    result: Boolean,
    data: {
        firstConnection: Boolean,
        username: String,
        email: String,
        token: String,
        level: String,
        totalSavedCo2: Number,
        favorites: [ObjectId]
    }
}
```

**Errors:**

- 400 fields missing: []
- 400 user not found
- 401 invalid password
- 500 internal server error

## historyRouter ('/history')

### Route pour récupérer l'historique des quêtes de l'utilisateur (pour HistoryScreen)

`GET /history`

**Headers:** `authorization` (token)

**Response:**

```
{
    result: Boolean,
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

**Headers:** `authorization` (token)

**Body:**

```
{
    restaurant: ObjectId,
    achievedChallenges: [ObjectId]
}
```

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

`GET /quizResults`

**Headers:** `authorization` (token)

**Response:**

```
{
    result: Boolean,
    data: [{
        _id: ObjectId,
        score: Number,
        passed: Boolean,
        passedAt: Date
    }]
}
```

**Errors:**

- 400 fields missing: token
- 400 user not found
- 500 internal server error

### Mettre à jour les résultats aux quiz après avoir fini un quiz (pour QuestionScreen)

`PUT /quizResults`

**Headers:** `authorization` (token)

**Body:**

```
{
    quizId: String,
    score: Number,
    passed: Boolean
}
```

**Response:**

Renvoie la liste actualisée

```
{
    result: Boolean,
    data: [
        {
            _id: ObjectId,
            score: Number,
            passed: Boolean,
            passedAt: Date
        }
    ]
}
```

**Errors:**

- 400 fields missing: []
- 400 user not found
- 400 quiz not found
- 500 internal server error

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

Routes pour afficher les restaurants trouvés en fonction des différents filtres de recherche et du "niveau de zoom" de la carte.

**Response:**

```
{
    result: Boolean,
    data: [
        {
            _id: ObjectId,
            name: String,
            desc: String,
            longDesc: String,
            score: Number,
            badges: [String],
            types: [String],
            priceRange: String,
            address: String,
            coordinates: {
                latitude: Number,
                longitude: Number,
            },
            imageUrl: String,
            websiteUrl: String,
            bookingUrl: String
        }
    ]
}
```

### Route pour chercher un restaurant par son nom

`POST /search/restaurant`

```
{
    input: String,
    badges: [String],
    types: [String],
    priceRange: String
}
```

### Route pour chercher des restaurants dans une ville précise

`POST /search/address`

```
{
    input: String,
    badges: [String],   // optional
    types: [String],   // optional
    priceRange: String   // optional
}
```

### Route pour chercher un restaurant à proximité (du centre) d'une ville

`POST /search/coordinates`

```
{
    input: String,
    distance: String,
    badges: [String],   // optional
    types: [String],   // optional
    priceRange: String   // optional
}
```

### Route pour chercher des restaurants autour de soi

`POST /search/geolocation`

```
{
    geolocation: {
        latitude: Number,
        longitude: Number,
    },
    distance: String,   // optional
    badges: [String],   // optional
    types: [String],   // optional
    priceRange: String   // optional
}
```