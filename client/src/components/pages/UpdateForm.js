import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useQuery } from "react-query";

import Uploader from "../Uploader";
import { API } from "../service/api";
import ServerError from "../../assets/500 Internal Server Error.gif";
import Loading from "../../assets/Process.gif";

const UpdateForm = () => {
  const History = useHistory();
  const { id } = useParams();

  let { data, isLoading, error } = useQuery("updatefundbyid", async () => {
    const response = await API.get("/fund/" + id);
    return response.data.data.fund;
  });

  const [form, setForm] = useState({
    title: "",
    goal: "",
    description: "",
    selectPic: null,
  });

  useEffect(() => {
    data &&
      setForm({
        title: data.title,
        goal: data.goal,
        description: data.description,
      });
  }, [data]);

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files[0] : e.target.value,
    });
  };

  const updateFund = async (e) => {
    e.preventDefault();
    try {
      if (form.selectPic) {
        const config = {
          headers: {
            "Content-type": "multipart/form-data",
          },
        };
        const fd = new FormData();
        fd.set("title", form.title);
        fd.set("goal", form.goal);
        fd.set("description", form.description);
        fd.append("thumbnail", form.selectPic);
        await API.patch(`/fund/${id}`, fd, config);
        History.push(`/view/${id}`);
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({
        title: form.title,
        goal: form.goal,
        description: form.description,
      });
      await API.patch(`/fund/${id}`, body, config);
      History.push(`/view/${id}`);
    } catch (error) {
      console.log(form.selectPic);
      console.log(error);
    }
  };
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

      <div>
        <div className="form-container">
          <h2 className="raisefund-title">Update Raise Fund</h2>
          <form className="form-modal1 raisefund-form" onSubmit={updateFund}>
            <input
              className="input-modal1"
              required
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={(e) => onChange(e)}
            />
            <Uploader
              pictureSelected={(e) => onChange(e)}
              button={
                <label
                  htmlFor="upload"
                  className="fund-btn card1-btn attach-btn"
                >
                  Attach Thumbnail
                </label>
              }
            />
            <input
              className="input-modal1"
              type="number"
              required
              name="goal"
              placeholder="Goal Donation"
              value={form.goal}
              onChange={(e) => onChange(e)}
            />

            <textarea
              className="input-modal1 description"
              name="description"
              required
              value={form.description}
              placeholder="Description"
              onChange={(e) => onChange(e)}
            ></textarea>
            <div className="container-fundbtn">
              <button className="fund-btn card1-btn publicfund-btn">
                Update Fundraising
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateForm;
