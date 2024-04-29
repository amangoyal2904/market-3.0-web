import FiiDiiHeader from "@/components/FIIDII/Header";
import FiiDiiOtherTable from "@/components/FIIDII/OtherTable";
import FiiDiiTabs from "@/components/FIIDII/Tabs";
import { getMfCashData } from "@/utils/utility";

const MFCash = async () => {
  const response: any = await getMfCashData("daily");
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
      <FiiDiiTabs activeTab="mf-cash" />
      <FiiDiiOtherTable
        headerTxt="Mutual Fund Buy-Sell Activity"
        fixedData={fixedData}
        otherData={otherData}
        metadataMapping={metadataMapping}
      />
    </>
  );
};

export default MFCash;
