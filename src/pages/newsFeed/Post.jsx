import React, { useState } from 'react';
import './NewsFeed.css';

const Post = ({post, setPosts}) => {
    const [comment, setComment] = useState('');

    const handleLike = () => {
        setPosts(prevPosts => 
            prevPosts.map(p =>
                p.id === post.id ? {...p, like: p.like + 1} : p
            )
        );
    };

    const handleAddComment = (e) => {
        e.preventDefault();
        if(!comment.trim()) return;

        const newComment = {
            id: Date.now(),
            content: comment,
            createdAt: new Date().toISOString()
        };

        setPosts(prevPosts =>
            prevPosts.map(p =>
                p.id === post.id ? {...p, comments: [...(p.comment || []), newComment]} : p
            )
        );

        setComment('');
    };

    return (
        <div className='post'>
            <div className='post-content'>
                <p>{post.content}</p>
                
                {post.images?.length > 0 && (
                    <div className='post-images'>
                        {post.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={'post-${post.id-${index}'}
                            />
                        ))}
                    </div>
                )}

                <div className='post-meta'>
                    <span>{post.likes} Lượt thích</span>
                    <small> [{new Date(post.createdAt).toLocaleString()}]</small>
                </div>
            </div>

            <div className='post-actions'>
                <button onClick={handleLike}>
                    👍 Thích
                </button>
                <button>
                    💬 Bình luận
                </button>
            </div>

            <div className='post-comments'>
                <div className='comment-list'>
                    {post.comment?.map(comment => (
                        <div key={comment.id} className='comment'>
                            <p>{comment.content}</p>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleAddComment} className='comment-form'>
                    <input
                        type='text'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder='Viết bình luận...'
                    />
                    <button type='submit'>Gửi</button>
                </form>
            </div>
        </div>  
    );
};

export default Post;