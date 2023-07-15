import { Switch } from "@mui/material";
import Input from "../components/Input";
import useForm from "../hooks/useForm";
import Hero from "../assets/Hero.jpg"
import GoogleLogo from "../assets/google.png"
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { auth as firebaseAuth, provider as googleProvider } from "../Firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { validateLoginForm } from "../helpers/formValidator";
import useLogin from "../hooks/useLogin";
import { loginWithGoogle } from "../api/internal/postgres";

export default function Login() {
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState({
    form: "",
  })
  const [errorMessagesEnabled, setErrorMessagesEnabled] = useState(false);
  const [rememberMeChecked, setRememberMeChecked] = useState(false);
  const login = useLogin();
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const [formState, handleInputChange] = useForm({
    "username": "",
    "password": "",
  });

  const heroImg = useLoaderData();

  const handleClickGoogleBtn = async () => {
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    // JWT from Google
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.idToken;

    try {
      const userData = await loginWithGoogle(token);
      dispatch({type: "LOGIN", payload: userData});
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Client-side input validation
    let {isValid, errors: {form} } = validateLoginForm(formState);

    // Form is validated on client, attempt to login user on server
    if (isValid) {
      try {
        await login(formState);
      } catch (error) {
        console.log(error);
        isValid = false;
        form = error.message;
      }
    } else {
      form = "Invalid login credentials"
    }

    // Set error messages state
    setIsValid(isValid);
    setErrors({form});
  }
  
  return (
    <div className="w-full min-h-screen flex">
      {/* Hero Image */}
      <div className="overflow-hidden">
        {heroImg}
      </div>

      {/* Form Sidebar*/}
      <main className="w-full min-h-screen ml-auto px-12 py-6 flex flex-shrink-0 flex-col 
      justify-center sm:w-[28rem] items-center">
        
        <form onSubmit={(e) => handleSubmit(e)} className="mb-10 max-w-sm w-full">
          <h1 className="font-display text-blue-500 font-bold text-4xl mb-0">Date Planner</h1>
          <h2 className="font-semibold text-lg ml-[3px] tracking-wide mb-4">Nice to see you again</h2>

          {/* Error Message Popup */}
          { !isValid && errors.form &&
            <div className="my-4 ml-1 text-red-500">{errors.form}</div>
          }

          {/* Main Form Section */}
          <section className="space-y-4 border-b-2 pb-8 border-gray-100">
            <Input id="username" name="username" label="Login" placeholder="Email or username" 
            updateForm={handleInputChange} />
            <Input id="password" name="password" label="Password" placeholder="Enter password" 
            updateForm={handleInputChange} type="password" />

            <div className="w-full">
              <div className="w-full flex items-center">
                <Switch 
                  checked={rememberMeChecked} 
                  onClick={() => setRememberMeChecked(!rememberMeChecked)}
                /> 
                <span className="text-sm">Remember me</span>
                <a className="text-sm ml-auto mr-4">Forgot password?</a>
              </div>
            </div>
            
            <button 
              className="w-full bg-blue-500 text-white font-semibold h-10 rounded-md 
              hover:brightness-110 transition duration-200"
            >
              Sign in
            </button>
          </section>

          {/* Alternate Login Section */}
          <section className="mt-8">
            {/* Google sign-in button */}
            <button
              type="button"
              onClick={handleClickGoogleBtn}
              className="w-full bg-gray-800 text-white h-10 rounded-md text-sm font-semibold 
              flex items-center justify-center"
            >
              <img src={GoogleLogo} className="h-5 w-5 inline-block mr-2"></img>Or sign in with Google
            </button>

            {/* Links */}
            <div className="text-sm mt-8 flex justify-center">
              Don't have an account?
              <Link to="/signup" className="ml-3">Sign up now</Link>
            </div>
          </section>
        </form>
      </main>
    </div>
  )
}

// Preload large hero image
export function loader() {
  return (<img src={Hero} className="object-cover w-full h-full" alt="Concert Lights" />);
}