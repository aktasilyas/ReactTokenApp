import { useState, useRef,useContext } from "react";

import classes from "./AuthForm.module.css";
import AuthContext from "../store/auth-context"
const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const AuthCtx=useContext(AuthContext)
debugger
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    setLoading(true);
    let url = "";
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC3s0BGR42flQrWuhWf12XVbu7_DUA7-PM";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC3s0BGR42flQrWuhWf12XVbu7_DUA7-PM";
    }
    fetch(url, {
      method: "Post",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            //show and error modal
            let errorMessage = "Authentication failed!";
            if (data && data.error && data.error.message)
              errorMessage = data.error.message;

              console.log(errorMessage)

            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
       AuthCtx.login(data.idToken)
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!loading && <button>{isLogin ? "Login" : "Create Account"}</button>}
          {loading && <p>Loading...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
