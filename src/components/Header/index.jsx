import React, { useContext } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { Button, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import UserContext from '../../contexts/UserContext';
import AlertContext from '../../contexts/AlertContext';
import tokenConfig from '../../utils/tokenConfig';
import DefaultAvatar from '../../assets/images/default-avatar.png';
import BootstrapLogo from '../../assets/images/bootstrap.svg';
import './styles.scss';

const Header = () => {
  const history = useHistory();
  const location = useLocation();
  const articleId = location.pathname.includes('edit')
    ? location.pathname.split('/')[2]
    : '';
  const { user, setUser } = useContext(UserContext);
  const { setAlert } = useContext(AlertContext);

  const noHeader =
    location.pathname.includes('signup') || location.pathname.includes('login');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser({
      ...user,
      data: null,
      token: null,
      liked: [],
      avatar: null,
    });
    setAlert({
      hasAlert: true,
      message: 'Logged out.',
    });
  };

  const deleteArticle = () => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const toDelete = confirm('Are you sure?');
    if (toDelete && articleId) {
      axios
        .delete(
          `http://localhost:3030/api/v1/users/articles/${articleId}`,
          tokenConfig(user)
        )
        .then(res => {
          history.push('/');
          setAlert({
            hasAlert: true,
            message: 'Article deleted!',
          });
        })
        .catch(err => {
          setAlert({
            hasAlert: true,
            message: 'Something wrong has happened when deleting your article.',
            error: true,
          });
        });
    }
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <button
      className="avatar-dropdown"
      type="button"
      ref={ref}
      onClick={event => {
        event.preventDefault();
        onClick(event);
      }}
    >
      {children}
      <img
        className="rounded-circle"
        width="40"
        height="40"
        src={user.avatar || DefaultAvatar}
        alt="user avatar"
      />
    </button>
  ));

  return noHeader ? null : (
    <header className="d-flex align-items-center justify-content-between pt-4 pb-3 border-bottom">
      <Link
        to="/"
        className="navbar-brand text-reset text-decoration-none d-flex logo align-items-center"
      >
        <img width="25" height="25" alt="bootstrap logo" src={BootstrapLogo} />
        <span className="lead ml-2">Tech Blog</span>
      </Link>
      {user.token ? (
        <div className="d-flex align-items-center">
          {location.pathname.includes('edit') ? (
            <Button
              className="mr-3"
              variant="outline-danger"
              onClick={deleteArticle}
            >
              Delete article
            </Button>
          ) : (
            <Link
              className="text-reset text-decoration-none mr-3"
              to="/articles/new"
            >
              <Button variant="outline-primary">New article</Button>
            </Link>
          )}
          <Dropdown>
            <Dropdown.Toggle as={CustomToggle} />
            <Dropdown.Menu align="right" className="mt-2">
              <Dropdown.Header>
                <div className="d-flex align-items-center">
                  <img
                    className="rounded-circle mr-2"
                    width="40"
                    height="40"
                    src={user.avatar || DefaultAvatar}
                    alt="user avatar"
                  />
                  <div className="ml-1">
                    <span className="text-dark">{user.data?.user_name}</span>
                    <br />
                    <span>{user.data?.email}</span>
                  </div>
                </div>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => history.push('/profile')}>
                My profile
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      ) : (
        <div className="d-flex align-items-center">
          <Link className="text-reset text-decoration-none mr-2" to="/login">
            <Button variant="outline-primary">Sign In</Button>
          </Link>
          <Link className="text-reset text-decoration-none" to="/signup">
            <Button variant="outline-success">Sign Up</Button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
