import styles from "./Livestream.module.scss";
import SlickSlider from "../SlickSlider";
import { LiveStreamCards } from "./LiveStreamCards";

const LiveStreamSlider = ({ liveStreamData }: any) => {
  const responsive = [
    {
      breakpoint: 2560,
      settings: {
        slidesToShow: 6,
      },
    },
    {
      breakpoint: 1921,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 1601,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 1361,
      settings: {
        slidesToShow: 4,
      },
    },
  ];
  return liveStreamData?.length ? (
    <div className={styles.liveStreamWrapper}>
      <SlickSlider
        slides={liveStreamData?.map((slides: any, index: any) => ({
          content: <LiveStreamCards data={slides} index={index} />,
        }))}
        key={`liveStreamSlider}`}
        sliderId={`slider-liveStream`}
        slidesToShow={5}
        slidesToScroll={1}
        rows={1}
        topSpaceClass="liveStream"
        responsive={responsive}
      />
    </div>
  ) : (
    ""
  );
};

export default LiveStreamSlider;
