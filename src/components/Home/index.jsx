import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import ArticlePreview from '../ArticlePreview';
import AlertContext from '../../contexts/AlertContext';
import './style.scss';

const Home = () => {
  const [tab, setTab] = useState(1);
  const [articles, setArticles] = useState([]);
  const { setAlert } = useContext(AlertContext);

  useEffect(() => {
    axios
      .get(
        `http://localhost:3030/api/v1/users/articles/${
          tab === 2 ? '?most_liked=true' : ''
        }`
      )
      .then(({ data }) => {
        setArticles(data.data.articles);
      })
      .catch(err => {
        setAlert({
          hasAlert: true,
          message: 'Something wrong has happened when retrieving data.',
          error: true,
        });
      });
  }, [tab]);

  return (
    <div className="d-flex mt-5 home-container">
      <Helmet>
        <title>Home | Tech Blog</title>
      </Helmet>
      <div className="display-articles mr-4">
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
      </div>
    </div>
  );
};

export default Home;
