//@ts-nocheck
//mui
import Box from "@mui/material/Box";
import LogoutIcon from "@mui/icons-material/Logout";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import JoinInnerOutlinedIcon from "@mui/icons-material/JoinInnerOutlined";
import ScreenshotMonitorOutlinedIcon from "@mui/icons-material/ScreenshotMonitorOutlined";
import CameraswitchOutlinedIcon from "@mui/icons-material/CameraswitchOutlined";
import RadarOutlinedIcon from "@mui/icons-material/RadarOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";

// eslint-disable
import { PotreeServiceImpl } from "@/application";
import { SideBarService } from "@/application/Potree/SideBarService";
import { usePotreeStore, ViewerType } from "@/store/usePotreeStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { StyledPotreeNavBar, StyleedPropertiesEmtyWrap } from "./style";
import * as THREE from "/public/Potree/libs/three.js/build/three.module.js";
import { Utils } from "/public/Potree/src/utils.js";

const potreeService = PotreeServiceImpl;

//component
import { BasicSearching } from "@/component/Inputs";
import { CustomizedSwitches } from "@/component/Switches";

//업무연계 탭 컴포넌트
import { BasicSelect } from "@/component/Selects";

//icon image
import { boardJobDetailData } from "@/apis/Board";
import { getLand, updateBoardAdmin, updateLand } from "@/apis/Land/land.api.ts";
import { AlertModal } from "@/component";
import { CustomSelect } from "@/component/Selects/CustomSelect";
import { DISTRICT_OPTIONS } from "@/consts/const";
import { commonImage, menuImage } from "@/consts/image";
import { ConfigType } from "@/container/Detector";
import { SHP_JIMOKLIST, ZOOM_OPTIONS } from "@/pages/service/const";
import { ROUTE_SERVICE } from "@/routes";
import useModalStore from "@/store/useModalStore";
import PotreeServiceUseCases from "@/useCases/PotreeServiceUseCases";
import { getRgba } from "@/utils";
import { Slider } from "@mui/material";
import { CreateResultModal } from "../../Modal/CreateResultModal";
import { SaveModal } from "../../Modal/SaveModal";
import useDxfDownLoad from "./hooks/useDxfDownLoad";
import useExcelDownload from "./hooks/useExcelDownload";
import { measureDrags } from "./hooks/useMeasureDrags";
import { AnnotationTool } from "./tools/AnnotationTool";
import { VolumeTool } from "./tools/VolumTool";
import { DatasetType } from "@/types";

interface PotreeNavBarProps {
  config: ConfigType;
  viewer: ViewerType;
  datasetInfo: DatasetType;
  handleCaptureToggle?: () => void;
}

