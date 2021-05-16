import { useState, useContext } from "react";
import { API, setAuthToken } from "../service/api";
import { UserContext } from "../service/userContext";

const Login = ({ toggle, handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [, dispatch] = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const body = JSON.stringify({ email, password });
      const response = await API.post("/login", body, config);

      setMessage(response.data.message);
      setAuthToken(response.data.data.user.token);

      dispatch({
        type: "login",
        payload: response.data.data.user,
      });
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="modal-content">
        <div className="modal1">
          <h2 className="title-modal1">Login</h2>
          {message && (
            <div className="alert alert-danger py-1">
              <small>{message}</small>
            </div>
          )}
          <form className="form-modal1" onSubmit={handleLogin}>
            <input
              className="input-modal1"
              type="text"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input-modal1"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn-modal1">Login</button>
          </form>
          <p className="text-modal1">
            Don't have an account ? Click{" "}
            <label onClick={toggle} className="text-here">
              here
            </label>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
