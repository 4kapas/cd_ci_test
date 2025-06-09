import { AlertModal, BasicModal } from "@/component";
import { StyledReportExportModal } from "./style";
import useModalStore from "@/store/useModalStore";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ReportService } from "@/application/Potree/ReportService";

export const ReportExportModal = () => {
  const { showReportExport, setShowReportExport } = useModalStore();
  const { filename, datasetInfo } = showReportExport;
  const [form, setForm] = useState({
    author: "",
    filename: filename || "",
  });
  const isActive = useMemo(() => form.author && form.filename, [form]);

  const handleConfirm = () => {
    if (datasetInfo) {
      const report = new ReportService({
        ...form,
        datasetInfo,
      });
      report.generate();
    }
  };

  const handleAuthor = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm({ ...form, author: value });
  };

  const handleFilename = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm({ ...form, filename: value });
  };

  useEffect(() => {
    if (filename) setForm({ ...form, filename });
  }, [filename]);

  if (!datasetInfo) return null;
  return (
    <BasicModal
      title="변화탐지 보고서 생성"
      open={showReportExport.open}
      setOpen={setShowReportExport}
      width="420px"
      height="auto"
      option={{
        enabledBodyPadding: true,
        disableBackdropClick: true,
      }}
    >
      <StyledReportExportModal>
        <div className="body">
          <div className="field required">
            <div className="label">파일명</div>
            <div className="value">
              <input
                type="text"
                placeholder="파일명을 입력하세요."
                value={form.filename}
                min={0}
                max={100}
                onChange={handleFilename}
              />
            </div>
          </div>
          <div className="field required">
            <div className="label">작성자</div>
            <div className="value">
              <input
                autoFocus
                type="text"
                placeholder="작성자명을 입력하세요."
                value={form.author}
                min={0}
                max={100}
                onChange={handleAuthor}
              />
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="message">
            <p>{""}</p>
          </div>{" "}
          <button className="prev" onClick={() => setShowReportExport(false)}>
            취소
          </button>
          <button disabled={!isActive} onClick={handleConfirm}>
            생성
          </button>
        </div>
      </StyledReportExportModal>
    </BasicModal>
  );
};
