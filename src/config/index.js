const requiredEnvVars = ["VITE_HOST", "VITE_BASE_URL", "VITE_COMPANY"];

const missingVars = requiredEnvVars.filter((key) => !import.meta.env[key]);

if (missingVars.length > 0) {
  const missingList = missingVars.join(", ");
  const message = `[환경변수 오류]

다음 환경변수가 설정되지 않았습니다: ${missingList}

필수 설정값이 누락되어 애플리케이션이 실행될 수 없습니다.
.env 파일 또는 환경 설정을 확인하고 값을 추가해 주세요.
`;

  console.error(message);
  alert(message);

  throw new Error(message);
}

const company = import.meta.env.VITE_COMPANY;
const ALLOWED_COMPANIES = ["UOK", "DOROSEE"];

if (!ALLOWED_COMPANIES.includes(company)) {
  const message = `[환경변수 오류]

VITE_COMPANY 값이 잘못되었습니다: "${company}"

허용된 값은 다음 중 하나여야 합니다: ${ALLOWED_COMPANIES.join(", ")}

.env 파일 또는 환경 설정을 확인하고 값을 수정해 주세요.
`;

  console.error(message);
  alert(message);
  throw new Error(message);
}

export const CONFIG = {
  HOST: import.meta.env.VITE_HOST,
  BASE_URL: import.meta.env.VITE_BASE_URL,
  COMPANY: import.meta.env.VITE_COMPANY,

  BASE_ROOT: import.meta.env.BASE_URL,
  DEV: import.meta.env.DEV,
};
