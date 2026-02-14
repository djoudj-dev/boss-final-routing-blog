Boss final du Module 5 sur [Easy Angular Kit](https://easyangularkit.com?via=djoudj) - Par [Gaëtan Redin](https://www.linkedin.com/in/gaetan-redin/)

# Blog Angular - Clean Architecture & Routing Avance

Application blog construite avec **Angular 21**, demonstrant les bonnes pratiques de **Clean Architecture**, le **routing avance** et la **reactivite par signaux**.

## Stack technique

| Technologie | Version | Role |
|-------------|---------|------|
| Angular | 21.1.0 | Framework frontend |
| TypeScript | 5.9.2 | Typage statique (strict mode) |
| Tailwind CSS | 4.1.12 | Styles utilitaires |
| RxJS | 7.8.0 | Programmation reactive |
| Vitest | 4.0.8 | Tests unitaires |
| json-server | 1.0.0-beta.5 | API REST mock |

## Demarrage rapide

```bash
# Installation des dependances
npm install

# Lancement (API mock + serveur de dev)
npm start
```

- Application : `http://localhost:4200`
- API mock : `http://localhost:3000`
- Comptes de demo : `admin / admin` ou `jane / jane`

### Commandes disponibles

```bash
npm start            # Lance json-server + ng serve en parallele
npm run serve        # Serveur Angular seul
npm run json-server  # API mock seule
npm run build        # Build de production
npm test             # Lance les 41 tests unitaires
```

## Architecture du projet

Le projet suit les principes de **Clean Architecture** avec une separation en couches :

```
src/app/
├── core/                          # Services singleton, guards, strategies
│   ├── auth/                      #   AuthService (gestion utilisateur par signaux)
│   ├── guards/                    #   isLoggedInGuard (CanMatchFn)
│   └── strategies/                #   CustomPreloadingStrategy
│
├── features/                      # Modules metier
│   ├── articles/
│   │   ├── domain/                #   Couche Domaine
│   │   │   ├── models/            #     Article, Comment (types)
│   │   │   └── gateways/         #     Classes abstraites (tokens DI)
│   │   ├── infra/                 #   Couche Infrastructure
│   │   │   ├── http-articles.ts   #     Implementation HTTP
│   │   │   └── http-comments.ts
│   │   └── pages/                 #   Couche Presentation
│   │       ├── home/              #     Liste des articles
│   │       └── article-detail/    #     Detail + commentaires
│   │
│   └── me/
│       ├── domain/                #   User model + UsersGateway
│       ├── infra/                 #   HttpUsersGateway
│       └── pages/                 #   Login, Register, Dashboard
│
├── pages/                         # Pages transversales
│   └── not-found/                 #   Page 404
│
└── shared/                        # Composants et services reutilisables
    ├── components/                #   Toast, ScrollToTop
    └── services/                  #   ToastService
```

### Couches Clean Architecture

| Couche | Contenu | Dependances |
|--------|---------|-------------|
| **Domain** | Models (types), Gateways (classes abstraites) | Aucune (pur TypeScript) |
| **Infrastructure** | Implementations HTTP des gateways | Domain, Angular HttpClient |
| **Presentation** | Composants Angular (pages) | Domain (via injection de l'abstraction) |

### Injection de dependances

Les composants injectent les **classes abstraites** (tokens DI), jamais les implementations concretes. Le wiring se fait dans `app.config.ts` :

```typescript
{ provide: ArticlesGateway, useClass: HttpArticlesGateway },
{ provide: CommentsGateway, useClass: HttpCommentsGateway },
{ provide: UsersGateway,    useClass: HttpUsersGateway },
```

Cela permet de swapper facilement les implementations (HTTP, in-memory, mock) sans toucher aux composants.

## Routing

### Configuration des routes

| Route | Composant | Chargement | Preload |
|-------|-----------|------------|---------|
| `/` | HomeComponent | Direct | - |
| `/articles/:id` | ArticleDetailComponent | Lazy | 2s |
| `/me/login` | LoginComponent | Lazy | 3s |
| `/me/register` | RegisterComponent | Lazy | 3s |
| `/me` | DashboardComponent | Lazy (protege) | 3s |
| `**` | NotFoundComponent | Lazy | - |

### Fonctionnalites de routing

- **Lazy loading** : composants et routes enfants charges a la demande
- **Custom Preloading Strategy** : precharge les routes marquees `preload: true` avec un delai configurable (`preloadDelay`)
- **Component Input Binding** : `withComponentInputBinding()` injecte les params de route comme `input()` dans les composants
- **View Transitions** : `withViewTransitions()` pour les animations de transition entre pages
- **Guard `canMatch`** : `isLoggedInGuard` protege le dashboard, redirige vers login si non connecte

## Fonctionnalites

### Articles
- Liste de tous les articles sur la page d'accueil
- Page de detail avec image, contenu et section commentaires
- Formulaire d'ajout de commentaire (Reactive Forms avec validation)

### Authentification
- Connexion / Inscription par formulaires reactifs
- Etat utilisateur gere par `signal<User | null>`
- Guard de route pour les pages protegees
- Deconnexion avec redirection

### Dashboard
- Affiche les commentaires recus sur les articles de l'utilisateur connecte
- Utilise `forkJoin` pour charger les articles puis leurs commentaires en parallele

### UX
- Notifications toast (succes, erreur, info) avec auto-dismiss
- Bouton scroll-to-top sur la page de detail
- Design dark theme (Slate + Teal) avec effets glassmorphism
- Responsive (grille adaptative `md:grid-cols-2`)

## API Endpoints (json-server)

| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/articles` | Tous les articles |
| GET | `/articles/:id` | Un article par ID |
| GET | `/articles?author=xxx` | Articles par auteur |
| POST | `/articles` | Creer un article |
| GET | `/comments?idArticle=xxx` | Commentaires d'un article |
| POST | `/comments` | Creer un commentaire |
| GET | `/users?login=x&password=y` | Authentification |
| POST | `/users` | Inscription |

## Tests

41 tests unitaires couvrant :

- **Services** : AuthService, ToastService
- **Guards** : isLoggedInGuard
- **Gateways HTTP** : HttpArticlesGateway, HttpCommentsGateway, HttpUsersGateway (avec `HttpTestingController`)
- **Composants** : Home, ArticleDetail, Login, Register, Dashboard, App

```bash
npm test
```

## Patterns et concepts cles

- **Standalone Components** : pas de NgModules, imports directs
- **Angular Signals** : gestion d'etat local reactive (`signal`, `computed`, `toSignal`)
- **Reactive Forms** : formulaires types avec validation
- **Template Control Flow** : `@if`, `@for`, `@empty` (syntaxe moderne)
- **Gateway Pattern** : abstraction de l'acces aux donnees via classes abstraites
- **Token-based DI** : injection par abstraction, wiring centralise dans `app.config.ts`
