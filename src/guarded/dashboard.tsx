import InputLongLink from "../components/shortenInput/input";
const Dashboard = () => {

  return (
    <div className="flex flex-col items-center mt-12 ml-4">
      <h1 className="self-start md:self-center text-2xl font-bold pl-4">
        Welcome,
      </h1>
      <InputLongLink text="Shorten a link" />{" "}
    </div>
  );
};

export default Dashboard;
