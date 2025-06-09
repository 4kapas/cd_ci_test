import styled from "styled-components";

export const StyledLayout = styled.div`
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  width: 100%;
  height: 100%;
  main {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
  }

  .MuiGrid-item > a {
    display: inline-block;
  }
`;
