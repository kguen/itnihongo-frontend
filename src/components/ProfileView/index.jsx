import React, { useEffect, useState, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { FaRegComment } from 'react-icons/fa';
import { HiOutlineThumbUp } from 'react-icons/hi';
import BalloonBlockEditor from '@ckeditor/ckeditor5-build-balloon-block';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import AlertContext from '../../contexts/AlertContext';
import DefaultAvatar from '../../assets/images/default-avatar.png';
import extractText from '../../utils/extractText';
import './styles.scss';

const ProfileView = () => {
  const [articles, setArticles] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const { setAlert } = useContext(AlertContext);
  const { id: userId } = useParams();

  dayjs.extend(relativeTime);

  useEffect(() => {
    axios
      .get(`http://localhost:3030/api/v1/users/articles/?author_id=${userId}`)
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
    axios
      .get(`http://localhost:3030/api/v1/users/${userId}`)
      .then(({ data }) => {
        setUserInfo({
          ...data.data,
          avatar: data.avatar,
        });
      })
      .catch(err => {
        setAlert({
          hasAlert: true,
          message: 'Something wrong has happened when retrieving data.',
          error: true,
        });
      });
  }, [userId]);

  return (
    <div className="mt-4 profile-view d-flex">
      <Helmet>
        <title>
          {userInfo.user_name ? userInfo.user_name : ''} | Tech Blog
        </title>
      </Helmet>
      <Link
        className="user-info text-reset text-decoration-none"
        to={`/users/${userInfo.id}`}
      >
        <img
          src={userInfo.avatar || DefaultAvatar}
          alt="author avatar"
          width="130"
          height="130"
        />
        <div className="text-muted user-bio mt-3">ABOUT</div>
        <div className="mt-1 info">
          <div className="user-name">{userInfo.user_name}</div>
          <div className="mt-2 text-muted user-bio">
            {userInfo.bio || 'Author, writing contents for Tech Blog readers.'}
          </div>
        </div>
      </Link>
      <div className="profile-articles">
        {articles.map(article => (
          <div className="profile-article-content">
            <Link
              to={`/articles/${article.id}`}
              className="text-decoration-none text-reset"
            >
              <div className="small-info text-muted mb-2">
                Published {dayjs(article.updated_at).fromNow()}
              </div>
              <h2 className="mb-4">{article.title}</h2>
            </Link>
            <div className="article-image">
              <img src={article.featured_image} alt="article feature pic" />
            </div>
            <CKEditor
              editor={BalloonBlockEditor}
              disabled
              data={article.detail}
            />
            <Link
              to={`/articles/${article.id}`}
              className="text-decoration-none text-reset"
            >
              <div className="read-more">
                Read more ·{' '}
                {Math.max(
                  1,
                  Math.ceil(extractText(article.content).length / 250)
                )}{' '}
                min read
              </div>
            </Link>

            <div className="d-flex align-items-center justify-content-between bottom-section border-bottom">
              <div className="article-tags">
                {article.categories.map(item => (
                  <small className="tag rounded px-2 py-2 mr-2" key={item.id}>
                    {item.name}
                  </small>
                ))}
              </div>
              <Link
                to={`/articles/${article.id}`}
                className="text-decoration-none text-reset d-flex align-items-center like-comment"
              >
                <div className="d-flex text-muted align-items-center like-container mr-3">
                  <HiOutlineThumbUp className="info-icon like-icon" />
                  <span className="info-text">{article.likes}</span>
                </div>
                <div className="d-flex text-muted align-items-center comment-count">
                  <FaRegComment className="info-icon" />
                  <span className="info-text">{article.comment_count}</span>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileView;
