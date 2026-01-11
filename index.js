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
// Supports multiple origins (comma-separated in CLIENT_URL) or single origin
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',').map(origin => origin.trim())
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('CORS blocked request from origin:', origin);
      console.warn('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));


app.use(express.json());

// Middleware to log Set-Cookie headers for debugging
app.use((req, res, next) => {
  const originalSetHeader = res.setHeader.bind(res);
  res.setHeader = function(name, value) {
    if (name.toLowerCase() === 'set-cookie') {
      console.log('Set-Cookie header being sent:', value);
    }
    return originalSetHeader(name, value);
  };
  next();
});

//DB connections
connectDB();
app.set("trust proxy", true); // Trust all proxies (needed for Google Cloud/Heroku proxy chain)

//Setting up session
app.use(
  session({
    secret: "jkfwjenw",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      // domain is not set - browser will handle it automatically
    },
    name: 'connect.sid', // Explicit cookie name
  })
);


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
