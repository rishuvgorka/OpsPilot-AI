import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/health/")
      .then((res) => setMessage(res.data.message))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold">
        {message}
      </h1>
    </div>
  );
}

export default App;
