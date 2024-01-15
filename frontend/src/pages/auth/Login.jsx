import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useLoginMutation } from "../../redux/api/usersApiSlice.js";

import Loader from "../../components/Loader.jsx";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { BiHide, BiShowAlt } from "react-icons/bi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("User Successfully LoggedIn");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An error occurred during login.");
      }
    }
  };

  return (
    <div className="grid place-content-center items-center bg-[#0E1629] min-h-[100vh]">
      <section className="ml-2 px-6 flex justify-around items-center flex-wrap gap-8 w-full text-[#ffffff] overflow-hidden pt-[8%]">
        <div className="text-[#e0e0e0]">
          <h1 className="text-xl md:text-2xl 2xl:text-3xl font-semibold mb-4 text-[#F6F6F6]">
            Log In
          </h1>
          <h1 className="text-lg md:text-2xl 2xl:text-2xl font-medium mb-2">
            Welcome to Nile! 👋🏻
          </h1>
          <p className="text-base md:text-lg font-medium mb-4">
            Please sign-in to your account and start the adventure
          </p>

          <form
            onSubmit={submitHandler}
            className="container w-[21rem] md:w-[33rem] 2xl:w-[36rem]"
          >
            <div className="">
              <label
                htmlFor="email"
                className="flex items-center gap-3 text-lg font-medium mb-2 "
              >
                <HiOutlineMail size={26} className="text-[#08D9D6]" />
                <span>Email</span>
              </label>

              <input
                type="email"
                id="email"
                className="mt-1 p-2 border rounded  w-[320px] md:w-[460px] 2xl:w-[520px] mb-4 bg-[#0E1629] placeholder-[#eaeaeab9]  text-[#F6F6F6] outline-none border-[#57575b] focus:border-[#FF2E63]"
                placeholder="jhon.doe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="mb-2">
              <label
                htmlFor="password"
                className="flex items-center gap-3 text-lg font-medium mb-2 "
              >
                <RiLockPasswordLine size={26} className="text-[#08D9D6]" />
                Password
              </label>
              <div className="relative">
                <input
                  type={isVisiblePass ? "text" : "password"}
                  id="password"
                  className="mt-1 p-2 border rounded  w-[320px] md:w-[460px] 2xl:w-[520px] bg-[#0E1629] placeholder-[#eaeaeab9] text-[#F6F6F6] outline-none border-[#57575b] focus:border-[#FF2E63]"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-8 top-3 md:top-[15px] md:right-24 cursor-pointer"
                  onClick={() => setIsVisiblePass(!isVisiblePass)}
                >
                  {isVisiblePass ? (
                    <BiShowAlt size={20} />
                  ) : (
                    <BiHide size={20} />
                  )}
                </span>
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="bg-[#db1143f3] hover:bg-[#FF2E63] transition-colors text-white border-none outline-none w-[320px] md:w-[460px] 2xl:w-[520px] px-4 py-2 rounded cursor-pointer my-[1rem] text-base font-semibold
              "
            >
              {isLoading ? "Signing In..." : "Login"}
            </button>

            {isLoading && <Loader />}
          </form>

          <div className="mt-4">
            <p className="text-lg">
              New Customer?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-[#7367F0] hover:underline shadow-2xl shadow-white"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Login;
