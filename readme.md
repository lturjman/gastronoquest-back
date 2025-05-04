# Routes

## indexRouter ('/')

### Route pour récupérer tous les défis

`GET /challenges`

**Response:**

```
{
    result: Boolean,
    challenges: [{
        _id: ObjectId,
        title: String,
        savedCo2: Number
    }]
}
```

**Errors:**

- 500 Internal server error

### Récupérer les informations de tous les quizz

`GET /quizzes`

**Response:**

```
{
    result: Boolean,
    quizzes: [{
        _id: ObjectId,
        quizNumber: Number,
        title: String,
        difficulty: String
    }]
}
```

**Errors:**

- 500 Internal server error

### Route pour récupérer un quiz

`GET /quiz/:quizId`

**Response:**

```
{
    result: Boolean,
    data: [
        {
            _id: ObjectId,
            quizNumber: Number,
            title: String,
            difficulty: String,
            questions: [
                {
                    questionNumber: Number,
                    question: String,
                    answers: [String],
                    rightAnswer: String,
                    comment: String,
                    articleUrl: String
                }
            ]
        }
    ]
}
```

**Errors:**

- 500 Internal server error

## usersRouter ('/users')

### Route pour s'inscrire et récupérer les informations de l'utilisateur

`POST /users/register`

**Body:** 

```
{
    username: String,
    email: String,
    password: String,
    favorite: String | undefined,
    quiz: {
        quiz: String,
        score: Number,
        passed: Boolean,
        passedAt: Date
    } | undefined,
    quest: {
        restaurant: String,
        date: Date,
        achievedChallenges: [String]
    } | undefined
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
        level: {
            currentLevel: {
                level: String,
                icon: String,
                co2: Number
            },
            nextLevel: {
                nextLevel: String,
                icon: String,
                remaining: Number
            },
            progressPercentage: Number
        },
        totalSavedCo2: Number,
        favorites: [
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
}
```

**Errors:**

- 400 Fields missing: []
- 400 Email already used
- 500 Internal server error

### Route pour se connecter et récupérer les informations de l'utilisateur

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
        level: {
            currentLevel: {
                level: String,
                icon: String,
                co2: Number
            },
            nextLevel: {
                nextLevel: String,
                icon: String,
                remaining: Number
            },
            progressPercentage: Number
        },
        totalSavedCo2: Number,
        favorites: [
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
}
```

**Errors:**

- 400 Fields missing: []
- 400 User not found
- 401 Invalid password
- 500 Internal server error

## historyRouter ('/history')

### Route pour récupérer l'historique des quêtes de l'utilisateur

`GET /history`

**Headers:** `authorization` (token)

**Response:**

```
{
    result: Boolean,
    data: [
        {
            restaurant: ObjectId,
            savedCo2: Number,
            achievedChallenges: [ObjectId]
        }
    ]
}
```

**Errors:**

- 500 Internal server error

### Route pour mettre à jour l'historique de l'utilisateur après validation d'une quête

`POST /history`

**Headers:** `authorization` (token)

**Body:**

```
{
    restaurant: String,
    achievedChallenges: [String]
}
```

**Response:**

```
{
    result: Boolean,
    totalSavedCo2: Number,
    level: {
        currentLevel: {
            level: String,
            icon: String,
            co2: Number
        },
        nextLevel: {
            nextLevel: String,
            icon: String,
            remaining: Number
        },
        progressPercentage: Number
    }
}
```

**Errors:**

- 500 Internal server error

## quizResultsRouter ('/quizResults')

### Route pour récupérer les résultats aux quizz de l'utilisateur

`GET /quizResults`

**Headers:** `authorization` (token)

**Response:**

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

- 400 Fields missing: token
- 400 User not found
- 500 Internal server error

### Route pour mettre à jour les résultats aux quizz de l'utilisateur après avoir terminé un quiz

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

- 400 Fields missing: []
- 400 User not found
- 400 Quiz not found
- 500 Internal server error

## favoritesRouter ('/favorites')

### Route pour ajouter un restaurant aux favoris de l'utilisateur

`POST /favorites`

**Headers:** `authorization` (token)

**Body:**

```
{
    restaurantId: String
}
```

**Response:**

```
{
    result: Boolean
}
```

**Errors:**

- 500 Internal server error

### Route pour supprimer un restaurant des favoris de l'utilisateur

`DELETE /favorites`

**Headers:** `authorization` (token)

**Body:**

```
{
    restaurantId: String
}
```

**Response:**

```
{
    result: Boolean
}
```

**Errors:**

- 500 Internal server error

## searchRouter ('/search')

### Route pour chercher un restaurant par son nom

`POST /search/restaurant`

**Body:**

```
{
    input: String,
    badges: [String] | undefined,
    types: [String] | undefined,
    priceRange: String | undefined
}
```

**Response:**

```
{
    result: Boolean,
    restaurants: [
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

**Errors:**

- 500 Internal server error

### Route pour chercher des restaurants dans une ville précise

`POST /search/address`

**Body:**

```
{
    input: String,
    badges: [String] | undefined,
    types: [String] | undefined,
    priceRange: String | undefined
}
```

**Response:**

```
{
    result: Boolean,
    restaurants: [
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

**Errors:**

- 500 Internal server error

### Route pour chercher des restaurants à proximité d'une ville

`POST /search/coordinates`

**Body:**

```
{
    input: String,
    distance: String | undefined,
    badges: [String] | undefined,
    types: [String] | undefined,
    priceRange: String | undefined
}
```

**Response:**

```
{
    result: Boolean,
    restaurants: [
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

**Errors:**

- 500 Internal server error

### Route pour chercher des restaurants autour de soi, en fonction de la géolocalisation de l'utilisateur

`POST /search/geolocation`

**Body:**

```
{
    geolocation: {
        latitude: Number,
        longitude: Number,
    },
    distance: String | undefined,
    badges: [String] | undefined,
    types: [String] | undefined,
    priceRange: String | undefined
}
```

**Response:**

```
{
    result: Boolean,
    restaurants: [
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

**Errors:**

- 500 Internal server error