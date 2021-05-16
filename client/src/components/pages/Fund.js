import { Link } from "react-router-dom";
import { useQuery } from "react-query";

import Card from "../Card";
import { API } from "../service/api";
import Loading from "../../assets/Process.gif";
import { useContext } from "react";
import { UserContext } from "../service/userContext";

const Fund = () => {
  const [state] = useContext(UserContext);
  let { isLoading, error, data } = useQuery("fund", async () => {
    const response = await API.get("/funds/" + state?.user?.id);
    return response.data.data.funds;
  });

  return (
    <>
      <div>
        <div className="header-fund">
          <h1>My Raise Fund</h1>
          <Link to="/form">
            <button className="card1-btn fund-btn">Make Raise Fund</button>
          </Link>
        </div>

        {data && (
          <div className="cards1">
            <Card data={data} button="View Fund" link="view" />
          </div>
        )}
      </div>

      <div className="notfound">
        {isLoading && <img src={Loading} alt="Loading" />}
        {error && (
          <>
            <div className="funderror alert alert-danger py-1">
              <small>There no data</small>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Fund;
