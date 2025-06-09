import {
  UploadServiceFormType,
  useUploadService,
} from "@/apis/Service/service.thunk";
import { BasicModal, BasicSelect } from "@/component";
import socket from "@/services/Socket";
import useLoadingStore from "@/store/useLoadingStore";
import useModalStore from "@/store/useModalStore";
import { formatDateWithOptionalTime, formatFileSize } from "@/utils";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FilePresentTwoToneIcon from "@mui/icons-material/FilePresentTwoTone";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQueryClient } from "react-query";
import { StyledUploadDatasetModal } from "./style";

export const UploadDatasetModal = () => {
  const INIT_REQUEST_BODY = {
    lasFile: null,
    name: "",
    description: "",
    coord: "EPSG:32652",
    acqType: "AIR",
    acqDate: "",
    socketID: "",
  };
  const { showUploadDataset, setShowUploadDataset } = useModalStore();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragRef = useRef<HTMLLabelElement | null>(null);
  const [selectedCoord, setSelectedCoord] = useState<string>();
  const [requestBody, setRequestBody] =
    useState<UploadServiceFormType>(INIT_REQUEST_BODY);
  const isActive = useMemo(() => {
    const { lasFile, name, coord, acqDate, acqType } = requestBody;
    return lasFile && name && coord && acqDate && acqType ? true : false;
  }, [requestBody]);
  const queryClient = useQueryClient();
  const { startLoading, stopLoading } = useLoadingStore();
  const { mutate } = useUploadService();

  const handleRequestBody = (form: Partial<UploadServiceFormType>) => {
    setRequestBody((prev) => ({ ...prev, ...form }));
  };

  const handleInputFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleRequestBody({ lasFile: file });
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith(".las")) {
      handleRequestBody({ lasFile: file });
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFieldChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: keyof UploadServiceFormType
  ) => {
    if (e.target) handleRequestBody({ [key]: e.target.value });
  };

  const handleUploadDataset = async () => {
    const { lasFile, name, coord, acqDate, acqType } = requestBody;
    if (lasFile && name && coord && acqDate && acqType) {
      startLoading("업로드 중입니다...");
      mutate(requestBody, {
        onSuccess: async () => {
          await queryClient.invalidateQueries(["service-list", "datasets"]);
          stopLoading();
          setShowUploadDataset(false);
        },
        onError: () => {
          stopLoading();
          setShowUploadDataset(false);
        },
      });
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.connect();
    const onConnect = () => {
      handleRequestBody({ socketID: socket.id });
    };
    socket.on("connect", onConnect);
  }, []);

  useEffect(() => {
    if (selectedCoord && selectedCoord !== "custom") {
      handleRequestBody({ coord: selectedCoord });
    }
  }, [selectedCoord]);

  useEffect(() => {
    if (!socket) return;

    if (showUploadDataset) {
      socket.connect();
      socket.on("connect", () => handleRequestBody({ socketID: socket.id }));
    } else {
      socket.disconnect();
      setRequestBody(INIT_REQUEST_BODY);
    }
  }, [showUploadDataset]);

  return (
    <BasicModal
      title="파일 업로드"
      open={showUploadDataset}
      setOpen={setShowUploadDataset}
      width="540px"
      height="auto"
      className="upload-dataset-modal"
      option={{
        enabledBodyPadding: true,
        disableBackdropClick: true,
      }}
    >
      <StyledUploadDatasetModal>
        <div className="main">
          <div
            className={`area file-box ${isDragging ? "dragging" : ""} ${
              requestBody.lasFile ? "selected" : "unselected"
            }`}
          >
            <input
              onChange={handleInputFile}
              type="file"
              id="file-upload"
              accept=".las, .laz"
            />
            <label
              htmlFor="file-upload"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              ref={dragRef}
            >
              {requestBody.lasFile ? (
                <div className="selected">
                  <FilePresentTwoToneIcon sx={{ fontSize: "38px" }} />
                  <div className="box">
                    <p className="name">{requestBody.lasFile.name}</p>
                    <p className="info">
                      <span>{formatFileSize(requestBody.lasFile.size)}</span>
                      <span style={{ fontWeight: "900" }}>﹒</span>
                      <span>
                        {formatDateWithOptionalTime(
                          requestBody.lasFile.lastModified,
                          true
                        )}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRequestBody({ lasFile: null });
                    }}
                  >
                    <CloseOutlinedIcon sx={{ fontSize: "20px" }} />
                  </button>
                </div>
              ) : (
                <div className="unselected">
                  <FileUploadIcon sx={{ fontSize: "20px" }} />
                  <p>
                    Drag & Drop or <span>Choose file</span> to upload
                  </p>
                  <p className="help">LAS or LAZ</p>
                </div>
              )}
            </label>
          </div>
          <span className="line" />
          <div className="area">
            <div className="box required">
              <div className="label">이름</div>
              <input
                className="field"
                type="text"
                placeholder="이름을 입력하세요."
                value={requestBody.name}
                onChange={(e) => handleFieldChange(e, "name")}
              />
            </div>
            <div className="box">
              <div className="label">설명</div>
              <input
                className="field"
                type="text"
                placeholder="설명을 입력하세요."
                value={requestBody.description}
                onChange={(e) => handleFieldChange(e, "description")}
              />
            </div>
            <div className="box required">
              <div className="label">좌표계</div>
              <div className={selectedCoord === "custom" ? "custom" : ""}>
                <BasicSelect
                  className="select-box"
                  defaultValue={requestBody.coord}
                  handleValue={setSelectedCoord}
                  options={[
                    {
                      label: "EPSG:32652 - UTM-K (WGS84, Zone 52N)",
                      value: "EPSG:32652",
                    },
                    {
                      label: "EPSG:5179 - 중부원점 (Bessel 1841, TM)",
                      value: "EPSG:5179",
                    },
                    {
                      label: "EPSG:5186 - 중부원점 (GRS80, TM)",
                      value: "EPSG:5186",
                    },
                    {
                      label: "EPSG:5187 - 동부원점 (GRS80, TM)",
                      value: "EPSG:5187",
                    },
                    {
                      label: "EPSG:5188 - 동해원점 (GRS80, TM)",
                      value: "EPSG:5188",
                    },
                    { label: "직접 입력", value: "custom" },
                  ]}
                />
                {selectedCoord === "custom" && (
                  <input
                    defaultValue=""
                    type="text"
                    className="field"
                    placeholder="EPSG:XXXX 형식으로 입력하세요."
                    value={requestBody.coord}
                    onChange={(e) => handleFieldChange(e, "coord")}
                  />
                )}
              </div>
            </div>
            <div className="box required">
              <div className="label">촬영 방식</div>
              <BasicSelect
                defaultValue={requestBody.acqType}
                handleValue={(value) => handleRequestBody({ acqType: value })}
                options={[
                  { label: "항공 라이다 (Airborne LIDAR)", value: "AIR" },
                  {
                    label: "이동형 라이다 (Mobile Mapping System)",
                    value: "MMS",
                  },
                  { label: "드론 라이다 (Drone LIDAR)", value: "DRONE" },
                  { label: "헬리콥터 라이다 (Helicopter LIDAR)", value: "HEL" },
                  {
                    label: "지상 라이다 (Terrestrial Laser Scanning)",
                    value: "TLS",
                  },
                  { label: "위성 기반 (Satellite-based DEM)", value: "DEM" },
                ]}
              />
            </div>
            <div className="box required">
              <div className="label">촬영 날짜</div>
              <input
                className="field"
                type="text"
                value={requestBody.acqDate}
                placeholder="YYYY-MM 형식으로 입력하세요."
                onChange={(e) => handleFieldChange(e, "acqDate")}
              />
            </div>
          </div>
        </div>
        <div className="footer">
          <button className="prev" onClick={() => setShowUploadDataset(false)}>
            취소
          </button>
          <button disabled={!isActive} onClick={handleUploadDataset}>
            업로드
          </button>
        </div>
      </StyledUploadDatasetModal>
    </BasicModal>
  );
};
