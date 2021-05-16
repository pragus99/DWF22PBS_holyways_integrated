import { useState } from "react";

import { Modal } from "react-bootstrap";
import { API } from "../service/api";

const Approve = ({ donateName, donateId, amount, evidence, refresh }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [status] = useState("success");

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const body = JSON.stringify({
        status,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await API.patch(`/donate/${donateId}`, body, config);
      refresh();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button className="card1-btn fund-btn" onClick={handleShow}>
        View
      </button>

      <Modal centered show={show} onHide={handleClose} onSubmit={submitForm}>
        <div className="modal-content">
          <div className="modal1 modal1-donate">
            <h2 className="title-approve">{donateName}</h2>
            <form className="form-modal1">
              <input type="hidden" value={status} />
              <input
                className="input-approve"
                type="number"
                placeholder={amount}
                disabled
              />
              <img
                className="img-approve"
                src={`http://localhost:9000/${evidence}`}
                alt=""
              />
              <button className="btn-modal1 btn-approve">Approve</button>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default Approve;
