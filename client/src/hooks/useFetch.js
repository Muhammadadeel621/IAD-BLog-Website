import { useState, useEffect } from "react";

const useFetch = (url, axiosInstance, initialState) => {
  const [data, setData] = useState({ ...initialState });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(url, {
          signal: abortController.signal,
        });

        setData(response.data);
        setError("");
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        // check if request is aborted
        if (err.code === "ERR_CANCELED") {
          console.log("Request aborted");
        } else if (!err.response) {
          setError("Server Down! No response from server");
          setIsLoading(false);
        } else {
          setError(
            err.response.data.message ? err.response.data.message : err.message
          );
          setIsLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      abortController.abort();
    };
  }, [url]);

  return { data, isLoading, error };
};

export default useFetch;
