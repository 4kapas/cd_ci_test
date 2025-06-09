const ionDefalutToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlOTVmYjA2My02Y2U0LTRmMmItOTAyNi03MzE1NzIzOGEwN2QiLCJpZCI6MjA1MzA0LCJpYXQiOjE3MTUxNDAxNjF9.asQFYeIvhNsHNlhcFja1P0l5S7DJNno3ojpwtw7BR8Y";
const daeguSangyeokToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1Yjg2OGQ1MS02MzVkLTRhODgtODU2Zi1hNjRkM2VjYTUwY2YiLCJpZCI6MjIxNjQwLCJpYXQiOjE3MTgxNTkwNTF9.94YPQE9rgHR4ZAUtsetSPfEvAjv5OQWuT29qKY14V_A";
const pilotProjectDistrictServiceList =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NzdhMzQ5NS0zY2ZkLTQ1M2ItODRhNi03NWJkNGY1NDNhZDUiLCJpZCI6MjI0OTY5LCJpYXQiOjE3MTk1Mzc1OTB9.xFEYmFIqODTlpbzpZvovgn4Izez7u0Q6aWbqgzBNxEg";
const doroseeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlNjY5ZjQwNi1lMjg3LTQ2NjMtOGJjYS02ZTk0NTExM2I2N2IiLCJpZCI6MzA0NzM0LCJpYXQiOjE3NDc4MTc5MTh9.EhnLvE89qiCSu_MBDCH7fJYlkTbEzFX_nakz9VqWJnM"

export const ION_TOKEN_GENERATOR = (area: String): String => {
  switch (area) {
    case "daeguDalseongGun":
      return daeguSangyeokToken;
    case "daeguDalseoGu":
      return pilotProjectDistrictServiceList;
    case "mokposiDaesan":
      return pilotProjectDistrictServiceList;
    case "yesangunGyechon":
      return pilotProjectDistrictServiceList;
        case "doroseeToken":
      return doroseeToken
    default:
      return ionDefalutToken;
  }
};
