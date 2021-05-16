import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useQuery } from "react-query";

import Uploader from "../Uploader";
import ServerError from "../../assets/500 Internal Server Error.gif";
import Loading from "../../assets/Process.gif";

import { API } from "../service/api";

const UpdateProfile = () => {
  const History = useHistory();
  const { id } = useParams();

  let { data, isLoading, error } = useQuery("updateuser", async () => {
    const response = await API.get("/user/" + id);
    return response.data.data.user;
  });

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    selectPic: null,
  });

  useEffect(() => {
    data &&
      setForm({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
      });
  }, [data]);

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files[0] : e.target.value,
    });
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      if (form.selectPic) {
        const config = {
          headers: {
            "Content-type": "multipart/form-data",
          },
        };
        const fd = new FormData();
        fd.set("fullName", form.fullName);
        fd.set("email", form.email);
        fd.set("phone", form.phone);
        fd.append("avatar", form.selectPic);
        await API.patch(`/user/${id}`, fd, config);

        window.location.reload();
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
      });
      await API.patch(`/user/${id}`, body, config);
      History.push(`/profile/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="notfound">
        {isLoading && <img src={Loading} alt="Loading" />}
        {error && (
          <>
            <img src={ServerError} alt="server error. can't fetch data" />
          </>
        )}
      </div>

      <div>
        <div className="form-container">
          <h2 className="raisefund-title">Update Profile</h2>
          <form className="form-modal1 raisefund-form" onSubmit={updateUser}>
            <input
              className="input-modal1"
              name="fullName"
              type="text"
              required
              placeholder="Full Name"
              value={form.fullName}
              onChange={(e) => onChange(e)}
            />
            <Uploader
              pictureSelected={(e) => onChange(e)}
              button={
                <label
                  htmlFor="upload"
                  className="fund-btn card1-btn attach-btn"
                >
                  Select Avatar
                </label>
              }
            />
            <input
              className="input-modal1"
              type="email"
              name="email"
              disabled
              placeholder="Email"
              value={form.email}
              onChange={(e) => onChange(e)}
            />
            <input
              className="input-modal1"
              type="number"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => onChange(e)}
            />
            <div className="container-fundbtn">
              <button className="fund-btn card1-btn publicfund-btn">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
