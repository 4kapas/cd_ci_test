import dayjs from "dayjs";
import { DEFAULT_DATE_FORTMAT } from "@/consts/const";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export function dateToString(date: Date) {
  return dayjs(date).format(DEFAULT_DATE_FORTMAT);
}

export function measureSeconds(callback: () => void): number {
  const start = new Date().getTime();
  callback();
  const end = new Date().getTime();
  const elapsedMilliseconds = end - start;
  const elapsedSeconds = elapsedMilliseconds / 1000;
  return elapsedSeconds;
}

export const getDiffTime = async (startTime: number, endTime: number) => {
  const elapsedMilliseconds = endTime - startTime;
  const elapsedSeconds = elapsedMilliseconds / 1000;
  return elapsedSeconds;
};

export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const hexToRgb = async (hexOrNumber: string | number) => {
  let hex: string;

  // 문자열인 경우 그대로 사용, 숫자인 경우 16진수 문자열로 변환
  if (typeof hexOrNumber === "string") {
    hex = hexOrNumber.replace(/^#/, ""); // 문자열에서 # 기호 제거
  } else if (typeof hexOrNumber === "number") {
    hex = hexOrNumber.toString(16);
  } else {
    return null; // 유효하지 않은 입력
  }

  // 유효한 16진수 헥사코드 패턴 확인
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return null; // 유효하지 않은 헥사코드
  }

  // 헥사코드를 RGB로 변환
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // 각 구성 요소를 0과 1 사이의 값으로 정규화
  const rNormalized = r / 255;
  const gNormalized = g / 255;
  const bNormalized = b / 255;

  // 결과를 객체로 반환
  return {
    r: rNormalized,
    g: gNormalized,
    b: bNormalized,
  };
};

export const generateRandomHexColor = async () => {
  // 0부터 16777215(0xFFFFFF) 사이의 무작위 정수 생성
  const randomColor = Math.floor(Math.random() * 16777216); // 0x1000000 (0xFFFFFF + 1)

  // 16진수 문자열로 변환하고 앞에 0을 채워서 6자리로 만듭니다.
  const hexColor = randomColor.toString(16).padStart(6, "0");

  // 앞에 '#'을 붙여서 헥사코드 형식으로 반환
  return `#${hexColor}`;
};

export const getRandomArrayValue = async (arr: any[]) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

export const calculateTimeDifference = (startTime: any) => {
  const timeDiffDuration = dayjs.duration(dayjs().diff(startTime));
  const yearDiff: number = parseInt(timeDiffDuration.format("Y"));
  const monthDiff: number = parseInt(timeDiffDuration.format("M"));
  const dateDiff: number = parseInt(timeDiffDuration.format("D"));
  const hourDiff: number = parseInt(timeDiffDuration.format("H"));
  const minDiff: number = parseInt(timeDiffDuration.format("m"));
  const secondDiff: number = parseInt(timeDiffDuration.format("s"));

  if (yearDiff > 0) {
    return `${yearDiff}년 전`;
  } else if (monthDiff > 0) {
    return `${monthDiff}달 전`;
  } else if (dateDiff > 0) {
    return `${dateDiff}일 전`;
  } else if (hourDiff > 0) {
    return `${hourDiff}시간 전`;
  } else if (minDiff > 0) {
    return `${minDiff}분 전`;
  } else if (secondDiff > 0) {
    return `${secondDiff}초 전`;
  } else {
    return "";
  }
};

export const getRgba = (selectColor: string) => {
  let switchColor;
  switch (selectColor) {
    case "yellow":
      switchColor = "255, 255, 0, 1"; // 정확한 노란색 값
      break;

    case "black":
      switchColor = "0, 0, 0, 1"; // 정확한 검정색 값
      break;

    case "white":
      switchColor = "255, 255, 255, 1";
      break;

    case "green":
      switchColor = "0, 50, 0, 1";
      break;
  }

  return switchColor;
};

/**
 * 두 개의 용량 문자열을 비교해서 기준(limitStr)을 초과하는지 확인
 * @param sizeStr - '1.2GB', '300MB' 등 비교 대상 용량
 * @param limitStr - '3GB', '2500MB' 등 제한 용량
 * @returns true: 제한 초과, false: 초과하지 않음
 */
export function isFileSizeOverLimit(
  sizeStr: string,
  limitStr: string
): boolean {
  const parseSize = (str: string): number => {
    const regex = /^([\d.]+)\s*(GB|MB|KB|B)$/i;
    const match = str.match(regex);
    if (!match) throw new Error(`Invalid size format: ${str}`);

    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();

    switch (unit) {
      case "GB":
        return value;
      case "MB":
        return value / 1024;
      case "KB":
        return value / (1024 * 1024);
      case "B":
        return value / (1024 * 1024 * 1024);
      default:
        throw new Error(`Unsupported unit: ${unit}`);
    }
  };

  return parseSize(sizeStr) > parseSize(limitStr);
}

/**
 * 본부별 색상값 반환함수
 * @param region
 * @returns 색상코드
 */
export const getColorByRegion = (category: string): string => {
  switch (category) {
    case "seoul":
      return "#FBD446"; //
    case "busan_ulsan":
      return "#FBB32D";
    case "incheon":
      return "#F69976";
    case "gyeonggi_south":
      return "#C68883";
    case "gyeonggi_north":
      return "#F2B8BD";
    case "gangwon":
      return "#E97699";
    case "chungbuk":
      return "#882B65";
    case "daejeon_sejong_chungnam":
      return "#D878E7";
    case "jeonbuk":
      return "#9783E8";
    case "gwangju_jeonnam":
      return "#8656B3";
    case "daegu_gyeongbuk":
      return "#534171";
    case "gyeongnam":
      return "#799CF0";
    case "jeju":
      return "#43BADB";
    case "pilot_zone":
      return "#A9DF8B";
    default:
      return "#2D9F83";
  }
};

/**
 * 날짜 데이터를 포맷된 문자열로 반환합니다.
 *
 * @param {string | number} data - 날짜 또는 타임스탬프 (Date로 변환 가능한 값)
 * @param {boolean} isTime - true일 경우 시간(AM/PM hh:mm)까지 포함하여 반환
 * @returns {string} 포맷된 날짜 문자열 (예: "2025.05.09" 또는 "2025.05.09 AM 09:22")
 *
 * @example
 * formatDateWithOptionalTime("2025-05-09T09:22:00Z", false); // "2025.05.09"
 * formatDateWithOptionalTime(1715246520000, true);           // "2025.05.09 PM 06:22"
 */
export const formatDateWithOptionalTime = (
  data: string | number,
  isTime: boolean
): string => {
  if (!data) return "-";
  const date = new Date(data);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  if (isTime) {
    const hour = date.getHours();
    const minute = String(date.getMinutes()).padStart(2, "0");
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = String(hour % 12 || 12).padStart(2, "0");

    return `${year}.${month}.${day} ${ampm} ${formattedHour}:${minute}`;
  }

  return `${year}.${month}.${day}`;
};

/**
 * 바이트 단위의 파일 크기를 사람이 읽기 쉬운 문자열로 변환합니다.
 *
 * @param {number} size - 바이트 단위 파일 크기
 * @returns {string} - 포맷된 크기 문자열 (예: "1.24GB", "512.00KB")
 */
export const formatFileSize = (size: number): string => {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;

  if (size >= GB) return (size / GB).toFixed(2) + "GB";
  if (size >= MB) return (size / MB).toFixed(2) + "MB";
  if (size >= KB) return (size / KB).toFixed(2) + "KB";
  return size + "B";
};
