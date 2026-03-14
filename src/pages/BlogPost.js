import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { posts } from '../data/posts';

const postContent = {
  'stop-burning-tokens': {
    body: (
      <>
        <p>
          Most people who use Claude figure that longer prompts are better. More context, more
          examples, more explanation — more for the AI to work with.
        </p>
        <p>I used to think this too. I was wrong about it pretty consistently.</p>
        <p>
          The context window is basically how much text Claude can hold in its head at once, and
          it's finite. In a long conversation, older stuff gets compressed or dropped. But more
          relevantly: everything you add gets processed. A big rambling system prompt before a
          simple question means a lot of that processing goes toward noise.
        </p>
        <p>Some things I've noticed that actually cost you:</p>

        <h2>Repeating context that's already there</h2>
        <p>
          If you're five messages in and you're writing "as I mentioned, this is a TypeScript
          project..." you're either burning tokens on something Claude already knows, or you never
          set up the context cleanly. Put it up front once.
        </p>

        <h2>Pasting the whole file when you need one function</h2>
        <p>
          You probably know where the bug is. If you're dumping an 800-line file and asking Claude
          to find the issue in the auth handler, you already know it's in the auth handler. Paste
          that part.
        </p>

        <h2>Trying to nail it in one massive prompt</h2>
        <p>
          The instinct is to front-load everything Claude might possibly need, because you want to
          get the answer right the first time. A focused three-message exchange usually works better
          and uses less context than one sprawling attempt to anticipate everything. Say the problem,
          see what comes back, adjust.
        </p>

        <h2>Keeping a conversation alive past the point where it's useful</h2>
        <p>
          Long sessions accumulate junk: abandoned approaches, wrong assumptions, corrections to
          corrections. All still in the context, influencing responses in ways you can't fully see.
          If a session has gone sideways twice, starting over with a cleaner prompt is usually faster
          than trying to fix it in place.
        </p>

        <h2>Asking Claude to figure out the problem instead of telling it what the problem is</h2>
        <p>
          "What should I do about my database schema?" is expensive. "My users table has 40M rows
          and queries are hitting 800ms — should I add a partial index on status or partition by
          date?" is cheap. Do enough thinking to get to the actual decision point first, then ask
          about that specific thing.
        </p>

        <hr />

        <p>
          None of this is about being terse for its own sake. It's about not burying what actually
          matters under everything that doesn't.
        </p>
        <p>
          If you're on Claude Code, your token count is visible in the session. If a conversation is
          at 80k tokens and you're still going in circles, just start a new one. Fresh context
          consistently produces better results than trying to repair a long conversation that went
          off course.
        </p>
      </>
    ),
  },
};

function BlogPost() {
  const { slug } = useParams();
  const meta = posts.find(p => p.slug === slug);
  const content = postContent[slug];

  if (!meta || !content) {
    return (
      <div className="blog-page">
        <div className="container">
          <p style={{ color: 'var(--text-secondary)', paddingTop: '8rem' }}>Post not found.</p>
          <Link to="/blog" className="btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="blog-page"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="post-container">
          <Link to="/blog" className="post-back">← Blog</Link>

          <header className="post-header">
            <div className="post-meta">
              <span className="post-date">{meta.date}</span>
              <span className="post-sep">·</span>
              <span className="post-read-time">{meta.readTime} read</span>
            </div>
            <h1 className="post-title">{meta.title}</h1>
            <div className="post-tags">
              {meta.tags.map(tag => (
                <span key={tag} className="post-tag">{tag}</span>
              ))}
            </div>
          </header>

          <article className="post-body">
            {content.body}
          </article>
        </div>
      </div>
    </motion.div>
  );
}

export default BlogPost;
