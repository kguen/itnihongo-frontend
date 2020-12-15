import React, { useContext, useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../../../contexts/UserContext';
import AlertContext from '../../../contexts/AlertContext';
import tokenConfig from '../../../utils/tokenConfig';
import './styles.scss';

const ProfileEditForm = () => {
  const { user, setUser } = useContext(UserContext);
  const { setAlert } = useContext(AlertContext);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user.data) {
      setFormData({
        name: user.data?.user_name,
        email: user.data?.email,
        bio: user.data?.bio,
        age: user.data?.age,
        gender: user.data?.gender,
      });
    }
  }, [user.data]);

  const handleSubmit = event => {
    event.preventDefault();

    const submitData = new FormData();
    if (formData.name) submitData.append('name', formData.name);
    if (formData.email) submitData.append('email', formData.email);
    if (formData.bio) {
      submitData.append('bio', formData.bio);
    } else {
      submitData.append('bio', null);
    }
    if (formData.age) {
      submitData.append('age', formData.age);
    } else {
      submitData.append('age', null);
    }
    if (formData.gender) {
      submitData.append('gender', formData.gender);
    } else {
      submitData.append('gender', null);
    }
    if (formData.avatar) submitData.append('avatar', formData.avatar);

    axios
      .patch(
        'http://localhost:3030/api/v1/auth/me/edit',
        submitData,
        tokenConfig(user, true)
      )
      .then(({ data }) => {
        setUser({
          ...user,
          data: data.user,
          avatar: data.avatar,
        });
        setAlert({
          hasAlert: true,
          message: 'Profile updated!',
        });
      })
      .catch(err => {
        setAlert({
          hasAlert: true,
          message: `${err.response.data.errors[0]}.`,
          error: true,
        });
      });
  };

  return (
    <Form className="profile-edit-form" onSubmit={handleSubmit}>
      <Form.Group controlId="name">
        <Form.Label className="my-label">Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your name"
          value={formData.name}
          required
          minLength={5}
          maxLength={50}
          onChange={event =>
            setFormData({ ...formData, name: event.target.value })
          }
        />
        <Form.Text className="text-muted mt-2">
          Your name will appear on your{' '}
          <Link
            to={`/users/${user.data?.id}`}
            className="text-muted text-decoration-none"
          >
            <u>Profile</u>
          </Link>{' '}
          page. It is a required field.
        </Form.Text>
      </Form.Group>
      <Form.Group controlId="email" className="mt-5">
        <Form.Label className="my-label">Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter your email"
          required
          minLength={5}
          maxLength={255}
          value={formData.email}
          onChange={event =>
            setFormData({ ...formData, email: event.target.value })
          }
        />
        <Form.Text className="text-muted">
          Your email is required to login.
        </Form.Text>
      </Form.Group>
      <Form.Group controlId="bio" className="mt-5">
        <Form.Label className="my-label">Bio</Form.Label>
        <Form.Control
          type="text"
          placeholder="Add your bio"
          value={formData.bio}
          maxLength={200}
          onChange={event =>
            setFormData({ ...formData, bio: event.target.value })
          }
        />
        <Form.Text className="text-muted mt-2">
          Your bio will appear on your{' '}
          <Link
            to={`/users/${user.data?.id}`}
            className="text-muted text-decoration-none"
          >
            <u>Profile</u>
          </Link>{' '}
          page. Max 200 characters.
        </Form.Text>
      </Form.Group>
      <Form.Row className="w-75 mt-5">
        <Form.Group as={Col} controlId="age">
          <Form.Label className="my-label">Age</Form.Label>
          <Form.Control
            type="number"
            step="1"
            min={10}
            placeholder="Enter your age"
            value={formData.age}
            onChange={event =>
              setFormData({ ...formData, age: event.target.value })
            }
          />
        </Form.Group>
        <Form.Group as={Col} controlId="gender">
          <Form.Label className="my-label">Gender</Form.Label>
          <Form.Control
            as="select"
            defaultValue="0"
            value={formData.gender}
            onChange={event =>
              setFormData({ ...formData, gender: event.target.value })
            }
          >
            <option value="0">Choose your gender</option>
            <option value="1">Male</option>
            <option value="2">Female</option>
          </Form.Control>
        </Form.Group>
      </Form.Row>
      <Form.Text className="text-muted mt-2">
        Some additional information for us to know more about you.
      </Form.Text>
      <Form.Group className="mt-5 mb-5">
        <Form.Label className="my-label">Avatar</Form.Label>
        <Form.File
          name="file"
          accept="image/png, image/jpeg"
          className={formData.avatar ? 'has-image' : ''}
          label={
            formData.avatar
              ? formData.avatar.name
              : 'Choose one image to update your avatar'
          }
          onChange={event =>
            setFormData({ ...formData, avatar: event.target.files[0] })
          }
          custom
        />
        <Form.Text className="text-muted mt-2">
          Your avatar will appear on your{' '}
          <Link
            to={`/users/${user.data?.id}`}
            className="text-muted text-decoration-none"
          >
            <u>Profile</u>
          </Link>{' '}
          page, your articles and comments. File type: PNG or JPEG.
        </Form.Text>
      </Form.Group>
      <Button variant="outline-success" type="submit">
        Update your profile
      </Button>
    </Form>
  );
};

export default ProfileEditForm;
