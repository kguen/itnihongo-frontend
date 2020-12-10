import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Form, Button } from 'react-bootstrap';
import { Link, useParams, useHistory } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import BalloonBlockEditor from '@ckeditor/ckeditor5-build-balloon-block';
import { AiOutlineLike, AiOutlineComment } from 'react-icons/ai';
import ArticlePreview from '../ArticlePreview';
import UserContext from '../../contexts/UserContext';
import AlertContext from '../../contexts/AlertContext';
import tokenConfig from '../../utils/tokenConfig';
import extractText from '../../utils/extractText';
import './styles.scss';

const ArticleDetails = () => {
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const history = useHistory();
  const { id: articleId } = useParams();
  const [userComment, setUserComment] = useState({
    detail: '',
    article_id: articleId,
  });
  const { setAlert } = useContext(AlertContext);
  const { user } = useContext(UserContext);

  dayjs.extend(relativeTime);

  useEffect(() => {
    setSuggestion([]);
    axios
      .get(`http://localhost:3030/api/v1/users/articles/${articleId}`)
      .then(({ data }) => {
        setArticle(data.data);
      })
      .catch(err => {
        history.push('/');
        setAlert({
          hasAlert: true,
          message: 'Something wrong has happened when retrieving data.',
          error: true,
        });
      });

    axios
      .get(`http://localhost:3030/api/v1/article/comments?id=${articleId}/`)
      .then(({ data }) => {
        setComments(data.data.comments);
      })
      .catch(err => {
        setAlert({
          hasAlert: true,
          message: 'Something wrong has happened when retrieving data.',
          error: true,
        });
      });

    axios
      .get(`http://localhost:3030/api/v1/article/suggestion?id=${articleId}/`)
      .then(({ data }) => {
        setSuggestion(data.data.articles_suggest);
      })
      .catch(err => {
        setAlert({
          hasAlert: true,
          message: 'Something wrong has happened when retrieving data.',
          error: true,
        });
      });
  }, [articleId]);

  useEffect(() => {
    if (user.data && comments.length) {
      console.log(user);
      const filtered = comments.find(item => item.user_id === user.data.id);
      if (filtered) setUserComment(filtered);
    }
  }, [articleId, user.data, comments.length]);

  const handleComment = event => {
    event.preventDefault();
    axios
      .post(
        'http://localhost:3030/api/v1/article/comments',
        userComment,
        tokenConfig(user)
      )
      .then(({ data }) => {
        setComments([{ user: user.data.user_name, ...data.data }, ...comments]);
        setAlert({
          hasAlert: true,
          message: 'Comment added!',
        });
      })
      .catch(err => {
        setAlert({
          hasAlert: true,
          message: 'Something wrong has happened when posting your comment.',
          error: true,
        });
      });
    // } else {
    //   axios
    //     .patch(
    //       `http://localhost:3030/api/v1/article/comments/${userComment.id}`,
    //       userComment,
    //       tokenConfig(user)
    //     )
    //     .then(({ data }) => {
    //       console.log({ ...data.data });
    //       setComments([
    //         { user: user.data.user_name, ...data.data },
    //         ...comments.filter(item => item.id !== userComment.id),
    //       ]);
    //       setUserComment(data.data);
    //       setAlert({
    //         hasAlert: true,
    //         message: 'Comment updated!',
    //       });
    //     })
    //     .catch(err => {
    //       setAlert({
    //         hasAlert: true,
    //         message: 'Something wrong has happened when posting your comment.',
    //         error: true,
    //       });
    //     });
    // }
  };

  if (!article) {
    return null;
  }
  return (
    <div className="mt-5 article-details d-flex">
      <div className="article-side-info d-flex flex-column">
        <Link
          className="author-info text-reset text-decoration-none border-bottom pb-3"
          to="/"
        >
          <img
            src="https://miro.medium.com/fit/c/262/262/1*LoU1WYCDpbNqNj2MKssqAA.jpeg"
            alt="author avatar"
            width="40"
            height="40"
            className="rounded-circle"
          />
          <div className="mt-2 author-name">{article.author}</div>
          <div className="mt-2 text-muted author-desc">
            Author, writing contents for programmers.
          </div>
        </Link>
        <div className="d-flex text-muted align-items-center">
          <AiOutlineLike className="info-icon" />
          <span className="ml-2 info-text">256</span>
        </div>
        <div className="d-flex text-muted align-items-center">
          <AiOutlineComment className="info-icon" />
          <span className="ml-2 info-text">{comments.length}</span>
        </div>
      </div>
      <div className="ml-5 article-content">
        {article.author_id === user.data?.id ? (
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h1>{article.title}</h1>
            <Link
              className="text-reset text-decoration-none mr-2"
              to={`/articles/${article.id}/edit`}
            >
              <Button variant="outline-secondary">Edit your article</Button>
            </Link>
          </div>
        ) : (
          <h1 className="mb-4">{article.title}</h1>
        )}
        <div className="small-info d-flex align-items-center mb-4">
          <img
            src="https://miro.medium.com/fit/c/262/262/1*LoU1WYCDpbNqNj2MKssqAA.jpeg"
            alt="author avatar"
            width="40"
            height="40"
            className="rounded-circle"
          />
          <div className="ml-2">
            <Link className="text-reset text-decoration-none" to="/">
              {article.author}
            </Link>
            <div className="text-muted">
              {dayjs(article.created_at).format('MMM DD, YYYY')} ·{' '}
              {Math.max(
                1,
                Math.ceil(extractText(article.content).length / 250)
              )}{' '}
              min read
            </div>
          </div>
        </div>
        <div className="article-image">
          <img src={article.featured_image} alt="article feature pic" />
        </div>
        <CKEditor editor={BalloonBlockEditor} disabled data={article.detail} />
        <div className="mt-3 mb-5 article-tags pb-4 border-bottom">
          {article.categories.map(item => (
            <small className="tag rounded px-2 py-2 mr-2" key={item.id}>
              {item.name}
            </small>
          ))}
        </div>
        <div className="article-comments mb-5">
          <h4 className="mb-4">Comments ({comments.length})</h4>
          {user.token && user.data?.id !== article.author_id ? (
            <Form className="mb-4" onSubmit={handleComment}>
              <Form.Group controlId="comment">
                <Form.Control
                  as="textarea"
                  placeholder="What are your thoughts?"
                  value={userComment.detail}
                  onChange={event =>
                    setUserComment({
                      ...userComment,
                      detail: event.target.value,
                    })
                  }
                  rows={2}
                />
              </Form.Group>
              <Button variant="outline-secondary" type="submit">
                Submit
              </Button>
            </Form>
          ) : null}
          {comments.map(item => (
            <div
              className="comment pt-4 pb-3 border-bottom"
              key={item.updated_at}
            >
              <div className="comment-info d-flex align-items-center">
                <img
                  src="https://miro.medium.com/fit/c/262/262/1*HQTxFkIf5fymNTatLc0qjA.jpeg"
                  alt="author avatar"
                  width="40"
                  height="40"
                  className="rounded-circle"
                />
                <div className="ml-2">
                  <Link
                    className="text-reset text-decoration-none comment-author"
                    to="/"
                  >
                    {item.user}
                  </Link>
                  <div className="text-muted">
                    {dayjs(item.updated_at).fromNow()}
                  </div>
                </div>
              </div>
              <p className="comment-content mt-2">{item.detail}</p>
            </div>
          ))}
        </div>
        <div className="article-suggest mt-4">
          <h4 className="mb-4">Recommended articles</h4>
          {suggestion.map(item => (
            <ArticlePreview article={item} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetails;
