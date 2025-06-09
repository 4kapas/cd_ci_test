import { useMemo, useState } from "react";
//component
import { BasicSelect } from "@/component";
//style
import { commonImage } from "@/consts/image";

import {
  DatasetListType,
  getCategoryList,
  getServiceList,
} from "@/apis/Service/service.thunk";
import { GridList } from "@/component/DataGrid";
import useModalStore from "@/store/useModalStore";
import { formatDateWithOptionalTime, getColorByRegion } from "@/utils";
import { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { StyleGridWrap, StyleHomeWrap, StyledHomeTitle } from "./style";
import UploadFileIcon from "@mui/icons-material/UploadFile";

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

export const Dataset = () => {
  const [district, setDistrict] = useState("ALL");
  const { data: serviceData } = getServiceList("datasets");
  const { data: categoryData } = getCategoryList();
  const { setShowDeleteDataset, setShowUploadDataset } = useModalStore();
  const navigate = useNavigate();

  const columnData: GridColDef[] = [
    {
      // sortable: true,
      field: "name",
      headerAlign: "left",
      align: "left",
      headerName: "이름",
      flex: 1,
      minWidth: 300,
      renderCell: (params) => {
        return (
          <div
            className="custom-cell"
            style={{
              borderLeft: `4px solid ${getColorByRegion(params.row.category)}`,
              paddingLeft: "12px",
              width: "100%",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {params.value}
          </div>
        );
      },
    },
    {
      // sortable: true,
      field: "address",
      headerAlign: "left",
      align: "left",
      headerName: "주소",
      width: 300,
      renderCell: (params: any) => (params.value ? params.value : "-"),
    },
    {
      // sortable: true,
      field: "acqType",
      headerAlign: "center",
      align: "center",
      headerName: "촬영방식",
      width: 120,
      renderCell: (params: any) => (params.value ? params.value : "-"),
    },
    {
      // sortable: true,
      field: "acqDate",
      headerAlign: "center",
      align: "center",
      headerName: "촬영연도",
      width: 120,
      renderCell: (params: any) => (params.value ? params.value : "-"),
    },
    {
      // sortable: true,
      field: "createDate",
      headerAlign: "center",
      align: "center",
      headerName: "생성일",
      width: 200,
      renderCell: (params) => formatDateWithOptionalTime(params.value, true),
    },
    {
      // sortable: true,
      field: "size",
      headerAlign: "center",
      align: "center",
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
              type: "datasets",
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
              <div className="label">데이터셋 목록</div>
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
            <div className="box">
              <button onClick={() => setShowUploadDataset(true)}>
                <UploadFileIcon sx={{ fontSize: 22 }} />
              </button>
            </div>
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
