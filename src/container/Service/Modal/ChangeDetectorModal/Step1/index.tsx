import {
  DatasetListType,
  ExcuteChangeDetectionFormType,
} from "@/apis/Service/service.thunk";
import useModalStore from "@/store/useModalStore";
import { DatasetType } from "@/types";
import { isFileSizeOverLimit } from "@/utils";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { StyledChangeDetectorStep1 } from "./style";

interface HeaderListType {
  key: keyof DatasetListType;
  name: string;
  align?: "left" | "center" | "right" | "inherit" | "justify";
}

interface ChangeDetectorStep1Props {
  SERVICE_ID: string;
  serviceInfo: DatasetType | undefined;
  serviceList: DatasetListType[];
  requestBody: ExcuteChangeDetectionFormType;
  handleNext: () => void;
  handleRequestBody: (form: Partial<ExcuteChangeDetectionFormType>) => void;
}

export const ChangeDetectorStep1 = ({
  SERVICE_ID,
  serviceInfo,
  serviceList,
  requestBody,
  handleNext,
  handleRequestBody,
}: ChangeDetectorStep1Props) => {
  const [message, setMessage] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const headerList: HeaderListType[] = [
    { key: "name", name: "파일명", align: "left" },
    { key: "description", name: "설명", align: "left" },
    { key: "address", name: "주소", align: "left" },
    { key: "acqDate", name: "촬영연도", align: "center" },
    { key: "size", name: "용량", align: "center" },
    { key: "createDate", name: "등록일", align: "center" },
  ];
  const handleSelectService = (service: DatasetListType) => {
    if (isFileSizeOverLimit(service.size, "20GB")) {
      setMessage("20GB 이하의 LAS 파일만 선택할 수 있습니다.");
      handleRequestBody({ targetID: "" });
      return;
    }
    setMessage(null);
    handleRequestBody({ targetID: service.id });
  };

  useEffect(() => {
    setIsActive(requestBody.targetID === "" ? false : true);
  }, [requestBody.targetID]);

  return (
    <StyledChangeDetectorStep1>
      <div className="main">
        {serviceList.length > 0 && (
          <TableContainer
            className="table-container"
            // sx={{ overflowX: "hidden" }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {headerList.map((header) => (
                    <TableCell key={header.key} align="center">
                      {header.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {serviceList
                  .filter((service) => service.id !== SERVICE_ID)
                  .map((row: DatasetListType, rid) => (
                    <TableRow
                      key={rid}
                      onClick={() => handleSelectService(row)}
                      className={`
                        ${requestBody.targetID === row.id ? "selected" : ""}
                      ${
                        row.address === serviceInfo?.address
                          ? "highlight-region"
                          : ""
                      }
                        `}
                    >
                      {headerList.map((header, hid) => {
                        const value = row[header.key];
                        return (
                          <TableCell align={header.align} key={`${rid}-${hid}`}>
                            {typeof value === "string" ? value : "-"}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      <div className="footer">
        <div className="message">
          <p>{message}</p>
        </div>
        <button disabled={!isActive} onClick={() => isActive && handleNext()}>
          다음
        </button>
      </div>
    </StyledChangeDetectorStep1>
  );
};
