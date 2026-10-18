import { useEffect, useRef, useState } from 'react';

// iPhone 15 logical points. The phone is laid out at this size and scaled
// to fit, so it always has the proportions people know.
const PHONE_W = 393;
const PHONE_H = 852;

// A small, working version of Any Chills? for the deck: the feed from the
// site's phone, with everything tappable. Join a plan, vote on a time, stick
// an emoji on a card, make a plan and send it. Nothing is saved anywhere.
// Copy follows the app's own ("I'm in", "You're in", "Not now", the clink).

const FRIENDS = ['Priya', 'Jordan', 'Ana', 'Theo', 'Maya'];
const STICKERS = ['🙌', '🔥', '🍕', '🎲', '✨', '🏃'];
const IDEAS = ['Tacos tonight?', 'Coffee walk', 'Board games', 'Sunday run', 'Pour-overs'];
const WHENS = ['Tonight', 'Tomorrow', 'This weekend'];

const initials = (name) => name.slice(0, 2).toUpperCase();

const START = [
  {
    id: 'tacos',
    host: 'Jordan',
    title: 'Tacos on Ossington',
    day: 'Tonight',
    time: '7:30 pm',
    tone: 'clay',
    going: ['Jordan', 'Ana'],
    spots: 3,
    status: 'invited',
    stickers: [],
  },
  {
    id: 'pilot',
    host: 'Priya',
    title: 'Pour-overs at Pilot',
    day: 'Saturday',
    time: '11 am',
    tone: 'moss',
    going: ['Priya', 'Maya', 'Noah', 'You'],
    deciding: 1,
    status: 'in',
    stickers: ['☕️'],
  },
  {
    id: 'games',
    host: 'Theo',
    title: 'Board games at mine',
    day: 'Picking a time',
    time: 'Sat or Sun?',
    tone: 'plum',
    going: ['Theo', 'Maya'],
    spots: 2,
    status: 'invited',
    stickers: [],
    vote: { options: [{ label: 'Saturday', votes: 2 }, { label: 'Sunday', votes: 1 }], mine: null },
  },
];

const Faces = ({ names }) => (
  <span className="ch-faces" aria-hidden="true">
    {names.slice(0, 4).map((name, i) => (
      <span key={name + i} className={`ch-face ${name === 'You' ? 'is-you' : ''}`}>
        {name === 'You' ? '✓' : initials(name)}
      </span>
    ))}
  </span>
);

