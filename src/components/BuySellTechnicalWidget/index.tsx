"use client";
import { useEffect, useState } from "react";
import BuySellTab from "./BuySellTab";
import { getBuySellTechnicals } from "@/utils/utility";
import MarketTable from "../MarketTable";
import { useStateContext } from "@/store/StateContext";
import tableConfig from "@/utils/tableConfig.json";
import refeshConfig from "@/utils/refreshConfig.json";
import styles from "./BuySellTechnicalWidget.module.scss";
import { dateFormat } from "@/utils";
import { trackingEvent } from "@/utils/ga";
import HeadingHome from "../ViewAllLink/HeadingHome";

const macd_opts = [
  { label: "1D", value: "1d", id: 1 },
  { label: "1W", value: "1w", id: 2 },
];

const stochastic_opts = [{ label: "1W", value: "1w", id: 1 }];

const indicator_opts = [
  { label: "EMA5", value: "EMA5", id: 1 },
  { label: "EMA10", value: "EMA10", id: 2 },
  { label: "EMA14", value: "EMA14", id: 3 },
  { label: "EMA20", value: "EMA20", id: 4 },
  { label: "EMA50", value: "EMA50", id: 5 },
  { label: "EMA200", value: "EMA200", id: 6 },
];

const BuySellTechnicalWidget = ({ data, otherData, bodyParams }: any) => {
  const { state } = useStateContext();
  const { isPrime } = state.login;
  const { currentMarketStatus } = state.marketStatus;
  const [otherDataSet, setOtherDataSet] = useState(otherData);
  const [processingLoader, setProcessingLoader] = useState(false);
  const [dropDownOptions, setDropDownOptions] = useState(indicator_opts);
  const [dropDownValue, setDropDownValue] = useState({
    label: "EMA20",
    value: "EMA20",
  });
  const [payload, setPayload] = useState(bodyParams);
  const [tableData, setTableData] = useState(data);
  const [activeItem, setActiveItem] = useState(
    "bullish-moving-average-crossover",
  );

  const config = tableConfig["buySellTechnicals"];

  const onExchangeChange = (exchange: string) => {
    setProcessingLoader(true);
    trackingEvent("et_push_event", {
      event_category: "mercury_engagement",
      event_action: "exchange_filter_applied",
      event_label: exchange,
    });
    setPayload({ ...payload, exchange });
  };

  const onDropDownChange = (value: any, label: any) => {
    setProcessingLoader(true);
    setDropDownValue({
      label: label,
      value: value,
    });
    if (value == "1d" || value == "1w") {
      const period = value;
      setPayload({ ...payload, period });
    } else {
      const indicatorName = value;
      setPayload({ ...payload, indicatorName });
    }
  };

  const onTabClick = (item: any) => {
    setProcessingLoader(true);
    const { indicatorName, crossoverType, key } = item;
    setActiveItem(key);
    if (indicatorName == "MACD" || indicatorName == "STOCHASTIC") {
      const opts = indicatorName == "MACD" ? macd_opts : stochastic_opts;
      setDropDownOptions(opts);
      let period = payload?.period;
      if (!period || !opts.some((option) => option.value == period)) {
        setDropDownValue(opts[0]);
        period = opts[0].value;
      }
      setPayload({ ...payload, crossoverType, indicatorName, period });
    } else {
      delete payload.period;
      if (
        payload.indicatorName == "MACD" ||
        payload.indicatorName == "STOCHASTIC"
      ) {
        setDropDownOptions(indicator_opts);
        setDropDownValue({
          label: "EMA20",
          value: "EMA20",
        });
        setPayload({ ...payload, crossoverType, indicatorName });
      } else {
        setPayload({ ...payload, crossoverType });
      }
    }
  };

  const updateTableData = async () => {
    const { table, otherData } = await getBuySellTechnicals(payload);
    setTableData(table);
    setOtherDataSet(otherData);
    setProcessingLoader(false);
  };
  const tableHeaderData =
    (tableData && tableData.length && tableData[0] && tableData[0]?.data) || [];

  useEffect(() => {
    setProcessingLoader(true);
    updateTableData();
  }, [payload]);

  return (
    <div className="sectionWrapper">
      <HeadingHome
        title="Technical Signals"
        url="/stocks/marketstats-technicals/golden-cross"
      />
      <div className="prel">
        <BuySellTab
          activeItem={activeItem}
          payload={payload}
          dropDownOptions={dropDownOptions}
          dropDownValue={dropDownValue}
          handleExchange={onExchangeChange}
          handleDropDown={onDropDownChange}
          tabClick={onTabClick}
          dropDownChangeHandler={onDropDownChange}
        />

        <MarketTable
          highlightLtp={
            !!currentMarketStatus && currentMarketStatus != "CLOSED"
          }
          data={tableData}
          tableHeaders={tableHeaderData}
          tableConfig={config}
          isprimeuser={isPrime}
          processingLoader={processingLoader}
          l1NavTracking="Markets"
          l2NavTracking="Buy/Sell"
          l3NavTracking={activeItem}
        />
        <div className={styles.helpTxt}>
          <span className={styles.note}>
            <strong>*Note:</strong>
          </span>
          <span>
            {` ${payload.crossoverType == "Bullish" ? "Gain" : "Decline"}%
            is the average price movement within ${otherDataSet.gainLossDays} of signal in last ${otherDataSet.gainLossYears}`}
          </span>
          {/* <span>
            {dateFormat(otherDataSet.unixDateTime, "* Formed On %MMM %d, %Y")}
          </span> */}
        </div>
      </div>
    </div>
  );
};

export default BuySellTechnicalWidget;
