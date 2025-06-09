import styled from "styled-components";
//image
import { commonImage } from "@/consts/image";
export const StyleedPropertiesEmtyWrap = styled.div`
  text-align: center;
  > p {
    font-size: 16px;
    font-weight: lighter;
    line-height: 24px;
    font-family: "Pretendard";
    color: #7a828f;
    margin-bottom: 0;
  }
`;
export const StyledPotreeNavBar = styled.div`
  .main-navBar {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    height: 36px;
    padding: 0 0 0 24px;
    border-bottom: 1px solid #dfe2e7;
    box-sizing: border-box;

    //홈,분석,업무연계 버튼
    .gnbTab {
      padding: 0 12px;
      color: #000000;
      font-size: 14px;
      font-weight: 400;
      line-height: 34px;
      border-bottom: 2px solid transparent;
      box-sizing: border-box;

      &.active {
        border-bottom-color: #00a991;
      }
    }
  }
  .visible {
    display: block;
  }

  .lnb {
    position: relative;

    .insightTabContainer {
      position: relative;
      top: 100%;
      display: flex;
      justify-content: flex-end;
      z-index: 999;
    }
    &.active {
      height: 84px;
    }
  }

  .lnbContainer {
    display: flex;
    gap: 12px;
    padding: 11px 18px;
    border-bottom: 1px solid #dfe2e7;
    box-sizing: border-box;
    &.active {
      position: fixed;
      width: 100%;
    }
  }

  .lnbButton {
    position: relative;
    &:hover {
      background: #f0f1f4;
    }
  }

  .lnbButton {
    position: relative;
    display: flex;
    align-items: center;
    flex-flow: column;
    width: 50px;
    min-height: 60px;
    padding: 4px 0 2px;
    background: #ffffff;
    border-radius: 2px;
    text-align: center;
    border: 1px solid #ebeef1;
    cursor: pointer;

    &#history,
    &#propInfo,
    &#te3 {
      margin-right: 10px;
      position: relative;

      &:after {
        content: "";
        position: absolute;
        right: -14px;
        top: 50%;
        width: 2px;
        height: 20px;
        transform: translateY(-50%);
        background-color: #dfe2e7;
      }
    }

    .lnbIcon {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      /* width: 18px;
      height: 18px; */
      margin-top: 2px;
      margin-bottom: 9px;

      &:after {
        content: "";
        position: absolute;
        right: -14px;
        top: 50%;
        width: 12px;
        height: 12px;
        transform: translateY(-50%);
      }
    }

    &.active {
      border-color: #dfe2e7;
      background-color: #ebeef1;
      .lnbIcon {
        margin-right: 4px;
      }
      .lnbIcon:after {
        background-image: url(${commonImage.dropDown});
        background-size: 100%;
      }
      &.notArrows {
        .lnbIcon {
          margin-right: 0;
        }
        .lnbIcon::after {
          display: none;
        }
      }
    }

    .lnbName {
      position: relative;
      color: #35393f;
      font-size: 12px;
      margin-bottom: 0;
    }
  }

  //측정,클리핑 메뉴
  .measureTools-container,
  .clippingTools-container {
    display: none;
  }

  .lnbChildrenButton.measureTool {
    min-width: 158px;
    width: 158px;
  }
  .lnbChildrenButton.clippingTool {
    min-width: 168px;
    width: 168px;
  }
  .lnbChildren {
    position: absolute;
    top: -1px;
    padding: 4px 0;
    background: #ffffff;
    border: 1px solid #dfe2e7;
    box-sizing: border-box;
    z-index: 999;
  }
  .lnbChildrenButton {
    display: flex;
    align-items: center;
    width: 200px;
    height: 36px;
    padding: 4px 15px;

    &:hover {
      background: #f0f1f4;
    }
    > p {
      margin-bottom: 0;
      color: #35393f;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
    }
    .childrenIcon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      margin-right: 10px;
    }
  }

  .history-container {
  }
  .apperance-container {
    background: white;
    position: absolute;
    top: 19px;
    width: 283px;
  }
  .apperance-container .floatingChildren {
    margin-bottom: 18px;
  }

  .apperance-container .floatingChildren:last-child {
    margin-bottom: 0;
  }
  .apperance-container .floatingChildren .settingVolume {
    margin-left: 10px;
  }
  .apperance-container .apperanceText {
    margin-bottom: 11px;
    color: #2f3237;
    font-size: 14px;
    font-weight: 500;
    line-height: 19.6px;
  }
  .apperanceText {
    ul {
      li {
        overflow: hidden;
      }
    }
  }
  .property-container {
    position: absolute;
    top: 19px;
    width: 310px;

    display: none;
  }
  .property-container .body {
    padding: 18px 10px;
  }

  .property-container .body.main {
    padding: 18px 10px;
    max-height: calc(100vh - 228px);
    overflow-y: auto;
  }
  .distanceList {
    margin-top: 18px;
    overflow-y: auto;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    cursor: pointer;
    width: 100%;
  }
  .distanceList img {
    width: 20px;
    height: 20px;
  }
  .header-innder-box {
    display: flex;
    align-items: center;
  }
  .distanceList .header {
    display: flex;
    align-items: center;
    height: 38px;
    padding: 0 16px;
    background-color: #f2f4f7;
    justify-content: space-between;
    /* border-bottom: 1px solid #d9d9d9; */
  }
  .distanceList .header .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    margin-right: 4px;
  }
  .distanceList .header span {
    color: #1d2939;
    font-size: 16px;
    font-weight: 500;
  }
  .distanceList .body {
    padding: 16px 11.5px;
  }
  .distanceList .body table {
    font-family: "Pretendard";
  }
  .distanceList .body .table-wrap {
    padding: 8px;
    background: #f9fafb;
    border-radius: 4px;
  }
  .distanceList .body .addr {
    padding-bottom: 10px;
    margin-bottom: 10px;
    color: #344054;
    font-size: 14px;
    font-weight: 400;
    line-height: 19.6px;
    border-bottom: 1px solid #dee3e8;
    width: 100%;
  }
  .distanceList .body .addr .point-title {
    display: inline-block;
    background: #fff;
    height: 16px;
    width: 120px;
    position: relative;
    z-index: 99;
  }
  .distanceList .body .addr .line {
    position: absolute;
    top: 50%;
    transform: translateX(-50%);
    transform: translateY(-50%);
    height: 1px;
    background: #7a828f;
    width: 100%;
  }
  .distanceList .body .addr:last-child {
    border-bottom: none !important;
  }
  .distanceList .body .addr.border-none {
    border-bottom: none !important;
    padding-bottom: 0 !important;
  }
  .distanceList .body .addr > p {
    margin-bottom: 0;
    font-weight: 400;
  }
  .distanceList .body table th,
  .distanceList .body table td {
    font-size: 14px;
    line-height: 19.6px;
    padding: 2.5px 0;
  }
  .distanceList .body table th {
    font-weight: 400;
  }
  .distanceList .body table td {
    font-weight: 400;
  }
  .distanceList.first {
    border-color: #00a991;
  }
  .distanceList.first .header {
    background: linear-gradient(121deg, #00a991 16%, #1c6aac 100%);
  }
  .distanceList.first .header span {
    color: #ffffff;
  }
  .distanceList:not(.first):hover {
    border-color: rgba(223, 226, 231, 1);
  }
  .distanceList:not(.first):hover img {
    filter: brightness(0);
  }

  .distanceList:not(.first):hover .header {
    background: rgba(223, 226, 231, 0.6);
  }
  .distanceList:not(.first):hover .header span {
    color: rgba(68, 73, 81, 1);
  }
`;
//업무연계 탭 style
export const StyledBusiness = styled.div`
  margin: 20px 0;

  .label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 146px;
    padding: 9px 20px;
    color: #1d2939;
    font-size: 16px;
    font-weight: 500;
    border-top: 1px solid #98a2b3;
    border-left: 1px solid #98a2b3;
    border-bottom: 1px solid #98a2b3;
    background-color: #ffffff;
    &:first-of-type {
      background-color: #98a2b3;
    }
    &:last-of-type {
      border-right: 1px solid #98a2b3;
    }
  }
`;
