import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { posts } from '../data/posts';

function Blog() {
  return (
    <motion.div
      className="blog-page"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="blog-header">
          <span className="label-mono">Writing</span>
          <h1>Blog</h1>
          <p>Occasional writing on software, tooling, and things I've had to figure out.</p>
        </div>

        <div className="blog-list">
          {posts.map(post => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card-link">
              <article className="blog-list-item">
                <div className="blog-list-meta">
                  <span className="post-date">{post.date}</span>
                  <span className="post-sep">·</span>
                  <span className="post-read-time">{post.readTime} read</span>
                </div>
                <h2 className="blog-list-title">{post.title}</h2>
                <p className="blog-list-excerpt">{post.excerpt}</p>
                <div className="post-tags">
                  {post.tags.map(tag => (
                    <span key={tag} className="post-tag">{tag}</span>
                  ))}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default Blog;
