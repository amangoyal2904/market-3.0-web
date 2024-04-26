import { getDaywiseActivityData } from "@/utils/utility";
import FiiDiiActivityClient from "./client";

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
    <FiiDiiActivityClient
      dataWithNiftySensex={dataWithNiftySensex}
      otherData={otherData}
    />
  );
};

export default FiiDiiActivity;
