import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { useContext } from "react";

import { API } from "../service/api";
import dateConvert from "../service/dateConvert";
import convert from "../service/convert";
import { UserContext } from "../service/userContext";

import Default from "../../assets/default.png";
import ServerError from "../../assets/500 Internal Server Error.gif";
import Loading from "../../assets/Process.gif";

function Profile() {
  const [state] = useContext(UserContext);

  const { id } = useParams();
  let { isLoading, error, data } = useQuery("user", async () => {
    const response = await API.get("/user/" + id);
    return response.data.data.user;
  });

  let { data: donate } = useQuery("donateprofile", async () => {
    const response = await API.get("/donate");
    return response.data.data;
  });

  return (
    <>
      <div className="notfound">
        {isLoading && <img src={Loading} alt="Loading" />}
        {error && (
          <>
            <img src={ServerError} alt="server error. can't fetch data" />
          </>
        )}
      </div>

      {data && donate && (
        <div className="container-profile">
          <div className="profile">
            <h1>My Profile</h1>
            <div className="profile-detail">
              <div className="profile-img">
                <img
                  src={
                    data.avatar
                      ? `http://localhost:9000/${data.avatar}`
                      : Default
                  }
                  alt="#"
                />
              </div>
              <div className="profile-content">
                <h6>Full Name</h6>
                <p>{data.fullName}</p>
                <h6>Email</h6>
                <p>{data.email}</p>
                <h6>Phone</h6>
                <p>{data.phone}</p>
              </div>
            </div>
            <Link to={`/updateprofile/${data.id}`}>
              <button className="card1-btn">Edit Profile</button>
            </Link>
          </div>
          <div className="transactions">
            <h1>History Donation</h1>
            <div className="list-donation">
              {donate.map((content) =>
                content.userId === state?.user?.id ? (
                  <div className="donation" key={content.id}>
                    <div className="donation-body">
                      <h3>{content.title}</h3>
                      <p>{dateConvert(content.createdAt)}</p>
                    </div>
                    <div className="donation-footer">
                      <p>Total : Rp {convert(content.donateAmount)}</p>
                      {content.status === "success" ? (
                        <p className="condition">{content.status}</p>
                      ) : (
                        <p className="pending">{content.status}</p>
                      )}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
