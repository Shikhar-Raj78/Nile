import React, { useState } from "react";
import styles from "./auth.module.scss";
import { MdMarkEmailRead } from "react-icons/md";
import Card from "../../components/card/Card";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../../services/authService";
import { SET_LOGIN} from "../../redux/features/auth/authSlice";
import { Loader } from "../../components/loader/Loader";

const initialState = {
  email: "",
  otp: "",
};
function VerifyEmail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setformData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { email, otp} = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };
  const verifyemail = async (e) => {
    e.preventDefault();
    const data = {
      email,
      otp,
    };
    setIsLoading(true);
    try {
        const data = await verifyEmail(data)
        await dispatch(SET_LOGIN(true));
        navigate("/dashboard");
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
            <MdMarkEmailRead size={35} color="#fff" />
          </div>
          <h2>Email Veification</h2>
          <form onSubmit={verifyemail}>
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
              <i className={`fa fa-key fa-2x ${styles.icon}`} style={{color: 'white'}}></i>
              <input
                type='text'
                placeholder="Enter OTP"
                required
                name="otp"
                value={otp}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="--btn --btn-primary --btn-block">
                Verify Email
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default VerifyEmail;
