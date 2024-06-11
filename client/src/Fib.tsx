import { type FormEvent, useEffect, useState } from "react";

const Fib = () => {
  const [seenIdx, setSeenIdx] = useState<number[]>([]);
  const [values, setValues] = useState({});
  const [idx, setIdx] = useState("");

  useEffect(() => {
    const fetchValues = async () => {
      const res = await fetch("/api/values/current");
      const v = await res.json();
      setValues({ ...values, ...v });
    };

    const fetchIdx = async () => {
      const res = await fetch("/api/values/all");
      const seenIndexes = await res.json();
      setSeenIdx([...seenIdx, ...seenIndexes.map((i) => i.number)]);
    };

    const fetching = async () => {
      await fetchValues();
      await fetchIdx();
    };

    fetching();
  }, []);

  console.log(values);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await fetch("/api/values", {
      method: "POST",
      body: JSON.stringify({
        index: idx,
      }),
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor="fibo" style={{ marginRight: "8px" }}>
          Enter your index:{" "}
        </label>
        <input
          name="fibo"
          type="text"
          value={idx}
          onChange={(event) => setIdx(event.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <h3>Indexes I have seen</h3>
      {seenIdx.join(",")}
      <h3>Calculated Values:</h3>
      {Object.values(values).join("-")}
    </div>
  );
};

export default Fib;
