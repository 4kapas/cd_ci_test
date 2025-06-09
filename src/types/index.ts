export * from "./notification.type";
export * from "./board.type";

export interface IndexObjectType {
  [key: string]: any;
}

export interface OptionType {
  label: string;
  value: string;
}

export interface DatasetType {
  id: string;
  name: string;
  description: string;
  category: string;
  coord: string;
  address: string;
  acqType: string;
  acqDate: string;
  pointCloudURL: string[];
  shapesURL: ShapesURLType[] | null;
  panoramaURL: string[] | null;
  changeDetect?: {
    threshold: number;
    base: {
      id: string;
      name: string;
      address: string;
      acqDate: string;
    };
    target: {
      id: string;
      name: string;
      address: string;
      acqDate: string;
    };
  };
}

export interface ShapesURLType {
  coord: string;
  name: string;
  shpArray: {
    name: string;
    shpURL: string;
    dbfURL: string;
  }[];
}
