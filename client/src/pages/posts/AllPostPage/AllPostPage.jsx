import { useParams } from "react-router-dom";

import { PostList } from "@components";
import { usePaginatedFetch } from "@hooks";
import axios from "@api/axiosClient";

function AllPostPage() {
  const { username } = useParams();

  const {
    isLoading,
    error,
    data,
    hasNextPage,
    hasPrevPage,
    handleNextPage,
    handlePrevPage,
  } = usePaginatedFetch(
    username ? `/api/users/${username}/posts` : "/api/posts",
    axios,
    { limit: 6 }
  );

  return (
    <main className="main py-200">
      <div className="wrapper">
        <div className="flex-between">
          <button
            className="btn btn--neutral"
            disabled={!hasPrevPage}
            onClick={handlePrevPage}
          >
            Prev Page
          </button>
          <h2>All posts</h2>
          <button
            className="btn btn--neutral"
            disabled={!hasNextPage}
            onClick={handleNextPage}
          >
            Next Page
          </button>
        </div>
        <PostList isLoading={isLoading} error={error} data={data} />
      </div>
    </main>
  );
}

export default AllPostPage;
