//@ts-nocheck
import { Layout } from "@/component";
import { Dataset } from "@/container";
import { usePotreeStore } from "@/store/usePotreeStore";
import { useEffect } from "react";

const DatasetPage = () => {
  useEffect(() => {
    usePotreeStore.getState().setSaveViewerJsonData("");
    usePotreeStore.getState().setChangeShapeZ(3);
  }, []);

  return (
    <Layout visibleNav visibleFooter>
      <Dataset />
    </Layout>
  );
};

export default DatasetPage;
