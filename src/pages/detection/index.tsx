//@ts-nocheck
import { Layout } from "@/component";
import { Detection } from "@/container/Detection";
import { usePotreeStore } from "@/store/usePotreeStore";
import { useEffect } from "react";

const DetectionPage = () => {
  return (
    <Layout visibleNav visibleFooter>
      <Detection />
    </Layout>
  );
};

export default DetectionPage;
