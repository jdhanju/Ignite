import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken"

// Verify tokens from Firebase Auth on server-end to confirm user
export default function verifyToken(token) {
  const decoded = jwt.decode(token)
  
  if (decoded.email_verified)
    return decoded.email;
  else
    return {error: "Email has not been verified"};
}