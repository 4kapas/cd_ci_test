import { CONFIG } from "@/config";
import { CRS } from "@/consts/const";
import useLoadingStore from "@/store/useLoadingStore";
import { DatasetType } from "@/types";
import ExcelJS, { Fill } from "exceljs";
import { saveAs } from "file-saver";

interface CenterCoordinates {
  centerX: number;
  centerY: number;
  centerZ: number;
}

interface ReportServiceOptions {
  datasetInfo: DatasetType;
  filename: string;
  author: string;
}

interface CenterCoordinates {
  centerX: number;
  centerY: number;
  centerZ: number;
  latitude: number;
  longitude: number;
  area: number;
}

export class ReportService {
  private datasetInfo: DatasetType;
  private detectID: string;
  private targetID: string;
  private filename: string;
  private author: string;
  private baseUrl: string;
  private serviceUrl: string;
  private viewerUrl: string;
  private startLoading: () => void;
  private stopLoading: () => void;
  private handleLoadingMessage: (message: string) => void;

  constructor({ datasetInfo, filename, author }: ReportServiceOptions) {
    this.datasetInfo = datasetInfo;
    this.filename = filename;
    this.author = author;

    this.detectID = datasetInfo.id;
    this.targetID = this.datasetInfo.changeDetect!.target.id;

    this.baseUrl = CONFIG.HOST;
    this.serviceUrl = CONFIG.HOST + "/services";
    this.viewerUrl = "/screenshotViewer/index.html";
    this.startLoading = useLoadingStore.getState().startLoading;
    this.stopLoading = useLoadingStore.getState().stopLoading;
    this.handleLoadingMessage = useLoadingStore.getState().handleLoadingMessage;
  }

  private async getCoordinatesAndArea(
    serviceId: string
  ): Promise<CenterCoordinates> {
    this.handleLoadingMessage("중심 좌표 및 면적 계산 중...");
    const metadataUrl = `${this.serviceUrl}/${serviceId}/pointcloud/metadata.json`;
    const serviceInfoUrl = `${this.baseUrl}/service/info/${serviceId}`;
    const metadataResponse = await fetch(metadataUrl);
    const serviceInfoResponse = await fetch(serviceInfoUrl);

    if (!metadataResponse.ok || !serviceInfoResponse.ok) {
      throw new Error(`Failed to fetch metadata for ${serviceId}`);
    }

    const response = await serviceInfoResponse.json();
    const metadata = await metadataResponse.json();

    const indexData: DatasetType = response.results;
    if (!indexData) throw new Error("Failed to fetch index data");

    const min = metadata.boundingBox.min;
    const max = metadata.boundingBox.max;

    const centerX = (min[0] + max[0]) / 2;
    const centerY = (min[1] + max[1]) / 2;
    const centerZ = (min[2] + max[2]) / 2;

    const sourceProjection = CRS[indexData.coord];
    const targetProjection = CRS["EPSG:4326"];

    const [longitude, latitude] = proj4(sourceProjection, targetProjection, [
      centerX,
      centerY,
    ]);

    // Calculate area using bounding box (in meters)
    const width = max[0] - min[0];
    const height = max[1] - min[1];
    const area = width * height; // 면적 (단위: 제곱미터)
    return { centerX, centerY, centerZ, latitude, longitude, area };
  }

