import { OptionType } from "dayjs";

export const DEFAULT_PAGE_COUNT = 12;
export const DEFAULT_DATE_FORTMAT = "YYYY-MM-DD";

export const DISTRICT_OPTIONS = [
  { value: "sadeog", label: "고흥 사덕" },
  { value: "eojeon", label: "고흥 어전" },
  { value: "ocheon", label: "고흥 오천" },
  { value: "baegil", label: "고흥 백일" },
  { value: "sinpyeong", label: "고흥 신평" },
];

export const getAllOption = (options: OptionType[]) => {
  return [{ value: "ALL", label: "전체" }, ...options];
};

export const NAME_OPTIONS = [
  { value: "complainant", label: "민원인" },
  { value: "answerUserNickname", label: "담당자" },
];

export const AREA_OPTIONS_LIST = [
  // { value: "본사", label: "본사" },
  { value: "서울지역본부", label: "서울지역본부" },
  { value: "부산울산지역본부", label: "부산울산지역본부" },
  { value: "Incheon", label: "인천지역본부" },
  { value: "경기남부지역본부", label: "경기남부지역본부" },
  { value: "경기북부지역본부", label: "경기북부지역본부" },
  { value: "강원지역본부", label: "강원지역본부" },
  { value: "충북지역본부", label: "충북지역본부" },
  { value: "대전세종충남지역본부", label: "대전세종충남지역본부" },
  { value: "전북지역본부", label: "전북지역본부" },
  { value: "UOK", label: "광주전남지역본부" },
  { value: "대구경북지역본부", label: "대구경북지역본부" },
  { value: "경남지역본부", label: "경남지역본부" },
  { value: "제주지역본부", label: "제주지역본부" },
  { value: "시범사업지구", label: "시범사업지구" },
  // { value: "시스템유지관리", label: "시스템유지관리" },
];

export const SHAPE_PALETTE = [
  "#FFFF00",
  "#0000FF",
  "#FFFF00",
  "#008000",
  "#00FFFF",
  "#0000FF",
  "#008B8B",
  "#800080",
];

export const tifToIonAssetsNumber = async (configArea: string) => {
  switch (configArea) {
    case "eojeon":
      return 2552567;
    case "ocheon":
      return 2552566;
    case "daegu":
      return 2617999;
    case "daeguDalseoGu":
      return 2638427;
    case "mokposiDaesan":
      return 2638430;
    case "yesangunGyechon":
      return 2638433;
    case "daeguDalseongGun":
      return 2617999;
    case "dorosee":
      return 3400333;
  }
};

export const DEMToIonAssetsNumber = async (configArea: string) => {
  switch (configArea) {
    case "dorosee":
      return 3400319;
  }
};

export const CRS: Record<string, string> = {
  /** 서부원점(GRS80) */
  "EPSG:5185":
    "+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs",
  /** 중부원점(GRS80) */
  "EPSG:5186":
    "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs",
  /** 제주원점(Bessel 타원체, WGS84 변환 파라미터 포함) */
  "EPSG:5175":
    "+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=550000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43",
  /** 동부원점(GRS80) */
  "EPSG:5187":
    "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs",
  /** 동해(울릉도)원점(GRS80) */
  "EPSG:5188":
    "+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs",
  /** WGS84 (위도/경도) */
  "EPSG:4326":
    "+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees +no_defs",
  /** UTM Zone 52N (WGS84) */
  "EPSG:32652":
    "+proj=utm +zone=52 +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
  /** UTM Zone 51N (WGS84) - 제주도 및 서부 일부에 사용 */
  "EPSG:32651":
    "+proj=utm +zone=51 +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
  /** UTM Zone 53N (WGS84) - 동해쪽 확장 시 사용 가능 */
  "EPSG:32653":
    "+proj=utm +zone=53 +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
  /** WGS84 Pseudo-Mercator (Web Mercator, Google Maps 등에서 사용) */
  "EPSG:3857":
    "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs",
  /** 중부원점 Bessel 타원체 (예전 한국 TM좌표계) */
  "EPSG:2097":
    "+proj=tmerc +lat_0=38 +lon_0=127 +k=1.0 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-146.43,507.89,681.46",
  /** 동부원점 Bessel 타원체 */
  "EPSG:2098":
    "+proj=tmerc +lat_0=38 +lon_0=129 +k=1.0 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-146.43,507.89,681.46",
};
