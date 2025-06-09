import { Box } from "@mui/material";
import { styled } from "styled-components";

export const StyledCreateResultModal = styled.div`
  .content {
    /* margin: 14px 0 */
    color: #2f3237;
    font-size: 16px;
    font-weight: 500;
    line-height: 22.4px;
    word-wrap: break-word;
    border: 1px solid #dfe2e7;
    /* border-right: none; */
    .top {
      margin-bottom: 16px;
      width: 100%;
      /* border-top: 1px #98a2b3 solid;
      border-bottom: 1px #98a2b3 solid; */

      ul.topRow {
        display: flex;
        padding: 0;
        margin: 0;
        flex-wrap: wrap;

        &.landinfo-ul {
          li {
            background: #fff;
            width: 100%;
            min-height: 40px;
            height: auto;
            border-bottom: 1px #dedede solid;
            display: flex;
            flex-direction: column;
            padding: initial;
            border-right: 1px #dedede solid;
            &.active {
              background: #31c1b7;
              color: #fff;
            }
            :last-child {
              border-bottom: none;
            }
            > div {
              padding: initial;
            }
            .landinfo-li-title {
              width: 100%;
              display: flex;
              justify-content: space-between;
              padding: 9px 14px;
              span {
                display: inline-block;
                white-space: nowrap;
                margin-right: 5px;
              }
              p {
                margin-bottom: 0;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                line-height: initial;
                margin-right: auto;
              }
            }

            .save-info-content {
              height: 0;
              transition: all 0.3s;
              .save-info-wrap {
                display: none;
              }
              &.active {
                height: auto;
                min-height: 140px;
                .save-info-wrap {
                  height: 100%;
                  display: block;
                  min-height: 140px;
                }
              }
            }
          }
        }
        li {
          list-style: none;
          display: flex;

          &:nth-of-type(1),
          &:nth-of-type(2),
          &:nth-of-type(3) {
            border-bottom: 1px #dedede solid;
          }

          > div {
            padding: 10px;
            font-size: 16px;
            .input {
              margin-top: 0;
              input {
                border: none;
                padding: 0;
                height: unset;
                font-weight: 400;
              }
            }
          }

          .width80 {
            width: 80px;
            min-width: 80px;
            background: #fff;
          }
          .width200 {
            width: 200px;
            min-width: 200px;
            background: #fff;
          }
          .width290 {
            width: 290;
            min-width: 290px;
            background: #fff;
          }

          .url {
            display: flex;

            img {
              cursor: pointer;
            }

            .URL {
              width: 250px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
          }

          .item {
            display: flex;
            justify-content: center;
            align-items: center;
            background: #f5f6f7;
          }
        }
      }
    }
    .bottom {
      h3 {
        color: black;
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 0;
      }
      .input {
        margin-top: 4px;
        margin-bottom: 16px;
      }
      textarea {
        outline: none;
      }
    }
  }

  .modalButtons {
    display: flex;
    justify-content: flex-end;

    & + button {
      margin-left: 12px;
    }
  }

  button {
    margin-left: 12px;
    width: 80px;
    height: 40px;
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    word-wrap: break-word;
    background: #00a991;
    border-radius: 2px;

    /* 새로 만들기, 조회 */

    &.create {
      background: #00a991;
    }
    padding: 10px 20px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    line-height: 18.2px;
    word-wrap: break-word;
    background: #8992a1;
    border-radius: 2px;
  }

  input {
    width: 100%;
    height: 40px;
    font-size: 16px;
    font-weight: 500;
    border: 1px solid #dfe2e7;
    border-radius: 2px;
    background: #ffffff;
    box-sizing: border-box;
    padding: 0 14px;
  }

  textarea {
    width: 100%;
    height: 190px;
    padding: 10px;
    font-size: 15px;
    line-height: 1.2;
    border: 1px solid #dfe2e7;
    resize: none;
    border-radius: 2px;
  }
`;

export const StyledSaveListContent = styled.div`
  /* display: none; */
  width: 100%;
  background: #f5f6f7;
  padding: 10px 14px !important;
  box-sizing: border-box;
  p {
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    font-family: "Pretendard";
    color: #2f3237;
  }
`;
