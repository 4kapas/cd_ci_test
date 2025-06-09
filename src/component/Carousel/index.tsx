import { useEffect, useState } from "react";
import { styled } from "styled-components";
import Carousel from "react-material-ui-carousel";
//consts
import { commonImage } from "@/consts/image";
import { getBoardFileImage } from "@/apis/Board";

export const StyledBasicCarousel = styled.div`
  & > div > div {
    height: 320px !important;
  }
  .MuiIconButton-root {
    opacity: 0.8;
    padding: 0;
  }
`;

export const BasicCarousel = ({ items }: any) => {
  const [image, setImage] = useState<string | "">("");

  const getFileImage = async (item: any) => {
    try {
      const res = await getBoardFileImage(item);
      setImage(res);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  useEffect(() => {
    if (!items) return;

    const fetchImages = async () => {
      for (const item of items) {
        await getFileImage(item);
      }
    };

    fetchImages();
  }, [items]);

  return (
    <StyledBasicCarousel className="carousel">
      <Carousel
        NextIcon={<img src={commonImage.arrowNext} />}
        PrevIcon={<img src={commonImage.arrowPrev} />}
        autoPlay={false}
        indicators={false}
      >
        {items.map((_: any, i: number) => {
          return (
            <div style={{ width: "100%", height: "320px !important" }}>
              <img
                key={i}
                src={image || ""}
                alt={image || ""}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          );
        })}
      </Carousel>
    </StyledBasicCarousel>
  );
};
