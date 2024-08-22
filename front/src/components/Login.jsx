import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../constants";
import "../styles/mix.css";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { affiliateLink } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem("userInfo");
    if (isAuthenticated) navigate("/dashboard");
  }, [navigate]);

  const sendLogin = async (e) => {
    e.preventDefault();
    try {
      if (email === "") {
        toast.error("Enter Your Email!");
      } else if (!email.includes("@")) {
        toast.error("Enter a Valid Email!");
      } else {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        setLoading(true); // Start loading
        await axios
          .post(`${baseURL}/api/users/login`, { email, password }, config)
          .then((res) => {
            localStorage.setItem("userInfo", JSON.stringify(res.data));
            navigate("/dashboard");
          })
          .catch((err) => {
            toast.error(err.response.data.error);
          });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      <section style={{ fontFamily: "cursive", fontSize: "20px" }}>
        <div className="form_data">
          <div className="form_heading">
            <h1>Welcome Back, Log In</h1>
            <p>Hi, we are glad you are back. Please login.</p>
          </div>
          <form>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email Address"
                disabled={loading} // Disable input when loading
              />
            </div>
            <div className="form_input">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your Password"
                disabled={loading} // Disable input when loading
              />
            </div>
            <button
              className="btn"
              onClick={sendLogin}
              style={{ backgroundColor: "green" }}
              disabled={loading} // Disable button when loading
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p>
              Don't have an account?{" "}
              <NavLink to={`/register/${affiliateLink}`}>Sign up</NavLink>
            </p>
          </form>
        </div>
        <ToastContainer autoClose={3000} draggableDirection="x" />
      </section>
    </>
  );
};

export default Login;
