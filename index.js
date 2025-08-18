require("dotenv").config();
const MongoStore = require("connect-mongo");
const express = require("express");
const cors = require("cors");
const session = require("express-session");

const connectDB = require("./Config/db");
const app = express();

const recipeController = require("./Controllers/recipeController");
const albumController = require("./Controllers/albumController");
const authController = require("./Controllers/authController");

const validate = require("./middleware/validate");
const createRecipeSchema = require("./middleware/recipeValidator");
const { createAlbumSchema, updateAlbumSchema, addRecipeToAlbumSchema } = require("./middleware/albumValidator");
const { signUpSchema, loginSchema } = require("./middleware/userValidator");
const uploadImage = require("./middleware/s3Uploader");
const parseArray = require("./middleware/parseInput");
const userAuth = require("./middleware/userAuth");

// CORS configuration to allow credentialed requests from the frontend
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());



//DB connections
connectDB();

//Setting up session
app.use(
  session({
    secret: "jkfwjenw",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // Use your MongoDB connection string
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: false, // set to true behind HTTPS in production
      sameSite: "lax",
    },
  })
)



//Routes (http://localhost:2356/recipes)
app.post(
  "/recipes",
  userAuth,
  uploadImage,
  parseArray,
  validate(createRecipeSchema),
  recipeController.addRecipe
);

app.get("/recipes", recipeController.fetchRecipes);

app.get("/recipes/search", recipeController.searchRecipes);

app.get("/recipes/:id", recipeController.obtainRecipeByID);

app.put(
  "/recipes/:id",
  userAuth,
  uploadImage,
  parseArray,
  validate(createRecipeSchema),
  recipeController.updateRecipeByID
);

app.delete("/recipes/:id", userAuth, recipeController.deleteRecipeByID);

// Album routes
app.post(
  "/albums",
  userAuth,
  validate(createAlbumSchema),
  albumController.createAlbum
);

app.get("/albums/:userId", userAuth, albumController.getUserAlbums);

app.get("/albums/detail/:albumId", userAuth, albumController.getAlbumById);

app.put(
  "/albums/:albumId",
  userAuth,
  validate(updateAlbumSchema),
  albumController.updateAlbum
);

app.delete("/albums/:albumId", userAuth, albumController.deleteAlbum);

app.post(
  "/albums/:albumId/recipes",
  userAuth,
  validate(addRecipeToAlbumSchema),
  albumController.addRecipeToAlbum
);

app.delete("/albums/:albumId/recipes/:recipeId", userAuth, albumController.removeRecipeFromAlbum);

app.get("/albums/:userId/check-saved/:recipeId", userAuth, albumController.checkRecipeSaved);

//Route(signup)

app.post(
  "/auth/signUp",
  validate(signUpSchema),
  authController.signUp
);

app.post(
  "/auth/confirmSignUp",
  authController.confirmSignUp
);

app.post(
  "/auth/login",
  validate(loginSchema),
  authController.login
);

// Forgot password routes
app.post(
  "/auth/forgot-password",
  authController.forgotPassword
);

app.post(
  "/auth/confirm-forgot-password",
  authController.confirmForgotPassword
);

// Check authentication status
app.get(
  "/auth/check-status",
  authController.checkAuthStatus
);

// Logout user
app.post(
  "/auth/logout",
  authController.logout
);

//Start server
app.listen(process.env.PORT, () => console.log("Server running on port 2356"));

// Server -> Controller -> Services -> Model
