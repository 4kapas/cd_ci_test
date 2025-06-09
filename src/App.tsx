import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import { ToastContainer } from "react-toastify";

import { routes } from "./routes";

// default theme (프로젝트 전반 style)
import { themeOptions } from "@/styles/theme";
import { ThemeProvider } from "@mui/material/styles";
import { LoadingBar } from "./component/LoadingBar";
import "./index.css";
import { ReportExportModal } from "./container/Common/Modal/ReportExportModal";
import { DeleteDatasetModal } from "./container/Common/Modal/DeleteDatasetModal";
import { UploadDatasetModal } from "./container/Common/Modal/UploadDatasetModal";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={themeOptions}>
        <ToastContainer />
        <LoadingBar />
        <Suspense fallback={""}>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/dataset" replace />} />
              {routes.common.map((item, index) => (
                <Route
                  key={index}
                  path={item.path}
                  Component={item.component}
                />
              ))}
            </Routes>
            <ReportExportModal />
            <DeleteDatasetModal />
            <UploadDatasetModal />
          </HashRouter>
        </Suspense>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
