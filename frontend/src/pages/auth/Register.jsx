import React, { useState } from "react";
import styles from "./auth.module.scss";
import { TiUserAddOutline } from "react-icons/ti";
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser, validateEmail } from "../../services/authService";
import { useDispatch } from "react-redux";
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";
import { Loader } from "../../components/loader/Loader";

const initialState = {
  name: "",
  email: "",
  password: "",
  password2: "",
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setformData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [eyeicon, setEyeIcon] = useState('-eye')
  const [visibility, setVisibility] = useState('password')
  const { name, email, password, password2 } = formData;

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
  const register = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error("All fields are required");
    }
    if (password.length < 8) {
      return toast.error("Passwords length should be atleast 8 characters");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }
    if (password !== password2) {
      return toast.error("Passwords do not match");
    }
    const username = name
    const userData = {
      username,
      email,
      password,
    };

    setIsLoading(true);
    try {
      const data = await registerUser(userData);
      // console.log(data)
      // await dispatch(SET_LOGIN(true));
      console.log(data.name)
      await dispatch(SET_NAME(data.name));
      navigate("/verifyEmail");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <TiUserAddOutline size={35} color="#fff" />
          </div>
          <h2>Sign Up</h2>
          <form onSubmit={register}>
            <div className={`${styles.input_icons}`}>
              <i className={`fa fa-user fa-2x ${styles.icon}`}></i>
              <input
                type="text"
                placeholder="Name"
                required
                name="name"
                value={name}
                onChange={handleInputChange}
              />
            </div>
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
              <i onClick={showPassword} className={`fa fa${eyeicon} fa-2x ${styles.icon}`} style={{cursor: 'pointer'}}></i>
              <input
                type={`${visibility}`}
                placeholder="Password"
                required
                name="password"
                value={password}
                onChange={handleInputChange}
              />
            </div>
            <div className={`${styles.input_icons}`}>
              <i onClick={showPassword} className={`fa fa${eyeicon} fa-2x ${styles.icon}`} style={{cursor: 'pointer'}}></i>
              <input
                type={`${visibility}`}
                placeholder="Confirm Password"
                required
                name="password2"
                value={password2}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="--btn --btn-primary --btn-block">
              Register
            </button>
          </form>
          <span className={styles.register}>
            <Link to="/">Home</Link>
            <p>&nbsp;Already have an account? &nbsp;</p>
            <Link to="/login">Login</Link>
          </span>
        </div>
      </Card>
    </div>
  );
};

export default Register;