  private async captureScreenshot(
    serviceId: string,
    isDetection: boolean,
    centerCoordinate: CenterCoordinates
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.handleLoadingMessage("3D 화면 캡처 중...");
      const iframe = document.createElement("iframe");
      iframe.style.width = "1920px";
      iframe.style.height = "1080px";
      iframe.style.position = "fixed";
      iframe.style.top = "-9999px";
      iframe.style.left = "-9999px";
      iframe.src = `${this.viewerUrl}?serviceId=${serviceId}&detectMode=${isDetection}&host=${CONFIG.HOST}&centerX=${centerCoordinate.centerX}&centerY=${centerCoordinate.centerY}&centerZ=${centerCoordinate.centerZ}`;
      document.body.appendChild(iframe);

      iframe.onload = async () => {
        try {
          const canvas =
            iframe.contentDocument?.querySelector<HTMLCanvasElement>(
              "#potree_render_area canvas"
            );
          if (!canvas) {
            throw new Error("캔버스를 찾을 수 없습니다.");
          }

          await new Promise((resolve) => setTimeout(resolve, 10000));

          const screenshotDataUrl = canvas.toDataURL("image/png");
          document.body.removeChild(iframe);
          resolve(screenshotDataUrl);
        } catch (error) {
          document.body.removeChild(iframe);
          reject(error);
        }
      };
    });
  }

  private async createExcelReport(
    targetScreenshot: string,
    detectScreenshot: string,
    centerCoordinate: CenterCoordinates
  ): Promise<void> {
    this.handleLoadingMessage("보고서 시트 구성 중...");
    const { base, target } = this.datasetInfo.changeDetect!;
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Report");

    const titleBackground: Fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFC0C0C0" },
    };

    sheet.mergeCells("B1:G3");
    sheet.getCell("B1").value = "변화탐지 분석 결과보고서";
    sheet.getCell("B1").font = { size: 18, bold: true };
    sheet.getCell("B1").fill = titleBackground;

    sheet.getCell("A5").value = "분석일자";
    sheet.getCell("A5").fill = titleBackground;
    sheet.getCell("A6").value = "도엽번호";
    sheet.getCell("A6").fill = titleBackground;

    sheet.getCell("F5").value = "작성자";
    sheet.getCell("F5").fill = titleBackground;
    sheet.getCell("G5").value = this.author;
    sheet.mergeCells("G5:H5");
    sheet.getCell("F6").value = "확인자";
    sheet.getCell("F6").fill = titleBackground;
    sheet.mergeCells("G6:H6");

    sheet.getCell("A8").value = "1. 기본 정보";

    sheet.getCell("A9").value = "주소";
    sheet.getCell("B9").value = base.address;
    sheet.getCell("A9").fill = titleBackground;
    sheet.mergeCells("B9:H9");

    sheet.getCell("A10").value = "GPS좌표(위도)";
    sheet.getCell("B10").value = centerCoordinate.latitude;
    sheet.getCell("A10").fill = titleBackground;
    sheet.mergeCells("B10:D10");

    sheet.getCell("A11").value = "GPS좌표(경도)";
    sheet.getCell("B11").value = centerCoordinate.longitude;
    sheet.getCell("A11").fill = titleBackground;
    sheet.mergeCells("B11:D11");

    sheet.getCell("A12").value = "면적";
    sheet.getCell("B12").value = centerCoordinate.area;
    sheet.getCell("A12").fill = titleBackground;
    sheet.mergeCells("B12:D12");

    sheet.getCell("E10").value = "X";
    sheet.getCell("F10").value = centerCoordinate.centerX;
    sheet.getCell("E10").fill = titleBackground;
    sheet.mergeCells("F10:H10");

    sheet.getCell("E11").value = "Y";
    sheet.getCell("F11").value = centerCoordinate.centerY;
    sheet.getCell("E11").fill = titleBackground;
    sheet.mergeCells("F11:H11");

    sheet.getCell("E12").value = "Z";
    sheet.getCell("F12").value = centerCoordinate.centerZ;
    sheet.getCell("E12").fill = titleBackground;
    sheet.mergeCells("F12:H12");

    sheet.mergeCells("A14:H14");
    sheet.getCell("A14").value = "3. 변화지역 데이터";

    const baseImageId = workbook.addImage({
      base64: targetScreenshot.replace(/^data:image\/png;base64,/, ""),
      extension: "png",
    });

    const detectImageId = workbook.addImage({
      base64: detectScreenshot.replace(/^data:image\/png;base64,/, ""),
      extension: "png",
    });

    sheet.addImage(baseImageId, {
      tl: { col: 0, row: 14 },
      ext: { width: 282, height: 218 },
      editAs: "oneCell",
    });

    sheet.addImage(detectImageId, {
      tl: { col: 4, row: 14 },
      ext: { width: 282, height: 218 },
      editAs: "oneCell",
    });
    sheet.mergeCells("A15:D25");
    sheet.mergeCells("E15:H25");

    sheet.mergeCells("A26:D26");
    sheet.getCell("A26").value = `${target.acqDate.split("-")[0]}년도`;
    sheet.mergeCells("E26:H26");
    sheet.getCell("E26").value = `${base.acqDate.split("-")[0]}년도`;

    sheet.mergeCells("A27:H27");
    sheet.getCell("A27").value = "비고";
    sheet.getCell("A27").fill = titleBackground;

    sheet.mergeCells("A28:H42");
    sheet.eachRow({ includeEmpty: true }, (row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        if (cell.address !== "B1") {
          cell.font = { size: 12 };
        }
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
      });
    });
    this.handleLoadingMessage("엑셀 다운로드 준비 중...");
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(
      blob,
      `${this.filename}.xlsx` || `변화탐지보고서_${this.datasetInfo.id}.xlsx`
    );
  }

  public async generate(): Promise<void> {
    try {
      this.startLoading();
      const centerCoordinate = await this.getCoordinatesAndArea(this.detectID);
      const [targetScreenshot, detectScreenshot] = await Promise.all([
        this.captureScreenshot(this.targetID, false, centerCoordinate),
        this.captureScreenshot(this.detectID, true, centerCoordinate),
      ]);
      await this.createExcelReport(
        targetScreenshot,
        detectScreenshot,
        centerCoordinate
      );
    } catch (error) {
      console.error("[ERROR] 보고서 생성 실패:", error);
    } finally {
      this.stopLoading();
    }
  }
}
