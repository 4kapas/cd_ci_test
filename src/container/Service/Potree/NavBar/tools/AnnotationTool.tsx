import { commonImage, menuImage } from "@/consts/image";
import { IPropsAnnotationTool } from "./types";
import { useEffect } from "react";

export const AnnotationTool = ({
  annotationTool,
  clickedAnnotationId,
  isClickHandler,
  sceneDelect,
  sceneRef,
}: IPropsAnnotationTool): JSX.Element => {
  useEffect(() => {
    const refCurrent = sceneRef.current as any;

    if (!clickedAnnotationId || !sceneRef.current) {
      refCurrent.style.display = "none";
    } else {
      refCurrent.style.display = "block";
    }
  }, [annotationTool, clickedAnnotationId]);
  return (
    <>
      {/* annotationTool */}
      {annotationTool?.map((annotation, index) => {
        const points = annotation?.position;
        const annotationId = annotation?.uuid;
        return (
          <div
            className={`distanceList ${
              clickedAnnotationId === annotationId ? "first" : ""
            }`}
            key={annotation?.uuid}
            onClick={isClickHandler(
              annotationId,
              points,
              annotation,
              "annotation"
            )}
            id={annotation?.uuid}
          >
            <div className="header">
              <div className="header-innder-box">
                <span className="icon">
                  <img
                    src={menuImage?.iconAnnotation}
                    alt="distance"
                    style={{
                      marginRight: "4px",
                      display: "inline-block",
                    }}
                  />
                </span>
                <span>annotation</span>
              </div>
              <button
                onClick={sceneDelect(index, "annotations", annotation?.uuid)}
              >
                <img
                  src={
                    clickedAnnotationId === annotationId
                      ? commonImage.commonCloseActive
                      : commonImage.commonClose
                  }
                  alt="레이어 닫기버튼"
                />
              </button>
            </div>
            <div className="body">
              <div className="addr">
                제목 : <span>{annotation?._title}</span>
              </div>
              <div className="addr">
                내용 : <span>{annotation?._description}</span>
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
