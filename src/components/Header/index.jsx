import React, { useContext } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { Button, Dropdown } from 'react-bootstrap';
import UserContext from '../../contexts/UserContext';
import AlertContext from '../../contexts/AlertContext';
import './styles.scss';

const Header = () => {
  const history = useHistory();
  const location = useLocation();
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
    });
    setAlert({
      hasAlert: true,
      message: 'Logged out!',
    });
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
        src="https://miro.medium.com/fit/c/262/262/1*LoU1WYCDpbNqNj2MKssqAA.jpeg"
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
        <img
          width="25"
          src="https://getbootstrap.com/docs/4.5/assets/brand/bootstrap-solid.svg"
          height="25"
          alt="bootstrap logo"
        />
        <span className="lead ml-2">Tech Blog</span>
      </Link>
      {user.token ? (
        <div className="d-flex align-items-center">
          <Link
            className="text-reset text-decoration-none mr-3"
            to="/articles/new"
          >
            {location.pathname.includes('edit') ? (
              <Button variant="outline-danger">Delete article</Button>
            ) : (
              <Button variant="outline-primary">New article</Button>
            )}
          </Link>
          <Dropdown>
            <Dropdown.Toggle as={CustomToggle} />
            <Dropdown.Menu align="right">
              <Dropdown.Header>
                <div className="d-flex align-items-center">
                  <img
                    className="rounded-circle mr-2"
                    width="40"
                    height="40"
                    src="https://miro.medium.com/fit/c/262/262/1*LoU1WYCDpbNqNj2MKssqAA.jpeg"
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
        <Link className="text-reset text-decoration-none" to="/signup">
          <Button variant="outline-success">Sign Up</Button>
        </Link>
      )}
    </header>
  );
};

export default Header;
