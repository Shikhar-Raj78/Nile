import React, { useState } from "react";
import styles from "./auth.module.scss";
import { MdPassword } from "react-icons/md";
import Card from "../../components/card/Card";
import { Link, useParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import { toast } from "react-toastify";

const initialState = {
  password: "",
  password2: "",
};
const Reset = () => {
  const [formData, setformData] = useState(initialState);
  const { password, password2 } = formData;

  const { resetToken } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const reset = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      return toast.error("Passwords length should be atleast 6 characters");
    }
    if (password !== password2) {
      return toast.error("Passwords do not match");
    }
    const userData = {
      password,
      password2,
    };
    try{
        const data = await resetPassword(userData, resetToken)
        toast.success(data.message)
    }catch(error){
        console.log(error.message);
    }
  };
  return (
    <div className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <MdPassword size={35} color="#999" />
          </div>
          <h2>Reset Password</h2>
          <form onSubmit={reset}>
            <input
              type="password"
              placeholder="New password"
              required
              name="password"
              value={password}
              onChange={handleInputChange}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              required
              name="password2"
              value={password2}
              onChange={handleInputChange}
            />
            <button type="submit" className="--btn --btn-primary --btn-block">
              Reset Password
            </button>
            <div className={styles.links}>
              <p>
                <Link to="/">- Home</Link>
              </p>
              <p>
                <Link to="/login">- Login</Link>
              </p>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Reset;