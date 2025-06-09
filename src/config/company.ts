import UokLogo from "../assets/icon/uok-logo.png";
import DoroseeLogo from "../assets/icon/dorosee-logo.svg";
import { CONFIG } from ".";

const COMPANY_DATA = {
  DOROSEE: {
    name: "(주)도로시",
    ceo: "안성일",
    address: "서울특별시 금천구 디지털로 178, 퍼블릭가산 B동 516~519호",
    companyId: "450-88-01288",
    email: "si_an@dorosee.kr",
    logo: DoroseeLogo,
  },
  UOK: {
    name: "(주)유오케이에이티씨",
    ceo: "김진수",
    address: "서울특별시 양천구 목동중앙로13길 1 3층(목동)",
    companyId: "416-81-95507",
    email: "uok_3d@naver.com",
    logo: UokLogo,
  },
};

type CompanyKeys = keyof typeof COMPANY_DATA;

// ✅ 프록시 생성
export const COMPANY = new Proxy(COMPANY_DATA[CONFIG.COMPANY as CompanyKeys], {
  get(target, prop: keyof (typeof COMPANY_DATA)[CompanyKeys]) {
    return target[prop];
  },
});
