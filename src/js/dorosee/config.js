export const VWorldKey = `1CE577F9-FC5E-304A-A4E3-42FD46DDDC9C`;

const testHOST = `http://203.234.214.224:37600`;
const LOCALHOST = `http://dt.incheon.go.kr:37600`; // 나중에 만약 서버 컴퓨터 옮기게되면 할 용도

export const HOST = LOCALHOST;

export const isDev = true;

export const COORDS = {
  // 현재 국토지리정보원 표준
  //서부원점(GRS80)
  "EPSG:5185":
    "+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs",
  //중부원점(GRS80)
  "EPSG:5186":
    "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs",
  //제주원점(GRS80)
  "EPSG:5175":
    "+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=550000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43",
  //동부원점(GRS80)
  "EPSG:5187":
    "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs",
  //동해(울릉)원점(GRS80)
  "EPSG:5188":
    "+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs",
  //

  WGS84:
    "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees",

  // UTM 전세계를 6도 단위로 나누는 표준적인 TM으로 군사지도에서 많이 사용
  // 경도 120~126도 사이에서 사용
  "EPSG:32652":
    "+proj=utm +zone=52 +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
};
