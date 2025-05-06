// Profile.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle, FaCamera } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [preview, setPreview] = useState(currentUser?.avatar || '');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setAvatar(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      if (avatar) {
        formData.append('avatar', avatar);
      }

      const response = await axios.put(
        `http://localhost:5000/api/users/${currentUser._id}/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Cập nhật thông tin người dùng trong localStorage
      const updatedUser = {
        ...currentUser,
        avatar: response.data.avatarUrl,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert('Cập nhật ảnh đại diện thành công!');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert('Có lỗi xảy ra khi cập nhật ảnh đại diện');
    }
  };

  return (
    <div className="profile-container">
      <h1>Hồ sơ cá nhân</h1>
      <form onSubmit={handleSubmit}>
        <div className="avatar-upload">
          <label htmlFor="avatar-upload">
            {preview ? (
              <img src={preview} alt="Avatar" className="avatar-preview" />
            ) : (
              <FaUserCircle size={100} />
            )}
            <div className="camera-icon">
              <FaCamera />
            </div>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
        <button type="submit">Lưu thay đổi</button>
      </form>
    </div>
  );
};

export default Profile;