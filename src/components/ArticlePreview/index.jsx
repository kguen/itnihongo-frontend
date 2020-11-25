import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

const ArticlePreview = () => {
  return (
    <div className="row mb-5 pb-4 border-bottom">
      <div className="col-8 no-pl">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="article-author">
            <img
              src="https://miro.medium.com/fit/c/25/25/0*IEP3z0HdLYAjHBvk.jpg"
              alt="author avatar"
              width="20"
              height="20"
              className="rounded-circle"
            />
            <Link className="ml-2 text-reset text-decoration-none" to="/">
              Hugh McGuire
            </Link>
          </div>
        </div>
        <Link className="text-reset text-decoration-none" to="/">
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

export default ArticlePreview;
