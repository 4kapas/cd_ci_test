//@ts-nocheck

import { DXFExporter } from "/public/Potree/src/exporter/DXFExporter.js";

const useExcelDownload = (): void => {
  const dxfDownLoad = (viewer: any, measurementId: string) => {
    if (!measurementId) return;

    const thisMeasureMents = viewer?.scene?.measurements.filter((el) => {
      return el.uuid === measurementId;
    });

    let measurements = [
      ...thisMeasureMents,
      ...viewer?.scene?.profiles,
      ...viewer?.scene?.volumes,
    ];
    console.log(measurements, "dxf");
    if (thisMeasureMents) {
      let dxf = DXFExporter.toString(measurements);

      let url = window.URL.createObjectURL(
        new Blob([dxf], { type: "data:application/octet-stream" })
      );
      // 다운로드를 위한 a 태그를 생성하고 설정
      let a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "measurements.dxf"; // 저장될 파일 이름 설정
      document.body.appendChild(a); // DOM에 추가
      a.click(); // 프로그래매틱하게 클릭 이벤트를 발생

      // 사용 후 정리
      window.URL.revokeObjectURL(url); // 생성된 URL을 메모리에서 해제
      document.body.removeChild(a); // 생성된 a 태그 제거
    } else {
      viewer.postError("no measurements to export");
      event.preventDefault();
    }
  };
  return dxfDownLoad;
};
export default useExcelDownload;
