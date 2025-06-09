import { useNavigate } from "react-router-dom";
import { StyledGridList } from "./style";

import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRowsProp,
  GridSortModel,
} from "@mui/x-data-grid";

export interface ColumnDataType {
  key: string;
  name: string;
  align?: "left" | "center" | "right" | "inherit" | "justify";
}

export interface RowDataType {
  [key: string]: string;
}

interface GridListProps {
  columns: GridColDef[];
  rows: GridRowsProp;
  defaultSort?: GridSortModel;
  onRowClick?: GridEventListener<"rowClick">;
}

export const GridList = ({
  columns,
  rows,
  defaultSort,
  onRowClick,
}: GridListProps) => {
  const navigate = useNavigate();
  return (
    <StyledGridList>
      <DataGrid
        className="data-grid"
        rows={rows}
        columns={columns}
        columnHeaderHeight={40}
        rowHeight={40}
        disableColumnMenu
        disableAutosize
        disableRowSelectionOnClick
        hideFooter
        localeText={{ noRowsLabel: "데이터가 없습니다." }}
        // onRowClick={onRowClick}
        onRowDoubleClick={onRowClick}
        initialState={{ sorting: { sortModel: defaultSort } }}
        // disableColumnSorting
        getCellClassName={(params) => {
          const allColumns = params.api.getAllColumns();
          const lastColumnField = allColumns[allColumns.length - 1].field;
          return params.field === lastColumnField ? "last-column-cell" : "";
        }}
      />
    </StyledGridList>
  );
};
