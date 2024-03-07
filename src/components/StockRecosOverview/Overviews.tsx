import React from "react";
import SlickSlider from "../SlickSlider";
import StockReco from "../StockReco";
import styles from "./StockRecosOverview.module.scss";
interface Props {
  data: any;
}
const Overview: React.FC<Props> = ({ data }) => {
  // console.log("activeTab --- > ", data);
  const responsive = [
    {
      breakpoint: 1921,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1601,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1361,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ];
  return (
    <>
      {data.map((obj: any, index: any) => (
        <div key={`"overView"${index} `} className={styles.overviewMain}>
          <h2 className={styles.title} key={index}>
            {obj.name}
          </h2>
          <SlickSlider
            slides={obj.data?.map((card: any, index: any) => ({
              content: (
                <StockReco data={card} key={index} activeTab={data.type} />
              ),
            }))}
            key={`slider${obj.type}`}
            sliderId={`slider${obj.type}`}
            slidesToShow={3}
            slidesToScroll={1}
            rows={1}
            responsive={responsive}
          />
        </div>
      ))}
    </>
  );
};
export default Overview;
