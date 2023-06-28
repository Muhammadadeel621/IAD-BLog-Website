import React from 'react';

function Error({ message, image }) {
  return (
    <div className='error'>
      {image && <img src={`/assets/images/${image}`} alt='error' />}
      <p>{message}</p>
    </div>
  );
}

export default Error;
