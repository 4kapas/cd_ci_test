import { COMPANY } from "@/config/company";
import { FooterWrap } from "./style";

export const Footer = () => {
  const { name, ceo, address, companyId, email } = COMPANY;
  return (
    <FooterWrap>
      <p className="main-title">{name}</p>
      <ul>
        <li>대표이사:&nbsp; {ceo}</li>
        <li>주소:&nbsp; {address}</li>
        <li>사업자등록번호:&nbsp; {companyId}</li>
        <li>대표메일:&nbsp; {email}</li>
      </ul>
    </FooterWrap>
  );
};
