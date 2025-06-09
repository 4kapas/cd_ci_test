// base
import { useRef } from "react";
// libraries
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from "@mui/material";
//style
import { StyledHomeTable, StyledPagination } from "./style";

export const HomeTable = ({
  columns,
  dataSource,
  onRowClick,
  pageInfo,
}: {
  columns?: any;
  dataSource?: any;
  onRowClick?: any;
  pageInfo?: any;
}) => {
  const tableRef = useRef(null);

  const {
    currentPage,
    rowsPerPage,
    totalElements,
    totalPages,
    handlePageChange,
    handlePerPageChange,
  } = pageInfo;

  const handleClickRow = (record: any) => {
    if (!onRowClick) return;
    onRowClick(record);
  };

  const handleChangePage = (newPage: number) => {
    handlePageChange(newPage);
  };

  return (
    <StyledHomeTable>
      <TableContainer ref={tableRef}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column: any, index: number) => {
                return (
                  <TableCell
                    key={index}
                    style={{
                      minWidth: column.minWidth,
                      width: column.minWidth,
                      maxWidth: column.maxWidth,
                    }}
                  >
                    {column.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataSource?.length > 0 ? (
              dataSource.map((row: any, index: number) => {
                return (
                  <TableRow
                    hover
                    role="radio"
                    tabIndex={-1}
                    key={index}
                    onClick={() => handleClickRow(row)}
                    style={{ cursor: "pointer" }}
                  >
                    {columns.map((column: any) =>
                      column.render ? (
                        <TableCell key={column.id}>
                          {column.render(row[column.id], row)}
                        </TableCell>
                      ) : (
                        <TableCell key={column.id}>{row[column.id]}</TableCell>
                      )
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>Data Not Found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <StyledPagination>
        <Pagination
          count={totalPages}
          page={currentPage + 1}
          onChange={(event, newPage) => handleChangePage(newPage - 1)}
          shape="rounded"
        />
      </StyledPagination>
    </StyledHomeTable>
  );
};
