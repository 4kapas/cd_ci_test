import React from 'react';
import { Link } from 'react-router-dom';

interface MyCardProps {
  title: string;
  image: string;
  description: string;
  link: string;
}

export const MyCard = (props: MyCardProps) => {
  let { title, image, description, link } = props;

  return (
    <article className="card">
      {/* <img src={image} alt={title} /> */}
      {/* <h2>{title}</h2>
        <p>{description}</p> */}
      <Link to={link}>
        <div className="card-content" style={{ color: "black" }}>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </Link>
    </article>
  );
};

