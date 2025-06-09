import { useMutation, useQuery, UseQueryResult } from "react-query";
import { ServiceAPI } from "./service.api";
import { DatasetType } from "@/types";

export interface DatasetListType extends DatasetType {
  id: string;
  size: string;
  createDate: string;
}

export interface CategoryDataType {
  label: string;
  value: string;
}

export interface UploadServiceFormType {
  lasFile: File | null;
  name: string;
  description: string;
  coord: string;
  acqType: string;
  acqDate: string;
  socketID: string;
}

export interface ExcuteChangeDetectionFormType {
  baseID: string;
  targetID: string;
  socketID: string;
  threshold: string;
  description: string;
}

export interface GetServiceListResponseType {
  services: DatasetListType[];
  count: number;
  totalSize: string;
}

export const getServiceList = (
  source: "datasets" | "detections" = "datasets"
): UseQueryResult<GetServiceListResponseType> => {
  return useQuery({
    queryKey: ["service-list", source],
    queryFn: ServiceAPI._getServiceList,
  });
};

export const getCategoryList = (): UseQueryResult<CategoryDataType[]> => {
  return useQuery({
    queryKey: "category-list",
    queryFn: ServiceAPI._getCategoryList,
  });
};

export const useChangeDetectionMutation = () => {
  return useMutation((form: ExcuteChangeDetectionFormType) =>
    ServiceAPI._excuteChangeDetection(form)
  );
};

export const useDeleteService = () => {
  return useMutation((serviceId: string) =>
    ServiceAPI._deleteService(serviceId)
  );
};

export const useUploadService = () => {
  return useMutation((form: UploadServiceFormType) =>
    ServiceAPI._uploadService(form)
  );
};
