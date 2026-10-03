import React from 'react';
import { motion } from 'framer-motion';
import { posts } from '../data/posts';
import { TransitionLink, useArrival } from '../lib/pageTransition';

function Blog() {
  const arrived = useArrival();

  return (
    <motion.div
      className="blog-page"
      initial={arrived ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="blog-header">
          <span className="label-mono">Writing</span>
          <h1 className="page-title">Blog</h1>
          <p>Occasional writing on software, tooling, and things I've had to figure out.</p>
        </div>

        <div className="blog-list">
          {posts.map(post => (
            <TransitionLink key={post.slug} to={`/blog/${post.slug}`} className="blog-card-link">
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
            </TransitionLink>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default Blog;
