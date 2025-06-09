import { chooseColorList } from "@/pages/service/const";
import { StyledCustomSelect } from "../CommonSelect/style";

interface IPropsCustomSelect {
  setSelectColor: React.Dispatch<React.SetStateAction<string>>;
  selectColor: string;
  type?: string;
}

export const CustomSelect = ({
  setSelectColor,
  selectColor,
  type,
}: IPropsCustomSelect): JSX.Element => {
  const handleClick = (
    value: string,
    setSelectColor: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setSelectColor(value);
  };

  return (
    <StyledCustomSelect>
      <ul>
        {chooseColorList.map((el, index) => {
          // 조건에 맞춰 label 값을 변경
          let adjustedLabel = el.label;
          if (type === "면적정보" && el.value === "white") {
            adjustedLabel = "분홍"; // 'white'의 label을 '분홍'으로 변경
          }

          return (
            <li
              key={el.value} // key를 value로 설정하여 고유하고 변경되지 않도록 함
              className={selectColor === el.value ? "active" : ""}
              onClick={() => handleClick(el.value, setSelectColor)}
            >
              <span>{adjustedLabel}</span>
            </li>
          );
        })}
      </ul>
    </StyledCustomSelect>
  );
};
