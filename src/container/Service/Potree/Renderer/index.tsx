import { ViewerType } from "@/store/usePotreeStore";
import PotreeServiceUseCases from "@/useCases/PotreeServiceUseCases";
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

interface PotreeRenderProps {
  config: { area: string; shp: boolean };
  handleViewer: (viewer: ViewerType) => void;
}

export const PotreeRenderer = ({ config, handleViewer }: PotreeRenderProps) => {
  const POTREE_RENDER_ID = `POTREE-${uuidv4()}`;
  const CESIUM_RENDER_ID = `CESIUM-${uuidv4()}`;

  const init = async () => {
    try {
      if (!POTREE_RENDER_ID || !CESIUM_RENDER_ID)
        throw new Error("project or area Error");

      const { potreeViewer, cesiumViewer } =
        await PotreeServiceUseCases.initPotree(
          POTREE_RENDER_ID,
          CESIUM_RENDER_ID,
          config
        );
      handleViewer({ potreeViewer, cesiumViewer });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div
      id={POTREE_RENDER_ID}
      className="potree_render_area"
      style={{ position: "relative", width: "100%" }}
    >
      <div id={CESIUM_RENDER_ID} className="cesium_render_area" />
    </div>
  );
};
