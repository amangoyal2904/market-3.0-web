import FiiDiiHeader from "@/components/FIIDII/Header";
import FiiDiiOtherTable from "@/components/FIIDII/OtherTable";
import FiiDiiTabs from "@/components/FIIDII/Tabs";
import { getFandOCashData } from "@/utils/utility";

const FiiFnO = async () => {
  const response: any = await getFandOCashData("daily", "index");
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
      <FiiDiiTabs activeTab="fii-fno" />
      <FiiDiiOtherTable
        headerTxt="FII F&O Buy-Sell Activity"
        fixedData={fixedData}
        otherData={otherData}
        metadataMapping={metadataMapping}
      />
    </>
  );
};

export default FiiFnO;
