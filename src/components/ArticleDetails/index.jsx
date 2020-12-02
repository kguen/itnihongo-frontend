import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Form, Button } from 'react-bootstrap';
import { Link, useParams, useHistory } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import BalloonBlockEditor from '@ckeditor/ckeditor5-build-balloon-block';
import { AiOutlineLike, AiOutlineComment } from 'react-icons/ai';
import AlertContext from '../../contexts/AlertContext';
import extractText from '../../utils/extractText';
import './styles.scss';

const ArticleDetails = () => {
  const [article, setArticle] = useState(null);
  const history = useHistory();
  const { id: articleId } = useParams();
  const { setAlert } = useContext(AlertContext);

  useEffect(() => {
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
  }, []);

  if (!article) {
    return null;
  }
  return (
    <div className="mt-5 article-details d-flex">
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
        <div className="d-flex text-muted align-items-center">
          <AiOutlineLike className="info-icon" />
          <span className="ml-2 info-text">256</span>
        </div>
        <div className="d-flex text-muted align-items-center">
          <AiOutlineComment className="info-icon" />
          <span className="ml-2 info-text">10</span>
        </div>
      </div>
      <div className="ml-5 article-content">
        <h1 className="mb-4">{article.title}</h1>
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
        <CKEditor editor={BalloonBlockEditor} disabled data={article.detail} />
        <div className="my-4 article-tags pb-4 border-bottom">
          {article.categories.map(item => (
            <small className="tag rounded px-2 py-2 mr-2" key={item.id}>
              {item.name}
            </small>
          ))}
        </div>
        <div className="article-comments">
          <h4 className="mb-4">Comments (10)</h4>
          <Form className="mb-4">
            <Form.Group controlId="comment">
              <Form.Control
                as="textarea"
                placeholder="What are your thoughts?"
                rows={2}
              />
            </Form.Group>
            <Button variant="outline-secondary" type="submit">
              Submit
            </Button>
          </Form>
          <div className="comment pt-4 pb-3 border-bottom">
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
                  Kaki Okumura
                </Link>
                <div className="text-muted">2 years ago</div>
              </div>
            </div>
            <p className="comment-content mt-2">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas
              a sit nobis fugiat hic illo, natus veniam iste perferendis ad
              voluptatum culpa.
            </p>
          </div>
          <div className="comment pt-4 pb-3 border-bottom">
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
                  Kaki Okumura
                </Link>
                <div className="text-muted">2 years ago</div>
              </div>
            </div>
            <p className="comment-content mt-2">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas
              a sit nobis fugiat hic illo, natus veniam iste perferendis ad
              voluptatum culpa.
            </p>
          </div>
          <div className="comment pt-4 pb-3 border-bottom">
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
                  Kaki Okumura
                </Link>
                <div className="text-muted">2 years ago</div>
              </div>
            </div>
            <p className="comment-content mt-2">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas
              a sit nobis fugiat hic illo, natus veniam iste perferendis ad
              voluptatum culpa.
            </p>
          </div>
          <div className="comment pt-4 pb-3 border-bottom">
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
                  Kaki Okumura
                </Link>
                <div className="text-muted">2 years ago</div>
              </div>
            </div>
            <p className="comment-content mt-2">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas
              a sit nobis fugiat hic illo, natus veniam iste perferendis ad
              voluptatum culpa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetails;
