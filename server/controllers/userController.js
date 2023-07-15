import bcrypt from 'bcrypt';
import pool from '../postgres.js'
import verifyToken from '../helpers/verifyGoogleToken.js';

const SALT_ROUNDS = 10;

// Helper function: Remove fields from database response user object
const createUserSession = (userData) => {
  const { username, email, avatar_url } = userData;
  return { username, email, avatar_url };
}

const userController = {};

userController.loginUser = async (req, res, next) => {
  const {username, password} = req.body;
  let result;

  if (username.includes("@")) {
    result = await pool.query("SELECT * FROM users WHERE email = $1", [username])
  } else {
    result = await pool.query("SELECT * FROM users WHERE username = $1", [username])
  }

  if (result.rows.length > 0) {
    const userData = result.rows[0];
    const hashedPassword =  userData.password;
    bcrypt.compare(password, hashedPassword, (err, result) => {
      if (!result) {
        // Invalid password
        res.status(401).send({error: "Invalid login credentials"});
      } else {
        // Login success - create a session
        const userSession = createUserSession(userData);
        req.session.regenerate((err) => {
          if (err) next(err);
          req.session.user = {...userSession};
          res.json(req.session.user);
        })
      }
    })
  } else {
    res.status(401).send({error: "Invalid login credentials"});
  }
}

userController.signupUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  const userExistsQuery = "SELECT * FROM users \
                              WHERE username = $1 \
                              OR email = $2";
  const userExistsResult = await pool.query(userExistsQuery, [username, email]);

  // If user already exists in DB, don't sign up
  if (userExistsResult.rows.length > 0) {
    return res.status(409).send({error: "Username/email already taken"});
  }

  const insertUserQuery = "INSERT INTO users(username, email, password, password_salt) \
                              VALUES ($1, $2, $3, $4) \
                              RETURNING (id)";

  // Create password hash using bcrypt
  bcrypt.genSalt(SALT_ROUNDS, function(err, salt) {
    bcrypt.hash(password, salt, async function(err, hash) {
      // Insert into DB and then return the newly inserted row
      const result = await pool.query(insertUserQuery, [username, email, hash, salt]);
      const id = result.rows[0].id;
      const userData = (await pool.query("SELECT * FROM users WHERE id = $1", [id])).rows[0];
      const userSession = createUserSession(userData);
      req.session.user = userSession;
      res.json(userSession);
    });
  });
}

userController.getUsers = async(req, res, next) => {
  const usersQuery = "SELECT username, email, avatar_url FROM users";
  const usersResult = await pool.query(usersQuery);
  res.json(usersResult.rows);
}

userController.getUserByEmail = async(req, res, next) => {
  const {email} = req.query;
  const userExistsQuery = "SELECT * FROM users WHERE email = $1";
  const result = await pool.query(userExistsQuery, [email]);
  if (result.rows.length)
    res.json(result.rows[0]);
  else
    res.json({error: "No user with matching email found"});
}

userController.getUserByUsername = async(req, res, next) => {
  const {username} = req.query;
  const userExistsQuery = "SELECT * FROM users WHERE username = $1";
  const result = await pool.query(userExistsQuery, [username]);
  if (result.rows.length)
    res.json(result.rows[0]);
  else
    res.json({error: "No user with matching username found"});
}

userController.getSession = (req, res, next) => {
  if (req.session.user) {
    console.log("Session exists:", req.session.user);
    res.json(req.session.user);
  } else {
    res.json({error: "No session available"});
  }
}

userController.endSession = (req, res, next) => {
  // regenerate wasn't working for some reason
  req.session.destroy();
  res.status(200).end();
}

userController.loginWithGoogle = async (req, res, next) => {
  // Extracting Bearer Token from headers
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];

  // Get email from decoded token
  const email = await verifyToken(token);
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const {username, avatar_url} = result.rows[0];
  const userData = {username, email, avatar_url};
  req.session.user = {...userData};
  res.status(200).json(userData)
}

export default userController;