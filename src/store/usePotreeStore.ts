//@ts-nocheck
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { logMiddleWare } from "@/store";

export interface ViewerType {
  potreeViewer: any;
  cesiumViewer: any;
}

export interface IndexViewerType {
  [index: number]: ViewerType;
}

// PotreeStoreInitial.ts
export const initialState = {
  SERVICE_ID: null,
  viewer: { potreeViewer: null, cesiumViewer: null },
  viewerList: {},
  editMode: true,
  potreeDorosee: undefined,
  coordinateReferenceSystem: "",
  viewers: undefined,
  targetViewers: undefined,
  clickViewer: null,
  allShapeSize: 3,
  isClipingMode: 1,
  properTires: undefined,
  properDataList: undefined,
  saveFeatures: null,
  changeShapeZ: 3,
  muuid: null,
  saveViewerJsonData: null,
  isControlPressed: false,
  saveMode: true,
  clickThisViewers: undefined,
  viewersTarget: undefined,
  transform: undefined,
  panoramaTarget: null,
  currentEditingProperty: null,
};

interface CommonState {
  SERVICE_ID: string | null;
  setServiceID: (SERVICE_ID: string) => void;
  viewer: ViewerType;
  setViewer: (viewer: Partial<ViewerType>) => void;
  viewerList: IndexViewerType;
  setViewerList: (viewerList: ViewerType, index: number) => void;
  resetViewerList: () => void;
  editMode: boolean;
  setEditMode: (editmode: boolean) => void;
  potreeDorosee: any;
  setPotreeDorosee: (potreeDorosee: any) => void;
  coordinateReferenceSystem: string;
  setCoordinateReferenceSystem: (coordinateReferenceSystem: string) => void;
  viewers: any;
  targetViewers: any;
  setSyncViewer: (viewers: any, targetViewers: any) => void;
  clickViewer: any;
  setClickThisViewer: (viewer: any) => void;
  allShapeSize: number;
  setAllShapeSize: (size: number) => void;
  isClipingMode: number;
  setIsClipingMode: (mode: number) => void;
  properTires: any;
  shpProperTires: (properTires: any) => void;
  properDataList: any;
  setProperDataList: (properDataList: any) => void;
  saveFeatures: any;
  setSaveFeatures: (saveFeature: any) => void;
  changeShapeZ: number;
  setChangeShapeZ: (changeShapeZ: number) => void;
  muuid: any;
  setMuuid: (muuid: any) => void;
  saveViewerJsonData: any;
  setSaveViewerJsonData: (data: any) => void;
  isControlPressed: boolean;
  setIsControlPressed: (isControlPressed: boolean) => void;
  saveMode: boolean;
  setSaveMode: (mode: boolean) => void;
  clickThisViewers: any;
  viewersTarget: any;
  topOnView: (clickThisViewers: any, viewersTarget: any) => void;
  transform: any;
  setTransform: (transform: any) => void;
  panoramaTarget: any;
  setPanoramaTarget: (panoramaTarget: any) => void;
  currentEditingProperty: any;
  setCurrentEditingProperty: (property: any) => void;
  resetPotreeStore: () => void;
}

export const usePotreeStore = create<CommonState>(
  persist(
    devtools(
      logMiddleWare(
        (set: any): CommonState => ({
          ...initialState,
          setServiceID: (SERVICE_ID: string) => set({ SERVICE_ID }),
          setViewer: async (viewer) =>
            set((state) => ({ viewer: { ...state.viewer, ...viewer } })),
          setViewerList: async (viewerList, index) =>
            set((state) => ({
              viewerList: { ...state.viewerList, [index]: viewerList },
            })),
          resetViewerList: () => set({ viewerList: {} }),
          setEditmode: async (editmode) => set({ editmode }),
          setPotreeDorosee: async (potreeDorosee) =>
            set({ potreeDorosee: potreeDorosee }),
          setCoordinateReferenceSystem: async (coordinateReferenceSystem) =>
            set({ coordinateReferenceSystem }),
          setNewFeature: async (newFeature) => set({ newFeature }),
          setSyncViewer: async (viewers, targetViewers) =>
            set({ viewers, targetViewers }),
          setClickThisViewer: async (clickViewer) => set({ clickViewer }),
          setAllShapeSize: async (allShapeSizes) => set({ allShapeSizes }),
          setIsClipingMode: async (isClipingMode) => set({ isClipingMode }),
          shpProperTires: async (properTires) => set({ properTires }),
          setProperDataList: async (properDataList) => set({ properDataList }),
          setSaveFeatures: async (saveFeatures) => set({ saveFeatures }),
          setChangeShapeZ: async (changeShapeZ) => set({ changeShapeZ }),
          setMuuid: async (muuid) => set({ muuid }),
          setSaveViewerJsonData: async (saveViewrJsonData) =>
            set({ saveViewrJsonData }),
          setAsdasd: async (asdasd) => set({ asdasd }),
          setIsControlPressed: async (isControlPressed) =>
            set({ isControlPressed }),
          setSaveMode: async (saveMode) => set({ saveMode }),
          topOnView: async (clickThisViewers, viewersTarget) =>
            set({ clickThisViewers, viewersTarget }),
          setTransform: async (transform) => set({ transform }),
          setPanoramaTarget: async (panoramaTarget) => set({ panoramaTarget }),
          setCurrentEditingProperty: (property) =>
            set({ currentEditingProperty: property }),
          resetPotreeStore: () => {
            set({ ...initialState });
          },
        }),
        { name: "PotreeStore" }
      )
    ),
    {
      name: "PotreeStore-storage", // Unique key for localStorage
      partialize: (state) => {
        // `properTires` 상태를 제외한 상태만 반환
        const {
          panoramaTarget,
          saveMode,
          isControlPressed,
          isClipingMode,
          properDataList,
          properTires,
          muuid,
          currentEditingProperty,
          saveFeatures,
          clickViewer,
          clickThisViewers,
          viewersTarget,
          editmode,
          transform,
          rlawnstn,
          ...rest
        } = state;
        return rest;
      },
    }
  )
);
