import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { Editor } from '@components';

import { useFetch, useAxiosPrivate } from '@hooks';

function EditPost() {
  const [data, setData] = useState({ title: '', summary: '', content: '' });
  const { id } = useParams();
  const { data: oldData, error, isLoading } = useFetch(`/api/posts/${id}`);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  // update the data state with the old data
  useEffect(() => {
    if (oldData?.post)
      setData((prev) => ({ title: oldData.post.title, summary: oldData.post.summary, content: oldData.post.content }));
  }, [oldData]);

  const handleChange = (e) => {
    const type = e.target.type;
    const name = e.target.name;
    const value = type === 'file' ? e.target.files[0] : e.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const haneleContentChange = (value) => {
    setData((prev) => ({ ...prev, content: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosPrivate.patch(`/posts/${id}`, data);

      // if post is created successfully, show toast and redirect to home page
      toast.success('Post updated successfully');
      setTimeout(() => {
        navigate(`/posts/${id}`);
      }, 3000);
    } catch (err) {
      // check if the error is a response from the server
      if (err.response) {
        toast.error(err.response.data.message);
        return;
      }

      // check if the error is a network error
      if (err.request) {
        toast.error('Network error. Please try again later.');
        return;
      }

      // check if the error is anything else
      toast.error('Something went wrong. Please try again later.');
    }
  };

  let content;

  if (isLoading) content = <div>Loading...</div>;
  else if (error) content = <div>{error}</div>;
  else if (oldData?.post)
    content = (
      <form className='create-post-form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <input type='text' name='title' id='title' placeholder='Title' value={data.title} onChange={handleChange} />
        </div>
        <div className='form-group'>
          <input
            type='text'
            name='summary'
            title='summary'
            placeholder='Summary'
            value={data.summary}
            onChange={handleChange}
          />
        </div>
        <div className='form-group'>
          <Editor value={data.content} onChange={haneleContentChange} name='content' type='text' />
        </div>
        <div className='form-group'>
          <button className='btn btn--primary'>Update post</button>
        </div>
      </form>
    );

  return (
    <main className='main'>
      <div className='wrapper'>
        <h1 className='section-title'>Edit Post</h1>
        {content}
      </div>
    </main>
  );
}

export default EditPost;
