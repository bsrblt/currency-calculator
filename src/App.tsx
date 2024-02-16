import { ChangeEvent, useEffect, useState } from "react";

const URL = "https://api.frankfurter.app/latest?amount=";

type ValuesType = { amount: string; from: string; to: string };

const App = () => {
  const [values, setValues] = useState<ValuesType>({
    amount: "",
    from: "USD",
    to: "EUR",
  });

  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  const { amount, from, to } = values;

  useEffect(() => {
    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount) || !from || !to) return;
    if (from === to) return setResult(amount);
    async function changeCurrency() {
      try {
        setIsLoading(true);
        setIsError(null);
        const res = await fetch(`${URL}${numAmount}&from=${from}&to=${to}`);
        if (!res.ok) throw new Error("Something went wrong..");
        const data = await res.json();
        setResult(data.rates[to]);
      } catch (error: unknown) {
        if (typeof error === "string") {
          setIsError(error);
        } else if (error instanceof Error) {
          setIsError(error.message);
        } else {
          setIsError("Something went wrong");
        }
      } finally {
        setIsLoading(false);
      }
    }
    changeCurrency();
  }, [amount, from, to]);

  return (
    <main>
      <div className="form">
        <div className="group">
          <label htmlFor="amount">Amount: </label>
          <input
            id="amount"
            name="amount"
            value={values.amount}
            onChange={handleChange}
            type="number"
          />
        </div>
        <div className="group">
          <label htmlFor="from">From:</label>
          <select
            disabled={isLoading}
            name="from"
            id="from"
            value={values.from}
            onChange={handleChange}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="CAD">CAD</option>
            <option value="INR">INR</option>
            <option value="GBP">GBP</option>
            <option value="TRY">TRY</option>
          </select>
        </div>
        <div className="group">
          <label htmlFor="to">To:</label>
          <select
            disabled={isLoading}
            name="to"
            id="to"
            value={values.to}
            onChange={handleChange}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="CAD">CAD</option>
            <option value="INR">INR</option>
            <option value="GBP">GBP</option>
            <option value="TRY">TRY</option>
          </select>
        </div>

        <p className="result">
          {isLoading && !isError && <span>Loading...</span>}
          {!isLoading && isError && <span>{isError}</span>}
          {Number(amount) > 0 && !isLoading && !isError && (
            <>
              <span>{amount}</span> <em>{from}</em> = <span>{result}</span>{" "}
              <em>{to}</em>
            </>
          )}
        </p>
      </div>
    </main>
  );
};

export default App;
