import React from 'react';
import { useParams } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { posts } from '../data/posts';
import { TransitionLink, useArrival } from '../lib/pageTransition';

const postContent = {
  'build-the-tool-you-can-see': {
    body: (
      <>
        <p>
          At some point this year I had four or five Claude Code sessions running at once, each in
          its own worktree, each on a different branch. It felt productive until I noticed how much
          of my day went to checking on them.
        </p>
        <p>
          The questions were always the same. Which one is stuck on a permission prompt? Which branch
          has work that never got pushed? Did that refactor finish, or has it been waiting twenty
          minutes for me to type "y"? The agents were moving fast enough. I was the one holding
          things up.
        </p>
        <p>
          What I wanted was one window with every session across every project, and the ones waiting
          on me at the top. Nothing did that, so I built it. That's{' '}
          <TransitionLink to="/projects/nebula-desktop">Nebula Desktop</TransitionLink>.
        </p>

        <h2>The first version</h2>
        <p>
          It didn't start as a desktop app. It started as "which session is waiting on me," and the
          first version answered that and nothing else. Everything since came from using it every day
          and noticing what still bugged me.
        </p>
        <p>
          I also didn't replace anything. Nebula already had a daemon and a terminal UI I liked. The
          desktop app speaks the same socket protocol and writes to the same settings files, so the
          two run side by side against the same sessions. There was nothing to migrate, and I could
          keep using the TUI while the app was still rough.
        </p>

        <h2>What it fixed</h2>
        <p>
          Most of the features are fixes for things I was doing by hand.
        </p>
        <p>
          I was cycling through terminals to see who needed me. Now there's a "waiting on you" queue
          across all projects, with notifications, so I don't have to go looking.
        </p>
        <p>
          I kept losing track of unpushed work. Each session now shows its worktree's branch status
          next to it, which makes forgotten commits hard to miss.
        </p>
        <p>
          Committing and pushing was the same little routine every time. Now a Commit &amp; push
          button hands the job to an idle agent and waits for it to finish its turn. It's a small
          thing and I use it constantly.
        </p>
        <p>
          I also had no idea what a week of this was costing. The app parses the Claude Code logs
          incrementally in Rust, so the number is just there, no dashboard required.
        </p>
        <p>
          None of these were hard problems. They just weren't anyone else's problems.
        </p>

        <h2>Working on it</h2>
        <p>
          What kept this moving was making the app safe to work on. There's a sandbox daemon with a
          fake agent CLI, so I can develop against pretend sessions instead of my real ones. Setup is
          one script that installs nebula at the pinned protocol version and builds the app.
        </p>
        <p>
          That mattered more than I expected. I've abandoned plenty of internal tools because they
          were a pain to change, and I didn't want this to be another one.
        </p>
        <p>
          The code is on{' '}
          <a href="https://github.com/yobazy/nebula-desktop" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{' '}
          if you want to see how it's put together.
        </p>
      </>
    ),
  },
  'build-it-while-its-warm': {
    body: (
      <>
        <p>
          <TransitionLink to="/projects/ghosts-playground">ghosts-playground</TransitionLink> started
          because I wanted to stand in front of a projector and have shaders move around me. That's
          pretty much the whole idea. You step in front of a webcam, your silhouette becomes a mask,
          and the visuals move through and around you.
        </p>
        <p>
          It's meant for a dark room and a projector. Most of it got built at a desk under normal
          lighting, which is a lot less atmospheric. It's live at{' '}
          <a href="https://ghosts.fyi" target="_blank" rel="noopener noreferrer">ghosts.fyi</a>{' '}
          if you have a webcam handy.
        </p>

        <h2>How it's set up</h2>
        <p>
          There are two parts. Live is the party camera, the thing you run in the room. Studio is the
          workbench where I build and tune modes. The background on this site's homepage is a quieter
          port of one of them.
        </p>

        <h2>The edit loop</h2>
        <p>
          The decision that mattered most was keeping the gap between an idea and seeing it as short
          as I could. I change a value and see it on myself a frame later. There's no build step to
          wait on, no export and no render queue.
        </p>
        <p>
          With visual work you can't really reason your way to whether a shader looks right. You have
          to watch it move. A fast loop meant I could try fifty versions of something in the time a
          slower setup would give me three, and the one I kept was usually somewhere in the forties.
        </p>
        <p>
          It also changed which ideas I bothered with. When an experiment takes ten seconds I try the
          silly ones too, and a lot of the modes I like came from those.
        </p>

        <h2>Playing with it</h2>
        <p>
          When the feedback is instant I stop planning and start reacting. I'll push a parameter way
          past where it makes sense just to see it break, and sometimes the broken version is better
          than what I was going for.
        </p>
        <p>
          The webcam makes it physical. My own movement is part of the input, so testing a mode means
          stepping into frame and moving around. It's closer to playing an instrument than writing
          code, and I don't think I'd have found half the modes if testing meant sitting still.
        </p>

        <h2>Shipping it rough</h2>
        <p>
          ghosts-playground is public and still in progress, on purpose. The point is the live mixer,
          not a polished product page. Putting it in front of people early shows me how it reads to
          someone who didn't build it, and for something meant to be experienced in a room, that's
          the feedback I actually need.
        </p>
        <p>
          If I'd waited until it felt finished, it would still be a folder of sketches and a list of
          things I meant to try.
        </p>
        <p>
          I've noticed the same thing outside of visuals. Whenever I've shortened the loop between an
          idea and seeing it run, on a UI component or an API, I end up trying more things.
          ghosts-playground is just where it was most obvious.
        </p>
      </>
    ),
  },
  'stop-burning-tokens': {
    body: (
      <>
        <p>
          For a while my default with Claude was to give it everything: the whole file, a paragraph
          of background, a reminder of what we'd already covered. More context seemed like it could
          only help.
        </p>
        <p>
          It mostly didn't. The context window is how much text Claude can hold at once, and it fills
          up. In a long conversation, older stuff gets compressed or dropped. Everything you add also
          gets read, so if your question comes after a page of background, a lot of the effort goes
          into the background.
        </p>
        <p>These are the habits that cost me the most.</p>

        <h2>Repeating yourself</h2>
        <p>
          If I'm five messages in and typing "as I mentioned, this is a TypeScript project," that's
          either something Claude already knows or something I should have said in the first message.
          Saying it once, up front, is enough.
        </p>

        <h2>Pasting the whole file</h2>
        <p>
          I used to paste an 800-line file and ask Claude to find the bug in the auth handler. I
          already knew it was in the auth handler. I'd said so in the question.
        </p>

        <h2>One giant prompt</h2>
        <p>
          The urge is to front-load everything Claude might need so the first answer comes back
          right. A short back-and-forth works better: describe the problem, see what comes back,
          adjust. Three focused messages usually use less context than one prompt that tries to
          predict everything.
        </p>

        <h2>Sessions that have gone sideways</h2>
        <p>
          Long sessions collect junk, like approaches you gave up on, wrong assumptions and
          corrections to the corrections. All of it is still in the context and still affects the
          answers, even after you've moved on. Once a session has gone off track twice, I start a new
          one with a cleaner prompt. That's quicker than steering the old one back.
        </p>

        <h2>Vague questions</h2>
        <p>
          "What should I do about my database schema?" asks Claude to do the thinking I skipped. "My
          users table has 40M rows and queries take 800ms. Partial index on status, or partition by
          date?" gets a useful answer in one reply. I've learned to get to the actual decision first
          and then ask about that.
        </p>

        <hr />

        <p>
          Claude Code shows the token count for the session, which helps. When a conversation is at
          80k tokens and we're still going in circles, I take that as my cue to start over.
        </p>
      </>
    ),
  },
};

function BlogPost() {
  const arrived = useArrival();
  const { scrollYProgress } = useScroll();
  const { slug } = useParams();
  const meta = posts.find(p => p.slug === slug);
  const content = postContent[slug];

  if (!meta || !content) {
    return (
      <div className="blog-page">
        <div className="container">
          <p style={{ color: 'var(--text-secondary)', paddingTop: '8rem' }}>Post not found.</p>
          <TransitionLink to="/blog" className="btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            Back to blog
          </TransitionLink>
        </div>
      </div>
    );
  }

  return (
    <>
    {/* Outside the page wrapper: its entrance transform would anchor a fixed child. */}
    <motion.div className="read-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
    <motion.div
      className="blog-page"
      initial={arrived ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="post-container">
          <TransitionLink to="/blog" className="post-back">← Blog</TransitionLink>

          <header className="post-header">
            <div className="post-meta">
              <span className="post-date">{meta.date}</span>
              <span className="post-sep">·</span>
              <span className="post-read-time">{meta.readTime} read</span>
            </div>
            <h1 className="post-title page-title">{meta.title}</h1>
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
    </>
  );
}

export default BlogPost;
