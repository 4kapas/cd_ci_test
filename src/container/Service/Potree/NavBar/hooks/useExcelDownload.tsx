import { useCallback } from "react";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";

const useExcelDownload = () => {
  const s2ab = useCallback((s: any) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }, []);

  const excelDownload = useCallback(
    (initialPoints: any[], points: any[]) => {
      const excelFileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const excelFileExtension = ".xlsx";
      const excelFileName = "coordinates_data";
      if (!initialPoints) {
        // 첫 번째 워크시트 생성 (기준좌표)
        const ws = XLSX.utils.aoa_to_sheet([["기준좌표"], ["x", "y", "z"]]);

        console.log(points, "initinal");
        points.forEach((data) => {
          let datas = data.position;
          XLSX.utils.sheet_add_aoa(ws, [[datas.x, datas.y, datas.z]], {
            origin: -1,
          });
        });
        ws["!cols"] = [{ wpx: 200 }, { wpx: 200 }, { wpx: 200 }];

        // 워크북 객체 생성
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "좌표");

        // 엑셀 파일 작성
        const excelBuffer = XLSX.write(wb, {
          bookType: "xlsx",
          type: "binary",
        });

        const data = s2ab(excelBuffer); // Convert the binary string to an ArrayBuffer
        const excelFile = new Blob([data], { type: excelFileType });
        FileSaver.saveAs(excelFile, excelFileName + excelFileExtension);
      } else {
        // 첫 번째 워크시트 생성 (기준좌표)

        console.log(points, "initinal");
        const ws = XLSX.utils.aoa_to_sheet([["기준좌표"], ["x", "y", "z"]]);

        console.log(initialPoints, "initinal");
        initialPoints.forEach((data) => {
          XLSX.utils.sheet_add_aoa(ws, [[data.x, data.y, data.z]], {
            origin: -1,
          });
        });
        ws["!cols"] = [{ wpx: 200 }, { wpx: 200 }, { wpx: 200 }];

        // 두 번째 워크시트 생성 (수정좌표)
        const ws2 = XLSX.utils.aoa_to_sheet([["수정좌표"], ["x", "y", "z"]]);
        points.forEach((data) => {
          XLSX.utils.sheet_add_aoa(
            ws2,
            [[data.position.x, data.position.y, data.position.z]],
            { origin: -1 }
          );
        });
        ws2["!cols"] = [{ wpx: 200 }, { wpx: 200 }, { wpx: 200 }];

        // 워크북 객체 생성
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "기준좌표");
        XLSX.utils.book_append_sheet(wb, ws2, "수정좌표");

        // 엑셀 파일 작성
        const excelBuffer = XLSX.write(wb, {
          bookType: "xlsx",
          type: "binary",
        });
        const data = s2ab(excelBuffer); // Convert the binary string to an ArrayBuffer
        const excelFile = new Blob([data], { type: excelFileType });
        FileSaver.saveAs(excelFile, excelFileName + excelFileExtension);
      }
    },
    [s2ab]
  );

  return excelDownload;
};

export default useExcelDownload;
