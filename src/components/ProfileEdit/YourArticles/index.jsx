import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import UserContext from '../../../contexts/UserContext';
import AlertContext from '../../../contexts/AlertContext';
import ArticlePreview from '../../ArticlePreview';
import './styles.scss';

const YourArticles = () => {
  const [articles, setArticles] = useState([]);
  const { user } = useContext(UserContext);
  const { setAlert } = useContext(AlertContext);

  useEffect(() => {
    axios
      .get(
        `http://localhost:3030/api/v1/users/articles/?author_id=${user.data.id}`
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
  }, [user.data.id]);

  return (
    <div className="your-articles">
      {articles.map(item => (
        <ArticlePreview article={item} key={item.id} />
      ))}
    </div>
  );
};

export default YourArticles;
