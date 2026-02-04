import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getMyPosts, deletePost } from '../services/api';
import { Post } from '../types';
import '../pages/styles/Home.css';

const MyPosts: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (user) {
        try {
          const data = await getMyPosts();
          setPosts(data);
        } catch (err) {
          setPosts([]);
        }
      }
      setLoading(false);
    };
    fetchPosts();
  }, [user]);

  const handleDelete = async (postId: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err: any) {
      setError('Failed to delete post');
    }
  };

  if (!user) return <div>Please log in to view your posts.</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="my-posts-page">
      <h2>My Posts</h2>
      {error && <p className="error">{error}</p>}
      <div className="post-list">
        {posts.length === 0 ? (
          <p>You haven't created any posts yet.</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card">
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              {post.comments.length > 0 && (
                <p className="first-comment">
                  First comment: {post.comments[0].content} by {post.comments[0].userName || post.comments[0].authorId}
                </p>
              )}
              <button onClick={() => handleDelete(post.id)} style={{marginTop: '10px', background: '#dc3545'}}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyPosts;