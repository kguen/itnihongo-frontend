import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import BalloonBlockEditor from '@ckeditor/ckeditor5-build-balloon-block';
import './styles.scss';

const ArticleEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <Form
      className="new-article pt-3"
      onSubmit={event => {
        event.preventDefault();
        console.log(title, content);
      }}
    >
      <Form.Group controlId="articleTitle">
        <Form.Control
          type="text"
          value={title}
          placeholder="Article title"
          onChange={event => setTitle(event.target.value)}
        />
      </Form.Group>
      <CKEditor
        editor={BalloonBlockEditor}
        config={{
          placeholder: 'Write your article here!',
        }}
        onChange={(event, editor) => setContent(editor.getData())}
      />
      <Button className="mt-4 ml-2" variant="outline-success" type="submit">
        Publish
      </Button>
    </Form>
  );
};

export default ArticleEditor;
