import { Link } from "react-router-dom";
import Fib from "./Fib";

const OtherPage = () => {
  return (
    <div className="">
      <Fib />
      <Link to="/">Go back home</Link>
    </div>
  );
};

export default OtherPage;
