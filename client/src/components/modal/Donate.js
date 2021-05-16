import { useContext, useState } from "react";
import { Modal } from "react-bootstrap";

import Uploader from "../Uploader";
import { UserContext } from "../service/userContext";
import { API } from "../service/api";

const Donate = ({ fundid, judul, refresh }) => {
  const [state] = useContext(UserContext);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [form, setForm] = useState({
    userId: state?.user?.id,
    fundId: fundid,
    title: judul,
    status: "pending",
    donateAmount: "",
    selectPic: null,
  });

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files[0] : e.target.value,
    });
  };

  const handleDonation = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };
      const fd = new FormData();
      fd.set("userId", form.userId);
      fd.set("fundId", form.fundId);
      fd.set("title", form.title);
      fd.set("status", form.status);
      fd.set("donateAmount", form.donateAmount);
      fd.append("proofAttachment", form.selectPic);
      await API.post(`/donate`, fd, config);
      setForm({
        userId: state.user.id,
        fundId: fundid,
        title: judul,
        status: "pending",
        donateAmount: "",
        selectPic: null,
      });
      refresh();
      setMessage("");
      handleClose();
    } catch (error) {
      console.log(error);
      setMessage("Please select image to upload");
    }
  };

  return (
    <>
      <button className="btn-modal1 btn-viewdonate" onClick={handleShow}>
        Donate
      </button>

      <Modal centered show={show} onHide={handleClose}>
        <div className="modal-content">
          <div className="modal1 modal1-donate">
            {message && (
              <div className="alert alert-danger py-1">
                <small>{message}</small>
              </div>
            )}
            <form className="form-modal1" onSubmit={handleDonation}>
              <input type="hidden" name="title" value={form.title} />
              <input type="hidden" name="userId" value={form.userId} />
              <input type="hidden" name="fundId" value={form.fundId} />
              <input type="hidden" name="status" value={form.status} />
              <input
                className="input-modal1"
                type="number"
                name="donateAmount"
                required
                placeholder="Donation"
                value={form.donateAmount}
                onChange={(e) => onChange(e)}
              />
              <div className="modal1-payment">
                <Uploader
                  pictureSelected={(file) => onChange(file)}
                  button={
                    <label htmlFor="upload" className="btn-modal1 btn-payment">
                      Attach Payment
                    </label>
                  }
                />
                <p>*transfers can be made to holyways accounts</p>
              </div>
              <button className="btn-modal1">Donate</button>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Donate;
