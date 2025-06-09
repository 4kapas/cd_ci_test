import { DatasetListType } from "@/apis/Service/service.thunk";
import { DatasetType } from "@/types";
import { create } from "zustand";

interface ModalStoreType {
  showChangeDetector: boolean;
  showDeleteDataset: {
    open: boolean;
    type: "detections" | "datasets" | null;
    datasetInfo: DatasetType | null;
  };
  showReportExport: {
    open: boolean;
    filename: string | null;
    datasetInfo: DatasetType | null;
  };
  showUploadDataset: boolean;
  setShowChangeDetector: (visible: boolean) => void;
  setShowDeleteDataset: (
    visible: boolean,
    props?: {
      type: "detections" | "datasets" | null;
      datasetInfo: DatasetType | null;
    }
  ) => void;
  setShowReportExport: (
    visible: boolean,
    prop?: {
      filename: string | null;
      datasetInfo: DatasetType | null;
    }
  ) => void;
  setShowUploadDataset: (visible: boolean) => void;
}

const useModalStore = create<ModalStoreType>((set) => ({
  showChangeDetector: false,
  showDeleteDataset: { open: false, type: null, datasetInfo: null },
  showReportExport: {
    open: false,
    filename: null,
    datasetInfo: null,
  },
  showUploadDataset: false,
  setShowChangeDetector: (visible: boolean) => {
    set({ showChangeDetector: visible });
  },
  setShowDeleteDataset: (
    visible: boolean,
    prop?: {
      type: "detections" | "datasets" | null;
      datasetInfo: DatasetType | null;
    }
  ) => {
    set((state) => {
      return {
        showDeleteDataset: {
          ...state.showDeleteDataset,
          ...(prop || {
            type: null,
            datasetInfo: null,
          }),
          open: visible,
        },
      };
    });
  },
  setShowReportExport: (
    visible: boolean,
    prop?: {
      filename: string | null;
      datasetInfo: DatasetType | null;
    }
  ) => {
    set((state) => {
      return {
        showReportExport: {
          ...state.showReportExport,
          ...(prop || {
            filename: null,
            datasetInfo: null,
          }),
          open: visible,
        },
      };
    });
  },
  setShowUploadDataset: (visible: boolean) => {
    set({ showUploadDataset: visible });
  },
}));

export default useModalStore;
