# ConsignO Cloud – Suite de tests automatisés Playwright

Évaluation technique QA – Portage CyberTech
Plateforme testée : https://cloud.consigno.com

---

## Prérequis

- [Node.js](https://nodejs.org) v18 ou supérieur
- npm (inclus avec Node.js)

---

## Installation

```bash
# 1. Installer les dépendances npm
npm install

# 2. Installer les navigateurs Playwright
npx playwright install chromium
```

---

## Lancer les tests

```bash
# Tous les tests (100 tests)
npm test

# Avec navigateur visible
npm run test:headed

# Par suite
npm run test:auth        # Authentification       (18 tests)
npm run test:dashboard   # Tableau de bord         (24 tests)
npm run test:projects    # Création de projet      (19 tests)
npm run test:account     # Compte utilisateur      (15 tests)
npm run test:templates   # Modèles                 (13 tests)
npm run test:access      # Navigation & accès      ( 9 tests)
# Note : 07-logout s'exécute automatiquement en dernier via npm test (projet isolé)

# Rapport HTML interactif (après exécution)
npm run report
```

---

## Structure du projet

```
├── playwright.config.ts              # Configuration : baseURL, timeout, reporter
├── fixtures/
│   └── auth.fixture.ts               # Fixture d'authentification réutilisable
├── pages/                            # Page Object Model
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── ProjectCreatePage.ts
│   ├── UserAccountPage.ts
│   └── TemplatesPage.ts
├── tests/
│   ├── 01-auth.spec.ts               # 18 tests – Authentification
│   ├── 02-dashboard.spec.ts          # 24 tests – Tableau de bord
│   ├── 03-project-creation.spec.ts   # 19 tests – Création de projet
│   ├── 04-user-account.spec.ts       # 15 tests – Compte utilisateur
│   ├── 05-templates.spec.ts          # 13 tests – Modèles
│   ├── 06-navigation-and-access-control.spec.ts  # 9 tests – Navigation & accès
│   └── 07-logout.spec.ts             #  2 tests – Déconnexion (projet isolé, s'exécute en dernier)
└── utils/
    └── test-data.ts                  # Données de test centralisées
```

---

## Résultats obtenus

| Suite | Tests | Statut |
|-------|------:|--------|
| 01-auth | 18 | ✅ 18/18 |
| 02-dashboard | 24 | ✅ 24/24 |
| 03-project-creation | 19 | ✅ 19/19 |
| 04-user-account | 15 | ✅ 15/15 |
| 05-templates | 13 | ✅ 13/13 |
| 06-navigation | 9 | ✅ 9/9 |
| 07-logout | 2 | ✅ 2/2 |
| **Total** | **100** | **✅ 100/100** |

---

## Architecture de la suite logout

Le fichier `07-logout.spec.ts` est isolé dans un projet Playwright séparé (défini en dernier dans `playwright.config.ts`) et n'utilise **pas** le `storageState` partagé. Chaque test effectue un login indépendant afin d'éviter d'invalider la session serveur des autres suites (cascade de timeouts).

---

## Bonnes pratiques appliquées

- **Page Object Model (POM)** – sélecteurs séparés de la logique de test
- **Fixture d'authentification** – session réutilisable, pas de login répété
- **Sélecteurs sémantiques** – `getByRole`, `getByText`, attributs ARIA
- **Données externalisées** – `utils/test-data.ts`, jamais codées en dur
- **Tests orientés métier** – chaque suite justifie son périmètre métier en commentaire
- **Isolation du logout** – projet séparé pour éviter toute invalidation de session partagée
