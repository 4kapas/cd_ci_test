import { useMemo, useState } from "react";
//component
import { BasicSelect } from "@/component";
//style
import { commonImage } from "@/consts/image";

import { StyleGridWrap, StyleHomeWrap, StyledHomeTitle } from "./style";
import { useNavigate } from "react-router-dom";
import { GridColDef } from "@mui/x-data-grid";
import styled from "styled-components";
import { GridList } from "@/component/DataGrid";
import {
  getCategoryList,
  getServiceList,
  DatasetListType,
  useDeleteService,
} from "@/apis/Service/service.thunk";
import { formatDateWithOptionalTime, getColorByRegion } from "@/utils";
import { useQueryClient } from "react-query";
import useModalStore from "@/store/useModalStore";

const StyledDeleteButton = styled.button`
  border: none;
  display: flex;
  padding: 4px;
  border-radius: 4px;
  margin: 0 auto;
  &:hover {
    background-color: #a8f0e680;
  }
`;

export const Detection = () => {
  const [district, setDistrict] = useState("ALL");
  const { data: serviceData } = getServiceList("detections");
  const { data: categoryData } = getCategoryList();
  const { showDeleteDataset, setShowDeleteDataset } = useModalStore();
  const [selectedService, setSelectedService] = useState<DatasetListType>();
  const navigate = useNavigate();
  const columnData: GridColDef[] = [
    {
      field: "name",
      align: "left",
      headerName: "이름",
      flex: 1,
      minWidth: 300,
      renderCell: (params: any) => {
        return (
          <div
            className="custom-cell"
            style={{
              borderLeft: `4px solid ${getColorByRegion(params.row.category)}`,
              paddingLeft: "12px",
              width: "100%",
              overflow: "hidden", // 넘친 내용 숨김
              whiteSpace: "nowrap", // 줄바꿈 방지
              textOverflow: "ellipsis", // 말줄임표
            }}
          >
            {params.value}
          </div>
        );
      },
    },
    {
      field: "description",
      align: "left",
      headerName: "설명",
      flex: 1,
      width: 300,
      renderCell: (params: any) => (params.value ? params.value : "-"),
    },
    {
      field: "",
      align: "center",
      headerName: "임계값",
      headerAlign: "center",
      width: 100,
      renderCell: (params) => {
        const threshold = params.row?.changeDetect.threshold;
        return threshold ? `${threshold}M` : "-";
      },
    },
    {
      field: "createDate",
      align: "center",
      headerAlign: "center",
      headerName: "생성일",
      width: 200,
      renderCell: (params) => formatDateWithOptionalTime(params.value, true),
    },
    {
      field: "size",
      align: "center",
      headerAlign: "center",
      headerName: "크기",
      width: 120,
    },
    {
      field: "actions",
      headerName: "삭제",
      align: "center",
      headerAlign: "center",
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <StyledDeleteButton
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowDeleteDataset(true, {
              type: "detections",
              datasetInfo: params.row,
            });
          }}
        >
          <img src={commonImage.iconDeleteOutlined} alt="icon" />
        </StyledDeleteButton>
      ),
    },
  ];
  const options = useMemo(() => {
    if (categoryData) {
      return [{ label: "전체", value: "ALL" }, ...categoryData];
    } else {
      return [];
    }
  }, [serviceData]);
  const { serviceList, totalSize, count } = useMemo(
    () => ({
      serviceList: serviceData?.services || [],
      totalSize: serviceData?.totalSize || "",
      count: serviceData?.count || 0,
    }),
    [serviceData]
  );
  return (
    <>
      <StyleHomeWrap>
        <StyledHomeTitle>
          <div className="area fill">
            <div className="box">
              <img src={commonImage.databaseTwotone} className="icon" />
              <div className="label">탐지결과 목록</div>
            </div>
          </div>
          <div className="area">
            <div className="box">
              <div className="label">총 파일 개수: </div>
              <span>{count}개</span>
            </div>
            <span className="line" />
            <div className="box">
              <div className="label">총 파일 크기: </div>
              <span>{totalSize}</span>
            </div>
          </div>
          <div className="area">
            <BasicSelect
              className="select"
              defaultValue={"ALL"}
              placeholder={district === "ALL" ? "전체" : district}
              options={options}
              width="208px"
              handleValue={setDistrict}
            />
          </div>
        </StyledHomeTitle>
        <StyleGridWrap>
          <GridList
            columns={columnData}
            rows={serviceList.filter((service) =>
              district === "ALL" ? true : service.category === district
            )}
            onRowClick={(params) => navigate(`/service/${params.id}`)}
            defaultSort={[{ field: "createDate", sort: "desc" }]}
          />
        </StyleGridWrap>
      </StyleHomeWrap>
    </>
  );
};