export const PotreeMainNavBar = ({
  config,
  viewer,
  datasetInfo,
  handleCaptureToggle,
}: PotreeNavBarProps): JSX.Element | null => {
  const { potreeViewer, cesiumViewer } = viewer;
  const { area, shp } = config;
  const isDetectMode = datasetInfo.changeDetect ? true : false;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // 쿼리 스트링 값 가져오기
  const boardId = searchParams.get("boardId");
  const landInfoIdParams = searchParams.get("landInfoId");

  const sideBarRef = useRef<any>(null);
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const firstMenuWrapRef = useRef([]);
  const [measureTools, setMeasureTools] = useState<any[]>([]);
  const [clippingTools, setClippingTools] = useState<any[]>([]);
  const [landData, setLandData] = useState<any[] | undefined>([]);

  const [isCreateResultModal, setIsCreateResultModal] = useState(false); // 결과 등록 모달 창
  const [isJobDetailModal, setIsJobDetailModal] = useState(false); // 결과 등록 모달 창
  const [clickedMeasurementId, setClickedMeasurementId] = useState(null);
  const [clickedVolumId, setClickedVolumId] = useState(null);
  const [clickedAnnotationId, setClickedAnnotationId] = useState(null);
  const [clickedShpId, setClickedShpId] = useState(null);
  const [dotLineMode, setDotLineMode] = useState(true);
  const [clipingMode, setClipingMode] = useState(false);

  const [savedBoardId, setSavedBoardId] = useState(null);
  const [isSaveModal, setIsSaveModal] = useState(false); // 저장 모달 창
  const [distance, setDistance] = useState(null);

  const [isWorldSave, setIsWorldSave] = useState(false);
  const [urlPosition, setUrlPosition] = useState<any[]>([]); // 클리핑 좌표 저장

  const [leftToolBarValues, setLeftToolBarValues] = useState([]);
  const [openMenuList, setOpenMenuList] = useState<any[]>([]); // 측정 메뉴 활성화 상태
  const [opens, setOpen] = useState(false);
  const [opensError, setOpensError] = useState(false);

  const [menuOpens, setMenuOpens] = useState(false);

  const createdAreas = useRef([]);

  const { mutate: mutateUpdateBoardAdmin } = useMutation(updateBoardAdmin);
  const { mutate: mutateUpdateLand } = useMutation(updateLand);

  const navigate = useNavigate();

  const handleExcelDownload = useExcelDownload();
  const handleDxfDownload = useDxfDownLoad();
  // const handleAllZoomChange = useHandleAllZoomChange(potreeViewer);

  const [intervalId, setIntervalId] = useState(null);
  const [dragState, setDragState] = useState({
    isDragging: false,
    selectedPoint: null,
  });

  const {
    saveMode,
    viewerList,
    targetViewers,
    isClipingMode,
    properTires,
    setNewFeature,
    newFeature,
    saveFeatures,
    setIsControlPressed,
    isControlPressed,
    clickViewer,
    clickThisViewers,
    saveViewerJsonData,
    panoramaTarget,
    setPanoramaTarget,
    setChangeShapeZ,
  } = usePotreeStore();

  const { setShowChangeDetector, setShowReportExport } = useModalStore();

  const mainHeaderSetting = {
    mainHeaders: [
      {
        name: "분석",
        id: "insight",
        subMenus: [
          {
            name: "나가기",
            id: "exit",
            icon: LogoutIcon,
            available: true,
            callBack: async (viwer, isWorldSave, setOpen) => {
              if (!isWorldSave && potreeViewer.scene.measurements.length > 0) {
                setOpen(true);
                return;
              } else if (
                isWorldSave &&
                potreeViewer.scene.measurements.length > 0
              ) {
                navigate("/dataset");
              }

              if (
                !landInfoIdParams &&
                potreeViewer.scene.measurements.length <= 0
              ) {
                navigate("/dataset");
              }
            },
          },
          {
            name: "저장",
            id: "save",
            icon: SaveOutlinedIcon,
            available: true,
          },
          // {
          //   name: "결과등록",
          //   id: "export",
          //   icon: menuImage.iconExport,
          //   available: false,
          // },
          {
            name: "작업내역",
            id: "history",
            icon: HistoryOutlinedIcon,
            available: true,
          },
          {
            name: "레이어",
            id: "layer",
            icon: LayersOutlinedIcon,
            available: true,
            callBack: (menuId) => {
              openMenuLists(menuId);
            },
          },
          {
            name: "설정",
            id: "settings",
            icon: SettingsOutlinedIcon,
            available: true,
            callBack: (menuId) => {
              openMenuLists(menuId);
            },
          },
          {
            name: "미니맵",
            id: "minimap",
            icon: ExploreOutlinedIcon,
            available: true,
            callBack: (menuId: string): void => {
              openMenuLists(menuId);

              const potreeMaToggle: HTMLElement | null =
                document.querySelector("#potree_map_toggle");

              if (potreeMaToggle !== null) {
                potreeMaToggle.click();
              } else {
                console.error("요소를 찾지 못했습니다.");
              }
            },
          },
          {
            name: "속성정보",
            id: "propInfo",
            icon: InfoOutlinedIcon,
            available: true,
            callBack: (menuId) => {
              openMenuLists(menuId);
            },
          },
          {
            name: "측정",
            id: "te1",
            icon: TableChartOutlinedIcon,
            available: true,
            callBack: (menuId) => {
              openMenuLists(menuId);
            },
          },
          {
            name: "클리핑",
            id: "te2",
            icon: JoinInnerOutlinedIcon,
            available: true,
            callBack: (menuId) => {
              openMenuLists(menuId);
            },
          },

          // {
          //   name: (
          //     <>
          //       경계지
          //       <br />
          //       설정
          //     </>
          //   ),
          //   id: "te3",
          //   icon: menuImage.iconLandSetting,
          //   available: true,
          //   callBack: (menuId) => {
          //     openMenuLists(menuId);
          //   },
          // },
          // {
          //   name: (
          //     <>
          //       경계지
          //       <br />
          //       클리핑
          //     </>
          //   ),
          //   id: "te4",
          //   icon: menuImage.iconClipping,
          //   available: false,
          // },
          {
            name: "화면캡처",
            id: "te5",
            icon: ScreenshotMonitorOutlinedIcon,
            available: true,
            callBack: (menuId) => {
              handleCaptureToggle();
              // openMenuLists(menuId);
            },
          },
          {
            name: "탑뷰",
            id: "te6",
            icon: CameraswitchOutlinedIcon,
            available: true,
            callBack: (clickThisViewers) => {
              if (!clickThisViewers) {
                potreeViewer.scene.view.position.copy({
                  ...potreeViewer.scene.getActiveCamera().position,
                  z: 300,
                });
                potreeViewer.scene.view.yaw = 0;
                potreeViewer.scene.view.pitch = -Math.PI / 2;
                // potreeViewer.fitToScreen();
                // return;

                // zoomToAnnotation(
                //   potreeViewer.scene,
                //   potreeViewer.scene.getActiveCamera().position,
                //   position
                // );
                return;
              } else {
                clickThisViewers.scene.view.position.copy({
                  ...clickThisViewers.scene.getActiveCamera().position,
                  z: 300,
                });
                clickThisViewers.scene.view.yaw = 0;
                clickThisViewers.scene.view.pitch = -Math.PI / 2;
              }
            },
          },
          {
            name: "변화탐지",
            id: "te9",
            icon: RadarOutlinedIcon,
            available: true,
            hidden: isDetectMode,
            callBack: (menuId) => {
              setShowChangeDetector(true);
            },
          },
          {
            name: "보고서",
            id: "te10",
            icon: SummarizeOutlinedIcon,
            available: true,
            hidden: !isDetectMode,
            callBack: (menuId) => {
              if (datasetInfo?.changeDetect) {
                const { changeDetect } = datasetInfo;
                const { target, base } = changeDetect;
                setShowReportExport(true, {
                  filename: `${base.acqDate}_${
                    target.acqDate
                  }_${datasetInfo.address.replaceAll(" ", "_")}_변화탐지보고서`,
                  datasetInfo: datasetInfo,
                });
              }
            },
          },

          // newFeature == 2 && {
          //   name: "화면해제",
          //   id: "te7",
          //   icon: menuImage.iconScreenUnLock,
          //   viewMode: 2,
          //   available: true,
          //   callBack: (menuId, toggleControlState) => {
          //     toggleControlState();
          //   },
          // },
          // newFeature == 2 && {
          //   name: "동기화",
          //   id: "te8",
          //   viewMode: 2,
          //   icon: menuImage.iconScreenSync,
          //   available: true,
          //   callBack: (clickSyncToview, isClickViewNumber) => {
          //     clickSyncToview(isClickViewNumber);
          //   },
          // },
        ],
      },
    ],
  };

  const mainHeaders = mainHeaderSetting.mainHeaders;

  const [activedMainHeader, setActivedMainHeader] = useState<{
    name: string;
    id: string;
    subMenus: {
      name: string;
      id: string;
      icon: any;
      available: boolean;
      hidden?: boolean;
      callBack?: any;
    }[];
  }>(mainHeaders[0]);

  const [activedSubMenuHeader, setActivedSubMenuHeader] = useState<string[]>(
    []
  );
  const [lngLat, setLngLat] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });

  const [selectColor, setSelectColor] = useState("white"); // 면적정보
  const [allShapeZ, setAllShapeZ] = useState<number>(3); //테스트용
  const [allShapeSize, setAllShapeSize] = useState<number>(1); //테스트용
  const [allShapeColor, setAllShapeColor] = useState("yellow"); //테스트용
  const [allShapeTextColor, setAllShapeTextColor] = useState("black"); // 지목색상

  const [volumeTool, setVolumeTool] = useState([]);
  const [measurementsTool, setMeasurements] = useState([]);
  const [annotationTool, setAnnotationTool] = useState([]);

  const [shpAreaHoverObject, setShpAreaHoverObject] = useState<any>(null);

  const [areaHoverOn, setAreaHoverOn] = useState<boolean>(false);

  const [inputValue, setInputValue] = useState(allShapeZ.toFixed(2)); // 새로운 상태 추가

  // potreeViewer2 화면 감시
  // useEffect(() => {
  //   if (targetViewers === 1 && isControlPressed) {
  //     syncToview(potreeView2, potreeViewer.scene.view);
  //   }
  // }, [
  //   potreeView2?.position.x,
  //   potreeView2?.position.y,
  //   potreeView2?.position.z,
  // ]);

  useEffect(() => {
    if (typeof potreeViewer !== "object") return;
    init(searchParams);
    setVolumeTool(potreeViewer?.volumeTool?.scene.children);
    setMeasurements(potreeViewer?.measuringTool?.scene.children);
    setAnnotationTool(potreeViewer?.annotationTool.viewer.visibleAnnotations);
  }, [potreeViewer]);

  useEffect(() => {
    const updateState = () => {
      let newVolumTool = potreeViewer?.volumeTool?.scene.children;
      let newMeasuringTool = potreeViewer?.measuringTool?.scene.children;
      let newAnnotationTool =
        potreeViewer?.annotationTool?.viewer?.visibleAnnotations;

      if (newVolumTool && !arraysEqual(volumeTool, newVolumTool)) {
        setVolumeTool(newVolumTool ? [...newVolumTool] : []);
      }

      if (
        newMeasuringTool &&
        !arraysEqual(measurementsTool, newMeasuringTool)
      ) {
        setMeasurements(newMeasuringTool ? [...newMeasuringTool] : []);
      }

      if (
        newAnnotationTool &&
        !arraysEqual(annotationTool, newAnnotationTool)
      ) {
        setAnnotationTool(newAnnotationTool ? [...newAnnotationTool] : []);
      }
    };

    updateState();
  }, [
    potreeViewer?.volumeTool?.scene.children,
    potreeViewer?.measuringTool?.scene.children,
    potreeViewer?.annotationTool?.viewer?.visibleAnnotations,
    volumeTool,
    measurementsTool,
    annotationTool,
    properTires,
  ]);

  function arraysEqual(arr1, arr2) {
    if (arr1 === arr2) return true; // 참조가 같은 경우

    if (arr1?.length !== arr2?.length) return false;

    for (let i = 0; i < arr1?.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }

    return true;
  }
  useEffect(() => {
    if (isClipingMode == 1) {
      potreeViewer.setClipTask(1);
    } else {
      potreeViewer.setClipTask(2);
    }
  }, [isClipingMode]);

  useEffect(() => {
    const teKeys = ["te1", "te2", "te3"];
    // 현재 openMenuList에서 'teX' 항목들의 위치를 찾음.
    const teIndexes = openMenuList.reduce((acc, item, index) => {
      if (teKeys.includes(item)) {
        acc.push(index);
      }
      return acc;
    }, []);

    // 'teX' 항목들이 여러 개 있는 경우, 가장 마지막 항목을 제외한 나머지를 제거.
    if (teIndexes.length > 1) {
      const latestTeIndex = teIndexes[teIndexes.length - 1];
      const latestTe = openMenuList[latestTeIndex];

      // 최신 'teX'를 제외한 나머지 'teX' 항목들을 제거.
      const updatedOpenMenuList = openMenuList.filter(
        (item, index) => !teKeys.includes(item) || index === latestTeIndex
      );
      setOpenMenuList(updatedOpenMenuList);

      // activedSubMenuHeader도 업데이트.
      const updatedActivedSubMenuHeader = activedSubMenuHeader.filter(
        (item) => item === latestTe || !teKeys.includes(item)
      );
      setActivedSubMenuHeader(updatedActivedSubMenuHeader);
    }

    if (openMenuList.includes("te5") && openMenuList.length > 1) {
      // setIsCaptureEnabled((prev: boolean) => {
      //   if (prev) {
      //     const iscaped = false;
      //     return iscaped;
      //   }
      // });

      const updatedTe5Active: string[] = activedSubMenuHeader.filter(
        (item) => item !== "te5"
      );
      setActivedSubMenuHeader(updatedTe5Active);
      // "te5"를 openMenuList에서 제거
      setOpenMenuList((prev) => prev.filter((item) => item !== "te5"));
    }
  }, [openMenuList]);

  useEffect(() => {
    if (typeof potreeViewer !== "object") return;
    let foundObject = potreeViewer.scene.scene.getObjectByName("Shapes");
    if (foundObject) {
      // 원하는 오브젝트를 찾았을 때 실행할 코드

      setChangeShapeZ(allShapeZ);

      foundObject.position.z = allShapeZ;

      const filteredMeasurements = potreeViewer.scene.measurements;
      const filteredMeasurementsss =
        potreeViewer?.measuringTool?.scene.children;
      const filteredMeasurements2 = potreeViewer.scene.scene.children;

      if (potreeViewer.scene.measurements.length > 0 && filteredMeasurements) {
        for (const measurementsItem of filteredMeasurements) {
          if (measurementsItem.type == "editMeasure") {
            measurementsItem.position.z = 0;
            measurementsItem.position.z = allShapeZ;
          }
        }
      }

      if (
        potreeViewer.scene.scene.children.length > 0 &&
        filteredMeasurements2
      ) {
        for (const measurementsItem2 of filteredMeasurements2) {
          if (measurementsItem2.type == "editMeasure") {
            measurementsItem2.position.z = 0;
            measurementsItem2.position.z = allShapeZ;
          }
        }
      }
      if (
        potreeViewer?.measuringTool?.scene.children.length > 0 &&
        filteredMeasurementsss
      ) {
        for (const filteredMeasurementsss of filteredMeasurements2) {
          if (filteredMeasurementsss.type == "editMeasure") {
            filteredMeasurementsss.position.z = 0;
            filteredMeasurementsss.position.z = allShapeZ;
          }
        }
      }
    } else {
      // 오브젝트를 찾지 못했을 때 실행할 코드
      console.log("Object not found.");
    }
  }, [allShapeZ]);

  useEffect(() => {
    let foundObject = potreeViewer.scene.scene.getObjectByName("Shapes");
    if (foundObject) {
      foundObject.children[0].children[0].children[0].material.linewidth =
        allShapeSize;
    } else {
      // 오브젝트를 찾지 못했을 때 실행할 코드
      console.log("Object not found.");
    }
  }, [allShapeSize]);

  useEffect(() => {
    let foundObject = potreeViewer.scene.scene.getObjectByName("Shapes");
    if (foundObject) {
      foundObject.children[0].children[0].children[0].material.color.setColorName(
        allShapeColor
      );
    } else {
      // 오브젝트를 찾지 못했을 때 실행할 코드
      console.log("Object not found.");
    }
  }, [allShapeColor]);

  useEffect(() => {
    // getObjectByName으로 씬에서 특정 객체 찾기
    const foundObject = potreeViewer.scene.scene.getObjectByName("Shapes");
    if (
      foundObject &&
      foundObject.children[0] &&
      foundObject.children[0].children
    ) {
      foundObject.children[0].children.forEach((child) => {
        const sprite = child.children[0].children[0];
        const texture = sprite.material.map;
        const canvas = texture.image;
        const context = canvas.getContext("2d");
        const text = sprite.userData.text;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = `rgba(${getRgba(allShapeTextColor)})`;
        context.fillText(text, 30, 50); // 텍스트 재렌더링

        texture.needsUpdate = true;
      });
    } else {
      console.log("Object not found.");
    }
  }, [allShapeTextColor]); // allShapeTextColor 상태가 변경될 때마다 실행

  // 면적정보 색상
  useEffect(() => {
    let foundObject = potreeViewer.scene.scene.getObjectByName("Shapes");
    if (foundObject) {
      switchingColor(selectColor);
    } else {
      // 오브젝트를 찾지 못했을 때 실행할 코드
      console.log("Object not found.");
    }
  }, [selectColor]);

  const initAllshpZ = async (allShapeZ) => {
    const filteredMeasurements = potreeViewer.scene.measurements;

    const filteredMeasurements2 = potreeViewer.scene.scene.children;
    if (potreeViewer.scene.measurements.length > 0 && filteredMeasurements) {
      for await (const measurementsItem of filteredMeasurements) {
        if (measurementsItem.type == "editMeasure") {
          measurementsItem.position.z = 0;
          measurementsItem.position.z = allShapeZ;
        }
      }
    }

    if (potreeViewer.scene.scene.children.length > 0 && filteredMeasurements2) {
      for await (const measurementsItem2 of filteredMeasurements2) {
        if (measurementsItem2.type == "editMeasure") {
          measurementsItem2.position.z = 0;
          measurementsItem2.position.z = allShapeZ;
        }
      }
    }
  };

  const init = async (searchParams) => {
    try {
      sideBarRef.current = new SideBarService(potreeViewer);
      sideBarRef.current.init();

      //측정,클리핑 : name,callback 불러오는 위치
      setMeasureTools(
        await sideBarRef.current.getTools(setMeasurements, setAnnotationTool)
      );
      setClippingTools(
        await sideBarRef.current.getClippingTools(setVolumeTool, potreeViewer)
      );

      await PotreeServiceUseCases.init(
        potreeViewer,
        cesiumViewer,
        config,
        isDetectMode
      );

      let foundObject = potreeViewer.scene.scene.getObjectByName("Shapes");

      if (foundObject) {
        const { changeShapeZ } = usePotreeStore.getState();

        setAllShapeZ(changeShapeZ);
        setInputValue(changeShapeZ);

        // line size
        foundObject.children[0].children[0].children[0].material.linewidth =
          allShapeSize;

        //line position
        foundObject.position.z = changeShapeZ;

        // handleAllZoomChange(area);
      } else {
        // 오브젝트를 찾지 못했을 때 실행할 코드
        console.log("Object not found.");
      }

      const potreeQuickButtons: HTMLElement | null = document.querySelector(
        "#potree_quick_buttons"
      );

      potreeQuickButtons.style.display = "none";

      getCoord();
      getProperTires(potreeViewer);
      pointcloudsMaterialSetting(foundObject);

      if (newFeature == 2) {
        toggleControlState();
        setIsControlPressed(true);
      }

      // 저장한 지역에 해당되는 metadata 호출
      if (searchParams.size === 2) {
        await PotreeServiceUseCases.getShapeForContest(
          potreeViewer,
          landInfoIdParams
        );
      }

      if (searchParams.size <= 2) {
        //분할 화면 시 metadata 수정 구역에 대한 로드
        if (saveViewerJsonData) {
          let result = await PotreeServiceUseCases.LoadTogetShapeForContest(
            potreeViewer,
            saveViewerJsonData
          );

          createdAreas.current.push(...result);

          const filterEditMeasure = potreeViewer.scene.measurements.filter(
            (el) => el.type === "editMeasure"
          );

          if (filterEditMeasure.length < 1) return false;

          for (const setDragSetingMeasure of filterEditMeasure) {
            measureDrags(potreeViewer, setDragSetingMeasure, true);
          }
        }
      } else if (searchParams.size > 2) {
        // 클리핑 url로 접근시
        await PotreeServiceUseCases.loadUrlVolum(potreeViewer, location);
      }

      initAllshpZ(allShapeZ);

      openMenuLists("layer");
      setActivedSubMenuHeader(["layer"]);
    } catch (e) {
      console.error(e);
      console.log(e, "errororor");
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["land", boardId],
    queryFn: getLand,
    staleTime: 5 * 60 * 1000,
    enabled: !!boardId,
  });

  const {
    data: jobDetailDatas,
    isLoading: isJubdatasLoading,
    refetch,
  } = boardJobDetailData(boardId);

  useEffect(() => {
    // 툴바 사이드 메뉴 위치
    if (containerRef?.current && firstMenuWrapRef?.current.length > 0) {
      const containerRect = containerRef.current.getBoundingClientRect();
      let toolBarLeftArray = [];
      firstMenuWrapRef.current.forEach((menuWrap, index) => {
        if (menuWrap) {
          const menuWrapRect = menuWrap.getBoundingClientRect();
          const leftPosition = menuWrapRect.left - containerRect.left;

          toolBarLeftArray.push(leftPosition);
        }
      });

      setLeftToolBarValues(toolBarLeftArray);
    }
  }, [containerRef?.current, firstMenuWrapRef?.current]);

  useEffect(() => {
    if (!data) return;

    setLandData((prev) => (prev = data?.resultObject));
  }, [sideBarRef.current, data?.resultObject]);

  useEffect(() => {
    let landInfoId;
    if (savedBoardId && !jobDetailDatas) {
      navigate(`${ROUTE_SERVICE}/${area}?boardId=${savedBoardId}`);
    }

    if (savedBoardId && jobDetailDatas) {
      landInfoId = jobDetailDatas?.resultObject[0]?.landInfoId;
      navigate(
        `${ROUTE_SERVICE}/${area}?boardId=${savedBoardId}&landInfoId=${Number(
          landInfoId + 1
        )}`
      );

      refetch();
    }
  }, [jobDetailDatas, savedBoardId, area]);

  // esc 버튼 클릭 시
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setOpenMenuList((prev: string[]) => {
          if (!prev.length > 0) return prev; // 배열이 이미 비어있으면 그대로 반환
          const lastItem = prev[prev.length - 1];

          // layout, settings, propsInfo, minimap이 아닌 경우에만 제거
          if (
            lastItem !== "layer" &&
            lastItem !== "settings" &&
            // lastItem !== "propInfo" &&
            lastItem !== "minimap"
          ) {
            const upDateArray = prev.slice(0, -1);

            setActivedSubMenuHeader(upDateArray);

            // "캡처"가 활성화되어 있을 때 setIsCaptureEnabled를 false로 설정
            if (upDateArray.indexOf("te5") === -1) {
              // setIsCaptureEnabled(false);
            }

            return upDateArray;
          } else {
            return prev; // layout, settings, propsInfo, minimap이면 그대로 반환
          }
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function getSpritesFromDeepestLevel(obj) {
    // 현재 객체에 children이 없으면 현재 객체를 배열로 반환
    if (!obj.children || obj.children.length === 0) {
      return [obj];
    }

    // 자식 객체들을 재귀적으로 탐색하여 가장 깊은 레벨의 객체들을 얻음
    let deepestChildren = [];
    for (let child of obj.children) {
      deepestChildren = deepestChildren.concat(
        getSpritesFromDeepestLevel(child)
      );
    }

    // 가장 깊은 레벨에서 type이 'Sprite'인 객체들만 필터링하여 반환
    return deepestChildren.filter((item) => item.type === "Sprite");
  }

  const pointcloudsMaterialSetting = (foundObject) => {
    potreeViewer.setEDLStrength(0.3);
    potreeViewer.setEDLRadius(1);

    if (foundObject) {
      let result = getSpritesFromDeepestLevel(foundObject);

      setTimeout((el) => {
        let tree = $(`#jstree_scene`);
        let name = "지번";

        let areaNo = tree.jstree(
          "create_node",
          "#",
          { text: "<b>지번</b>", id: "areaNo", icon: "" },
          "last",
          false,
          false
        );

        tree.jstree("check_node", areaNo);

        let nodeIDs = tree.jstree(
          "create_node",
          areaNo,
          {
            text: "지번",
            icon: "",
            data: result,
          },
          "last",
          false,
          false
        );

        tree.jstree("check_node", nodeIDs);

        if (result[0].visible) {
          tree.jstree("check_node", nodeIDs);
        } else {
          tree.jstree("uncheck_node", nodeIDs);
        }
      }, 1000);
    } else {
      console.log("오브젝트 로드 불가");
    }
  };

  const subToolBarLeftsettings = (targetId: string) => {
    let leftValue;
    switch (targetId) {
      case "te1":
        leftValue = leftToolBarValues[7];
        break;
      case "te2":
        leftValue = leftToolBarValues[8];
        break;
      case "te3":
        leftValue = leftToolBarValues[9];
        break;
    }
    return leftValue;
  };
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    const numericValue = parseFloat(newValue);
    if (!isNaN(numericValue)) {
      setAllShapeZ(numericValue);
    }
  };

  const handleMouseUp = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  const handleFileDownButton = () => {
    setMenuOpens((prev) => !prev);
  };

  const handleButtonClick = useCallback(
    async (
      type,
      savedBoardId,
      viewers,
      jobDetailDatas,
      refetch,
      setIsWorldSave,
      allShapeZ
    ) => {
      try {
        let changeType = type;
        if (changeType == 2) {
          saveSplitViewData(
            savedBoardId,
            viewers,
            jobDetailDatas,
            refetch,
            setIsWorldSave,
            setNewFeature,
            changeType,
            allShapeZ
          );
        } else if (changeType == 1) {
          setNewFeature(changeType);
        }
        // 작업이 완료된 후 상태 업데이트
      } catch (error) {
        throw error;
      }
    },
    [setNewFeature]
  );

  const saveSplitViewData = async (
    savedBoardId,
    viewers,
    jobDetailDatas,
    refetch,
    setIsWorldSave,
    setNewFeature,
    changeType,
    allShapeZ
  ) => {
    let saveJson = await sideBarRef.current.getSence(viewers, 1);

    setChangeShapeZ(allShapeZ);
    usePotreeStore.getState().setSaveViewerJsonData(saveJson);
    usePotreeStore.getState().setNewFeature(2);
  };

  const handleFloatingClose = useCallback(
    (menuId: string) => () => {
      setActivedSubMenuHeader((prev) => {
        return prev.filter((el) => el !== menuId);
      });
      //  sceneDelect(
      //       index,
      //       "measurements",
      //       measurement.uuid
      //     )
    },
    [setActivedSubMenuHeader]
  );

  const notArrowLists = useCallback((menuId: string): "" | string => {
    const notArrowList = [
      "save",
      "layer",
      "settings",
      "minimap",
      "propInfo",
      "te5",
      "te6",
      "te7",
      "te8",
      "exit",
    ] as string[];
    const isNotArrows = notArrowList.includes(menuId) as boolean;

    if (isNotArrows) {
      return "notArrows";
    } else {
      return "";
    }
  }, []);

  //속성리스트 선택 삭제
  const sceneDelect =
    (idx: number, type: string, id: string) =>
    (e: MouseEvent): void => {
      e.stopPropagation();

      if (type === "measurements") {
        const updatedMeasurements =
          potreeViewer?.measuringTool?.scene?.children?.slice();

        potreeViewer?.scene?.measurements?.splice(idx, 1);

        if (updatedMeasurements) {
          updatedMeasurements.splice(idx, 1);
          potreeViewer.measuringTool.scene.children = updatedMeasurements;
          setMeasurements(updatedMeasurements);
        }

        let tree = $("#jstree_scene");
        let measurementsRoot = $("#jstree_scene")
          .jstree()
          .get_json("measurements");

        let jsonNode = measurementsRoot.children.find(
          (child) => child.data.uuid === id
        );

        let sceneR = potreeViewer.scene.scene.children.find(
          (child) => child.userData.prentId === id
        );

        potreeViewer.inputHandler.deselectAll();

        if (jsonNode) {
          tree.jstree("delete_node", jsonNode.id);
        }

        if (sceneR) {
          potreeViewer.scene.scene.remove(sceneR);
        }
      }

      // 클리핑
      if (type === "volume") {
        const updatedVolumeTool =
          potreeViewer?.volumeTool?.scene?.children?.slice();
        const updataSceneVolumeTool = potreeViewer?.scene?.volumes?.slice();
        if (updatedVolumeTool) {
          updataSceneVolumeTool.splice(idx, 1);
          updatedVolumeTool.splice(idx, 1);
          potreeViewer.scene.volumes = updataSceneVolumeTool;
          potreeViewer.volumeTool.scene.children = updatedVolumeTool;

          setVolumeTool(updatedVolumeTool);
        }
        let tree = $("#jstree_scene");
        let measurementsRoot = $("#jstree_scene")
          .jstree()
          .get_json("measurements");
        let jsonNode = measurementsRoot.children.find(
          (child) => child.data.uuid === id
        );
        potreeViewer.inputHandler.deselectAll();

        if (jsonNode) {
          tree.jstree("delete_node", jsonNode.id);
        }
      }

      // annotations
      if (type === "annotations") {
        const updatedAnnotations =
          potreeViewer?.annotationTool?.viewer?.visibleAnnotations?.slice();
        const updatedSceneAnnotations =
          potreeViewer?.scene?.annotations?.children?.slice();

        if (updatedAnnotations) {
          updatedAnnotations.splice(idx, 1);
          updatedSceneAnnotations.splice(idx, 1);

          potreeViewer.annotationTool.viewer.visibleAnnotations =
            updatedAnnotations;
          potreeViewer.scene.annotations.children = updatedSceneAnnotations;
          setAnnotationTool(updatedAnnotations);
        }
        let tree = $("#jstree_scene");
        let annotationsRoot = $("#jstree_scene")
          .jstree()
          .get_json("annotations");
        let jsonNode = annotationsRoot?.children.find(
          (child) => child.data.uuid === id
        );

        potreeViewer.inputHandler.deselectAll();

        if (jsonNode) {
          tree.jstree("delete_node", jsonNode.id);
          jsonNode.data.domElement.remove();
        }
      }

      if (type === "properTires") {
        const findingId = potreeViewer?.scene?.measurements.findIndex(
          (el) => el.uuid === id.id
        );

        const updatedMeasurements =
          potreeViewer?.measuringTool?.scene?.children?.slice();

        potreeViewer?.scene?.measurements?.splice(findingId, 1);

        if (updatedMeasurements) {
          updatedMeasurements.splice(findingId, 1);
          potreeViewer.measuringTool.scene.children = updatedMeasurements;
          setMeasurements(updatedMeasurements);
        }

        let tree = $("#jstree_scene");
        let measurementsRoot = $("#jstree_scene")
          .jstree()
          .get_json("measurements");

        let jsonNode = measurementsRoot.children.find(
          (child) => child.data.uuid === id.id
        );

        let sceneR = potreeViewer.scene.scene.children.find(
          (child) => child.userData.prentId === id.id
        );

        potreeViewer.inputHandler.deselectAll();

        if (jsonNode) {
          tree.jstree("delete_node", jsonNode.id);
        }

        if (sceneR) {
          potreeViewer.scene.scene.remove(sceneR);
        }

        if (createdAreas.current.length > 0) {
          createdAreas.current.filter(
            (el) => el !== jsonNode.data.userData.jibun
          );
        }

        usePotreeStore.getState().shpProperTires(undefined);
        usePotreeStore.getState().setSaveMode(false);
        // setIsShpMode(false);
      }
    };

  const openMenuLists = (menuId: string): void => {
    setOpenMenuList((prev: string[]) => {
      if (!prev.includes(menuId)) {
        // 중복되지 않으면 추가
        return [...prev, menuId];
      } else {
        // 중복되면 제거
        return prev.filter((id) => id !== menuId);
      }
    });
  };

  //미니맵 토글
  const toggleMiniMap = (e): void => {
    const isMinimapActive: boolean = activedSubMenuHeader.includes("minimap");

    const updatedSubMenuHeader: string[] = isMinimapActive
      ? activedSubMenuHeader.filter((item) => item !== "minimap")
      : [...activedSubMenuHeader, "minimap"];
    setActivedSubMenuHeader(updatedSubMenuHeader);
  };

  // 속성정보 클릭
  const isClickHandler =
    (Id: string, position: string[], data: any[], name: string) =>
    (e): void => {
      event?.stopPropagation();
      setClickedMeasurementId(Id); // 측정 속성정보
      setClickedVolumId(Id); // 클리핑 속성정보
      setClickedAnnotationId(Id); // 속정정보 선택
      setClickedShpId(data);
      selectNodeInJSTree(Id, name);
      if (name == "annotation" && position) {
        zoomToAnnotation(
          potreeViewer.scene,
          potreeViewer.scene.getActiveCamera().position,
          position
        );

        return;
      } else if (position instanceof Array) {
        // 측정 일시
        zoomToMeasurement(
          position,
          name,
          potreeViewer.scene,
          potreeViewer.scene.getActiveCamera().position,
          data
        );
        return;
      } else if (position) {
        // 클리핑 일시 (볼륨)
        zoomToVolume(data);

        const volumesQueryString = setSelectVolumeQueryString(data);
        setUrlPosition(volumesQueryString);
        return;
      }
    };

  // JSTree에서 노드 선택 함수
  const selectNodeInJSTree = (camera: string, name: string): void => {
    let jstreeRoot = !name
      ? $("#jstree_scene").jstree().get_json("measurements")
      : $("#jstree_scene").jstree().get_json("annotations");
    let jsonNode = jstreeRoot?.children.find((child) => child.data.uuid);

    if (jsonNode) {
      const jstreeReference = $.jstree.reference(jsonNode.id);
      jstreeReference.deselect_all();
      jstreeReference.select_node(jsonNode.id);
    }
  };

  // Annotation일 때 화면 확대 함수
  const zoomToAnnotation = (scene, endPosition, endTarget): void => {
    Utils.moveTo(scene, endPosition, endTarget);
  };

  // 측정일 때 화면 확대 함수
  const zoomToMeasurement = (
    position: any[],
    name: string,
    scene,
    viwerScene,
    data
  ): void => {
    if (name == "shpproperties") {
      const findFeaturesList = scene.scene.children[0].children[0].children;

      const findArea = findFeaturesList
        .filter((el) => {
          return el.userData.properties.JIBUN === data;
        })
        .map((el) => el.geometry);

      let points = findArea[0].vertices;
      let box = new THREE.Box3().setFromPoints(points);

      if (box.getSize(new THREE.Vector3()).length() > 0) {
        let node = new THREE.Object3D();
        node.boundingBox = box;

        potreeViewer.zoomTo(node, 1, 500);
      }
      return;
    }

    let points = position.map((p) => p.position);
    let box = new THREE.Box3().setFromPoints(points);

    if (box.getSize(new THREE.Vector3()).length() > 0) {
      let node = new THREE.Object3D();
      node.boundingBox = box;

      potreeViewer.zoomTo(node, 1, 500);
      return;
    } else {
      // let node = new THREE.Box3();
      // node.boundingBox = box;
      // potreeViewer.zoomTo(node, 1, 500);
      potreeViewer.setTopView();
      potreeViewer.scene.view.position.copy({
        ...points[0],
        z: 500,
      });
      // potreeViewer.scene.view.lookAt(box);
    }
  };

  // 클리핑(볼륨)일 때 화면 확대 함수
  const zoomToVolume = (volumeData): void => {
    let box = volumeData.boundingBox
      .clone()
      .applyMatrix4(volumeData.matrixWorld);

    if (box.getSize(new THREE.Vector3()).length() > 0) {
      let node = new THREE.Object3D();
      node.boundingBox = box;
      potreeViewer.zoomTo(node, 1, 500);
    }
  };

  // 클리핑(볼륨)일 때 선택 시 setSelectVolumeQueryString url 변환
  const setSelectVolumeQueryString = (data: any[]): string => {
    let requestUrl = "";

    for (let key of Object.keys(data)) {
      const value = data[key];

      // 특정 key에 해당하는 경우만 추가
      if (
        key === "uuid" ||
        key === "type" ||
        key === "name" ||
        key === "position" ||
        key === "rotation" ||
        key === "scale" ||
        key === "visible" ||
        key === "clip"
      ) {
        // 값이 존재하는 경우에만 추가
        if (value !== undefined && value !== null) {
          if (key === "position" || key === "rotation" || key === "scale") {
            // 배열 또는 객체를 JSON 문자열로 변환
            const arrayOrObjectAsString = JSON.stringify(value);
            if (requestUrl.length < 1) {
              requestUrl += `?${key}=${arrayOrObjectAsString}`;
            } else {
              requestUrl += `&${key}=${arrayOrObjectAsString}`;
            }
          } else {
            if (requestUrl.length < 1) {
              requestUrl += `?${key}=${value}`;
            } else {
              requestUrl += `&${key}=${value}`;
            }
          }
        }
      }
    }
    return requestUrl;
  };

  const setClipingModeHandeler = (e) => {
    console.log("cliping handler");
    if (!e.target) return;
    const isClickState = e.target.checked;
    if (!isClickState) {
      setClipingMode(false);
      usePotreeStore.getState().setIsClipingMode(true);
      potreeViewer.setClipTask(2);
    } else {
      setClipingMode(true);
      usePotreeStore.getState().setIsClipingMode(false);
      potreeViewer.setClipTask(1);
    }
  };
  const setDotLineModeHandeler = (e) => {
    if (!e.target) return;
    const isClickState = e.target.checked;
    if (!isClickState) {
      setDotLineMode(false);
      potreeViewer.setEDLRadius(0);
      potreeViewer.setEDLStrength(0);
    } else {
      setDotLineMode(true);
      potreeViewer.setEDLRadius(0.9);
      potreeViewer.setEDLStrength(0.3);
    }
  };

  const handleAllShapeZChange = (event: Event, newValue: number | number[]) => {
    setAllShapeZ(newValue as number);
    setInputValue(newValue.toFixed(2));
  };

  const handleMouseDown = (direction) => {
    const id = setInterval(() => {
      setAllShapeZ((prevValue) => {
        const newValue = prevValue + (direction === "left" ? -0.1 : 0.1);
        setInputValue(newValue.toFixed(2));
        return newValue;
      });
    }, 10); // 100ms 마다 0.1씩 증가 또는 감소
    setIntervalId(id);
  };

  const setHandleAllzoomChange = (viewer, newValue: number) => {
    // 포인트 클라우드와 바운딩 박스 확인
    const pointcloud = viewer.scene.pointclouds[0];

    let pointCenter = new THREE.Vector3(
      pointcloud.position.x + pointcloud.boundingBox.max.x / 2,
      pointcloud.position.y + pointcloud.boundingBox.max.y / 2,
      pointcloud.position.z
    );

    viewer.scene.view.setView(
      [pointCenter.x, pointCenter.y, pointCenter.z + newValue],
      [pointCenter.x, pointCenter.y + 1, pointCenter.z]
    );
  };

  const handleAllShapeSize = useCallback(
    (event: Event, newValue: number | number[]) => {
      setAllShapeSize(newValue as number);
    },
    [allShapeSize]
  );

  const getCoord = useCallback(() => {
    let firstCoord =
      "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs";
    let secondCoord =
      "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees";

    potreeViewer.renderer.domElement.addEventListener("mousemove", (e) => {
      let mouse = new THREE.Vector2();
      mouse.x = (event?.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event?.clientY / window.innerHeight) * 2 + 1;
      let inputHandler = potreeViewer.inputHandler;
      let i = inputHandler.getMousePointCloudIntersection();

      if (i) {
        let x = i.location.x;
        let y = i.location.y;
        // 원래 좌표를 WGS84로 변환.
        const transformedCoords = proj4(firstCoord, secondCoord, [x, y]);

        // console.log('변환된 좌표 (WGS84):', transformedCoords);
        setLngLat({ lng: transformedCoords[0], lat: transformedCoords[1] });
      }
    });

    potreeViewer.renderer.domElement.addEventListener("mousedown", (e) => {
      const teKeys = ["te1", "te2", "te3"];

      handleProppertires(e, "mousedown", potreeViewer);

      setOpenMenuList((prevOpenMenuList) => {
        return prevOpenMenuList.filter((item) => !teKeys.includes(item));
      });

      setActivedSubMenuHeader((prevOpenMenuList) => {
        // 'te1', 'te2', 'te3'를 제외하고 나머지 요소들만 유지.
        return prevOpenMenuList.filter((item) => !teKeys.includes(item));
      });
    });

    potreeViewer.renderer.domElement.addEventListener("mousewheel", (event) => {
      let inputHandler = potreeViewer.inputHandler;
      let intersectionInfo = inputHandler.getMousePointCloudIntersection();

      if (intersectionInfo) {
        const { distance } = intersectionInfo;

        if (distance <= 60) {
          setAreaHoverOn(true);
          // potreeViewer.scene.pointclouds[0].material.size = 2;
        } else if (distance > 60) {
          setAreaHoverOn(false);
          // potreeViewer.scene.pointclouds[0].material.size = 1;
        }
      }
    });
  }, []);

  const handleMouseHover = (e) => {
    let mouse = new THREE.Vector2();
    mouse.x = (event?.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event?.clientY / window.innerHeight) * 2 + 1;
    let inputHandler = potreeViewer.inputHandler;
    let i = inputHandler.getMousePointCloudIntersection();

    const raycaster = new THREE.Raycaster();
    const camera = potreeViewer.scene.getActiveCamera();
    raycaster.setFromCamera(mouse, camera);

    let intersects = raycaster.intersectObjects(
      potreeViewer.scene.scene.children,
      true
    );

    let currentHoverObject = null;
    for (let i = 0; i < intersects.length; i++) {
      let intersect = intersects[i];
      const propertiesd = intersect.object.userData;
      if (propertiesd.type == "areaPolygonMesh") {
        // console.log(mm, "bmbmbmbm");
        // for (let i = 0; i < mm[0].length; i++) {
        //   mm;
        // }
        currentHoverObject = intersect.object;
        // intersect.object.material.color.set(0xc0c0c0); // 색상 변경
        // intersect.object.material.side = 2;
        // intersect.object.material.transparent = true;

        let material = new THREE.MeshBasicMaterial({
          color: 0xc0c0c0, // 적용할 색상
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5,
          depthTest: false, // 깊이 테스트 비활성화
          depthWrite: false, // 깊이 쓰기 비활성화
        });
        intersect.object.material = material;

        let materials = new THREE.MeshBasicMaterial({
          color: 0x0000ff33,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0, // 반투명 설정
          alphaTest: 1,
          depthTest: false, // 깊이 테스트 비활성화
          depthWrite: false, // 깊이 쓰기 비활성화
        });
        potreeViewer.scene.scene.children[0].children[0].children
          .filter((el) => {
            return el.userData.type == "areaPolygonMesh";
          })
          .map((el) => (el.materials = materials));
        // intersect.object.renderOrder = 1; // 렌더 순서 설정
        // intersect.object.material.side = THREE.DoubleSide;
        // intersect.object.material.needsUpdate = true;
        // transparent: true,

        break;
      }
    }

    if (
      shpAreaHoverObject &&
      currentHoverObject?.userData.properties.JIBUN !==
        shpAreaHoverObject?.userData.properties.JIBUN
    ) {
      let material = new THREE.MeshBasicMaterial({
        color: 0x0000ff33,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0, // 반투명 설정
        alphaTest: 1,
      });
      shpAreaHoverObject.material = material;
      // shpAreaHoverObject.material.opacity = 0;
    }

    setShpAreaHoverObject(currentHoverObject);
  };

  useEffect(() => {
    if (areaHoverOn) {
      potreeViewer.renderer.domElement.addEventListener(
        "mousemove",
        handleMouseHover
      );
    } else {
      let material = new THREE.MeshBasicMaterial({
        color: 0x0000ff33,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0, // 반투명 설정
        alphaTest: 1,
      });
      if (shpAreaHoverObject) {
        shpAreaHoverObject.material = material;
      }
      potreeViewer?.scene?.scene?.children[0]?.children[0].children
        .filter((el) => {
          return el.userData.type == "areaPolygonMesh";
        })
        .map((el) => (el.material = material));
      setShpAreaHoverObject(null);

      potreeViewer.renderer.domElement.removeEventListener(
        "mousemove",
        handleMouseHover
      );
    }

    return () => {
      potreeViewer.renderer.domElement.removeEventListener(
        "mousemove",
        handleMouseHover
      );
    };
  }, [potreeViewer, shpAreaHoverObject, areaHoverOn]);

  const getProperTires = (potreeViewer) => {
    const targetElement = potreeViewer.renderer.domElement; // 또는 적절한 DOM 요소
    targetElement.addEventListener("dblclick", (event) => {
      handleProppertires(event, "dblclick", potreeViewer);
    });

    // targetElement.addEventListener("mousedown", (event) => {
    //   handleProppertires(event, "mousedown", potreeViewer);
    // });
  };

  const switchingColor = (selectColor) => {
    let switchColor;
    switch (selectColor) {
      case "yellow":
        switchColor = { r: 255, g: 255, b: 0 };
        break;

      case "black":
        switchColor = { r: 0, g: 0, b: 0 };

        break;
      case "white":
        switchColor = { r: 236, g: 0, b: 213 };
        break;
      case "green":
        switchColor = { r: 0, g: 50, b: 0 };
        break;
    }

    for (const measurementsItem of potreeViewer.scene.measurements) {
      // 최상위 add 배열 순회

      measurementsItem.areaLabel.material.color = { ...switchColor };
    }
    setSelectColor(selectColor);
  };

  const handleProppertires = (e, dblclickState: string, potreeViewer) => {
    event?.stopPropagation();

    const { saveFeatures, transform } = usePotreeStore.getState();
    if (event?.button === 2) {
      return; // 마우스 오른쪽 클릭이면 여기서 함수 실행을 중단
    }
    // 마우스 위치를 기반으로 raycaster 설정
    let mouse = new THREE.Vector2();
    mouse.x = (event?.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event?.clientY / window.innerHeight) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    const camera = potreeViewer.scene.getActiveCamera();
    raycaster.setFromCamera(mouse, camera);

    // 교차하는 객체 찾기

    let intersects = raycaster.intersectObjects(
      potreeViewer.scene.scene.children,
      true
    );
    if (intersects.length < 1) return;

    for (let i = 0; i < intersects.length; i++) {
      let intersect = intersects[i];

      if (!intersect.object.parent.visible) return; // 체크 활성화된 지적선,
      if (intersect.object.userData.type === "areaPolygonMesh") {
        // const v360images = $("#jstree_scene").jstree().get_json("images")
        // // console.log('panorame??',)
        // console.log(v360images.children[0].data.sphere.rotation.z - 8.3,'asdasd')
        // v360images.children[0].data.sphere.rotation.set(...v360images.children[0].data.sphere.rotation,v360images.children[0].data.sphere.rotation.z - 6.3)
        let material = new THREE.MeshBasicMaterial({
          color: 0x0000ff33,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0, // 반투명 설정
          alphaTest: 1,
        });
        intersect.object.material = material;

        setShpAreaHoverObject(null);
        setAreaHoverOn(false);

        potreeViewer.renderer.domElement.removeEventListener(
          "mousemove",
          handleMouseHover
        );
      }

      if (
        intersect.object.type === "Mesh" &&
        intersect.object.userData.properties
      ) {
        console.log("intersect", intersect);
        potreeViewer.orbitControls.doubleClockZoomEnabled = false;

        // userData의 properties를 사용하여 정보 표시
        const propertiesd = intersect.object.userData;

        let currentHoverObject = null;

        currentHoverObject = intersect.object;
        intersect.object.material.color.set(0xff0000); // 적색으로 변경

        if (dblclickState == "dblclick") {
          saveFeatures.mesure?.removeEventListener("sphereClicked", callback);

          shpEditHandler(potreeViewer, propertiesd, saveMode, saveFeatures);
          usePotreeStore.getState().shpProperTires(propertiesd);
          usePotreeStore.getState().setCurrentEditingProperty(propertiesd);
          openMenuLists("propInfo");
          setActivedSubMenuHeader(["propInfo"]);
        } else {
          saveFeatures.mesure?.removeEventListener("sphereClicked", callback);
          let callback = (e) => {
            // console.log(e, "ee");
            // spclick(e, potreeViewer, result.transform);

            measureDrags(potreeViewer, saveFeatures.mesure, true);
          };
          saveFeatures.mesure?.addEventListener(
            "sphereClicked",
            callback,
            false
          );

          break;
        }
        break; // 첫 번째 교차 객체 처리 후 종료
      }
    }
  };

  const shpEditHandler = async (potreeViewer, shpProperties, isEditMode) => {
    usePotreeStore.getState().setSaveMode(isEditMode);
    event?.stopPropagation();
    console.log("shpProperties", shpProperties);
    try {
      // setSaveMode(isEditMode);
      let result;
      // 객체에 UUID가 이미 할당되어 있는 경우, 즉 이미 생성된 객체를 편집하는 경우
      if (createdAreas.current.includes(shpProperties.properties.JIBUN)) {
        // 편집 모드에 대한 처리.
        // 예: 시각적 특성 활성화, 편집 UI 표시, 등등

        zoomToMeasurement(
          [],
          "shpproperties",
          potreeViewer.scene,
          potreeViewer.scene.getActiveCamera().position,
          shpProperties.properties.JIBUN
        );
        activateVisualProperties(potreeViewer, shpProperties.id, isEditMode);
        // setIsShpMode(isEditMode);
        // 편집 모드 상태를 true로 설정
      } else {
        const { changeShapeZ } = usePotreeStore.getState();

        // UUID가 없는 경우, 새로운 객체를 생성하는 경우
        result = await PotreeServiceUseCases.editShpLines({
          potreeViewer,
          area,
          shp: true,
          shpProperties,
          changeShapeZ,
        });
        console.log("result", result);
        // 결과에서 반환된 UUID를 shpProperties에 할당
        shpProperties.id = result.measure.uuid;

        result.measure.position.z = changeShapeZ;
        createdAreas.current.push(shpProperties.properties.JIBUN);

        // console.log(callback, "clickspires");
        // 필요한 추가 처리를 수행
        // setIsShpMode((prev) => (prev = true)); // 편집 모드 상태를 true로 설정
        usePotreeStore.getState().setSaveFeatures(result);
        usePotreeStore.getState().setCurrentEditingProperty(shpProperties);
        usePotreeStore.getState().setSaveMode(true); // 편집 모드 상태를 true로 설정

        let callback = (e) => {
          // console.log(e, "ee");
          spclick(e, potreeViewer, result.transform);
        };
        result.measure?.addEventListener("sphereClicked", callback, false);

        // handleProppertires(event, "mousedown", potreeViewer);

        // drags(potreeViewer, result.measure, "createmesure"); // drags 기능은 모든 측정에 적용

        switchingColor(selectColor);

        return;
      }
      // spclick(result?.measure, potreeViewer);
    } catch (error) {
      console.error("Error in shpEditHandler:", error);
    }
  };

  const spclick = async (saveFeatures, potreeViewer, transform) => {
    const { saveFeatures: newFeatures, changeShapeZ } =
      usePotreeStore.getState();
    try {
      if (saveFeatures == null) return;

      const { target, position } = saveFeatures;

      let clickedPosition = position;
      position.z = 0;
      target.position.z = changeShapeZ;

      const tolerance = 5;
      let matchedFeatures;

      // 자기 자신의 구역과 중복된 지번을 제외하고 features를 필터링
      matchedFeatures = newFeatures.features.filter((feature) => {
        if (
          target.userData.jibun !== feature.properties.JIBUN &&
          !createdAreas.current.includes(feature.properties.JIBUN)
        ) {
          return feature.geometry.coordinates[0].some(([x, y]) => {
            const [transformedX, transformedY] = transform.forward([x, y]);
            return (
              Math.abs(transformedX - clickedPosition.x) <= tolerance &&
              Math.abs(transformedY - clickedPosition.y) <= tolerance
            );
          });
        }
      });

      matchedFeatures.forEach((feature) => {
        const measure = new Potree.Measure("editMeasure", feature);

        // 여기서는 측정 기능의 자기 자신 포함 여부를 더 이상 고려하지 않음
        measure.type = "editMeasure";
        measure.showDistances = false;
        measure.showArea = true;
        measure.closed = true;
        measure.renderOrder = 100;
        measure.name = `${feature.properties.JIBUN} 좌표정보`;
        measure.isEditArea = true;

        // 다각형의 경계 좌표를 정의하는 코드
        const shape = new THREE.Shape();
        const initPost = [];
        const uniqueCoordinates = new Set();
        feature.geometry.coordinates[0].forEach(([x, y]) => {
          uniqueCoordinates.add(`${x},${y}`);
        });

        const { changeShapeZ } = usePotreeStore.getState();
        Array.from(uniqueCoordinates).forEach((coord, index) => {
          const [x, y] = coord.split(",").map(Number);
          const [transformedX, transformedY] = transform.forward([x, y]);
          if (index === 0) {
            shape.moveTo(transformedX, transformedY);
          } else {
            shape.lineTo(transformedX, transformedY);
          }
          const pos = new THREE.Vector3(
            parseFloat(transformedX),
            parseFloat(transformedY)
          );
          initPost.push(pos);
          measure.addMarker(pos);
        });

        // 측정 도형의 mesh 생성
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: 0xffff00,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5,
          // depthTest: false, // 깊이 테스트 비활성화
          // depthWrite: false, // 깊이 쓰기 비활성화
        });
        measure.areaLabel.fontsize = 28;
        measure.edgeLabels.forEach((label) => (label.fontsize = 15));
        measure.userData = {
          jibun: feature.properties.JIBUN,
          properties: {
            REGIAREA: feature.properties.REGIAREA,
          },
        };
        measure.renderOrder = 0;
        measure.closed = true;
        measure.position.z = changeShapeZ;
        measure.initialPoints = JSON.parse(JSON.stringify(initPost));

        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = {
          jibun: feature.properties.JIBUN,
          prentId: measure.uuid,
        };
        mesh.type = "editMeasure";
        mesh.position.z = changeShapeZ;
        mesh.closed = true;

        createdAreas.current.push(feature.properties.JIBUN);

        potreeViewer.scene.scene.add(mesh);
        potreeViewer.scene.addMeasurement(measure);

        // drags(potreeViewer, measure);
        // drags(potreeViewer, measure, "click measure creating area"); // drags 기능은 모든 측정에 적용

        measureDrags(potreeViewer, measure, true);
        switchingColor(selectColor);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 시각적 특성을 활성화/비활성화하는 함수
  function activateVisualProperties(potreeViewer, measurementId, activate) {
    const filteredMeasurements = potreeViewer.scene.measurements.filter(
      (measurement) => measurement.userData.jibun
    );

    if (filteredMeasurements) {
      filteredMeasurements.forEach((element) => {
        element._showArea = true;
        element._showAngles = false;
        element._showDistances = false;
        element._closed = true;
        element._showEdges = true;
        element._showCircle = false;
        element._showAzimuth = activate;
        element._showCoordinates = false;
        element._showHeight = false;
        element.spheres.forEach((sphere) => {
          sphere.visible = activate;
        });

        if (activate) {
          // 수정 모드일 때의 색상 설정
          element.color = { r: 1, g: 0, b: 0, isColor: true };
        } else {
          // 저장 완료 후의 색상 설정
          element.color = { r: 0, g: 1, b: 1, isColor: true };
        }
      });
    }
  }

  // 전체삭제
  const allPropertiresDelect = (potreeViewer) => {
    let tree = $("#jstree_scene");
    let annotationsRoot = $("#jstree_scene").jstree().get_json("annotations");
    tree.jstree("delete_node", annotationsRoot.children);

    for (let annotations of annotationsRoot.children) {
      potreeViewer.annotationTool.viewer.visibleAnnotations = [];

      annotations.data.domElement.remove();
    }

    potreeViewer.scene.removeAllMeasurements();

    let areaMeah = potreeViewer.scene.scene.children
      .filter((child) => child.userData.prentId)
      .map((el) => el);

    areaMeah.forEach((el) => {
      potreeViewer.scene.scene.remove(el);
    });

    setMeasurements([]);
    setAnnotationTool([]);
    usePotreeStore.getState().shpProperTires(undefined);
    usePotreeStore.getState().setSaveMode(false);
    createdAreas.current = [];
  };

  const moveAllshapez = (value, direction) => {
    if (direction === "left") {
      setAllShapeZ(value - 0.01); // 예시로 1씩 감소
    } else if (direction === "right") {
      setAllShapeZ(value + 0.01); // 예시로 1씩 증가
    }
  };

  const clickSyncToview = (targetViewer) => {
    document.querySelector("#te7")?.classList.remove("active");
    usePotreeStore.getState().setIsControlPressed(true);
    usePotreeStore
      .getState()
      .setSyncViewer(potreeViewer.scene.view, targetViewer);

    console.log(isControlPressed, "IsControlPressed");
  };

  /**
   * @discription 화면 분할시 카메라 싱크 적용 함수 view1 <-> view2
   * */
  const toggleControlState = useCallback(() => {
    const { isControlPressed } = usePotreeStore.getState();

    if (!isControlPressed) {
      setIsControlPressed(true); // 상태를 반전
      // document.querySelector("#te7")?.classList.add("active");
    } else {
      setIsControlPressed(false); // 상태를 반전
      // document.querySelector("#te7")?.classList.remove("active");
    }
  }, []);

  // useEffect(() => {
  //   if (newFeature == 2) {
  //     const handleMouseMove = (e) => {
  //       if (!isControlPressed) return;
  //       e.preventDefault();
  //       // 여기에 원하는 로직을 추가
  //       usePotreeStore.getState().setSyncViewer(potreeViewer.scene.view, 2);
  //     };

  //     // const handleKeyDown = (e) => {
  //     //   if (e.key === "Control") {
  //     //     setIsControlPressed(true);
  //     //   }
  //     // };

  //     // const handleKeyUp = (e) => {
  //     //   if (e.key === "Control") {
  //     //     setIsControlPressed(false);
  //     //   }
  //     // };

  //     const handleClick = (e) => {
  //       e.preventDefault();
  //       usePotreeStore.getState().setClickThisViewer(2);
  //       usePotreeStore.getState().topOnView(potreeViewer, 1);

  //       if (document.querySelector(".jstree.jstree-2")) {
  //         document.querySelector(".jstree.jstree-2").style.display = "none";
  //         document.querySelector(".jstree.jstree-1").style.display = "block";
  //       }
  //       document.querySelector(".layer-titles").innerHTML = "레이어1";
  //       document.querySelector(".points-area.view1").style.display = "none";
  //       if (document.querySelector(".points-area.view2")) {
  //         document.querySelector(".points-area.view2").style.display = "block";
  //       }
  //     };

  //     const domElement = potreeViewer.renderer.domElement;

  //     domElement.addEventListener("click", handleClick);
  //     domElement.addEventListener("mousemove", handleMouseMove);
  //     // domElement.addEventListener("keydown", handleKeyDown);
  //     // domElement.addEventListener("keyup", handleKeyUp);

  //     return () => {
  //       domElement.removeEventListener("mousemove", handleMouseMove);
  //       domElement.removeEventListener("click", handleClick);
  //       // domElement.removeEventListener("keydown", handleKeyDown);
  //       // domElement.removeEventListener("keyup", handleKeyUp);
  //     };
  //   }
  // }, [potreeViewer, isControlPressed]);

  useEffect(() => {
    if (!saveFeatures) return;
    console.log(saveMode, "saveMode");
    const filterEditMeasure = potreeViewer.scene.measurements.filter(
      (el) => el.type === "editMeasure"
    );

    for (const setDragSetingMeasure of filterEditMeasure) {
      measureDrags(potreeViewer, setDragSetingMeasure, saveMode);
    }
  }, [saveFeatures, createdAreas.current, saveMode]);

  useEffect(() => {
    let in360 = panoramaTarget?.focusimages;
    if (newFeature === 2 && in360) {
      let target = new THREE.Vector3(
        panoramaTarget?.sphere.position.x,
        panoramaTarget?.sphere.position.y,
        panoramaTarget?.sphere.position.z
      );

      let dir = target
        .clone()
        .sub(potreeViewer.scene.view.position)
        .normalize();
      let move = dir.multiplyScalar(0.000001);
      let newCamPos = target.clone().sub(move);

      potreeViewer.scene.view.setView(newCamPos, target, 500);
      return;
    } else if (!panoramaTarget?.image360) {
      let newPosition = potreeViewer.scene.view.position.clone();

      newPosition.z = 100;
      // 이전 뷰의 포지션으로부터 z값을 100으로 설정

      let target = potreeViewer.scene.view.getPivot();

      potreeViewer.scene.view.setView(newPosition, target);

      if (newPosition.z >= 100) {
        setAreaHoverOn(false);
      }
      return;
    }
  }, [panoramaTarget]);

  if (!data && !sideBarRef?.current) return null;

  return (
    <>
      <StyledPotreeNavBar className="acitveee">
        <div
          className={`lnb ${newFeature == 2 ? "active" : ""}`}
          style={
            searchParams.size > 2 ? { display: "none" } : { display: "block" }
          }
        >
          {/* 홈 눌렀을 때 */}
          {/*
                {
                    activedMainHeader
                    && (
                        <div className="subNav-container">
                            {activedMainHeader.subMenus.map((subMenu, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={activedSubMenuHeader.find(obj => obj === subMenu.id) ? 'active' : ''}
                                        onClick={() => {
                                            setActivedSubMenuHeader(prev => {
                                                let dubCheck = prev.find(obj => obj === subMenu.id)
                                                if (dubCheck) {
                                                    return prev.filter(obj => obj !== subMenu.id)
                                                }
                                                return [...prev, subMenu.id]
                                            })
                                        }}

                                    >
                                        {subMenu.name}
                                    </div>
                                )
                            })}
                        </div>
                    )
                }
                */}
          <div
            className={`lnbContainer ${newFeature == 2 ? "active" : ""}`}
            style={{ alignItems: "center" }}
            ref={containerRef}
          >
            {activedMainHeader
              ? activedMainHeader.subMenus.map((subMenu, index) => {
                  if (subMenu.hidden) return null;

                  const Icon = subMenu.icon;
                  return (
                    <div
                      className="lnbMenuWrap"
                      key={index}
                      ref={(el) => (firstMenuWrapRef.current[index] = el)}
                    >
                      <div
                        key={index}
                        style={{ display: subMenu.name ? "flex" : "none" }}
                        className={`lnbButton ${
                          activedSubMenuHeader.find(
                            (obj) =>
                              obj === subMenu.id &&
                              obj !== "exit" &&
                              obj !== "save" &&
                              obj !== "te5" &&
                              obj !== "te6" &&
                              obj !== "te8" &&
                              obj !== "te9" &&
                              obj !== "te10" &&
                              obj !== "export" &&
                              obj !== "history"
                          )
                            ? "active"
                            : ""
                        } ${notArrowLists(subMenu.id)}`}
                        onClick={() => {
                          if (!subMenu.available) {
                            // toast.error("이용불가능한 기능입니다.");
                            setOpensError(true);
                            return;
                          }
                          /** 저장 모달 창 */
                          if (subMenu.id === "save") {
                            setIsSaveModal(true);
                          }
                          /** 결과 등록 모달 창 */
                          if (subMenu.id === "export") {
                            setIsCreateResultModal(true);
                          }

                          /** 결과 등록 모달 창 */
                          if (subMenu.id === "history") {
                            refetch();
                            setIsJobDetailModal(true);
                          }

                          setActivedSubMenuHeader((prev) => {
                            let dubCheck = prev.find(
                              (obj) => obj === subMenu.id
                            );
                            if (subMenu.callBack) {
                              if (subMenu.id === "exit") {
                                subMenu.callBack(
                                  potreeViewer,
                                  isWorldSave,
                                  setOpen,
                                  landInfoIdParams
                                );
                              } else if (subMenu.id === "save") {
                                subMenu.callBack(
                                  savedBoardId || boardId,
                                  potreeViewer,
                                  jobDetailDatas,
                                  refetch,
                                  setIsWorldSave
                                );
                              } else if (subMenu.id === "te3") {
                                subMenu.callBack(subMenu.id);
                              } else if (subMenu.id === "te6") {
                                subMenu.callBack(
                                  clickThisViewers,
                                  potreeViewer
                                );
                              } else if (subMenu.id === "te7") {
                                subMenu.callBack(
                                  subMenu.id,
                                  toggleControlState
                                );
                              } else if (subMenu.id === "te8") {
                                subMenu.callBack(clickSyncToview, clickViewer);
                              } else if (subMenu.id === "te9") {
                                subMenu.callBack();
                              } else if (subMenu.id === "te10") {
                                subMenu.callBack();
                              } else subMenu.callBack(subMenu.id);
                            }
                            if (dubCheck) {
                              return prev.filter((obj) => obj !== subMenu.id);
                            }
                            return [...prev, subMenu.id];
                          });
                        }}
                        id={subMenu.id}
                      >
                        {/*subMenu.name의 아이콘*/}
                        {subMenu.id == "te7" ? (
                          <>
                            <span className="lnbIcon">
                              <img
                                src={
                                  isControlPressed
                                    ? menuImage.iconScreenUnLock
                                    : menuImage.iconScreenLock
                                }
                                alt={subMenu.name}
                              />
                            </span>
                            <p className="lnbName">
                              {isControlPressed ? "화면해제" : "화면잠금"}
                            </p>
                          </>
                        ) : (
                          <>
                            <>
                              {typeof Icon === "string" ? (
                                <span className="lnbIcon">
                                  <img src={subMenu.icon} alt={subMenu.name} />
                                </span>
                              ) : (
                                <Icon
                                  className="lnbIcon"
                                  sx={{ fontSize: 22 }}
                                />
                              )}
                              <p className="lnbName">{subMenu.name}</p>
                            </>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              : null}
            <BasicSearching viewer={potreeViewer} />
          </div>
          <div className="insightTabContainer">
            <div
              style={{
                left: "300px",
                display: activedSubMenuHeader.find((obj) => obj === "settings")
                  ? "block"
                  : "none",
              }}
              className="floatingContainer apperance-container"
              id="setting_window"
            >
              <div className="floatingHeader apperanceHeader">
                <p>설정</p>
                <button onClick={handleFloatingClose("settings")}>
                  <img src={commonImage.commonClose} alt="레이어 닫기버튼" />
                </button>
              </div>
              <h3 id="menu_appearance" style={{ display: "none" }}>
                <span data-i18n="tb.rendering_opt"></span>
              </h3>
              <div className="settings-wraps">
                <ul className="pv-menu-list">
                  {/* Point budget */}
                  <li className="floatingChildren">
                    <p className="apperanceText">
                      포인트 개수
                      <span
                        data-i18n="appearance.nb_max_pts"
                        hidden
                      ></span>: <span id="lblPointBudget"></span>
                    </p>
                    <div id="sldPointBudget" className="sldPointBudget"></div>
                  </li>
                  {/* Field of view */}
                  <li className="floatingChildren" hidden>
                    <p className="apperanceText">
                      <span data-i18n="appearance.field_view"></span>:{" "}
                      <span id="lblFOV"></span>
                    </p>
                    <div id="sldFOV"></div>
                  </li>
                  {/* Eye-Dome-Lighting */}
                  <li className="floatingChildren" hidden>
                    <p className="apperanceText">Eye-Dome-Lighting</p>

                    <label className="customCheckbox">
                      <input type="checkbox" id="chkEDLEnabled" />
                      <span className="check"></span>
                      <span
                        data-i18n="appearance.edl_enable"
                        className="text"
                      ></span>
                    </label>
                  </li>

                  <li className="floatingChildren">
                    <p className="apperanceText">품질</p>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {/* eslint-disable */}
                      <selectgroup
                        id="splat_quality_options"
                        className="commonGroup settingQuality"
                      >
                        <option
                          id="splat_quality_options_standard"
                          value="standard"
                        >
                          기본
                        </option>
                        <option id="splat_quality_options_hq" value="hq">
                          고품질
                        </option>
                      </selectgroup>
                      {/* eslint-enable */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "auto",
                        }}
                      ></Box>
                    </Box>
                  </li>
                  <li className="floatingChildren">
                    <div
                      className="notDraged"
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <p
                        className="apperanceText"
                        style={{ marginBottom: "0" }}
                      >
                        클리핑 모드
                      </p>
                      <CustomizedSwitches
                        setClipingModeHandeler={(event) => {
                          setClipingModeHandeler(event);
                        }}
                        enabled={clipingMode}
                      />
                    </div>
                  </li>

                  <li className="floatingChildren">
                    <p className="apperanceText">배경 설정</p>
                    {/* // eslint-disable-next-line */}
                    <selectgroup
                      id="background_options"
                      className="commonGroup settingBg"
                    >
                      <option id="background_options_none" value="null">
                        기본
                      </option>
                      <option id="background_options_black" value="black">
                        검정
                      </option>
                      <option id="background_options_white" value="white">
                        하양
                      </option>
                      {/* <option id="background_options_skybox" value="skybox">
                        기본
                      </option> */}
                      <option id="background_options_gradient" value="gradient">
                        혼합
                      </option>
                    </selectgroup>
                  </li>
                  <li className="floatingChildren">
                    <div
                      className="notDraged"
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <p
                        className="apperanceText"
                        style={{ marginBottom: "0" }}
                      >
                        점군
                        <span id="lblEDLStrength" hidden></span>
                        <span data-i18n="appearance.edl_strength" hidden></span>
                      </p>
                      <div
                        id="sldEDLStrength"
                        className="settingVolume"
                        hidden
                      ></div>
                      <CustomizedSwitches
                        setClipingModeHandeler={(event) => {
                          setDotLineModeHandeler(event);
                        }}
                        enabled={dotLineMode}
                      />
                    </div>
                  </li>

                  <li className="floatingChildren" hidden={!dotLineMode}>
                    <>
                      <p className="apperanceText">
                        점군 라인 : <span id="lblEDLRadius"></span>
                        <span data-i18n="appearance.edl_radius" hidden></span>
                      </p>
                      <div id="sldEDLRadius" className="settingVolume"></div>
                    </>
                  </li>

                  <li className="floatingChildren">
                    <p className="apperanceText">
                      최소 노드 크기 : <span id="lblMinNodeSize"></span>
                      <span data-i18n="appearance.lblMinNodeSize" hidden></span>
                    </p>
                    <div id="sldMinNodeSize" className="settingVolume"></div>
                  </li>
                  <li className="floatingChildren" hidden>
                    <p className="apperanceText">
                      투명도 <span id="lblOpacity"></span>
                      <span data-i18n="appearance.edl_opacity" hidden></span>
                    </p>
                    <div id="sldEDLOpacity" className="settingVolume"></div>
                  </li>
                  <li className="floatingChildren">
                    <div className="apperanceText">
                      SHP 전체 높이 :{/* {allShapeZ.toFixed(2)} */}
                      <div
                        className="notDraged"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginTop: "3px",
                        }}
                      >
                        <input
                          type="text"
                          value={inputValue}
                          onChange={handleInputChange}
                        />
                        <div style={{ display: "flex" }}>
                          <img
                            className="shpMoveArrows"
                            src={menuImage.iconDownArrow}
                            alt="저장리스트 화살표 아이콘"
                            onMouseDown={() => handleMouseDown("left")}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            style={{
                              transform: "rotate(90deg)",
                              marginRight: "3px",
                              cursor: "pointer",
                            }}
                          />
                          <Slider
                            size="small"
                            value={allShapeZ}
                            max={60}
                            min={-100}
                            step={0.01}
                            onChange={handleAllShapeZChange}
                            valueLabelDisplay="auto"
                            className="allShapeZslider"
                          />
                          <img
                            className="shpMoveArrows"
                            src={menuImage.iconDownArrow}
                            alt="저장리스트 화살표 아이콘"
                            onMouseDown={() => handleMouseDown("right")}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            style={{
                              transform: "rotate(-90deg)",
                              marginLeft: "3px",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="floatingChildren">
                    <div className="apperanceText">
                      SHP 라인 크기 : {allShapeSize}
                      <div className="notDraged">
                        <Slider
                          size="small"
                          value={allShapeSize}
                          onChange={handleAllShapeSize}
                          // valueLabelDisplay="on"
                        />
                      </div>
                    </div>
                  </li>
                  <li className="floatingChildren">
                    <div className="apperanceText">
                      SHP 라인 색상 설정
                      <div className="notDraged" style={{ marginTop: "10px" }}>
                        <CustomSelect
                          setSelectColor={setAllShapeColor}
                          selectColor={allShapeColor}
                        />
                      </div>
                    </div>
                  </li>
                  <li className="floatingChildren">
                    <div className="apperanceText">
                      SHP 지목 색상 설정
                      <div className="notDraged" style={{ marginTop: "10px" }}>
                        <CustomSelect
                          setSelectColor={setAllShapeTextColor}
                          selectColor={allShapeTextColor}
                        />
                      </div>
                    </div>
                  </li>
                  <li className="floatingChildren">
                    <div className="apperanceText">
                      면적정보 색상 변경
                      <div className="notDraged" style={{ marginTop: "10px" }}>
                        <CustomSelect
                          setSelectColor={setSelectColor}
                          selectColor={selectColor}
                          type={"면적정보"}
                        />
                      </div>
                    </div>
                  </li>
                  <li className="floatingChildren" hidden>
                    <p className="apperanceText">
                      <span data-i18n="appearance.min_node_size"></span>:{" "}
                      <span id="lblMinNodeSize"></span>
                    </p>
                    <div id="sldMinNodeSize"></div>
                  </li>
                  <li className="floatingChildren" hidden>
                    <label className="customCheckbox">
                      <input id="show_bounding_box" type="checkbox" />
                      <span className="check"></span>
                      <span data-i18n="appearance.box" className="text"></span>
                    </label>
                  </li>
                  <li className="floatingChildren" hidden>
                    <label className="customCheckbox">
                      <input id="set_freeze" type="checkbox" />
                      <span className="check"></span>
                      <span
                        data-i18n="appearance.freeze"
                        className="text"
                      ></span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>

            {/* <!-- SCENE --> */}
            <div
              style={{
                top: "10%",
                display: activedSubMenuHeader.find((obj) => obj === "layer")
                  ? "block"
                  : "none",
              }}
              className="floatingContainer scene-container"
              id="layer_window"
            >
              <div className="floatingHeader sceneHeader">
                <p>레이어</p>
                <div style={{ display: "flex", gap: "5px" }}>
                  <button onClick={handleFloatingClose("layer")}>
                    <img src={commonImage.commonClose} alt="레이어 닫기버튼" />
                  </button>
                </div>
              </div>
              {/* 포트리 scene영역 */}
              <h3 id="menu_scene" style={{ display: "none" }}>
                <span data-i18n="tb.scene_opt"></span>
              </h3>
              <div className="pv-menu-list">
                <div id="scene_export" style={{ display: "none" }}></div>

                <div className="divider">
                  <span className="layer-titles">
                    {newFeature === 2 ? "레이어1" : "레이어"}
                  </span>
                </div>

                <div id="scene_objects"></div>

                <div className="divider" style={{ display: "none" }}>
                  <span>Properties</span>
                </div>

                <div id="scene_object_properties" ref={sceneRef}></div>
              </div>
              {/*  */}
            </div>

            {/* 미니맵은 라이브러리 안에서 있음 */}

            {/* 속성 정보 */}
            {/*TODO:left 값 태그 위치 바꾸면 수정 필요 23.09.10 진아름*/}
            <div
              style={{
                right: "10px",
                display: activedSubMenuHeader.find((obj) => obj === "propInfo")
                  ? "block"
                  : "none",
              }}
              className="floatingContainer property-container propInfo-container"
              id="prop_info_window"
            >
              <div className="floatingHeader apperanceHeader">
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 500,
                  }}
                >
                  속성정보
                </p>

                <button
                  onClick={() => allPropertiresDelect(potreeViewer)}
                  style={{
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    marginLeft: "auto",
                    marginRight: "4px",
                    background: "#98A2B3",
                    width: "64px",
                    height: "30px",
                    borderRadius: "2px",
                    fontWeight: 600,
                    border: "1px solid #98A2B3",
                  }}
                  type="button"
                >
                  전체삭제
                </button>
                {properTires && (
                  <>
                    {!saveMode ? (
                      <button
                        onClick={() => {
                          shpEditHandler(
                            potreeViewer,
                            properTires,
                            true,
                            saveFeatures,
                            allShapeZ
                          );
                        }}
                        style={{
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          marginRight: "4px",
                          background: "#00A991",
                          width: "44px",
                          height: "30px",
                          borderRadius: "2px",
                          border: "1px solid #00A991",
                        }}
                        type="button"
                      >
                        편집
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={sceneDelect("", "properTires", properTires)}
                          style={{
                            color: "#727A86",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            marginRight: "4px",
                            background: "#FFFFFF",
                            width: "44px",
                            height: "30px",
                            borderRadius: "2px",
                            border: "1px solid #98A2B3",
                          }}
                          type="button"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => {
                            shpEditHandler(
                              potreeViewer,
                              properTires,
                              false,
                              saveFeatures,
                              allShapeZ
                            );
                          }}
                          style={{
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            marginRight: "4px",
                            background: "#00A991",
                            width: "44px",
                            height: "30px",
                            borderRadius: "2px",
                            border: "1px solid #00A991",
                          }}
                          type="button"
                        >
                          저장
                        </button>
                      </>
                    )}
                  </>
                )}

                <button onClick={handleFloatingClose("propInfo")}>
                  <img
                    src={commonImage.jsTreeClose}
                    alt="레이어 닫기버튼"
                    style={{ height: "30px" }}
                  />
                </button>
              </div>

              <div className="body main">
                {properTires ? (
                  <>
                    <div
                      style={{ paddingBottom: "0px" }}
                      className={`distanceList ${
                        clickedShpId === properTires.properties.JIBUN
                          ? "first"
                          : ""
                      }`}
                      onClick={isClickHandler(
                        "",
                        [],
                        properTires.properties.JIBUN,
                        "shpproperties"
                      )}
                    >
                      <div className="header">
                        <div className="header-innder-box">
                          <span className="icon">
                            <img
                              src={`${
                                clickedShpId === properTires.properties.JIBUN
                                  ? menuImage.iconPropertiresActive
                                  : menuImage.iconPropertires
                              }`}
                              alt="distance"
                              style={{ marginRight: "4px" }}
                            />
                          </span>
                          <span>{properTires.properties.JIBUN}</span>
                        </div>

                        <button
                          onClick={sceneDelect("", "properTires", properTires)}
                        >
                          <img
                            src={
                              clickedShpId !== properTires.properties.JIBUN
                                ? commonImage.commonClose
                                : commonImage.commonCloseActive
                            }
                            alt="레이어 닫기버튼"
                          />
                        </button>
                      </div>
                      <div className="body">
                        <div className="addr">
                          소유자 : <span>{properTires.properties.OWNER}</span>
                        </div>
                        <div className="addr">
                          지번 : <span>{properTires.properties.JIBUN}</span>
                        </div>
                        <div className="addr">
                          지목 :{" "}
                          <span>{`${SHP_JIMOKLIST.filter(
                            (data) => data.no === properTires.properties.JIMOK
                          ).map((data) => data.buho)}`}</span>
                        </div>
                        <div className="addr">
                          대장면적 :{" "}
                          <span>{properTires.properties.REGIAREA}</span>
                        </div>
                        <div className="addr">
                          좌표면적 :{" "}
                          <span>
                            {properTires.properties.editAreaData ||
                              properTires.properties.DRAWAREA}
                          </span>
                        </div>
                        <div className="addr">
                          오차 :{" "}
                          <span>
                            {parseInt(properTires.properties.REGIAREA) <
                            parseInt(properTires.properties.editAreaData)
                              ? "+"
                              : "-"}
                            {Math.abs(
                              properTires.properties.editAreaMistake
                            ).toFixed(1) || properTires.properties.TOLERANCE}
                          </span>
                        </div>
                        <div className="addr">
                          공차 : <span>{properTires.properties.ERRRANGE}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <StyleedPropertiesEmtyWrap>
                    <p>선택된 지적정보가 없습니다.</p>
                    <p>구역을 선택하여 정보를 불러와주세요.</p>
                  </StyleedPropertiesEmtyWrap>
                )}

                {/* measurementsTool */}
                {measurementsTool
                  ?.sort((a, b) => {
                    const isAMatch = clickedShpId === a.userData.jibun;
                    const isBMatch = clickedShpId === b.userData.jibun;
                    if (isAMatch && !isBMatch) {
                      return -1; // A가 조건에 맞고 B가 조건에 맞지 않으면 A를 앞으로
                    } else if (!isAMatch && isBMatch) {
                      return 1; // B가 조건에 맞고 A가 조건에 맞지 않으면 B를 앞으로
                    }
                  })
                  .map((measurement, index) => {
                    const points = measurement?.points;
                    const measurementId = measurement?.uuid;
                    const isEditArea = measurement.isEditArea;
                    const initialPoints = measurement.initialPoints;

                    return (
                      <div
                        className={`distanceList ${
                          (!isEditArea &&
                            clickedMeasurementId === measurementId) ||
                          (isEditArea &&
                            clickedMeasurementId === measurementId) ||
                          clickedShpId === measurement.userData.jibun
                            ? "first"
                            : ""
                        }`}
                        key={measurement.uuid}
                        onClick={isClickHandler(measurementId, points)}
                        id={measurement.uuid}
                      >
                        <div
                          className="header"
                          style={{ position: "relative" }}
                        >
                          <div className="header-innder-box">
                            <span className="icon">
                              {!isEditArea ? (
                                <img
                                  src={menuImage.iconDistanceV2}
                                  alt="distance"
                                />
                              ) : (
                                <img
                                  src={
                                    clickedMeasurementId === measurementId ||
                                    clickedShpId === measurement.userData.jibun
                                      ? menuImage.iconPropertiresActive
                                      : menuImage.iconPropertires
                                  }
                                  alt="distance"
                                />
                              )}
                            </span>
                            <span>{measurement.name}</span>
                          </div>
                          <>
                            <button
                              style={{
                                marginLeft: "auto",
                                paddingRight: "8px",
                                cursor: "pointer",
                              }}
                              onClick={() => handleFileDownButton()}
                            >
                              <img
                                src={
                                  clickedMeasurementId === measurementId ||
                                  clickedShpId === measurement.userData.jibun
                                    ? menuImage.iconMenusActive
                                    : menuImage.iconMenus
                                }
                                alt="속성 파일 다운 버튼"
                              />
                            </button>
                            {clickedMeasurementId === measurementId &&
                              menuOpens && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "40px",
                                    zIndex: 999,
                                    right: "7px",
                                    background: "#fff",
                                    textAlign: "left",
                                    padding: "0px 10px",
                                  }}
                                  className="menulist-ul"
                                >
                                  <ul>
                                    <li
                                      onClick={() =>
                                        handleExcelDownload(
                                          initialPoints,
                                          points
                                        )
                                      }
                                    >
                                      엑셀 다운로드
                                    </li>
                                    <li
                                      onClick={() =>
                                        handleDxfDownload(
                                          potreeViewer,
                                          measurementId
                                        )
                                      }
                                    >
                                      DXF파일 다운로드
                                    </li>
                                  </ul>
                                </div>
                              )}

                            <button
                              onClick={sceneDelect(
                                index,
                                "measurements",
                                measurement.uuid
                              )}
                            >
                              <img
                                src={
                                  clickedMeasurementId === measurementId ||
                                  clickedShpId === measurement.userData.jibun
                                    ? commonImage.commonCloseActive
                                    : commonImage.commonClose
                                }
                                alt="레이어 닫기버튼"
                              />
                            </button>
                          </>
                        </div>
                        <div className="body">
                          {isEditArea ? (
                            <>
                              <div>
                                <div
                                  className="addr border-none"
                                  style={{
                                    textAlign: "center",
                                    fontSize: "14px",
                                    lineHeight: "16px",
                                    color: "#7A828F",
                                    fontFamily: "Pretendard",
                                    position: "relative",
                                  }}
                                >
                                  <div className="line"></div>
                                  <span className="point-title">기준좌표</span>
                                </div>
                                <div className="table-wrap">
                                  <table>
                                    <thead>
                                      <tr>
                                        <th>x</th>
                                        <th>y</th>
                                        <th>z</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {initialPoints.map((data, index) => {
                                        return (
                                          <tr key={index}>
                                            <td>{data.x.toFixed(3)}</td>
                                            <td>{data.y.toFixed(3)}</td>
                                            <td>{data.z.toFixed(3)}</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div>
                                <div
                                  className="addr border-none"
                                  style={{
                                    textAlign: "center",
                                    fontSize: "14px",
                                    lineHeight: "16px",
                                    color: "#7A828F",
                                    fontFamily: "Pretendard",
                                    marginTop: "8px",
                                    position: "relative",
                                  }}
                                >
                                  <div className="line"></div>
                                  <span className="point-title">수정좌표</span>
                                </div>
                                <div className="table-wrap">
                                  <table>
                                    <thead>
                                      <tr>
                                        <th>x</th>
                                        <th>y</th>
                                        <th>z</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {points.map((data, index) => {
                                        return (
                                          <tr key={index}>
                                            <td>
                                              {data.position.x.toFixed(3)}
                                            </td>
                                            <td>
                                              {data.position.y.toFixed(3)}
                                            </td>
                                            <td>
                                              {data.position.z.toFixed(3)}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div>
                              <div className="table-wrap">
                                <table>
                                  <thead>
                                    <tr>
                                      <th>x</th>
                                      <th>y</th>
                                      <th>z</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {points.map((data, index) => {
                                      return (
                                        <tr key={index}>
                                          <td>{data.position.x.toFixed(3)}</td>
                                          <td>{data.position.y.toFixed(3)}</td>
                                          <td>{data.position.z.toFixed(3)}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                {/* VolumeTool */}
                <VolumeTool
                  volumeTool={volumeTool}
                  clickedVolumId={clickedVolumId}
                  isClickHandler={isClickHandler}
                  sceneDelect={sceneDelect}
                  districtOptions={DISTRICT_OPTIONS}
                  area={area}
                />

                {/* AnnotationTool */}
                <AnnotationTool
                  annotationTool={annotationTool}
                  clickedAnnotationId={clickedAnnotationId}
                  isClickHandler={isClickHandler}
                  sceneDelect={sceneDelect}
                  sceneRef={sceneRef}
                />
              </div>
            </div>

            {/* 측정 */}
            {/*TODO:left 값 태그 위치 바꾸면 수정 필요 23.09.11 진아름*/}
            <div
              style={{
                left: subToolBarLeftsettings("te1"),
                display: activedSubMenuHeader.find((obj) => obj === "te1")
                  ? "block"
                  : "none",
              }}
              className="lnbChildren measureTools-container"
            >
              {measureTools.map((measureTool, index) => {
                return (
                  // if(measureTool.name)
                  <button
                    className="lnbChildrenButton measureTool"
                    key={index}
                    onClick={measureTool.callBack}
                    data-i18n={measureTool.datai18n}
                  >
                    {/*measureTool.name의 아이콘 위치: 상단 > initialMeasureTools 배열 추가 23.09.11.진아름 */}
                    <span className="childrenIcon">
                      <img src={measureTool.icon} alt="" />
                    </span>

                    <p>{measureTool.name}</p>
                  </button>
                );
              })}
            </div>
            <div
              style={{
                left: subToolBarLeftsettings("te3"),
                display: activedSubMenuHeader.find((obj) => obj === "te3")
                  ? "block"
                  : "none",
              }}
              className="lnbChildren borderlandContainer"
            >
              <button
                type="button"
                className="lnbChildrenButton"
                onClick={() => handleButtonClick(1)}
              >
                <span className="childrenIcon">
                  <img src={menuImage.iconAngle} alt="기본" />
                </span>
                <p>기본</p>
              </button>
              <button
                type="button"
                className="lnbChildrenButton"
                onClick={() =>
                  handleButtonClick(
                    2,
                    savedBoardId,
                    potreeViewer,
                    jobDetailDatas,
                    refetch,
                    setIsWorldSave,
                    allShapeZ
                  )
                }
              >
                <span className="childrenIcon">
                  <img src={menuImage.iconAreaClipping} alt="2분할레이아웃" />
                </span>
                <p>2분할 레이아웃</p>
              </button>
              {/* <button
                type="button"
                className="lnbChildrenButton"
                onClick={() => handleButtonClick(4)}
              >
                <span className="childrenIcon">
                  <img src={menuImage.iconFullClipping} alt="4분할레이아웃" />
                </span>
                <p>4분할 레이아웃</p>
              </button> */}
              {/* <button
                type="button"
                className="lnbChildrenButton"
                onClick={() => handleButtonClick(1)}
              >
                <span className="childrenIcon">
                  <img src={menuImage.iconMenuDelete} alt="전체속성초기화" />
                </span>
                <p>전체 속성 초기화</p>
              </button> */}
            </div>
            {/* 화면 캡처 - 무조건 브라우조의 정중앙에 위치 23.09.11 진아름*/}
            {/* <div
              style={{
                left: "23.3%",
                display: activedSubMenuHeader.find((obj) => obj === "te3")
                  ? "block"
                  : "none",
              }}
              className="lnbChildren borderlandContainer"
            >
              <div className="header">화면 캡처</div>
              <div className="body"> */}
            {/*캡쳐화면 이미지 자리*/}
            {/* <div className="img">
                  <img src="" alt="캡처 이미지"></img>
                </div>
              </div>
              <div className="footer">
                <button className="cancel">취소</button>
                <button className="save">저장</button>
              </div>
            </div> */}

            {/*TODO:업무연계 플로팅창 23.09.10 진아름*/}
            <div>
              {/* 클리핑 */}
              <div
                style={{
                  left: subToolBarLeftsettings("te2"),
                  display: activedSubMenuHeader.find((obj) => obj === "te2")
                    ? "block"
                    : "none",
                }}
                className="lnbChildren clippingTools-container"
              >
                {clippingTools.map((clippingTool, index) => {
                  return (
                    <button
                      className="lnbChildrenButton clippingTool"
                      key={index}
                      onClick={clippingTool.callBack}
                    >
                      {/*clippingTool.name의 아이콘 위치: 상단 > initialMeasureTools 배열 추가 23.09.11.진아름 */}

                      <span className="childrenIcon">
                        <img src={clippingTool.icon} alt="" />
                      </span>
                      <p>{clippingTool.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "fixed",
            height: "36px",
            right: "0px",
            bottom: "0px",
            /* left: 0px; */
            alignItems: "center",
            display: "flex",
            width: "100%",
            backgroundColor: "#f0f1f4",
            justifyContent: "end",
            zIndex: 9999,
          }}
        >
          {/* 좌표계 임시 주석 */}
          <div
            className="points-area view1"
            style={{
              width: "fit-content",
              border: "none",
              marginRight: "10px",
            }}
          >
            <div className="points-area-inner">
              <div>
                <p className="points-sub-title">좌표</p>
              </div>
              <div className="points-area-x-y">
                <p>{lngLat.lng.toFixed(3)}, </p>
                <p>{lngLat.lat.toFixed(3)}</p>
              </div>
              {/* <p>좌표계:{coordinateReferenceSystem}</p> */}
            </div>
          </div>
          <div
            className="points-area"
            style={{
              // position: "absolute",
              width: "fit-content",
              // right: 149,
              border: "none",
              // zIndex: 10000,
              marginRight: "14px",
            }}
          >
            <div className="points-area-inner">
              <div>
                <p className="points-sub-title">축적</p>
              </div>
              <div className="points-area-x-y">
                <div className="filter" style={{ width: "100%" }}>
                  <BasicSelect
                    className="zoom-select"
                    defaultValue={3000}
                    options={ZOOM_OPTIONS}
                    onChange={(value: any) => {
                      setHandleAllzoomChange(potreeViewer, value);
                    }}
                    label={undefined}
                    width={100}
                    height={20}
                    arrowIconPath={undefined}
                    optionClassName="zoom-options"
                  />
                </div>
              </div>

              {/* <p>좌표계:{coordinateReferenceSystem}</p> */}
            </div>
          </div>
        </div>
        <img id="potree_map_toggle" onClick={toggleMiniMap} />
      </StyledPotreeNavBar>
      {isSaveModal && (
        <SaveModal
          open={isSaveModal}
          setOpen={setIsSaveModal}
          landData={landData}
          saveDatas={[]}
          titles={"저장하기"}
          sideBarRef={sideBarRef}
          viewer={potreeViewer}
          savedBoardId={savedBoardId}
          setSavedBoardId={setSavedBoardId}
          setIsWorldSave={setIsWorldSave}
          jobDetailDatas={jobDetailDatas}
          refetch={refetch}
        />
      )}
      {isCreateResultModal && (
        <CreateResultModal
          open={isCreateResultModal}
          setOpen={setIsCreateResultModal}
          landData={landData}
          saveDatas={[]}
          urlPosition={urlPosition}
          titles={"결과등록"}
        />
      )}

      {isJobDetailModal && (
        <CreateResultModal
          open={isJobDetailModal}
          setOpen={setIsJobDetailModal}
          landData={[]}
          saveDatas={jobDetailDatas?.resultObject}
          urlPosition={urlPosition}
          titles={"작업내역"}
        />
      )}

      {opens && (
        <AlertModal
          open={opens}
          title={"저장되지 않은 내용이 있습니다."}
          setOpen={setOpen}
          type={"save"}
          children={
            <p>
              저장하지 않고 페이지를 벗어날 경우, 지금까지 작업한 내용이
              사라집니다.
            </p>
          }
        />
      )}
      {opensError && (
        <AlertModal
          open={opensError}
          title={"서비스 준비중 입니다."}
          setOpen={setOpensError}
          children={
            <p>
              이용에 불편을 드려 죄송합니다.
              <br />
              보다 나은 서비스 제공을 위하여 페이지 준비중에 있습니다.
            </p>
          }
        />
      )}
    </>
  );
};
