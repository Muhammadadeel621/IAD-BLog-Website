import { useState } from 'react';
import { useFetch } from '@hooks';

const usePaginatedFetch = (url, axiosInstance, options) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { latest, limit } = options;

  const initialState = { posts: [], numHits: 0 };

  const { data, isLoading, error } = useFetch(
    `${url}?latest=${latest}&limit=${limit}&page=${currentPage}`,
    axiosInstance,
    initialState
  );

  const handleNextPage = () => setCurrentPage((prev) => prev + 1);
  const handlePrevPage = () => setCurrentPage((prev) => (prev === 1 ? 1 : prev - 1));

  return {
    data,
    isLoading,
    error,
    hasNextPage: data.numHits === limit,
    hasPrevPage: currentPage > 1,
    handleNextPage,
    handlePrevPage,
  };
};

export default usePaginatedFetch;