const ChillsDemo = () => {
  const [plans, setPlans] = useState(START);
  const [toast, setToast] = useState({ text: 'Jordan is in 🙌', sub: 'Tacos on Ossington · tonight' });
  const [stickerFor, setStickerFor] = useState(null);
  const [composer, setComposer] = useState(false);
  const [draft, setDraft] = useState({ title: '', when: 'Tonight', friends: ['Priya', 'Jordan'] });
  const [tab, setTab] = useState('This week');
  const timer = useRef(null);
  const feed = useRef(null);
  const frame = useRef(null);
  const [scale, setScale] = useState(0.8);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Fit the phone to the space it has, never larger than life.
  useEffect(() => {
    const node = frame.current;
    if (!node) return undefined;
    const fit = () => {
      const phone = window.matchMedia('(max-width: 900px)').matches;
      const maxH = phone ? window.innerHeight * 0.7 : Math.min(window.innerHeight * 0.68, 700);
      setScale(Math.min(1, node.clientWidth / PHONE_W, maxH / PHONE_H));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(node);
    window.addEventListener('resize', fit);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, []);

  const say = (text, sub) => {
    setToast({ text, sub });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2600);
  };

  const update = (id, fn) => setPlans((list) => list.map((plan) => (plan.id === id ? fn(plan) : plan)));

  const join = (plan) => {
    update(plan.id, (p) => ({ ...p, status: 'in', going: [...p.going, 'You'], spots: p.spots ? p.spots - 1 : p.spots }));
    const others = plan.going.filter((n) => n !== 'You');
    say(`You're in. ${others.slice(0, 2).join(' and ')} just got a buzz.`, 'Tap the card to stick something on');
    setStickerFor(plan.id);
  };

  const leave = (plan) => {
    update(plan.id, (p) => ({ ...p, status: 'invited', going: p.going.filter((n) => n !== 'You'), spots: p.spots ? p.spots + 1 : p.spots }));
    setStickerFor(null);
    say('No worries. The host sees it as a no.');
  };

  const maybe = (plan) => {
    update(plan.id, (p) => ({ ...p, status: 'maybe' }));
    say("Marked as maybe. You'll get a nudge on the day.");
  };

  const stick = (plan, emoji) => {
    update(plan.id, (p) => ({ ...p, stickers: [...p.stickers, emoji].slice(-5) }));
    setStickerFor(null);
    say(`Stuck ${emoji} on ${plan.host}'s plan. Everyone invited sees it.`);
  };

  const vote = (plan, label) => {
    update(plan.id, (p) => ({
      ...p,
      vote: {
        mine: label,
        options: p.vote.options.map((o) => ({
          ...o,
          votes: o.votes + (o.label === label ? 1 : 0) - (o.label === p.vote.mine ? 1 : 0),
        })),
      },
    }));
    say(`You can make ${label}. Theo picks once enough people answer.`);
  };

  const send = () => {
    const title = draft.title || IDEAS[0];
    const plan = {
      id: `new-${Date.now()}`,
      host: 'You',
      title,
      day: draft.when,
      time: draft.when === 'Tonight' ? '8 pm' : 'Time TBD',
      tone: 'sage',
      going: ['You'],
      spots: draft.friends.length,
      status: 'host',
      stickers: [],
    };
    setPlans((list) => [plan, ...list]);
    setComposer(false);
    setDraft({ title: '', when: 'Tonight', friends: ['Priya', 'Jordan'] });
    say(`Sent. ${draft.friends.slice(0, 2).join(' and ')} just got a buzz.`, 'Share the link to drop it in the group chat');
    feed.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFriend = (name) =>
    setDraft((d) => ({ ...d, friends: d.friends.includes(name) ? d.friends.filter((f) => f !== name) : [...d.friends, name] }));

  return (
    <div className="ch" data-no-field ref={frame}>
      <div className="ch-device" style={{ width: PHONE_W * scale, height: PHONE_H * scale }}>
      <div
        className="ch-phone"
        role="group"
        aria-label="Any Chills? demo. Tap around; nothing is saved."
        style={{ width: PHONE_W, height: PHONE_H, transform: `scale(${scale})` }}
      >
        <div className="ch-status" aria-hidden="true">
          <span>9:41</span>
          <span className="ch-island" />
          <span className="ch-signal">
            <i /><i /><i /><i />
            <b />
          </span>
        </div>
        <div className="ch-top">
          <span className="ch-brand">
            <span className="ch-clink" aria-hidden="true" />
            any chills?
          </span>
          <button type="button" className="ch-new" onClick={() => setComposer(true)}>
            New plan
          </button>
        </div>

        {toast && (
          <div className="ch-toast" role="status">
            <span className="ch-toast-text">{toast.text}</span>
            {toast.sub && <span className="ch-toast-sub">{toast.sub}</span>}
          </div>
        )}

        {composer ? (
          <div className="ch-composer">
            <p className="ch-label">What&rsquo;s the plan?</p>
            <input
              className="ch-input"
              value={draft.title}
              placeholder={IDEAS[0]}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              aria-label="Plan title"
            />
            <div className="ch-chips">
              {IDEAS.map((idea) => (
                <button key={idea} type="button" className="ch-chip" onClick={() => setDraft((d) => ({ ...d, title: idea }))}>
                  {idea}
                </button>
              ))}
            </div>
            <p className="ch-label">When</p>
            <div className="ch-chips">
              {WHENS.map((when) => (
                <button
                  key={when}
                  type="button"
                  className={`ch-chip ${draft.when === when ? 'is-on' : ''}`}
                  onClick={() => setDraft((d) => ({ ...d, when }))}
                >
                  {when}
                </button>
              ))}
            </div>
            <p className="ch-label">Who</p>
            <div className="ch-chips">
              {FRIENDS.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`ch-chip ch-friend ${draft.friends.includes(name) ? 'is-on' : ''}`}
                  onClick={() => toggleFriend(name)}
                >
                  <span className="ch-face">{initials(name)}</span>
                  {name}
                </button>
              ))}
            </div>
            <div className={`ch-card is-sage ch-preview`}>
              <span className="ch-card-host">Your plan</span>
              <span className="ch-card-when">{draft.when}</span>
              <span className="ch-card-title">{draft.title || IDEAS[0]}</span>
              <span className="ch-card-meta">{draft.friends.length || 'No'} invited</span>
            </div>
            <div className="ch-composer-actions">
              <button type="button" className="ch-ghost" onClick={() => setComposer(false)}>
                Cancel
              </button>
              <button type="button" className="ch-send" onClick={send} disabled={!draft.friends.length}>
                Send to {draft.friends.length ? draft.friends.slice(0, 2).join(' & ') : 'friends'}
                {draft.friends.length > 2 ? ` +${draft.friends.length - 2}` : ''}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="ch-tabs" role="tablist" aria-label="When">
              {['Today', 'This week', 'Later'].map((name) => (
                <button key={name} type="button" role="tab" aria-selected={tab === name} className={tab === name ? 'is-on' : ''} onClick={() => setTab(name)}>
                  {name}
                </button>
              ))}
            </div>
            <p className="ch-count">{plans.length} plans this week</p>
            <div className="ch-feed" ref={feed}>
              {plans
                .filter((p) => tab !== 'Today' || p.day === 'Tonight')
                .map((plan) => (
                  <article key={plan.id} className={`ch-card is-${plan.tone}`}>
                    <span className="ch-card-host">
                      <span className="ch-face">{plan.host === 'You' ? '✓' : initials(plan.host)}</span>
                      {plan.host === 'You' ? 'Your plan' : `${plan.host} invited you`}
                    </span>
                    <span className="ch-card-when">
                      <small>{plan.day}</small>
                      {plan.time}
                    </span>
                    <span className="ch-card-title">{plan.title}</span>
                    {plan.stickers.length > 0 && (
                      <span className="ch-stuck" aria-label={`Stickers: ${plan.stickers.join(' ')}`}>
                        {plan.stickers.map((s, i) => (
                          <span key={s + i} style={{ '--n': i }}>
                            {s}
                          </span>
                        ))}
                      </span>
                    )}
                    <span className="ch-card-row">
                      <Faces names={plan.going} />
                      <span className="ch-card-meta">
                        <b>{plan.going.length} going</b>
                        {plan.spots ? ` · ${plan.spots} spot${plan.spots === 1 ? '' : 's'} left` : plan.deciding ? ` · ${plan.deciding} deciding` : ''}
                      </span>
                      {plan.status === 'invited' && (
                        <button type="button" className="ch-join" onClick={() => join(plan)}>
                          I&rsquo;m in
                        </button>
                      )}
                      {plan.status === 'maybe' && (
                        <button type="button" className="ch-join is-maybe" onClick={() => join(plan)}>
                          Maybe · tap to join
                        </button>
                      )}
                      {plan.status === 'in' && (
                        <button type="button" className="ch-join is-in" onClick={() => setStickerFor(stickerFor === plan.id ? null : plan.id)}>
                          ✓ You&rsquo;re in
                        </button>
                      )}
                      {plan.status === 'host' && <span className="ch-join is-in">Sent</span>}
                    </span>
                    {plan.vote && (
                      <span className="ch-vote">
                        {plan.vote.options.map((o) => (
                          <button key={o.label} type="button" className={plan.vote.mine === o.label ? 'is-on' : ''} onClick={() => vote(plan, o.label)}>
                            {o.label}
                            <small>
                              {o.votes} can make it
                            </small>
                          </button>
                        ))}
                      </span>
                    )}
                    {plan.status === 'invited' && (
                      <span className="ch-quiet">
                        <button type="button" onClick={() => maybe(plan)}>
                          Maybe
                        </button>
                        <button type="button" onClick={() => say("Not now. No reply counts as a no, so nothing else to do.")}>
                          Not now
                        </button>
                      </span>
                    )}
                    {plan.status === 'in' && plan.host !== 'You' && (
                      <span className="ch-quiet">
                        <button type="button" onClick={() => leave(plan)}>
                          Can&rsquo;t make it
                        </button>
                      </span>
                    )}
                    {stickerFor === plan.id && (
                      <span className="ch-strip" role="group" aria-label="Stick something on">
                        {STICKERS.map((s) => (
                          <button key={s} type="button" onClick={() => stick(plan, s)} aria-label={`Stick ${s}`}>
                            {s}
                          </button>
                        ))}
                      </span>
                    )}
                  </article>
                ))}
            </div>
          </>
        )}
        <div className="ch-tabbar" aria-hidden="true">
          <span className="is-on">Plans</span>
          <span>Friends</span>
          <span>Activity</span>
          <span>You</span>
        </div>
        <span className="ch-home" aria-hidden="true" />
      </div>
      </div>
      <p className="ch-note">A working sketch of the app. Tap anything. Nothing is saved.</p>
    </div>
  );
};

export default ChillsDemo;
