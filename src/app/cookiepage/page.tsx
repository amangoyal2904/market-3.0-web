import { cookies } from "next/headers";
const CookiePage = () => {
  const cookieStore = cookies();
  const ssoid: any = cookieStore.get("ssoid");
  const PrintCookies = () => {
    return cookieStore.getAll().map((cookie: any, index: number) => (
      <div key={index}>
        <p>Name: {cookie.name}</p>
        <p>Value: {cookie.value}</p>
      </div>
    ));
  };
  return (
    <>
      <h1>SSOID: {ssoid}</h1>
      {PrintCookies()}
    </>
  );
};

export default CookiePage;
