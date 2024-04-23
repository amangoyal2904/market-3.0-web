import { getAllIndices } from "@/utils/utility";
import { Metadata } from "next";
import IndicesClient from "./client";
import tableConfig from "@/utils/tableConfig.json";

export const metadata: Metadata = {
  title: "Indices",
  description: "Indices",
};

const Indices = async () => {
  const { tableHeaderData, tableData, exchange } = await getAllIndices(
    "nse",
    "",
    "DESC",
  );

  return (
    <IndicesClient
      tableHeaderData={tableHeaderData}
      tableData={tableData}
      exchange="nse"
      tableConfig={tableConfig["indicesListing"]}
    />
  );
};

export default Indices;
