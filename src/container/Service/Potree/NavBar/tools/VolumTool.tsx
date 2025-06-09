import { commonImage, menuImage } from "@/consts/image";
import { IPropsVolumeTool } from "./types";

export const VolumeTool = ({
  volumeTool,
  clickedVolumId,
  isClickHandler,
  sceneDelect,
  DISTRICT_OPTIONS,
  area,
}: IPropsVolumeTool): JSX.Element => {
  return (
    <>
      {volumeTool?.map((volume, index) => {
        let points = volume?.position;

        const volumeId = volume?.uuid;

        return (
          <div
            className={`distanceList ${
              clickedVolumId === volumeId ? "first" : ""
            }`}
            key={volume.uuid}
            onClick={isClickHandler(volumeId, points, volume)}
          >
            <div className="header">
              <div className="header-innder-box">
                <span className="icon" style={{ marginRight: "8.6px" }}>
                  <img src={menuImage.iconVolumeClipping} alt="distance" />
                </span>
                <span>{volume.name}</span>
              </div>
              <button onClick={sceneDelect(index, "volume", volume.uuid)}>
                <img
                  src={`${
                    clickedVolumId === volumeId
                      ? commonImage.commonCloseActive
                      : commonImage.commonClose
                  }`}
                  alt="레이어 닫기버튼"
                />
              </button>
            </div>
            <div className="body">
              <div className="addr">
                주소 :{" "}
                <span>
                  {DISTRICT_OPTIONS?.map((el) => {
                    if (el.value === area) return el.label;
                  })}
                </span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>x</th>
                    <th>y</th>
                    <th>z</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{points.x.toFixed(3)}</td>
                    <td>{points.y.toFixed(3)}</td>
                    <td>{points.z.toFixed(3)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </>
  );
};
