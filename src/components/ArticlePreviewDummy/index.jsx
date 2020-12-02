import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

const ArticlePreviewDummy = () => {
  return (
    <div className="row mb-5 pb-4 border-bottom">
      <div className="col-8 no-pl">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="article-author">
            <img
              src="https://miro.medium.com/fit/c/262/262/1*HQTxFkIf5fymNTatLc0qjA.jpeg"
              alt="author avatar"
              width="20"
              height="20"
              className="rounded-circle"
            />
            <Link
              className="author-name ml-2 text-reset text-decoration-none"
              to="/"
            >
              Kaki Okumura
            </Link>
          </div>
        </div>
        <Link className="text-reset text-decoration-none" to="/articles/1">
          <h4>Simple Authentication Guide with Ruby on Rails</h4>
          <div className="article-preview mb-1">
            This is a simple tutorial on implementing
            authorization/authentication in your Rails application. I will be
            using the latest version...
          </div>
          <small className="article-info text-muted">
            Apr 23, 2015 · 11 min read
          </small>
        </Link>
        <div className="mt-2 article-tags">
          <small className="tag rounded px-2 py-1 mr-1">rails</small>
          <small className="tag rounded px-2 py-1 mr-1">authentication</small>
          <small className="tag rounded px-2 py-1 mr-1">ruby</small>
        </div>
      </div>
      <div className="col-4 no-pr">
        <img
          src="https://miro.medium.com/max/875/0*v79zUcR07Rdg6otp"
          alt="article"
          className="article-img"
        />
      </div>
    </div>
  );
};

export default ArticlePreviewDummy;
