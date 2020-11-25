import React from 'react';
import ArticlePreview from '../ArticlePreview';

const Home = () => {
  return (
    <div className="d-flex mt-5">
      <div className="recent-articles mr-4 w-75">
        <h3 className="mb-5">Recent articles</h3>
        <ArticlePreview />
        <ArticlePreview />
        <ArticlePreview />
        <ArticlePreview />
        <ArticlePreview />
      </div>
    </div>
  );
};

export default Home;
