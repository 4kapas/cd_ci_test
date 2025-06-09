import styled from "styled-components";

export const StyledFullButton = styled.button`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ fontWeight }) => fontWeight};
  color: ${({ theme }) => theme.fontColor};
  background-color: ${({ theme }) => theme.bgColor};
  border:1px solid;
  border-color:transparent;
  border-radius: 2px;
  cursor: pointer;
  &:hover{
    color: ${(props) => props.theme.hover.fontColor};
    background-color: ${(props) => props.theme.hover.bgColor};
  }
  &:disabled {
    background-color: ${(props) => props.theme.disabled.bgColor};
    color: ${(props) => props.theme.disabled.fontColor};
    border-color:${(props) => props.theme.disabled.borderColor};
  }
`;

export const StyledBorderButton = styled.button`
  min-width: ${({ minWidth }) => minWidth};
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ fontWeight }) => fontWeight};
  color: ${({ theme }) => theme.fontColor};
  background-color: ${({ theme }) => theme.bgColor};
  border:1px solid;
  border-color:${({ theme }) => theme.borderColor};
  border-radius: 2px;
  cursor: pointer;
  &:hover{
    color: ${(props) => props.theme.hover.fontColor};
    background-color: ${(props) => props.theme.hover.bgColor};
  }
  &:disabled {
    background-color: ${(props) => props.theme.disabled.bgColor};
    color: ${(props) => props.theme.disabled.fontColor};
    border-color:${(props) => props.theme.disabled.borderColor};
  }
`;
