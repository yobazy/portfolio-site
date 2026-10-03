import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { posts } from '../data/posts';
import { TransitionLink, useArrival } from '../lib/pageTransition';

const postContent = {
  'build-the-tool-you-can-see': {
    body: (
      <>
        <p>
          At some point this year I was running four or five Claude Code sessions at once, each in
          its own worktree, each chewing on a different branch. It felt productive right up until I
          realized how much of my day went to checking on them.
        </p>
        <p>
          Which one is stuck on a permission prompt? Which branch has work that never got pushed?
          Did that refactor finish, or has it been sitting there waiting for a yes for twenty
          minutes? I was the bottleneck in my own setup, and I was spending my attention on
          bookkeeping instead of on the actual problems.
        </p>
        <p>
          I could see exactly what I wanted: one window, every session across every project, the
          ones waiting on me at the top. So I built it. That's{' '}
          <TransitionLink to="/projects/nebula-desktop">Nebula Desktop</TransitionLink>.
        </p>

        <h2>When you can see it, build it</h2>
        <p>
          There's a specific feeling when a fix is obvious. Not "this could be better someday," but
          a clear picture of the thing that would make the friction go away. Most developers get
          that feeling several times a week and file it under later.
        </p>
        <p>
          I've started treating that feeling as a signal. If I can describe the tool in a sentence
          and I'll use it every day, the cost of building a first version is almost always lower
          than the cost of living without it. The friction compounds. A tool that saves thirty
          seconds on something you do forty times a day pays for itself in a week.
        </p>
        <p>
          The trap is scoping it like a product. Nebula Desktop didn't start as a desktop app. It
          started as "I need to know which session is waiting on me," and the first version did
          that and nothing else. Everything since came from using it.
        </p>

        <h2>Don't rebuild what already works</h2>
        <p>
          The fastest thing I did was not replace anything. Nebula already had a daemon and a
          terminal UI that I liked. The desktop app speaks the same socket protocol and writes to the
          same settings files, so both run side by side against the same sessions. I didn't have to
          migrate, and I didn't have to trust a new thing all at once.
        </p>
        <p>
          That's a pattern I keep coming back to: build the new surface on top of the thing that
          already works. You get to ship the useful part on day one instead of spending a month on
          parity.
        </p>

        <h2>Your workflow is a codebase too</h2>
        <p>
          We refactor code when it gets painful. We rarely refactor how we work. But the way you
          move between tasks, check status, ship a change, and context switch is a system, and it
          has bugs like any other system.
        </p>
        <p>
          A few of the ones Nebula Desktop fixed for me:
        </p>
        <p>
          <strong>Polling.</strong> I was manually cycling through terminals. Now there's a
          cross-project "waiting on you" queue with notifications, so the sessions come to me.
        </p>
        <p>
          <strong>Forgotten work.</strong> Worktree bands show branch status next to each session,
          so unpushed changes are hard to miss.
        </p>
        <p>
          <strong>Shipping ceremony.</strong> Commit &amp; push hands the job to an idle agent and
          waits until it finishes its turn. It's a small thing. I use it constantly.
        </p>
        <p>
          <strong>Cost blindness.</strong> Rust parses the Claude Code logs incrementally, so I can
          see what the week is costing without opening a dashboard.
        </p>
        <p>
          None of these are hard problems. They just weren't anybody else's problems, so nobody was
          going to fix them for me.
        </p>

        <h2>Make building the tool cheap too</h2>
        <p>
          The other thing that kept this fast was making it safe to iterate. There's a sandbox
          daemon with a fake agent CLI, so I can develop the app without touching my real sessions.
          Setup is one script that installs nebula at the pinned protocol version and builds the
          app.
        </p>
        <p>
          If your internal tool is annoying to work on, you'll stop working on it. The same rule
          applies all the way down.
        </p>

        <hr />

        <p>
          Developer creativity isn't only the product you ship. It's also noticing where your own
          time goes and deciding that's worth fixing. The best tools I use are the ones I built
          because I got tired of waiting for someone else to.
        </p>
        <p>
          Next time you catch yourself doing the same annoying thing for the fifth time and you can
          already picture the fix, give it an afternoon. The code is on{' '}
          <a href="https://github.com/yobazy/nebula-desktop" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{' '}
          if you want to see how this one turned out.
        </p>
      </>
    ),
  },
  'build-it-while-its-warm': {
    body: (
      <>
        <p>
          Ideas have a half-life. You get one in the shower or on the walk home, and it's vivid for
          about an hour. If you can try it in that window, you find out what it actually is. If you
          can't, it turns into a note you'll never open.
        </p>
        <p>
          <TransitionLink to="/projects/ghosts-playground">ghosts-playground</TransitionLink> is basically a machine for
          catching ideas before they go cold.
        </p>

        <h2>What it is</h2>
        <p>
          It's a camera playground for visuals. You step in front of a webcam, your silhouette
          becomes the mask, and a field of shaders moves through and around you. It's built for a
          dark room and a projector, but I prototype it at a desk. It's live at{' '}
          <a href="https://ghosts.fyi" target="_blank" rel="noopener noreferrer">ghosts.fyi</a>{' '}
          if you have a webcam handy.
        </p>
        <p>
          There are two sides to it. Live is the party camera, the thing you run in the room. Studio
          is the clip workbench, where I build and tune modes. The field behind the homepage of this
          site is a quiet port of one of them.
        </p>

        <h2>The loop is the product</h2>
        <p>
          The most important decision in the whole project was keeping the distance between
          "what if" and "oh, that's what it looks like" as short as possible. Change a value, see it
          on your own body a frame later. No build step I have to wait on, no export, no render
          queue.
        </p>
        <p>
          That matters more for visual work than almost anything else. You can't reason your way to
          whether a shader feels right. You have to watch it move. A tight loop means you get to try
          fifty versions of an idea in the time a slower setup gives you three, and the good one is
          usually somewhere in the forties.
        </p>
        <p>
          It also changes what you're willing to try. When an experiment costs ten seconds, you try
          the dumb ones. The dumb ones are where most of the interesting stuff comes from.
        </p>

        <h2>Real time changes how you think</h2>
        <p>
          There's a difference between designing something and playing with it. When the feedback is
          instant, I stop planning and start reacting. I'll push a parameter way past where it makes
          sense just to see it break, and sometimes the broken version is better than what I was
          aiming for.
        </p>
        <p>
          The webcam makes this even more direct. My own movement is part of the input, so testing a
          mode means stepping into frame and moving around. It's closer to playing an instrument than
          writing code. I don't think I'd have landed on half the modes if the loop involved sitting
          still.
        </p>

        <h2>Ship the rough version</h2>
        <p>
          ghosts-playground is public and still in progress, and that's on purpose. The piece is the
          live mixer, not a polished product page. Putting it in front of people early means I see
          how it reads to someone who didn't build it, which is the only feedback that really
          matters for something meant to be experienced in a room.
        </p>
        <p>
          If I'd waited until it felt done, it wouldn't exist. It would be a folder of sketches and
          a list of things I meant to try.
        </p>

        <h2>Why this carries over</h2>
        <p>
          This isn't only true for visuals. Any time I've cut the loop between an idea and seeing it
          run, I've gotten more creative with the work, whether that's a UI component, an API, or a
          workflow. Speed isn't just about finishing sooner. It's what lets you afford to explore.
        </p>

        <hr />

        <p>
          If you have a creative idea sitting in a notes app, the move is probably not to plan it
          better. It's to find the smallest version you can see running today, and build that while
          it's still warm.
        </p>
      </>
    ),
  },
  'stop-burning-tokens': {
    body: (
      <>
        <p>
          Most people who use Claude figure that longer prompts are better. More context, more
          examples, more explanation. More for the AI to work with.
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
          and queries are hitting 800ms. Should I add a partial index on status or partition by
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
  const arrived = useArrival();
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
  );
}

export default BlogPost;
