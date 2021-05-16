import { useParams, Link, useHistory } from "react-router-dom";
import { useMutation } from "react-query";
import { useQuery } from "react-query";

import convert from "../service/convert";
import Donate from "../modal/Donate";
import Approve from "../modal/Approve";
import { API } from "../service/api";
import dateConvert from "../service/dateConvert";
import Loading from "../../assets/Process.gif";
import ServerError from "../../assets/500 Internal Server Error.gif";

const View = () => {
  const { id } = useParams();
  const History = useHistory();

  let { data, isLoading, error, refetch } = useQuery("fundview", async () => {
    const response = await API.get("/fund/" + id);
    return response.data.data.fund;
  });

  let { data: donate } = useQuery("donateview", async () => {
    const response = await API.get("/donate/" + id);
    return response.data.data.donate;
  });

  const deleteById = async (id) => {
    deleteFund.mutate(id);
  };

  const deleteFund = useMutation(async (id) => {
    await API.delete(`/fund/${id}`);
    History.goBack();
  });

  return (
    <>
      <div className="notfound">
        {isLoading && <img src={Loading} alt="Loading" />}
      </div>
      {error && (
        <>
          <img src={ServerError} alt="server error. can't fetch data" />
        </>
      )}
      {data && donate && (
        <div className="container-detail">
          <div className="wrapper-action">
            <Link to={`/updateform/${data.id}`}>
              <label className="card1-btn">Edit data</label>
            </Link>
            <label onClick={() => deleteById(data.id)} className="card1-btn">
              Delete Fund
            </label>
          </div>
          <div className="detail">
            <div className="detail-img">
              <img src={`http://localhost:9000/${data.thumbnail}`} alt="" />
            </div>
            <div className="detail-content">
              <h1>{data.title}</h1>
              <div className="detail-progress">
                <div className="progress-money">
                  <p>
                    <i>Rp {data.money && convert(data.money)}</i>
                  </p>
                  <p>gathered from</p>
                  <p>
                    <i>Rp {data.goal && convert(data.goal)}</i>
                  </p>
                </div>
                <progress
                  className="progress"
                  value={data.money}
                  max={data.goal}
                ></progress>
                <div className="deadline">
                  <p>
                    <i className="number">{donate.length}</i> Donation
                  </p>
                  <p>
                    <i className="number">{data.deadline}</i> More Day
                  </p>
                </div>
              </div>
              <p className="detail-description">{data.description}</p>

              <Donate refresh={refetch} fundid={id} judul={data.title} />
            </div>
          </div>

          <div className="list-container">
            <h1 className="list-title">
              List Donation ({donate.status === "success" ? donate.length : "0"}
              )
            </h1>
            <div className="list-donation">
              {donate.map((success, index) =>
                success.status === "success" ? (
                  <div className="list" key={success.id + index}>
                    <h3>{success.user.fullName}</h3>
                    <p>{dateConvert(success.createdAt)}</p>
                    <p>Total: Rp {convert(success.donateAmount)}</p>
                  </div>
                ) : null
              )}
            </div>
          </div>

          <label className="load">Load More</label>

          <div className="list-container">
            <h1 className="list-title">
              Donation has not been approved (
              {donate.status === "pending" ? donate.length : "0"})
            </h1>
            <div className="list-donation">
              {donate.map((pending) =>
                pending.status === "pending" ? (
                  <div className="list wait-approve" key={pending.id}>
                    <div>
                      <h3>{pending.user.fullName}</h3>
                      <p>{dateConvert(pending.createdAt)}</p>
                      <p>Total: Rp {convert(pending.donateAmount)}</p>
                    </div>

                    <div>
                      <Approve
                        refresh={refetch}
                        donateName={pending.user.fullName}
                        donateId={pending.id}
                        amount={convert(pending.donateAmount)}
                        evidence={pending.proofAttachment}
                      />
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
          <label className="load">Load More</label>
        </div>
      )}
    </>
  );
};

export default View;
