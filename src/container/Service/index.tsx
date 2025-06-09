import { Layout } from "@/component";
import useModalStore from "@/store/useModalStore";
import { usePotreeStore, ViewerType } from "@/store/usePotreeStore";
import html2canvas from "html2canvas";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ChangeDetectorModal } from "./Modal/ChangeDetectorModal";
import { StyledService } from "./style";
import { PotreeRenderer } from "./Potree/Renderer";
import { PotreeMainNavBar } from "./Potree/NavBar/PotreeMainNavBar";
import { ServiceAPI } from "@/apis/Service/service.api";
import { DatasetType } from "@/types";
import { PotreeSubNavBar } from "./Potree/NavBar/PotreeSubNavBar";

type ViewerModeType = "DEFAULT" | "SPLIT" | "COMPARE";
type ConfigType = { area: string; shp: boolean }[];

export const Service = () => {
  const { serviceId } = useParams<string>();
  const { showChangeDetector } = useModalStore();
  const { SERVICE_ID, setServiceID, resetPotreeStore } = usePotreeStore();
  const [datasetInfo, setDatasetInfo] = useState<DatasetType>();
  const [config, setConfig] = useState<ConfigType>([]);

  const [viewer1, setViewer1] = useState<ViewerType>();
  const [viewer2, setViewer2] = useState<ViewerType>();
  const isReady = useMemo(() => (datasetInfo ? true : false), [datasetInfo]);
  const [viewerMode, setViewerMode] = useState<ViewerModeType>("DEFAULT");

  const init = async (id: string) => {
    try {
      const info = await ServiceAPI._getServiceInfo(id);
      if (info) {
        if (info.changeDetect) {
          setConfig([
            { area: id, shp: true },
            { area: info.changeDetect.target.id, shp: true },
          ]);
        } else {
          setConfig([{ area: id, shp: true }]);
        }
        setDatasetInfo(info);
      }
    } catch (e) {
    } finally {
      setServiceID(id);
    }
  };

  const handleCaptureToggle = async (): Promise<null | undefined> => {
    const captureArea =
      document.getElementById("potree-main-id") ||
      document.getElementById("potree_ctn");

    const lnbContainer: HTMLDivElement | null =
      document.querySelector(".lnbContainer");
    const sceneContainer: HTMLDivElement | null =
      document.querySelector(".scene-container");

    if (!captureArea || !lnbContainer || !sceneContainer) return null;

    lnbContainer.style.opacity = "0";
    sceneContainer.style.opacity = "0";

    await html2canvas(captureArea)
      .then((canvas) => {
        const capturedImage = canvas.toDataURL("image/jpeg", 1);
        const downloadLink = document.createElement("a");
        downloadLink.href = capturedImage;
        downloadLink.download = "captured_image.jpg";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        lnbContainer.style.opacity = "1";
        sceneContainer.style.opacity = "1";
      })
      .catch((error) => {
        console.error("Error during html2canvas:", error);
      });
  };

  const reset = () => {
    setViewer1(undefined);
    setViewer2(undefined);
    window.location.reload();
  };

  useEffect(() => {
    return reset;
  }, []);

  useEffect(() => {
    if (serviceId) init(serviceId);
  }, [serviceId]);

  if (!SERVICE_ID || !isReady) return null;
  return (
    <Layout>
      <div>
        <StyledService>
          {viewer1 && datasetInfo && (
            <PotreeMainNavBar
              viewer={viewer1}
              config={config[0]}
              datasetInfo={datasetInfo}
              handleCaptureToggle={handleCaptureToggle}
            />
          )}
          {viewerMode !== "DEFAULT" && viewer2 && (
            <PotreeSubNavBar
              viewer={viewer2}
              config={config[1]}
              baseConfig={config[0]}
            />
          )}

          <div id="potree_ctn">
            <div className="potree_container" style={{ display: "flex" }}>
              {viewerMode === "DEFAULT" && (
                <PotreeRenderer config={config[0]} handleViewer={setViewer1} />
              )}
              {viewerMode === "COMPARE" && (
                <>
                  <div className="split-layer before">
                    <PotreeRenderer
                      config={config[0]}
                      handleViewer={setViewer1}
                    />
                  </div>
                  <div className="split-layer after">
                    <PotreeRenderer
                      config={config[1]}
                      handleViewer={setViewer2}
                    />
                  </div>
                </>
              )}

              {viewerMode === "SPLIT" && (
                <>
                  <PotreeRenderer
                    config={config[0]}
                    handleViewer={setViewer1}
                  />
                  <PotreeRenderer
                    config={config[1]}
                    handleViewer={setViewer2}
                  />
                </>
              )}
              <div style={{ display: "none" }} id="potree_sidebar_container" />
            </div>
          </div>
        </StyledService>
      </div>
      {showChangeDetector && <ChangeDetectorModal SERVICE_ID={SERVICE_ID} />}
    </Layout>
  );
};
