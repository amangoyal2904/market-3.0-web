import FiiDiiHeader from "@/components/FIIDII/Header";
import FiiDiiOtherTable from "@/components/FIIDII/OtherTable";
import FiiDiiTabs from "@/components/FIIDII/Tabs";
import { getCashData } from "@/utils/utility";

const CashProvisional = async () => {
  const response: any = await getCashData("daily");
  const { listData, metadataMapping } = response.datainfo.data;
  const fixedData: any = [];
  const otherData: any = [];
  listData.forEach((data: any) => {
    const { dateLong, datelable, dateStr, ...rest } = data;
    fixedData.push({ dateLong, datelable, dateStr });
    otherData.push(rest);
  });
  return (
    <>
      <FiiDiiHeader />
      <FiiDiiTabs activeTab="cash-provisional" />
      <FiiDiiOtherTable
        headerTxt="FII & DII Buy-Sell Activity"
        fixedData={fixedData}
        otherData={otherData}
        metadataMapping={metadataMapping}
      />
    </>
  );
};

export default CashProvisional;
