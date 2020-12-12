import React from 'react';
import { Link } from 'react-router-dom';
import { htmlToText } from 'html-to-text';
import dayjs from 'dayjs';
import extractText from '../../utils/extractText';
import './styles.scss';

const ArticlePreview = ({ article }) => {
  return (
    <div className="row align-items-center article-preview border-bottom">
      <div className="col-8 no-pl">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="article-author">
            <img
              src="https://miro.medium.com/fit/c/262/262/1*LoU1WYCDpbNqNj2MKssqAA.jpeg"
              alt="author avatar"
              width="20"
              height="20"
              className="rounded-circle"
            />
            <Link
              className="author-name ml-2 text-reset text-decoration-none"
              to="/"
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
          <div className="article-content-preview mb-1">
            {htmlToText(article.detail, {
              baseElement: 'p',
            }).slice(0, 130)}
            {htmlToText(article.detail, {
              baseElement: 'p',
            }).length > 130 && '...'}
          </div>
          <small className="article-preview-info text-muted">
            {dayjs(article.created_at).format('MMM DD, YYYY')} ·{' '}
            {Math.max(1, Math.ceil(extractText(article.content).length / 250))}{' '}
            min read
          </small>
        </Link>
        <div className="mt-2 article-tags">
          {article.categories.map(item => (
            <small className="tag rounded px-2 py-1 mr-1" key={item.id}>
              {item.name}
            </small>
          ))}
        </div>
      </div>
      <div className="col-4 no-pr">
        <img
          src={article.featured_image}
          alt="article"
          className="article-img"
        />
      </div>
    </div>
  );
};

export default ArticlePreview;
