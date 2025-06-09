import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

export interface MyCardProps {
  id: string;
  title: string;
  image: string;
  description: string;
  link: string;
  isChangeDetect: boolean;
  createDate?: string;
}
export const MyCardBootStrap = (props: MyCardProps) => {
  const { title, image, description, link, createDate, isChangeDetect } = props;

  const getColor = (title: string) => {
    if (isChangeDetect) {
      return "#d43584";
    } else if (title.indexOf("고흥") != -1) {
      return "#EC6C00";
    } else if (title.indexOf("광주") != -1) {
      return "#00AA51";
    } else {
      return "#005CB9";
    }
  };

  return (
    <Link to={link}>
      <Card
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "244px",
          padding: "20px 20px 24px",
          border: "1px solid #DFE2E7",
          borderRadius: "0",
        }}
      >
        <Card.Body
          style={{
            width: "100%",
            padding: "0",
          }}
        >
          {/*디자인에서 영문명은 없어서 잠시 주석처리 23.09.10 진아름*/}
          {/*<Card.Title>{title}</Card.Title>*/}
          <Card.Title
            style={{
              display: "flex",
              alignItems: "center",
              height: "21px",
              paddingLeft: "6px",
              marginBottom: "8px",
              borderLeft: `4px solid ${getColor(title)}`,
              fontSize: "18px",
              fontWeight: "600",
              color: "#2F3237",
              boxSizing: "border-box",
            }}
          >
            {title}
          </Card.Title>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "400",
              lineHeight: "19,6px",
              color: "#727A86",
              display: "inline-block",
              marginBottom: "8px",
              fontFamily: "Pretendard",
            }}
          >
            {description}
          </div>
          <div
            style={{
              height: "1px",
              marginBottom: "12px",
              backgroundColor: "#DFE2E7",
            }}
          ></div>
          <Card.Img
            variant="top"
            src={image}
            alt="이미지없음"
            style={{ width: "100%", height: "184px", borderRadius: "2px" }}
          />
          {/*<Link to={link}>*/}
          {/*  <Button variant="primary">Go to Page</Button>*/}
          {/*</Link>*/}
        </Card.Body>
      </Card>
    </Link>
  );
};
