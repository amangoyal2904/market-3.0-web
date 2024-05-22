import Link from "next/link";
const MarketPage = () => {
  return (
    <>
      <Link title="Markets" className="default-btn" href="/markets">
        Markets
      </Link>
      <Link
        title="Go to Stock Screener"
        className="default-btn"
        href="/markets/stock-screener"
      >
        Go to Stock Screener
      </Link>
    </>
  );
};

export default MarketPage;
