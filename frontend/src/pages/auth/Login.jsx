import React, { useState } from "react";
import styles from "./auth.module.scss";
import { BiLogIn } from "react-icons/bi";
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginUser, validateEmail } from "../../services/authService";
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";
import { Loader } from "../../components/loader/Loader";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setformData] = useState(initialState);
  const [eyeicon, setEyeIcon] = useState('-eye')
  const [visibility, setVisibility] = useState('password')
  const { email, password } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  function showPassword() {
    if (eyeicon === "-eye") {
      setEyeIcon("-eye-slash");
      setVisibility("text");
    } else if (eyeicon === "-eye-slash") {
      setEyeIcon("-eye");
      setVisibility("password");
    }
  }

  const login = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("All fields are required");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }
    if (password.length < 8) {
      return toast.error("Passwords length should be atleast 6 characters");
    }

    const userData = {
      email,
      password,
    };
    setIsLoading(true);
    try {
      const data = await loginUser(userData);
      console.log(data);
      await dispatch(SET_LOGIN(true));
      await dispatch(SET_NAME(data.name));
      navigate("/dashboard");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
    console.log(formData);
  };

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <BiLogIn size={35} color="#fff" />
          </div>
          <h2>Login</h2>
          <form onSubmit={login}>
            <div className={`${styles.input_icons}`}>
              <i className={`fa fa-envelope fa-2x ${styles.icon}`}></i>
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={handleInputChange}
              />
            </div>
            <div className={`${styles.input_icons}`}>
              <i
                onClick={showPassword}
                className={`fa fa${eyeicon} fa-2x ${styles.icon}`}
                style={{ cursor: "pointer" }}
              ></i>
              <input
                type={`${visibility}`}
                placeholder="Password"
                required
                name="password"
                value={password}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="--btn --btn-primary --btn-block">
              Login
            </button>
          </form>
          <Link to="/forgot">Forgot Password</Link>
          <span className={styles.register}>
            <Link to="/">Home</Link>
            <p>&nbsp;Don't have an account? &nbsp;</p>
            <Link to="/register">Register</Link>
          </span>
        </div>
      </Card>
    </div>
  );
};

export default Login;
