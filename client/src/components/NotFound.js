import Img from "../assets/404 Error with a cute animal.gif";
import { Link, useHistory } from "react-router-dom";

const NotFound = () => {
  const History = useHistory();

  const handleBack = (e) => {
    History.goBack();
  };

  return (
    <div className="notfound">
      <img src={Img} alt="" />
      <p>
        Go back to <Link to="/"> Home</Link> or{" "}
        <label onClick={handleBack}>Previous </label> page
      </p>
    </div>
  );
};

export default NotFound;
