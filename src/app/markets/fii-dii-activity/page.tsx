import { getDaywiseActivityData } from "@/utils/utility";
import FiiDiiTabs from "@/components/FIIDII/Tabs";
import FiiDiiHeader from "@/components/FIIDII/Header";
import FiiDiiActivityOverviewTable from "@/components/FIIDII/OverviewTables";

const FiiDiiActivity = async () => {
  const response: any = await getDaywiseActivityData();
  const { listFiiDiiDaywiseActivityData } =
    response.datainfo.fiiDiiDaywiseActivity;
  const dataWithNiftySensex: any = [];
  const otherData: any = [];
  listFiiDiiDaywiseActivityData.forEach((data: any) => {
    const { dateLong, dateStr, nifty, sensex, ...rest } = data;

    dataWithNiftySensex.push({ dateLong, dateStr, nifty, sensex });
    otherData.push(rest);
  });

  return (
    <>
      <FiiDiiHeader />
      <FiiDiiTabs activeTab="overview" />
      <FiiDiiActivityOverviewTable
        dataWithNiftySensex={dataWithNiftySensex}
        otherData={otherData}
      />
    </>
  );
};

export default FiiDiiActivity;
