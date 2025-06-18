export const GAME_SLIDER_SETTINGS = {
  dots: true,
  infinite: false, // Will be set dynamically based on games length
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  autoplay: false,
  centerMode: false,
  variableWidth: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ]
};

export const GAME_CAROUSEL_STYLES = `
  .slick-dots {
    bottom: -40px !important;
    display: flex !important;
    justify-content: center;
    gap: 8px;
  }

  .slick-dots li button {
    width: 12px !important;
    height: 12px !important;
    border-radius: 50% !important;
    background: rgba(255, 255, 255, 0.3) !important;
    border: none !important;
    transition: all 0.3s ease !important;
  }

  .slick-dots li.slick-active button {
    background: rgba(255, 255, 255, 0.8) !important;
    transform: scale(1.2);
  }

  .slick-dots li button:before {
    display: none !important;
  }
`;