import Link from "next/link";
import { cookies } from "next/headers";
const MarketPage = () => {
  const cookieStore = cookies();
  const PrintCookies = () => {
    return cookieStore.getAll().map((cookie: any) => (
      <div key={cookie.name}>
        <p>Name: {cookie.name}</p>
        <p>Value: {cookie.value}</p>
      </div>
    ));
  };
  return (
    <>
      Hello i m Market pages
      <br />
      {PrintCookies()}
      <br />
      <Link href="/markets/stock-screener">Go to Stock Scrnner page</Link>
    </>
  );
};

export default MarketPage;
