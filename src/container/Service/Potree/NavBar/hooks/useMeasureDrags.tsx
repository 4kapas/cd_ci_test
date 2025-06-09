type Point = {
  position: {
    x: number;
    y: number;
    z: number;
    copy: (pos: { x: number; y: number; z: number }) => void;
  };
};

type Measure = {
  points: Point[];
};

type Viewer = {
  inputHandler: {
    getMousePointCloudIntersection: () => {
      location: { x: number; y: number; z: number };
    } | null;
  };
  renderer: {
    domElement: HTMLElement;
  };
};

export const measureDrags = (
  viewer: Viewer,
  measure: Measure,
  enableDragging: boolean = true // Default to true if not provided
) => {
  let isDragging = false;
  let selectedPoint: Point | null = null;

  const handleMouseDown = (event: MouseEvent) => {
    if (!enableDragging) return; // 드래그가 비활성화된 경우 이벤트 무시
    if (event.button !== 0) return;
    const intersection = viewer.inputHandler.getMousePointCloudIntersection();
    if (!intersection) {
      console.log("No intersection found");
      return;
    }
    intersection.location.z = 0;
    const { x, y } = intersection.location;
    const tolerance = 2;

    measure.points.forEach((point: Point) => {
      if (
        Math.abs(point.position.x - x) <= tolerance &&
        Math.abs(point.position.y - y) <= tolerance
      ) {
        isDragging = true;
        selectedPoint = point;
      }
    });
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!enableDragging) return; // 드래그가 비활성화된 경우 이벤트 무시
    if (!isDragging || !selectedPoint) return;
    const intersection = viewer.inputHandler.getMousePointCloudIntersection();
    if (!intersection) return;
    intersection.location.z = 0;
    selectedPoint.position.copy({
      x: intersection.location.x,
      y: intersection.location.y,
      z: 0, // Keep Z coordinate at 0
    });

    // Apply changes to viewer if necessary
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (!enableDragging) return; // 드래그가 비활성화된 경우 이벤트 무시
    if (event.button !== 0) return;
    isDragging = false;
    selectedPoint = null;
  };

  const domElement = viewer.renderer.domElement;

  // 항상 이벤트 리스너 추가
  domElement.addEventListener("mousedown", handleMouseDown);
  domElement.addEventListener("mousemove", handleMouseMove);
  domElement.addEventListener("mouseup", handleMouseUp);

  if (!enableDragging) {
    domElement.removeEventListener("mousedown", handleMouseDown);
    domElement.removeEventListener("mousemove", handleMouseMove);
    domElement.removeEventListener("mouseup", handleMouseUp);
  }

  // Return a function to clean up event listeners
  return () => {
    domElement.removeEventListener("mousedown", handleMouseDown);
    domElement.removeEventListener("mousemove", handleMouseMove);
    domElement.removeEventListener("mouseup", handleMouseUp);
  };
};
