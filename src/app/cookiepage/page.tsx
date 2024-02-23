import { cookies } from "next/headers";

const CookiePage = () => {
  const cookieStore = cookies();
  return (
    <>
      <h1>Cookies Page</h1>
      {cookieStore.getAll().map((cookie) => (
        <div key={cookie.name}>
          <p>Name: {cookie.name}</p>
          <p>Value: {cookie.value}</p>
          <hr />
        </div>
      ))}
    </>
  );
};

export default CookiePage;
