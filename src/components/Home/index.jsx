import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ArticlePreview from '../ArticlePreview';
import AlertContext from '../../contexts/AlertContext';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const { setAlert } = useContext(AlertContext);

  useEffect(() => {
    axios
      .get(`http://localhost:3030/api/v1/users/articles/`)
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
  }, []);

  return (
    <div className="d-flex mt-5">
      <div className="recent-articles mr-4 w-75">
        <h3 className="mb-5">Recent articles</h3>
        {articles.map(item => (
          <ArticlePreview article={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default Home;
