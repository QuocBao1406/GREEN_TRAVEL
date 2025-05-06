import React, { useState, useEffect } from 'react';
import Post from './Post';
import PostCreator from './PostCreator';
import './NewsFeed.css';

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [showPostCreator, setShowPostCreator] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
  }, []);

  const handlePostSubmit = (newPost) => {
    if (!currentUser) return;
    
    setPosts(prev => [{
      id: Date.now(),
      content: newPost.content,
      images: newPost.images,
      likes: 0,
      comments: [],
      author: currentUser.username,
      createdAt: new Date().toISOString(),
    }, ...prev]);
    setShowPostCreator(false);
  };

  const openPostCreator = () => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để đăng bài');
      return;
    }
    setShowPostCreator(true);
  };

  return (
    <div className='news-feed'>
      {currentUser && (
        <div className='create-post-box' onClick={openPostCreator}>
          <div className='create-post-input'>
            <span>{currentUser.username} ơi, bạn đang nghĩ gì?</span>
          </div>
        </div>
      )}

      {showPostCreator && (
        <div className='modal-overlay' onClick={() => setShowPostCreator(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <PostCreator
              onPostSubmit={handlePostSubmit}
              onClose={() => setShowPostCreator(false)}
            />
          </div>
        </div>
      )}

      <div className='post-list'>
        {posts.map(post => (
          <Post 
            key={post.id} 
            post={post} 
            setPosts={setPosts}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;