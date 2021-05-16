import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import { UserContext } from "../service/userContext";
import Uploader from "../Uploader";

import { API } from "../service/api";

const Form = () => {
  const [state] = useContext(UserContext);

  const [userId] = useState(state?.user?.id);
  const [money] = useState("");
  const [deadline] = useState(90);
  const [people] = useState("");
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [selectPic, setSelectPic] = useState(null);
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");

  const History = useHistory();

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };
      const fd = new FormData();
      fd.set("userId", userId);
      fd.set("title", title);
      fd.set("money", money);
      fd.set("people", people);
      fd.set("deadline", deadline);
      fd.set("goal", goal);
      fd.set("description", description);
      fd.append("thumbnail", selectPic);
      await API.post("/fund", fd, config);
      History.goBack();
    } catch (error) {
      setMessage("Please fill all required fields");
      console.log(error);
    }
  };

  return (
    <div>
      <div className="form-container">
        <h2 className="raisefund-title">Make Raise Fund</h2>
        {message && (
          <div className="alert alert-danger py-1">
            <small>{message}</small>
          </div>
        )}
        <form className="form-modal1 raisefund-form" onSubmit={submitForm}>
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="money" value={money} />
          <input type="hidden" name="people" value={people} />
          <input type="hidden" name="deadline" value={deadline} />
          <input
            className="input-modal1"
            type="text"
            required
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Uploader
            pictureSelected={(file) => setSelectPic(file.target.files[0])}
            button={
              <label htmlFor="upload" className="fund-btn card1-btn attach-btn">
                Attach Thumbnail
              </label>
            }
          />
          <input
            className="input-modal1"
            type="number"
            required
            placeholder="Goal Donation"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <input
            className="input-modal1 description"
            type="text"
            required
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="container-fundbtn">
            <button className="fund-btn card1-btn publicfund-btn">
              Publish Fundraising
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
