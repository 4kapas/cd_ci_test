import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//mui
import { Box, Container } from "@mui/material";
//component
import {
  AlertModal,
  BasicInput,
  BasicSelect,
  LoginCheckbox,
} from "@/component";
//style
import {
  StyledLoginButton,
  StyledLoginComment,
  StyledLoginContainer,
} from "./style";
//image
import { login } from "@/apis/Auth/auth.api";
import { commonImage, logoImage } from "@/consts/image";
import { ROUTE_DATASET } from "@/routes";
import { useMutation } from "react-query";

//TODO: 서비스 아이디 수정 필요 임의로 삽입 (23.09.06 진아름)
const SELECT_OPTIONS = [
  { value: "lx", label: "한국국토정보공사" },
  { value: "dorosee", label: "도로시" },
];

interface LoginFormProps {
  serviceId: string;
  id: string;
  password: string;
  loginError: boolean;
  rememberId: boolean;
  setId: (id: string) => void;
  setServiceId: (id: string) => void;
  setPassword: (password: string) => void;
  setRememberId: (value: boolean) => void;
  isLoginValid: () => boolean;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

//로그인페이지 UI
export const LoginForm = ({
  serviceId,
  id,
  password,
  loginError,
  rememberId,
  setId,
  setServiceId,
  setPassword,
  setRememberId,
  isLoginValid,
  handleSubmit,
}: LoginFormProps) => {
  /** 도움이 필요하신가요 모달 창 */
  const [open, setOpen] = useState(false);
  const handleModal = () => {
    setOpen(true);
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="loginForm">
        <h1 className="logo">
          <img src={logoImage.logoIncheon} alt="인천시청" />
        </h1>
        <Box
          sx={{
            display: "grid",
            gridTemplateRows: "repeat(3, auto)",
            gap: "calc((178px - 3 * 50px) / 4)",
          }}
        >
          <BasicSelect
            defaultValue={serviceId}
            placeholder={"서비스 아이디"}
            options={SELECT_OPTIONS}
            handleValue={setServiceId}
            optionClassName={"optionClassName"}
          />
          <BasicInput
            type="id"
            label="아이디"
            value={id}
            onChange={(e: any) => setId(e.target.value)}
            placeholder="아이디"
          />
          <BasicInput
            type="password"
            label="비밀번호"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            placeholder="비밀번호"
          />
          <div style={{ marginBottom: "13px", marginTop: "13px" }}>
            <LoginCheckbox
              label="아이디 저장"
              checked={rememberId}
              onChange={setRememberId}
            />
          </div>
        </Box>
        {loginError && (
          <Box
            sx={{ position: "relative", height: "32px", marginBottom: "9px" }}
          >
            <StyledLoginComment>
              <img src={commonImage.loginNotice} alt="불일치" />
              아이디 또는 비밀번호가 일치하지 않습니다.
            </StyledLoginComment>
          </Box>
        )}
        <StyledLoginButton type="submit" disabled={!isLoginValid()}>
          로그인
        </StyledLoginButton>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button type="button" onClick={handleModal}>
            도움이 필요하신가요?
          </button>

          {/* 기획 수정으로 아이디 기억하기 임시 주석 */}

          {/* <button type="button">비밀번호 찾기</button>  */}
        </Box>
      </form>
      {open && (
        <AlertModal
          open={open}
          title={"도움이 필요하신가요?"}
          setOpen={setOpen}
          children={
            <p>
              로그인 정보를 잃어버렸거나, 로그인이 되지 않을 경우 대표
              이메일(dorosee@dorosee.kr)로 연락주시면 상담을 통해 도움을
              드리도록 하겠습니다.
            </p>
          }
        />
      )}
    </>
  );
};

export const Login = () => {
  //아이디,비밀번호,비밀번호 기억하기
  const [serviceId, setServiceId] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberId, setRememberId] = useState(false);
  //로그인 실패시 상태
  const [loginError, setLoginError] = useState(false);

  const navigate = useNavigate(); // useNavigate hook 추가

  const initLoginForm = {
    serviceId: "",
    username: "admin@naver.com",
    password: "abcd1234!@",
  };

  const { mutate } = useMutation(login);

  //로그인,비밀번호 입력조건에 따라 로그인하기 버튼 활성,비활성화 함수 - 디자인 시안에 기재된 요청사항
  //TODO: 입력조건 임의 삽입 수정 필요 (23.09.09 진아름)
  const isLoginValid = () => id.length !== 0 && password.length >= 4;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updateLoginForm = {
      serviceId,
      username: id,
      password,
    };
    mutate(updateLoginForm, {
      onSuccess: (data, variables, context) => {
        if (data == undefined) {
          console.log({ data, variables, context });

          setLoginError(true);
        } else {
          navigate(ROUTE_DATASET);
        }
      },
      onError: () => {
        setLoginError(true);
      },
    });

    setLoginError(false);

    // 아이디 기억하기
    //TODO: 로그인 API 로직 필요합니다 (23.09.06 진아름)
    if (rememberId || id) {
      localStorage.setItem("storedId", id);
    } else {
      localStorage.removeItem("storedId");
    }
  };

  // localStorage에서 아이디 가져오기
  useEffect(() => {
    const storedId = localStorage.getItem("storedId");
    if (storedId) {
      setId(storedId);
      // 아이디가 저장되어 있으면 체크박스를 활성화
      setRememberId(true);
    }
  }, []);

  return (
    <StyledLoginContainer>
      <Container className="loginContainer">
        <LoginForm
          serviceId={serviceId}
          id={id}
          password={password}
          loginError={loginError}
          rememberId={rememberId}
          setId={setId}
          setServiceId={setServiceId}
          setPassword={setPassword}
          setRememberId={setRememberId}
          isLoginValid={isLoginValid}
          handleSubmit={handleSubmit}
        />
      </Container>
    </StyledLoginContainer>
  );
};
