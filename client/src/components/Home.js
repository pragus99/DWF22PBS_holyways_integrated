import { useState, useEffect } from "react";
import { io } from "socket.io-client";

import Card from "./Card";
import Hero from "./Hero";

import Loading from "../assets/Process.gif";
let socket;

const Home = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadfunds = async (socket) => {
    await socket.emit("get funds");
    await socket.on("funds", (data) => {
      setLoading(false);
      setFunds(data);
    });
  };

  useEffect(() => {
    socket = io("http://localhost:9000/funds");
    loadfunds(socket);
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="home">
      <Hero />
      {funds && (
        <div className="cards1">
          <Card data={funds} button="Donate" link="detail" />
        </div>
      )}
      <div className="notfound">
        {loading && <img src={Loading} alt="Loading" />}
      </div>
    </div>
  );
};

export default Home;
