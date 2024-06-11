import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import Fib from "./Fib";

function App() {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <Link to={"/"}>Back Home</Link>
        <Link to={"/fibo"}>Add new number</Link>
      </div>
      <Routes>
        <Route
          path="/"
          element={<div>Let's calculate Fibonacci ~.~</div>}
        />
        <Route path="/fibo" element={<Fib />} />
      </Routes>
    </>
  );
}

export default App;
