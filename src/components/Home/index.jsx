import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ArticlePreview from '../ArticlePreview';
import AlertContext from '../../contexts/AlertContext';
import DefaultAvatar from '../../assets/images/default-avatar.png';
import './style.scss';

const Home = () => {
  const [tab, setTab] = useState(1);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [articles, setArticles] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const { setAlert } = useContext(AlertContext);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    axios
      .get('http://localhost:3030/api/v1/users/articles/', {
        params: {
          page,
          most_liked: tab === 2 ? true : null,
        },
      })
      .then(({ data }) => {
        setArticles(data.data.articles);
        setTotalPage(data.data.meta_data.total_pages);
      })
      .catch(err => {
        setAlert({
          hasAlert: true,
          message: 'Something wrong has happened when retrieving data.',
          error: true,
        });
      });
  }, [tab, page]);

  useEffect(() => {
    axios
      .get('http://localhost:3030/api/v1/users/')
      .then(({ data }) => {
        setTopUsers(data.data.users);
      })
      .catch(err => {
        setAlert({
          hasAlert: true,
          message: 'Something wrong has happened when retrieving data.',
          error: true,
        });
      });
  }, []);

  return (
    <div className="d-flex mt-5 home-container">
      <Helmet>
        <title>Home | Tech Blog</title>
      </Helmet>
      <div className="display-articles d-flex flex-column mr-4">
        <div className="d-flex align-items-center justify-content-between mb-5">
          <h3>{tab === 1 ? 'Recent articles' : 'Most like articles'}</h3>
          <div className="tabs">
            <button
              type="button"
              className={`${tab === 1 ? 'active' : ''}`}
              onClick={() => setTab(1)}
            >
              Recent
            </button>
            <button
              type="button"
              className={`${tab === 2 ? 'active' : ''}`}
              onClick={() => setTab(2)}
            >
              Most liked
            </button>
          </div>
        </div>
        {articles.map(item => (
          <ArticlePreview article={item} key={item.id} />
        ))}
        <Pagination className="align-self-center">
          <Pagination.First onClick={() => setPage(1)} />
          <Pagination.Prev
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          />
          {[...Array(totalPage).keys()].map(item => (
            <Pagination.Item
              active={item + 1 === page}
              onClick={() => setPage(item + 1)}
            >
              {item + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={page === totalPage}
            onClick={() => setPage(page + 1)}
          />
          <Pagination.Last onClick={() => setPage(totalPage)} />
        </Pagination>
      </div>
      <div className="top-authors d-flex flex-column">
        <h3 className="mb-5">Top authors</h3>
        {topUsers.map(item => (
          <Link
            to={`/users/${item.id}`}
            className="text-reset text-decoration-none d-flex align-items-center mb-4 user-info"
            key={item.id}
          >
            <img
              src={item.avatar || DefaultAvatar}
              alt="user avatar"
              width="62"
              height="62"
              className="rounded-circle"
            />
            <div className="d-flex flex-column info">
              <span className="name">
                {item.name} ({item.article_count} articles)
              </span>
              <small className="text-muted bio">
                {item.bio || 'Author, writing contents for Tech Blog readers.'}
              </small>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
