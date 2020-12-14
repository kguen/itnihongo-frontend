import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { Link, useParams, useHistory } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import BalloonBlockEditor from '@ckeditor/ckeditor5-build-balloon-block';
import { FaRegComment } from 'react-icons/fa';
import { HiOutlineThumbUp, HiThumbUp } from 'react-icons/hi';
import { FiEdit, FiTrash } from 'react-icons/fi';
import ArticlePreview from '../ArticlePreview';
import UserContext from '../../contexts/UserContext';
import AlertContext from '../../contexts/AlertContext';
import tokenConfig from '../../utils/tokenConfig';
import extractText from '../../utils/extractText';
import './styles.scss';

const ArticleDetails = () => {
  const [article, setArticle] = useState(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const history = useHistory();
  const { id: articleId } = useParams();
  const [userComment, setUserComment] = useState({
    detail: '',
    article_id: articleId,
  });
  const { setAlert } = useContext(AlertContext);
  const { user, setUser } = useContext(UserContext);

  dayjs.extend(relativeTime);

  useEffect(() => {
    setLiked(user.liked.includes(parseInt(articleId, 10)));
  }, [user.liked.length]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        setComments(
          data.data.comments.map(item => ({
            ...item,
            editing: false,
            editContent: item.detail,
          }))
        );
      })
      .catch(err => {
        setAlert({
          hasAlert: true,
          message: 'Something wrong has happened when retrieving data.',
          error: true,
        });
      });

    axios
      .get(
        `http://localhost:3030/api/v1/users/articles/?suggest_id=${articleId}/`
      )
      .then(({ data }) => {
        setSuggestion(data.data.articles);
      })
      .catch(err => {
        setAlert({
          hasAlert: true,
          message: 'Something wrong has happened when retrieving data.',
          error: true,
        });
      });
  }, [articleId]);

  const postComment = event => {
    event.preventDefault();
    axios
      .post(
        'http://localhost:3030/api/v1/article/comments',
        userComment,
        tokenConfig(user)
      )
      .then(({ data }) => {
        setComments([
          {
            user: user.data.user_name,
            ...data.data,
            editing: false,
            editContent: data.data.detail,
          },
          ...comments,
        ]);
        setUserComment({ ...userComment, detail: '' });
        setAlert({
          hasAlert: true,
          message: 'Comment added!',
        });
      })
      .catch(err => {
        setAlert({
          hasAlert: true,
          message: `${err.response.data.errors[0]}.`,
          error: true,
        });
      });
  };

  const editComment = (event, index) => {
    event.preventDefault();
    axios
      .patch(
        `http://localhost:3030/api/v1/article/comments/${comments[index].id}`,
        {
          ...comments[index],
          detail: comments[index].editContent,
        },
        tokenConfig(user)
      )
      .then(({ data }) => {
        const newComments = comments;
        newComments[index] = {
          ...data.data,
          user: user.data.user_name,
          editing: false,
          editContent: data.data.detail,
        };
        setComments(newComments);
        setAlert({
          hasAlert: true,
          message: 'Comment updated!',
        });
      })
      .catch(err => {
        setAlert({
          hasAlert: true,
          message: `${err.response.data.errors[0]}.`,
          error: true,
        });
      });
  };

  const deleteComment = commentId => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const toDelete = confirm('Are you sure?');
    if (toDelete) {
      axios
        .delete(
          `http://localhost:3030/api/v1/article/comments/${commentId}`,
          tokenConfig(user)
        )
        .then(({ data }) => {
          setComments(comments.filter(item => item.id !== commentId));
          setAlert({
            hasAlert: true,
            message: 'Comment deleted!',
          });
        })
        .catch(err => {
          setAlert({
            hasAlert: true,
            message: `${err.response.data.errors[0]}.`,
            error: true,
          });
        });
    }
  };

  const handleLikePost = () => {
    if (liked) {
      axios
        .delete(
          `http://localhost:3030/api/v1/article/${articleId}/likes`,
          tokenConfig(user)
        )
        .then(() => {
          setUser({
            ...user,
            liked: user.liked.filter(item => item !== parseInt(articleId, 10)),
          });
          setArticle({
            ...article,
            likes: article.likes - 1,
          });
        })
        .catch(err => {
          setAlert({
            hasAlert: true,
            message: `${err.response.data.message}.`,
            error: true,
          });
        });
    } else {
      axios
        .post(
          `http://localhost:3030/api/v1/article/${articleId}/likes`,
          null,
          tokenConfig(user)
        )
        .then(() => {
          setUser({
            ...user,
            liked: [...user.liked, parseInt(articleId, 10)],
          });
          setArticle({
            ...article,
            likes: article.likes + 1,
          });
        })
        .catch(err => {
          setAlert({
            hasAlert: true,
            message: `${err.response.data.message}.`,
            error: true,
          });
        });
    }
  };

  if (!article) {
    return null;
  }
  return (
    <div className="mt-5 article-details d-flex">
      <Helmet>
        <title>{article.title} | Tech Blog</title>
      </Helmet>
      <div className="article-info d-flex flex-column">
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
        <div className="d-flex text-muted align-items-center like-container">
          <button
            className="like-button"
            type="button"
            onClick={handleLikePost}
          >
            {liked ? (
              <HiThumbUp className="info-icon like-icon-active " />
            ) : (
              <HiOutlineThumbUp className="info-icon like-icon" />
            )}
          </button>
          <span className="ml-2 info-text">{article.likes}</span>
        </div>
        <div className="d-flex text-muted align-items-center">
          <FaRegComment className="info-icon" />
          <span className="ml-2 info-text">{comments.length}</span>
        </div>
      </div>
      <div className="ml-5 article-content">
        {article.author_id === user.data?.id ? (
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h1>{article.title}</h1>
            <Link
              className="text-reset text-decoration-none ml-4 mr-1"
              to={`/articles/${article.id}/edit`}
            >
              <Button variant="outline-info">Edit your article</Button>
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
              {dayjs(article.created_at).fromNow()} ·{' '}
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
            <Form className="mb-4" onSubmit={postComment}>
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
                  minLength={1}
                  maxLength={100}
                  rows={2}
                />
              </Form.Group>
              <Button variant="outline-success" type="submit">
                Submit
              </Button>
            </Form>
          ) : null}
          {comments.map((item, index) => (
            <div className="comment px-3 py-4" key={item.updated_at}>
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
              <div className="comment-content mt-3 d-flex align-items-center justify-content-between">
                {item.editing ? (
                  <Form
                    className="edit-comment-form"
                    onSubmit={event => editComment(event, index)}
                  >
                    <Form.Control
                      className="mb-2"
                      as="textarea"
                      placeholder="What are your thoughts?"
                      value={item.editContent}
                      onChange={event =>
                        setComments(
                          comments.map(comment =>
                            comment.id === item.id
                              ? {
                                  ...comment,
                                  editContent: event.target.value,
                                }
                              : comment
                          )
                        )
                      }
                      minLength={1}
                      maxLength={100}
                      rows={2}
                    />
                    <Button
                      className="mr-1"
                      variant="outline-success"
                      type="submit"
                      size="sm"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline-secondary"
                      type="button"
                      size="sm"
                      onClick={() =>
                        setComments(
                          comments.map(comment =>
                            comment.id === item.id
                              ? {
                                  ...comment,
                                  editContent: item.detail,
                                  editing: false,
                                }
                              : comment
                          )
                        )
                      }
                    >
                      Cancel
                    </Button>
                  </Form>
                ) : (
                  <>
                    <p className="content">{item.detail}</p>
                    {item.user_id === user.data?.id ? (
                      <div className="d-flex align-items-center">
                        <button
                          type="button"
                          className="edit mr-2"
                          onClick={() =>
                            setComments(
                              comments.map(comment =>
                                comment.id === item.id
                                  ? { ...comment, editing: true }
                                  : comment
                              )
                            )
                          }
                        >
                          <FiEdit />
                        </button>
                        <button
                          type="button"
                          className="remove"
                          onClick={() => deleteComment(item.id)}
                        >
                          <FiTrash />
                        </button>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
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
