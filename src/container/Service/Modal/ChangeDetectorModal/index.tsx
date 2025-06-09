import { BasicModal } from "@/component";
import useModalStore from "@/store/useModalStore";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { StyledChangeDetectorModal } from "./style";

import {
  ExcuteChangeDetectionFormType,
  getCategoryList,
  getServiceList,
  useChangeDetectionMutation,
} from "@/apis/Service/service.thunk";
import socket from "@/services/Socket";
import CompareIcon from "@mui/icons-material/Compare";
import CreateIcon from "@mui/icons-material/Create";
import DoneIcon from "@mui/icons-material/Done";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { ChangeDetectorError } from "./Error";
import { ChangeDetectorStep1 } from "./Step1";
import { ChangeDetectorStep2 } from "./Step2";
import { ChangeDetectorStep3 } from "./Step3";
import { ChangeDetectorStep4 } from "./Step4";
import { ChangeDetectorStep5 } from "./Step5";
import { ServiceAPI } from "@/apis/Service/service.api";
import { DatasetType } from "@/types";

interface StepType {
  label: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

export interface SocketLogType {
  source: "python" | "potree";
  /** 0: 준비, 1: 진행 중, 2: 완료, 3: 오류 */
  status: 0 | 1 | 2 | 3;
  message: string;
  progress: number;
}

export const ChangeDetectorModal = ({ SERVICE_ID }: { SERVICE_ID: string }) => {
  const { showChangeDetector, setShowChangeDetector } = useModalStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [socketLog, setSocketLog] = useState<SocketLogType | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [detectResultInfo, setDetectResultInfo] = useState<DatasetType>();
  const [requestBody, setRequestBody] = useState<ExcuteChangeDetectionFormType>(
    {
      baseID: SERVICE_ID,
      targetID: "",
      socketID: "",
      threshold: "1.0",
      description: "",
    }
  );
  const { data: serviceData } = getServiceList();
  const { data: categoryData } = getCategoryList();
  const serviceList = useMemo(() => serviceData?.services || [], [serviceData]);
  const categoryList = useMemo(() => categoryData || [], [categoryData]);
  const [serviceInfo, setServiceInfo] = useState<DatasetType>();

  const { mutate: changeDetectionMutate } = useChangeDetectionMutation();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handlePrev = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleRequestBody = (form: Partial<ExcuteChangeDetectionFormType>) => {
    setRequestBody((prev) => ({ ...prev, ...form }));
  };

  const excuteChangeDetection = () => {
    const { baseID, targetID, socketID, threshold } = requestBody;
    if (!baseID || !targetID || !socketID || !threshold) {
      return;
    }
    changeDetectionMutate(requestBody, {
      onSuccess: (response) => {
        if (response.code === 200 && response.isSuccess) {
          const detectInfo = response.results;
          if (detectInfo) {
            setDetectResultInfo(detectInfo);
          }
        }
      },
    });
  };

  const fetchServiceInfo = async () => {
    const info = await ServiceAPI._getServiceInfo(SERVICE_ID);
    setServiceInfo(info);
  };

  const handleLog = (log: SocketLogType) => {
    if (log.status === 3) {
      setIsError(true);
      socket.disconnect();
    }
    setSocketLog(log);
  };

  const steps: StepType[] = [
    { label: "비교 대상 선택", icon: FindInPageIcon },
    { label: "설정값 입력", icon: CreateIcon },
    { label: "변화 탐지 실행", icon: CompareIcon },
    { label: "3D 변환 처리", icon: ViewInArIcon },
    { label: "완료", icon: DoneIcon },
  ];

  const StepComponent: ReactElement[] = [
    <ChangeDetectorStep1
      serviceList={serviceList}
      serviceInfo={serviceInfo}
      SERVICE_ID={SERVICE_ID}
      requestBody={requestBody}
      handleRequestBody={handleRequestBody}
      handleNext={handleNext}
    />,
    <ChangeDetectorStep2
      serviceList={serviceList}
      categoryList={categoryList}
      requestBody={requestBody}
      handleRequestBody={handleRequestBody}
      handlePrev={handlePrev}
      handleNext={handleNext}
    />,
    <ChangeDetectorStep3
      requestBody={requestBody}
      socketLog={socketLog}
      handleNext={handleNext}
      handleLoading={setIsLoading}
      excuteChangeDetection={excuteChangeDetection}
    />,
    <ChangeDetectorStep4
      socketLog={socketLog}
      detectResultInfo={detectResultInfo}
      handleNext={handleNext}
      handleLoading={setIsLoading}
    />,
    <ChangeDetectorStep5
      detectResultInfo={detectResultInfo}
      handleSuccess={setIsSuccess}
    />,
  ];

  useEffect(() => {
    if (!socket) return;
    socket.connect();
    fetchServiceInfo();

    const onConnect = () => {
      handleRequestBody({ socketID: socket.id });
    };
    socket.on("log", handleLog);
    socket.on("connect", onConnect);
    return () => {
      setDetectResultInfo(undefined);
      socket.off("log", handleLog);
      socket.off("connect", onConnect);
    };
  }, []);

  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, [activeStep]);

  return (
    <BasicModal
      title="변화탐지 시작하기"
      open={showChangeDetector}
      setOpen={setShowChangeDetector}
      width="740px"
      height="auto"
      className="change-detector-modal"
      option={{
        enabledBodyPadding: true,
        disableBackdropClick: true,
      }}
    >
      <StyledChangeDetectorModal>
        <div className="stepper-box">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                className={`step ${activeStep === index ? "active" : ""} ${
                  activeStep > index || isSuccess ? "success" : ""
                } ${activeStep === index && isError ? "error" : ""}`}
                key={`step-${index}`}
              >
                <Icon className="icon" />
                <div className="area">
                  <p className="step-count">Step {index + 1}</p>
                  <div className="step-label">{step.label}</div>
                </div>
                <span
                  className={`point ${
                    isLoading && activeStep === index ? "loading" : ""
                  }`}
                >
                  {activeStep === index && isError ? (
                    <ErrorOutlineIcon />
                  ) : (
                    <>
                      {(activeStep > index || isSuccess) && <DoneIcon />}
                      {isLoading && activeStep === index && (
                        <span className="loading" />
                      )}
                    </>
                  )}
                </span>
              </div>
            );
          })}
        </div>
        <div className="main-box">
          {isError ? (
            <ChangeDetectorError message={socketLog?.message || ""} />
          ) : (
            StepComponent[activeStep]
          )}
        </div>
      </StyledChangeDetectorModal>
    </BasicModal>
  );
};
