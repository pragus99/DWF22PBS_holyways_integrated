import { useRef } from "react";
import Foto from "../assets/foto.png";
import Foto2 from "../assets/foto2.png";

const Hero = () => {
  const donate = useRef(null);
  const handleScroll = () => donate.current.scrollIntoView();

  return (
    <div>
      <div className="container-hero">
        <div className="hero">
          <div className="content-hero">
            <h1>
              While you are still standing, try to reach out to the people who
              are falling.
            </h1>
            <img className="img-hero" src={Foto} alt="" />

            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
            <button className="btn-hero" onClick={handleScroll}>
              Donate Now
            </button>
          </div>
        </div>
      </div>

      <div className="container-hero2">
        <div className="hero2">
          <div className="content-hero2">
            <h1>
              Your donation is very helpful for people affected by forest fires
              in Kalimantan.
            </h1>
            <div className="content2">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s.
              </p>
            </div>
          </div>
          <img className="img-hero2" src={Foto2} alt="" />
        </div>
      </div>
      <h6 className="title-donate" ref={donate}>
        Donate Now
      </h6>
    </div>
  );
};

export default Hero;
