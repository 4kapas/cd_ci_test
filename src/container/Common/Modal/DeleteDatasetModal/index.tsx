import { useDeleteService } from "@/apis/Service/service.thunk";
import { AlertModal } from "@/component";
import useLoadingStore from "@/store/useLoadingStore";
import useModalStore from "@/store/useModalStore";
import { useQueryClient } from "react-query";
import { StyledDeleteDatasetModal } from "./style";

export const DeleteDatasetModal = () => {
  const { mutate } = useDeleteService();
  const queryClient = useQueryClient();
  const { startLoading, stopLoading } = useLoadingStore();
  const { showDeleteDataset, setShowDeleteDataset } = useModalStore();
  const { type, datasetInfo } = showDeleteDataset;

  const handleConfirm = () => {
    if (datasetInfo) {
      startLoading();
      mutate(datasetInfo.id, {
        onSuccess: async () => {
          await queryClient.invalidateQueries(["service-list", type]);
          stopLoading();
          setShowDeleteDataset(false);
        },
        onError: () => {
          stopLoading();
          setShowDeleteDataset(false);
        },
      });
    }
  };

  if (!datasetInfo) return null;
  return (
    <AlertModal
      title="삭제"
      open={showDeleteDataset.open}
      setOpen={setShowDeleteDataset}
      handleConfirm={handleConfirm}
      type="confirm"
      buttonTitle="삭제"
    >
      <StyledDeleteDatasetModal>
        <p>
          <span>[{datasetInfo.name}]</span>
          데이터셋을 삭제하시겠습니까?
        </p>
      </StyledDeleteDatasetModal>
    </AlertModal>
  );
};
