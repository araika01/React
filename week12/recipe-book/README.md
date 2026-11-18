# Recipe Book — React Application

## Project Description

Recipe Book is a web application built with React and Vite. Users can browse recipes, search for recipes, apply filters, and view detailed cooking instructions.

The application supports user authentication with Firebase and data caching with TanStack Query. Users can also create, edit, and delete their own recipes.

## Features

### Recipe Management
- Browse a list of recipes.
- Search recipes by title.
- Filter recipes by cuisine, difficulty, and cooking time.
- Sort recipes by title, cooking time, and rating.
- Navigate between pages using pagination.
- View recipe details, including ingredients and cooking steps.
- Add recipes to favorites.
- Create new recipes.
- Edit and delete user-added recipes.

### Firebase Authentication
- Register using email and password.
- Log in using email and password.
- Sign in with Google.
- Log out of the application.
- Keep users signed in after refreshing the page.
- Protect the Profile page from unauthorized access.
- Display the authenticated user's email and UID.
- Update navigation links based on authentication status.

### TanStack Query
- Fetch recipe data using `useQuery`.
- Cache API results to avoid unnecessary requests.
- Use query keys that include search, filters, sorting, and pagination.
- Set a cache freshness time of 5 minutes.
- Handle loading and error states.
- Use `useMutation` for Create, Update, and Delete.
- Invalidate cached recipe lists after data changes.

## Technologies Used

- React
- Vite
- JavaScript
- React Router
- Firebase Authentication
- TanStack Query
- CSS
- LocalStorage

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/araika01/React.git
   ```

2. Open the project folder:

   ```bash
   cd React/week11/recipe-book
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the project root.

   Copy the variable names from `.env.example` and replace the example values with your Firebase project configuration.

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. In Firebase Console, enable Email/Password and Google sign-in methods. Add your deployment domain to Firebase Authentication's authorized domains.

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open the local URL displayed in the terminal.

## Project Structure

```text
src/
├── components/
│   ├── NavBar.jsx
│   ├── ProtectedRoute.jsx
│   ├── RecipeForm.jsx
│   ├── RecipeList.jsx
│   ├── FilterBar.jsx
│   └── Pagination.jsx
├── context/
│   └── AuthContext.jsx
├── hooks/
│   └── useFavorites.js
├── pages/
│   ├── RecipesPage.jsx
│   ├── RecipeDetailsPage.jsx
│   ├── AddRecipePage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   └── ProfilePage.jsx
├── services/
│   └── api.js
├── firebase.js
├── App.jsx
└── main.jsx
```

## Routing

The application uses React Router with HashRouter.

Main routes:

| Route | Description |
|---|---|
| `/` | Home page |
| `/recipes` | Recipe catalog |
| `/recipes/:id` | Recipe details |
| `/add` | Create a recipe |
| `/login` | User login |
| `/signup` | User registration |
| `/profile` | Protected user profile |
| `/dashboard` | Recipe dashboard |
| `/about` | About page |

Unauthenticated users who try to open `/profile` are redirected to `/login`.

## Data Storage

The application uses a simulated asynchronous API with Promises and LocalStorage.

- Recipe data is stored in the browser's LocalStorage.
- The initial recipe dataset is generated when no saved data exists.
- API requests include simulated delays and occasional errors.
- User-created recipes are stored locally in the browser.
- TanStack Query manages the in-memory cache of API responses.

Firebase Authentication is used for user accounts, not recipe storage.

Because recipes are stored locally, changes are specific to the browser where they were made.

## Cache Invalidation

After a recipe is created, updated, or deleted, the application invalidates the recipe list cache:

```javascript
queryClient.invalidateQueries({
  queryKey: ["recipes"],
});
```

This allows recipe lists to fetch updated data instead of continuing to display outdated cached results.

## Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Deployment

The project is designed for deployment to GitHub Pages.

Firebase environment variables must be available during the production build. The `.env.local` file is ignored by Git and is not uploaded to GitHub.

Firebase Authentication also requires the deployed domain to be included in the Firebase authorized domains list.
