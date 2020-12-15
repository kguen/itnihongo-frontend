import React from 'react';
import { Link } from 'react-router-dom';
import { htmlToText } from 'html-to-text';
import { FaRegComment } from 'react-icons/fa';
import { HiOutlineThumbUp } from 'react-icons/hi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import extractText from '../../utils/extractText';
import DefaultAvatar from '../../assets/images/default-avatar.png';
import './styles.scss';

const ArticlePreview = ({ article }) => {
  dayjs.extend(relativeTime);

  return (
    <div className="d-flex align-items-center article-preview border-bottom">
      <div className="col-8 no-pl">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="article-author">
            <img
              src={article.author_avatar || DefaultAvatar}
              alt="author avatar"
              width="20"
              height="20"
              className="rounded-circle"
            />
            <Link
              className="author-name ml-2 text-reset text-decoration-none"
              to={`/users/${article.author_id}`}
            >
              {article.author}
            </Link>
          </div>
        </div>
        <Link
          className="text-reset text-decoration-none"
          to={`/articles/${article.id}`}
        >
          <h4>{article.title}</h4>
          <div className="article-content-preview mb-2">
            {htmlToText(article.detail, {
              baseElement: 'p',
            }).slice(0, 150)}
            {htmlToText(article.detail, {
              baseElement: 'p',
            }).length > 150 && '...'}
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <small className="article-preview-info text-muted">
              {dayjs(article.updated_at).fromNow()} ·{' '}
              {Math.max(
                1,
                Math.ceil(extractText(article.content).length / 250)
              )}{' '}
              min read
            </small>
            <small className="d-flex align-items-center mr-3">
              <div className="d-flex text-muted align-items-center like-container">
                <HiOutlineThumbUp className="info-icon like-icon" />
                <span className="info-text">{article.likes}</span>
              </div>
              <div className="d-flex text-muted align-items-center comment-count">
                <FaRegComment className="info-icon" />
                <span className="info-text">{article.comment_count}</span>
              </div>
            </small>
          </div>
        </Link>
        <div className="mt-2 article-tags">
          {article.categories.map(item => (
            <small className="tag rounded px-2 py-1 mr-1" key={item.id}>
              {item.name}
            </small>
          ))}
        </div>
      </div>
      <div className="col-4 no-pr article-img">
        <img src={article.featured_image} alt="article" />
      </div>
    </div>
  );
};

export default ArticlePreview;
