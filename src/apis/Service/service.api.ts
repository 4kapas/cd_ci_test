import { DatasetType } from "@/types";
import { QueryFunctionContext } from "react-query";
import { instance } from "../../services/AxiosApiService";
import {
  ExcuteChangeDetectionFormType,
  GetServiceListResponseType,
  UploadServiceFormType,
} from "./service.thunk";

interface ResponseType {
  code: number;
  isSuccess: boolean;
  message: string;
  results: any;
}

interface UploadServiceResponseType extends ResponseType {}

interface ExcuteChangeDetectionResponseType extends ResponseType {
  results: DatasetType;
}

export class ServiceAPI {
  constructor() {}

  /**
   * Service List 조회
   * @returns
   */
  static _getServiceList = async (
    context: QueryFunctionContext<[string, "datasets" | "detections"]>
  ): Promise<GetServiceListResponseType> => {
    const [, source] = context.queryKey;
    return await instance
      .get("/service/list", {
        params: { type: source || "dataset" },
      })
      .then((res) => res.data.results);
  };

  /**
   * Service Detail 조회
   * @param {params}
   * @returns
   */
  static _getServiceInfo = async (serviceId: string): Promise<DatasetType> => {
    return await instance
      .get(`/service/info/${serviceId}`)
      .then((res) => res.data.results)
      .catch((e) => e);
  };

  /**
   * Service 삭제
   * @param {params}
   * @returns
   */
  static _deleteService = async (serviceId: string): Promise<DatasetType> => {
    return await instance
      .delete(`/service/delete/${serviceId}`)
      .then((res) => res.data)
      .catch((e) => e);
  };

  /**
   * Category 목록 조회
   * @returns
   */
  static _getCategoryList = async () => {
    return await instance
      .get("/category")
      .then((res) => res.data.results)
      .catch((e) => e);
  };

  static _excuteChangeDetection = async (
    form: ExcuteChangeDetectionFormType
  ): Promise<ExcuteChangeDetectionResponseType> => {
    return await instance
      .post("/change-detector", form)
      .then((res) => res.data)
      .catch((e) => e);
  };

  static _uploadService = async (
    form: UploadServiceFormType
  ): Promise<UploadServiceResponseType> => {
    const formData = new FormData();
    if (form.lasFile) {
      formData.append("lasFile", form.lasFile);
    } else {
      throw new Error("LAS 파일이 선택되지 않았습니다.");
    }
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("coord", form.coord);
    formData.append("acqType", form.acqType);
    formData.append("acqDate", form.acqDate);
    formData.append("socketID", form.socketID);

    return await instance.post("/service/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };
}
