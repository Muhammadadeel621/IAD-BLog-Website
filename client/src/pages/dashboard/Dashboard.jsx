import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import { toast } from "react-hot-toast";

import { Error } from "@components";
import { usePaginatedFetch, useAxiosPrivate } from "@hooks";

import styles from "./dashboard.module.css";

function Dashboard() {
  const tableWrapperRef = useRef(null);

  const axiosPrivate = useAxiosPrivate();

  const {
    isLoading,
    error,
    data,
    hasNextPage,
    hasPrevPage,
    handleNextPage,
    handlePrevPage,
  } = usePaginatedFetch("/users/me/posts", axiosPrivate, { limit: 4 });

  useEffect(() => {
    window.addEventListener("resize", () =>
      setTableWrapperOffsetTop(tableWrapperRef)
    );
    setTableWrapperOffsetTop(tableWrapperRef);

    return () => {
      window.removeEventListener("resize", () =>
        setTableWrapperOffsetTop(tableWrapperRef)
      );
    };
  }, []);

  let content;

  if (isLoading) {
    content = (
      <Table>
        {Array.from({ length: 10 }).map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </Table>
    );
  } else if (error) {
    content = <p className="error-message">{error}</p>;
  } else if (data.posts?.length === 0) {
    content = <Error message="No posts found" image="no-data.svg" />;
  } else {
    content = (
      <Table>
        {data.posts.map((post) => (
          <TableRow key={post._id} post={post} />
        ))}
      </Table>
    );
  }

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
          <h1 className="section-title">Dashboard</h1>
          <button
            className="btn btn--neutral"
            disabled={!hasNextPage}
            onClick={handleNextPage}
          >
            Next Page
          </button>
        </div>
        <div className={styles["posts-table-wrapper"]} ref={tableWrapperRef}>
          {content}
        </div>
      </div>
    </main>
  );
}

function Table({ children }) {
  return (
    <table className={styles["posts-table"]}>
      <thead className={styles["post-table__header"]}>
        <tr className={styles["post-table__row"]}>
          <th className={styles["post-table__header-cell"]}>Image</th>
          <th className={styles["post-table__header-cell"]}>Title</th>
          <th className={styles["post-table__header-cell"]}>Posted/Edited</th>
          <th className={styles["post-table__header-cell"]}>Actions</th>
        </tr>
      </thead>
      <tbody className={styles["post-table__body"]}>{children}</tbody>
    </table>
  );
}

function TableRowSkeleton() {
  return (
    <tr className={[styles["post-table__row"], styles["skeleton"]].join(" ")}>
      <td
        className={[styles["post-table__body-cell"], "pulse-animation"].join(
          " "
        )}
      ></td>
      <td
        className={[styles["post-table__body-cell"], "pulse-animation"].join(
          " "
        )}
      ></td>
      <td
        className={[styles["post-table__body-cell"], "pulse-animation"].join(
          " "
        )}
      ></td>
      <td
        className={[styles["post-table__body-cell"], "pulse-animation"].join(
          " "
        )}
      ></td>
    </tr>
  );
}

function TableRow({ post }) {
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      setIsFetching(true);
      const res = await axiosPrivate.delete(`/posts/${post._id}`);
      toast.success(res.data.message);
      navigate("/");
    } catch (err) {
      // check if the error is a response from the server
      if (err.response) return toast.error(err.response.data.message);

      // check if the error is a network error
      if (err.request)
        return toast.error("Network error. Please try again later.");

      // check if the error is anything else
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsFetching(false);
    }
  };

  const imagePath = post.cover
    ? `${import.meta.env.VITE_BACKEND_URL}${post.cover}`
    : "/assets/images/logo-dark.svg";

  return (
    <tr className={styles["post-table__row"]}>
      <td className={styles["post-table__body-cell"]}>
        <img src={imagePath} alt="post image" className="post-image" />
      </td>
      <td className={styles["post-table__body-cell"]}>
        <a href="post.html" className="post-title">
          {post.title}
        </a>
      </td>
      <td className={styles["post-table__body-cell"]}>
        <p className="post-date">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </td>
      <td className={styles["post-table__body-cell"]}>
        <div className="flex-between">
          <Link to={`/posts/${post._id}/edit`} className="btn btn--primary">
            Edit
            <FontAwesomeIcon icon={faEdit} />
          </Link>
          <button
            className="btn btn--danger"
            onClick={handleDelete}
            disabled={isFetching}
          >
            Delete <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function setTableWrapperOffsetTop(tableWrapperRef) {
  const offsetTop = tableWrapperRef.current.offsetTop;
  tableWrapperRef.current.style.setProperty("--offsetTop", offsetTop + "px");
}

export default Dashboard;
