import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { useQuery } from "react-query";

import { API } from "./service/api";
import convert from "./service/convert";
import { UserContext } from "./service/userContext";
import Modal from "./modal/Modal";
import Login from "./modal/Login";
import Register from "./modal/Register";

const Card1 = ({ data, button, link }) => {
  const [state] = useContext(UserContext);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleCloseRegister = () => {
    setShowRegister(false);
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };
  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const toggleToRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const toggleToLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  let { data: donate } = useQuery("donatecard", async () => {
    const response = await API.get("/donates");
    return response.data.data;
  });

  console.log(donate);

  return (
    <>
      <Modal show={showLogin} handleClose={handleCloseLogin}>
        <Login toggle={toggleToRegister} handleClose={handleCloseLogin} />
      </Modal>
      <Modal show={showRegister} handleClose={handleCloseRegister}>
        <Register toggle={toggleToLogin} handleClose={handleCloseLogin} />
      </Modal>

      {data.map((content) => (
        <div className="card1" key={content.id}>
          <img
            className="card1-img"
            src={`http://localhost:9000/${content.thumbnail}`}
            alt=""
          />
          <div className="card1-body">
            <div>
              <h1 className="card1-title">{content.title}</h1>
            </div>
            <div className="card1-content">
              <p>{content.description}</p>
            </div>
            <div className="card1-wrapperFooter">
              {donate &&
                donate.map((progress, index) =>
                  progress.fundId === content.id ? (
                    <progress
                      className="progress"
                      value={progress.donateAmount}
                      max={content.goal}
                      key={index}
                    ></progress>
                  ) : null
                )}

              <div className="card1-footer">
                <p>
                  Rp {""}
                  {donate &&
                    donate.map((money) =>
                      money.fundId === content.id
                        ? convert(money.donateAmount)
                        : null
                    )}
                </p>
                {state.login ? (
                  <Link to={`/${link}/${content.id}`}>
                    <button className="card1-btn">{button}</button>
                  </Link>
                ) : (
                  <label
                    onClick={handleShowLogin}
                    className="link-login card1-btn"
                  >
                    Donate
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Card1;
