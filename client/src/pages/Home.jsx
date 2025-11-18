import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/posts')
      .then(res => {
        // Handle both possible API responses
        const data = res.data.posts || res.data || [];
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("API Error:", err);
        setError("Failed to load posts");
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading posts...</h2>;
  if (error) return <h2 style={{color: 'red'}}>{error}</h2>;

  return (
    <div>
      <h1>Latest Blog Posts</h1>

      {posts.length === 0 ? (
        <p>No posts yet. <a href="/create">Create your first post!</a></p>
      ) : (
        posts.map(post => (
          <div key={post._id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            margin: '1rem 0',
            padding: '1.5rem',
            backgroundColor: '#fafafa'
          }}>
            {post.featuredImage && (
              <img 
                src={post.featuredImage} 
                alt={post.title}
                style={{ maxWidth: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
              />
            )}
            <h2 style={{ margin: '1rem 0' }}>{post.title || 'No title'}</h2>
            <p>{post.excerpt || (post.content?.substring(0, 150) + '...') || 'No content'}</p>
            <small>
              By <strong>{post.author?.username || 'Unknown'}</strong> • 
              {' '}{new Date(post.createdAt).toLocaleDateString()}
              {' '}• {post.viewCount || 0} views
            </small>
          </div>
        ))
      )}
    </div>
  );
}