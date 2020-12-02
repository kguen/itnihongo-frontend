import React, { useState, useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import BalloonBlockEditor from '@ckeditor/ckeditor5-build-balloon-block';
import { WithContext as ReactTags } from 'react-tag-input';
import AlertContext from '../../contexts/AlertContext';
import UserContext from '../../contexts/UserContext';
import tokenConfig from '../../utils/tokenConfig';
import './styles.scss';

const ArticleEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const history = useHistory();
  const { id: articleId } = useParams();
  const { user } = useContext(UserContext);
  const { setAlert } = useContext(AlertContext);

  useEffect(() => {
    if (articleId) {
      axios
        .get(`http://localhost:3030/api/v1/users/articles/${articleId}`)
        .then(({ data }) => {
          if (data.author_id !== user.id) {
            history.push('/');
            setAlert({
              hasAlert: true,
              message: 'Unauthorized page.',
              error: true,
            });
          } else {
            setTitle(data.data.title);
            setContent(data.data.detail);
            setTags(
              data.data.categories.map((item, index) => ({
                id: index.toString(),
                text: item.name,
              }))
            );
          }
        })
        .catch(err => {
          history.push('/');
          setAlert({
            hasAlert: true,
            message: 'Something wrong has happened when retrieving data.',
            error: true,
          });
        });
    }
  }, []);

  const postArticle = () => {
    axios
      .post(
        'http://localhost:3030/api/v1/users/articles',
        {
          title,
          detail: content,
          categories: tags.map(item => ({ name: item.text })),
        },
        tokenConfig(user)
      )
      .then(res => {
        history.push('/articles/:id');
        setAlert({
          hasAlert: true,
          message: 'Article created!',
        });
      })
      .catch(err => {
        setAlert({
          hasAlert: true,
          message: 'Something wrong has happened when creating your article.',
          error: true,
        });
      });
  };

  const editArticle = () => {
    axios
      .put(
        `http://localhost:3030/api/v1/users/articles/${articleId}`,
        {
          title,
          detail: content,
          categories: tags.map(item => ({ name: item.text })),
        },
        tokenConfig(user)
      )
      .then(res => {
        history.push(`/articles/${articleId}`);
        setAlert({
          hasAlert: true,
          message: 'Article updated!',
        });
      })
      .catch(err => {
        setAlert({
          hasAlert: true,
          message: 'Something wrong has happened when updating your article.',
          error: true,
        });
      });
  };

  return (
    <Form
      className="new-article mt-4"
      onSubmit={event => {
        event.preventDefault();
        if (articleId) {
          editArticle();
        } else {
          postArticle();
        }
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
        data={content}
        config={{
          placeholder: 'Write your article here!',
        }}
        onChange={(event, editor) => setContent(editor.getData())}
      />
      <Form.Group className="my-4">
        <ReactTags
          inline
          tags={tags}
          handleDelete={tagId =>
            setTags(tags.filter((tag, index) => index !== tagId))
          }
          placeholder="Add article categories..."
          handleAddition={tag => setTags([...tags, tag])}
          handleDrag={(tag, currPos, newPos) => {
            const newTags = [...tags].slice();
            newTags.splice(currPos, 1);
            newTags.splice(newPos, 0, tag);
            setTags(newTags);
          }}
          delimiters={[188, 13, 32]}
        />
      </Form.Group>
      <Button className="ml-2" variant="outline-success" type="submit">
        Publish
      </Button>
    </Form>
  );
};

export default ArticleEditor;
