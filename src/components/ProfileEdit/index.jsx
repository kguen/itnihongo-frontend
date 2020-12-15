import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import ProfileEditForm from './ProfileEditForm';
import YourArticles from './YourArticles';
import LikedArticles from './LikedArticles';
import './styles.scss';

const ProfileEdit = () => {
  const [tab, setTab] = useState(1);

  return (
    <div className="profile-edit d-flex mt-5">
      <Helmet>
        <title>Profile | Tech Blog</title>
      </Helmet>
      <div className="column-tabs d-flex flex-column">
        <h4>Profile</h4>
        <button
          type="button"
          className={tab === 1 ? 'active' : ''}
          onClick={() => setTab(1)}
        >
          Edit your profile
        </button>
        <button
          type="button"
          className={tab === 2 ? 'active' : ''}
          onClick={() => setTab(2)}
        >
          Your articles
        </button>
        <button
          type="button"
          className={tab === 3 ? 'active' : ''}
          onClick={() => setTab(3)}
        >
          Liked articles
        </button>
      </div>
      <div className="display-content">
        <h4 className="border-bottom tab-title">
          {tab === 1
            ? 'Edit your profile'
            : tab === 2
            ? 'Your articles'
            : 'Like articles'}
        </h4>
        {tab === 1 ? (
          <ProfileEditForm />
        ) : tab === 2 ? (
          <YourArticles />
        ) : (
          <LikedArticles />
        )}
      </div>
    </div>
  );
};

export default ProfileEdit;
