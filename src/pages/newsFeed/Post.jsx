import React, { useState } from 'react';
import './NewsFeed.css';
import { FaThumbsUp, FaRegThumbsUp, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Post = ({ post, setPosts, currentUser }) => {
  const [comment, setComment] = useState('');
  const [isHoveringLike, setIsHoveringLike] = useState(false);

  const hasLiked = currentUser && post.likedBy?.includes(currentUser.username);

  const handleLike = () => {
    if (!currentUser) return;
    
    setPosts(prevPosts => 
      prevPosts.map(p => {
        if (p.id === post.id) {
          const hasLiked = p.likedBy?.includes(currentUser.username);
          return {
            ...p,
            likes: hasLiked ? p.likes - 1 : p.likes + 1,
            likedBy: hasLiked 
              ? p.likedBy.filter(user => user !== currentUser.username)
              : [...(p.likedBy || []), currentUser.username]
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!comment.trim() || !currentUser) return;

    const newComment = {
      id: Date.now(),
      content: comment,
      author: currentUser.username,
      authorAvatar: currentUser.avatar, // Thêm avatar người bình luận
      createdAt: new Date().toISOString()
    };

    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === post.id ? { 
          ...p, 
          comments: [...(p.comments || []), newComment] 
        } : p
      )
    );
    setComment('');
  };

  return (
    <div className='post'>
      <div className='post-header'>
        <div className="author-info">
          <Link to={`/profile/${post.authorId}`} className="author-avatar">
            {post.authorAvatar ? (
              <img 
                src={post.authorAvatar} 
                alt={`${post.author}'s avatar`}
                className="avatar-image"
              />
            ) : (
              <FaUserCircle className="default-avatar" />
            )}
          </Link>
          <div className="author-details">
            <Link to={`/profile/${post.authorId}`} className="post-author">
              {post.author}
            </Link>
            <small className='post-time'>
              {new Date(post.createdAt).toLocaleString()}
            </small>
          </div>
        </div>
      </div>

      <div className='post-content'>
        <p>{post.content}</p>
        
        {post.images?.length > 0 && (
          <div className='post-images'>
            {post.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`post-${post.id}-${index}`}
              />
            ))}
          </div>
        )}

        <div className='post-meta'>
          <span>{post.likes || 0} Lượt thích</span>
          {post.comments?.length > 0 && (
            <span>{post.comments.length} Bình luận</span>
          )}
        </div>
      </div>

      <div className='post-actions'>
        <button 
          onClick={handleLike}
          onMouseEnter={() => setIsHoveringLike(true)}
          onMouseLeave={() => setIsHoveringLike(false)}
          disabled={!currentUser}
          className={`like-btn ${hasLiked ? 'liked' : ''}`}
        >
          {hasLiked ? (
            <>
              <FaThumbsUp className="like-icon" />
              <span>Thích</span>
            </>
          ) : isHoveringLike ? (
            <>
              <FaThumbsUp className="like-icon hover" />
              <span>Thích</span>
            </>
          ) : (
            <>
              <FaRegThumbsUp className="like-icon" />
              <span>Thích</span>
            </>
          )}
        </button>
        <button className="comment-btn" disabled={!currentUser}>
          💬 Bình luận
        </button>
      </div>

      <div className='post-comments'>
        {post.comments?.map(comment => (
          <div key={comment.id} className='comment'>
            <div className="comment-author-info">
              <Link to={`/profile/${comment.authorId}`} className="comment-avatar">
                {comment.authorAvatar ? (
                  <img 
                    src={comment.authorAvatar} 
                    alt={`${comment.author}'s avatar`}
                    className="avatar-image"
                  />
                ) : (
                  <FaUserCircle className="default-avatar small" />
                )}
              </Link>
              <div className="comment-content-wrapper">
                <Link to={`/profile/${comment.authorId}`} className='comment-author'>
                  {comment.author}
                </Link>
                <span className='comment-content'>{comment.content}</span>
              </div>
            </div>
          </div>
        ))}

        {currentUser && (
          <form onSubmit={handleAddComment} className='comment-form'>
            <div className="current-user-avatar">
              {currentUser.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={`${currentUser.username}'s avatar`}
                  className="avatar-image"
                />
              ) : (
                <FaUserCircle className="default-avatar small" />
              )}
            </div>
            <input
              type='text'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Viết bình luận...'
            />
            <button type='submit'>Gửi</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Post;