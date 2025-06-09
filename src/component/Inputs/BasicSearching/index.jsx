import React, { useRef, useState } from "react";
//mui
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
//image
import { commonImage } from "@/consts/image.ts";
import { StyledBasicSearching } from "@/component/Inputs/BasicSearching/style";
import { GeoCoderManager } from "@/js/dorosee/GeoCoderManager";
import { AlertModal } from "@/component/Modals";

export const BasicSearching = ({ viewer }) => {
  const [open, setOpens] = useState(false);

  const inputRef = useRef(null);
  const serchbox = new GeoCoderManager();

  const handleSearch = () => {
    const query = inputRef.current.value;
    const findFeaturesList =
      viewer?.scene?.scene?.children[0]?.children[0]?.children;

    const findArea = findFeaturesList?.some((el) => {
      return el.userData.properties.JIBUN === query;
    });

    serchbox?.codeAddress(query, viewer, (el) => {
      if (!el && !findArea) {
        setOpens(true);
        return;
      } else if (!el && findArea) {
        const findArea = findFeaturesList
          .filter((el) => {
            return el.userData.properties.JIBUN === query;
          })
          .map((el) => el.geometry);

        let points = findArea[0].vertices;
        let box = new THREE.Box3().setFromPoints(points);

        if (box.getSize(new THREE.Vector3()).length() > 0) {
          let node = new THREE.Object3D();
          node.boundingBox = box;

          viewer.zoomTo(node, 0, 300);
          return;
        }
      }
    });
  };

  return (
    <StyledBasicSearching>
      <TextField
        fullWidth
        variant="outlined"
        className="serchTextField"
        inputRef={inputRef}
        placeholder="주소를 입력해 주세요."
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch}>
                <img
                  src={commonImage.inputSearch}
                  alt="Search"
                  style={{ width: "24px", height: "24px", right: "4px" }}
                />
              </IconButton>
            </InputAdornment>
          ),
          onKeyDown: (e) => {
            if (e.key === "Enter" && handleSearch) {
              handleSearch(); // 엔터 키가 눌렸을 때 handleSearch 함수 실행
            }
          },
        }}
      />
      {open && (
        <AlertModal
          open={open}
          title={"검색결과가 없습니다."}
          setOpen={setOpens}
          children={
            <p>
              찾으시는 주소 검색 결과가 없습니다.
              <br />
              지번 또는 도로명을 다시 한번 확인해 주세요.
            </p>
          }
        />
      )}
    </StyledBasicSearching>
  );
};
