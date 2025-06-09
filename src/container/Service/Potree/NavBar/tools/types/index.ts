interface Point {
  x: number;
  y: number;
  z: number;
}

interface VolumeDatas {
  uuid: string;
  position: Point;
  name: string;
}

interface AnnotationDatas {
  uuid: string;
  position: Point;
  _title: string;
  _description: string;
}

export interface IPropsAnnotationTool {
  annotationTool: AnnotationDatas[];
  clickedAnnotationId: null;
  isClickHandler: (
    Id: string,
    position: Point,
    data: any,
    name: string
  ) => React.MouseEventHandler<HTMLDivElement> | undefined;
  sceneDelect: (
    idx: number,
    type: string,
    id: string
  ) => React.MouseEventHandler<HTMLButtonElement>;
  sceneRef: React.MutableRefObject<null>;
}

export interface IPropsVolumeTool {
  volumeTool: VolumeDatas[];
  clickedVolumId: null;
  isClickHandler: (
    Id: string,
    position: Point,
    data: any,
    name?: string
  ) => (e: any) => void;
  sceneDelect: (
    idx: number,
    type: string,
    id: string
  ) => React.MouseEventHandler<HTMLButtonElement>;
  DISTRICT_OPTIONS: {
    value: string;
    label: string;
  }[];
  area: string | undefined;
}
