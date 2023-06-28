import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { Editor } from '@components';
import { useAxiosPrivate } from '@hooks';

function CreatePost() {
  const [data, setData] = useState({
    title: '',
    summary: '',
    content: '',
    file: '',
  });
  const [isFetching, setIsFetching] = useState(false);

  const axiosPrivate = useAxiosPrivate('multipart/form-data');

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('summary', data.summary);
    formData.append('content', data.content);
    formData.append('image', data.file);

    try {
      setIsFetching(true);
      const response = await axiosPrivate.post('/posts', formData);
      console.log(response);

      toast.success('Post created successfully');
      navigate('/');
    } catch (err) {
      console.log(err);
      // check if the error is a response from the server
      if (err.response) return toast.error(err.response.data.message);

      // check if the error is a network error
      if (err.request) return toast.error('Network error. Please try again later.');

      // check if the error is anything else
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsFetching(false);
    }
  }

  const handleChange = (e) => {
    const type = e.target.type;
    const name = e.target.name;
    const value = type === 'file' ? e.target.files[0] : e.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const haneleContentChange = (value) => {
    setData((prev) => ({ ...prev, content: value }));
  };

  const disabled = isFetching || !data.title || !data.summary || !data.content;

  return (
    <main className='main'>
      <div className='wrapper'>
        <h1 className='section-title'>Create a new post</h1>
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
            <input
              type='file'
              name='file'
              id='file'
              filename={data.file.name}
              onChange={handleChange}
              accept='image/*'
            />
          </div>
          <div className='form-group'>
            <Editor value={data.content} onChange={haneleContentChange} name='content' type='text' />
          </div>
          <div className='form-group'>
            <button className='btn btn--primary' disabled={disabled}>
              Create post
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default CreatePost;
