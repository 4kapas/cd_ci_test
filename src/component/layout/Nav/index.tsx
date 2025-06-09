import { COMPANY } from "@/config/company";
import { menuItem } from "@/consts/menu";
import { useLocation, useNavigate } from "react-router-dom";
import { StyledNav } from "./style";

export const Nav = () => {
  const navigate = useNavigate(); // useNavigate hook 추가
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <StyledNav>
      <div className={`main-navBar`}>
        <div className="logo">
          <img src={COMPANY.logo} alt="logo" />
        </div>
        <div className="tab-wrap">
          {menuItem.map((main, index) => {
            return (
              <button
                className={`gnbTab ${pathname === main.link ? "active" : ""}`}
                key={index}
                onClick={() => {
                  navigate(main.link);
                }}
              >
                {main.title}
              </button>
            );
          })}
        </div>
      </div>
    </StyledNav>
  );
};
