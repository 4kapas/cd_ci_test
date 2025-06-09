// base
import styled from "styled-components";

export const StyledBasicButton = styled.div`
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    font-size: ${({ fontSize }) => fontSize};
    font-weight: ${({ fontWeight }) => fontWeight};
    color: ${({ theme }) => theme.fontColor};
    background-color: ${({ theme }) => theme.bgColor};
    border:1px solid;
    border-color:transparent;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        color: ${(props) => props.theme.hover.fontColor};
        background-color: ${(props) => props.theme.hover.bgColor};
    }
    &:disabled {
        background-color: ${(props) => props.theme.disabled.bgColor};
        color: ${(props) => props.theme.disabled.fontColor};
        border-color:${(props) => props.theme.disabled.borderColor};
    }
`;
