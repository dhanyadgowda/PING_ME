import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assests/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";
function LoginPage() {
  const navigate = useNavigate();

  const [values, setvalues] = useState({
    username: "",
    password: "",
  });

  const toastoptions = {
    position: "bottom-right",
    autoClose: 9000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  }, []);

  const handlesubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { password, username } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastoptions);
      }
      if (data.status === true) {
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        navigate("/");
      }
    }
  };

  function handleValidation() {
    const { username, password } = values;
    if (!username) {
      toast.error("Username is required", toastoptions);
      return false;
    }
    if (!password) {
      toast.error("Password is required", toastoptions);
      return false;
    }
    return true;
  }

  function handleChange(event) {
    setvalues({ ...values, [event.target.name]: event.target.value });
  }
  return (
    <>
      <FormContainer>
        <form onSubmit={handlesubmit}>
          <div className="brand">
            <img src={Logo} alt="logo " />
            <h1>PING-ME</h1>
          </div>
          <input
            type="text"
            placeholder="username"
            name="username"
            min="3"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            onChange={(e) => handleChange(e)}
          />

          <button type="submit">Login</button>
          <span>
            Dont have an account? <Link to="/register">Register</Link>{" "}
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}
const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default LoginPage;
