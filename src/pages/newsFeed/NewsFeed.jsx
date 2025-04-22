import React, { useState, useRef } from 'react';
import Post from './Post';
import './NewsFeed.css';

const PostCreator = ({ onPostSubmit, onClose }) => {
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        if(e.target.files) {
            const filesArray = Array.from(e.target.files).map(file => URL.createObjectURL(file));
            setImages(prev => [...prev, ...filesArray]);
        }
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!content.trim() && images.length === 0) return;

        onPostSubmit({ content, images });
        setContent('');
        setImages([]);
        onClose();
    };

    return (
        <div className='post-creator-container'>
            <div className='post-creator-popup'>
                <div className='post-creator-header'>
                    <h3>Tạo Bài Viết</h3>
                    <button 
                        className='close-btn' 
                        onClick={onClose}
                        aria-label='Đóng'
                    >
                        &times;
                    </button>
                </div>

                <div className='post-creator-body'>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder='Bạn đang nghĩ gì?'
                        rows={10}
                        autoFocus
                    />
                </div>

                <div className='image-preview-container'>
                    {images.map((img, index) => (
                        <div key={index} className='image-preview-item'>
                            <img src={img} alt={`preview ${index}`} />
                            <button
                                onClick={() => removeImage(index)}
                                className='remove-image-btn'
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>

                <div className='post-creator-footer'>
                    <div className='attachment-options'>
                        <button
                            type='button'
                            onClick={() => fileInputRef.current.click()}
                            className='add-photo-btn'
                        >
                            📷Ảnh/Video
                        </button>
                        <input
                        type='file'
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        multiple
                        accept='image/*,video/*'
                        style={{ display: 'none' }}
                        />
                    </div>

                    <button
                        type='submit'
                        onClick={handleSubmit}
                        className='post-submit-btn'
                        disabled={!content.trim() && images.length === 0}
                    >
                        Đăng
                    </button>
                </div>
            </div>
        </div>
    );
};

const NewsFeed = () => {
    const [posts, setPosts] = useState([]);
    const [showPostCreator, setShowPostCreator] = useState(false);

    const handlePostSubmit = (newPost) => {
        setPosts(prev => [{
            id: Date.now(),
            content: newPost.content,
            images: newPost.images,
            likes: 0,
            comments: [],
            createdAt: new Date().toISOString(),
        }, ...prev]);
        setShowPostCreator(false);
    };

    return (
        <div className='news-feed'>
            <div className='create-post-box' onClick={() => setShowPostCreator(true)}>
                <div className='create-post-input'>
                    <span>Bạn đang nghĩ gì?</span>
                </div>
            </div>

            {showPostCreator && (
                <div 
                    className='modal-overlay'
                    onClick={() => setShowPostCreator(false)}
                >
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
                    <Post key={post.id} post={post} setPosts={setPosts} />
                ))}
            </div>
        </div>
    );
};

export default NewsFeed;
