import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Editor({ value, onChange }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }, { font: [] }],
      [{ align: [] }, { color: [] }, { background: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
    ],
  };
  return (
    <div className='content'>
      <ReactQuill value={value} theme={'snow'} onChange={onChange} modules={modules} />
    </div>
  );
}
