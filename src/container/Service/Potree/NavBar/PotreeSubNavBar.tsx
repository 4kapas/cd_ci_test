//@ts-nocheck
import { PotreeServiceImpl } from "@/application";
import { usePotreeStore } from "@/store/usePotreeStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { StyledPotreeNavBar } from "./style";

import { getLand } from "@/apis/Land/land.api.ts";
import PotreeServiceUseCases from "@/useCases/PotreeServiceUseCases";

const potreeService = PotreeServiceImpl;
interface PotreeNavBarProps {
  config: { area: string; shp: boolean };
  baseConfig: { area: string; shp: boolean };
  viewer: ViewerType;
}

export const PotreeSubNavBar = ({
  config,
  baseConfig,
  viewer,
}: PotreeNavBarProps): JSX.Element | null => {
  const {
    targetViewers,
    isClipingMode,
    saveViewerJsonData,
    setIsControlPressed,
    isControlPressed,
    panoramaTarget,
    setPanoramaTarget,
  } = usePotreeStore();
  const { potreeViewer, cesiumViewer } = viewer;
  const { area, shp } = config;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // 쿼리 스트링 값 가져오기
  const boardId = searchParams.get("boardId");
  const landInfoIdParams = searchParams.get("landInfoId");

  const [landData, setLandData] = useState<any[] | undefined>([]);
  const [panoramaTargetState, setPanoramaTargetState] = useState(null);
  const [lngLat, setLngLat] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });

  const [focusedImage, setFocusedImage] = useState({
    focusimages: undefined,
    sphere: undefined,
  });
  const useRefs = useRef(null);

  const panoramaTargetStateRef = useRef(panoramaTargetState);
  // 화면잠금 상태
  // const [isControlPressed, setIsControlPressed] = useState(false); // 화면잠금 상태

  // potreeViewer1 화면 감시
  // useEffect(() => {
  //   if (targetViewers === 2 && isControlPressed) {
  //     syncToview(potreeView1, potreeViewer.scene.view);
  //   }
  // }, [
  //   potreeView1?.position.x,
  //   potreeView1?.position.y,
  //   potreeView1?.position.z,
  // ]);

  useEffect(() => {
    if (typeof potreeViewer !== "object") return;
    init(searchParams);
    toggleControlState();
  }, [potreeViewer]);

  const createHandleClick = (e) => {
    let mouse = new THREE.Vector2();
    mouse.x = (e?.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e?.clientY / window.innerHeight) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    const camera = potreeViewer.scene.getActiveCamera();
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(
      potreeViewer.scene.scene.children,
      true
    );

    for (let i = 0; i < intersects.length; i++) {
      let intersect = intersects[i];

      if (
        intersect.object.type === "Mesh" &&
        intersect.object.userData == "panorama"
      ) {
        let tree = $("#jstree_scene");
        let focusTarget = $("#jstree_scene").jstree().get_json("images");
        let forcimagesArray = {
          focusimages: focusTarget.children[0].data.focusedImage,
          sphere: focusTarget.children[0].data.sphere,
        };

        setPanoramaTarget(forcimagesArray);
      }
      break;
    }

    // usePotreeStore.getState().setClickThisViewer(1);
    // usePotreeStore.getState().topOnView(potreeViewer, 2);

    document.querySelector(".jstree.jstree-2").style.display = "block";
    document.querySelector(".jstree.jstree-1").style.display = "none";
    document.querySelector(".layer-titles").innerHTML = "레이어2";
    document.querySelector(".points-area.view1").style.display = "block";
    document.querySelector(".points-area.view2").style.display = "none";
  };

  const init = async (searchParams) => {
    try {
      const results = await PotreeServiceUseCases.init(
        potreeViewer,
        cesiumViewer,
        { area, shp: true },
        { area: baseConfig.area, shp: true }
      );
      const { pointclouds, basePointclouds } = results;
      if (results?.pointclouds[0]) {
        getCoord();
        // pointcloudsMaterialSetting(results.pointclouds[0]);
      }

      if (pointclouds && basePointclouds) {
        console.log("results", pointclouds[0], basePointclouds[0]);
      }
      setTimeout(() => {
        potreeViewer.setMinNodeSize(0);
      }, 3000);
      isClipingMode == true
        ? potreeViewer.setClipTask(2)
        : potreeViewer.setClipTask(1);

      if (searchParams.size <= 2) {
        await PotreeServiceUseCases.LoadTogetShapeForContest(
          potreeViewer,
          saveViewerJsonData
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    isClipingMode == true
      ? potreeViewer.setClipTask(2)
      : potreeViewer.setClipTask(1);
    console.log(isClipingMode, "view 2");
  }, [isClipingMode]);

  // const syncToview = useCallback(
  //   (view1: any, view2: any): void => {
  //     if (!(view1 || view2)) return;

  //     view2.maxPitch = view1.maxPitch;
  //     view2.minPtich = view1.minPitch;
  //     view2.position.x = view1.position.x;
  //     view2.position.y = view1.position.y;
  //     view2.position.z = view1.position.z;
  //     view2.yaw = view1.yaw;
  //     view2._pitch = view1._pitch;
  //   },
  //   [potreeView1, potreeViewer.scene.view]
  // );

  const toggleControlState = useCallback(() => {
    setIsControlPressed((prev) => !prev); // 상태를 반전
  }, []);

  useEffect(() => {
    if (document.querySelector(".unfocus-button")) {
      document
        .querySelector(".unfocus-button")
        .addEventListener("click", async (e) => {
          setPanoramaTarget({});
        });
    }
  }, [panoramaTarget]);

  useEffect(() => {
    // const handleMouseMove = (e) => {
    //   if (!isControlPressed) return;
    //   e.preventDefault();
    //   // 여기에 원하는 로직을 추가
    //   usePotreeStore.getState().setSyncViewer(potreeViewer.scene.view, 1);
    // };
    // const domElement = potreeViewer.renderer.domElement;
    // // const handleKeyDown = (e) => {
    // //   if (e.key === "Control") {
    // //     setIsControlPressed(true);
    // //   }
    // // };
    // // const handleKeyUp = (e) => {
    // //   if (e.key === "Control") {
    // //     setIsControlPressed(false);
    // //   }
    // // };
    // domElement.addEventListener("click", createHandleClick);
    // domElement.addEventListener("mousemove", handleMouseMove);
    // // domElement.addEventListener("keydown", handleKeyDown);
    // // domElement.addEventListener("keyup", handleKeyUp);
    // return () => {
    //   domElement.removeEventListener("mousemove", handleMouseMove);
    //   // domElement.removeEventListener("click", parameterizedHandleClick);
    //   // domElement.removeEventListener("keydown", handleKeyDown);
    //   // domElement.removeEventListener("keyup", handleKeyUp);
    // };
  }, [potreeViewer, isControlPressed, panoramaTarget]);

  const { data, isLoading } = useQuery({
    queryKey: ["land", boardId],
    queryFn: getLand,
    staleTime: 5 * 60 * 1000,
    enabled: !!boardId,
  });

  useEffect(() => {
    if (!data) return;

    setLandData((prev) => (prev = data?.resultObject));
  }, [data?.resultObject]);

  const getCoord = () => {
    let firstCoord =
      "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs";
    let secondCoord =
      "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees";
    potreeViewer.renderer.domElement.addEventListener("mousemove", (e) => {
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
  };

  if (!data) return null;

  return (
    <>
      <StyledPotreeNavBar ref={useRefs}>
        <div className={`lnb`}></div>
        {/* <div className={`lnb `} style={{ height: "84px" }}></div> */}
        {/* <ServiceSyncToViewBtn
          width={"fit-content"}
          height={"auto"}
          title={"sync to view2 <-> view1"}
          backgroundColor={"#fff"}
          handleSyncToView={toggleControlState}
        /> */}
        <div
          className="points-area view2"
          style={{
            // width: "50%",
            position: "absolute",
            bottom: "4px",
            right: "160px",
            zIndex: 10000,
            width: "auto",
            border: "none",
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
      </StyledPotreeNavBar>
    </>
  );
};
