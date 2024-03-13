import { useState } from "react";
import { useNavigate } from "react-router-dom";
const NotFound: React.FC = () => {
  const [count, setCount] = useState(5);
  const [seconds, setSeconds] = useState("seconds");

  const Redirect: React.FC = () => {
    const navigate = useNavigate();
    setTimeout(() => {
      navigate("/");
      location.href ="/";
    }, 4000);

    setInterval(() => {
      setCount(count - 1);
    }, 1000);

    if (count === 1) {
      setSeconds("second");
    }

    return (
      <div className="mt-5 w-[350px] text-center">
        <p>
          Redirecting to Cuttr in {count} {seconds}...
        </p>
      </div>
    );
  };
  return (
    <div className="h-screen flex items-center justify-center flex-col text-text">
      <h1 className="font-bold text-4xl">
        <span className="text-accent">Page</span> Not Found
      </h1>
      <Redirect />
    </div>
  );
};

export default NotFound;
