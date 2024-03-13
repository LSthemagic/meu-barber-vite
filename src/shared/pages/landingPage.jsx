import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Slider from "react-slick";
import styles from "./landingPage.module.css"; // Removed unused import
import ImagemFormatada from "./../layout/ImagemFormatted"
// Defining the colors
const colors = {
  marromClaro: "#e7d7b7",
  marromMedio: "#964b00",
  marromEscuro: "#5c4033"
};

// Component for the landing page
const LandingPage = () => {
  const [index, setIndex] = useState(0); // State for controlling the slideshow index

  const images = [
    "../../../public/section_img1.jpg",
    "../../../public/section_img2.jpg",
    "../../../public/section_img3.jpg",
    "../../../public/section_img4.jpg",
    "../../../public/section_img5.jpg",
    "../../../public/section_img6.jpg",
    "../../../public/section_img7.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true
  };

  return (
    <div className={styles.container}>
      <div className={styles["slider-wrapper"]}>
        <Slider arrows={true} {...settings} className="slider-wrapper">
          {images.map((image, idx) => (
            <div key={idx} className={styles.card}>
              <ImagemFormatada src={image}></ImagemFormatada>
              {/* <img sizes="(max-width: 600px) 100vw, 600px" src={image} alt={`Slide ${idx + 1}`} /> */}
            </div>
          ))}
        </Slider>
        <AboutSection>
        <h2>Sobre a Barbearia</h2>
        <p>
          Oferecemos os melhores cortes, tratamentos e cuidados para a sua
          barba. Nossa equipe de especialistas está pronta para atender você
          com excelência.
        </p>
      </AboutSection>
      </div>
           
      {/* Add more sections like 'Equipe', 'Serviços', 'Depoimentos', 'Contato', etc. */}
    </div>

  );
};



const AboutSection = styled.section`
  background-color: ${colors.marromClaro};

`;

export default LandingPage;
