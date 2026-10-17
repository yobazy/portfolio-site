import imgScheduler from '../assets/img/proj-scheduler.png';
import imgJungle from '../assets/img/proj-jungle.png';
import imgTinyapp from '../assets/img/proj-tinyapp.png';
import imgReasonable from '../assets/img/proj-reasonable.png';
import imgLink from '../assets/img/link-dark.jpg';
import imgLinkInvite from '../assets/img/link-invite.jpg';
import imgCnDiagram from '../assets/img/cn-integration-diagram.svg';
import imgMyfi from '../assets/img/myfi-dashboard.jpg';
import imgBarberbot from '../assets/img/barberbot.jpg';
import imgPlayground from '../assets/img/ghosts-playground.jpg';
import ghostsClipKaleido from '../assets/ghosts/clip-kaleido.mp4';
import ghostsClipKaleidoPoster from '../assets/ghosts/clip-kaleido.jpg';
import ghostsClipQuad from '../assets/ghosts/clip-quad.mp4';
import ghostsClipQuadPoster from '../assets/ghosts/clip-quad.jpg';
import ghostsStillGold from '../assets/ghosts/still-gold.jpg';
import ghostsStillViolet from '../assets/ghosts/still-violet.jpg';
import imgObservatory from '../assets/img/observatory.jpg';
import imgLifeSystems from '../assets/img/life-systems.jpg';
import imgMixvault from '../assets/img/mixvault.jpg';
import imgInterviewPrep from '../assets/img/interview-prep.jpg';
import imgExpecta from '../assets/img/expecta.jpg';
import imgFrontLeft from '../assets/img/front-left.jpg';
import imgObsidianRag from '../assets/img/obsidian-rag.jpg';
import imgAbletonHelper from '../assets/img/ableton-helper.jpg';
import imgShortTurn from '../assets/img/short-turn.jpg';
import imgShortTurnGrades from '../assets/img/short-turn-report-cards.jpg';

export const projects = [
  {
    slug: '360-ops',
    title: '360 Internal Operations',
    kind: 'web',
    org: 'Metrolinx',
    category: 'professional',
    featured: true,
    featuredSize: 'large',
    hasCaseStudy: true,
    line: 'Where every project stands, in one view.',
    description:
      'A portfolio management app for project managers and staff, built on the MERN stack. It shows each project\'s status, who\'s on it, what\'s blocking it, and whether it\'s still running. I was the tech lead and owned it end to end.',
    skills: ['MongoDB', 'Express', 'React', 'Node.js'],
    facts: ['Tech lead, end to end', 'MERN', 'Every project in one view'],
    caseStudy: {
      problem:
        'Project information lived in separate tools, so getting a picture of the whole portfolio meant asking around. Portfolio managers had no easy way to see which projects were on track, who was staffed on them, or what was stuck.',
      built:
        'A MERN app (MongoDB, Express, React, and Node.js) that gives portfolio managers and employees one view of every project: its current status, the roster, open blockers and issues, and whether it\'s ongoing. I led it end to end, from the data model and APIs to the frontend.',
      outcome:
        'Portfolio managers and staff can check the state of any project in one place, including who\'s on it and what\'s holding it up.',
    },
  },
  {
    slug: 'cn-integration',
    title: 'CN-Metrolinx Integration',
    kind: 'data',
    org: 'Metrolinx',
    category: 'professional',
    featured: true,
    featuredSize: 'default',
    hasCaseStudy: true,
    line: 'Live rail data between two organizations.',
    description:
      'Five containerized microservices on Azure Container Apps, connected by events. 20 queues and 10 RabbitMQ consumers move live rail data every 10 to 30 seconds, and each organization\'s data stays separate.',
    skills: ['Azure Container Apps', 'RabbitMQ', 'Microservices', 'Kubernetes'],
    facts: ['5 services', '20 queues · 10 consumers', 'Updates every 10–30 s'],
    img: imgCnDiagram,
    caseStudy: {
      problem:
        'CN and Metrolinx needed to share live rail data while staying two separate systems. Updates had to land every 10 to 30 seconds, and each organization\'s data had to stay isolated.',
      built:
        'Five event-driven microservices on Azure Container Apps, with 20 queues, 10 RabbitMQ consumers, and Kubernetes around the edges. Isolation between the two organizations was designed in from the start.',
      outcome:
        'Live rail data moves between the two networks without a shared database or a nightly sync.',
    },
  },
  {
    slug: 'urbaneyes',
    title: 'UrbanEyes',
    kind: 'web',
    org: 'UrbanEyes',
    category: 'professional',
    featured: true,
    featuredSize: 'default',
    hasCaseStudy: true,
    line: 'Maps and listings, rebuilt in Next.js.',
    description:
      'Ported the codebase to Next.js, shipped map features, and deployed to Vercel.',
    skills: ['Next.js', 'React', 'Vercel', 'Maps'],
    facts: ['Port to Next.js', 'Maps in the main flow', 'Deployed on Vercel'],
    caseStudy: {
      problem:
        'The product was on an older React setup. Maps and listings are the core of it, and they needed a stack the team could ship and host on its own.',
      built:
        'I ported the app to Next.js, built the map features, and deployed to Vercel so the team could ship changes without running its own servers.',
      outcome: 'The live product runs on Next.js, with maps in the main flow.',
    },
  },
  {
    slug: 'azure-pipelines',
    title: 'Azure Data Pipelines',
    kind: 'data',
    org: 'ONxpress',
    category: 'professional',
    featured: false,
    featuredSize: 'default',
    hasCaseStudy: false,
    line: '20+ daily reports for a $1.6B program.',
    description:
      'Combined three source systems with automated business rules and transformations. The output feeds 20+ daily reports for finance and operations on a $1.6B rail infrastructure program.',
    skills: ['Azure', 'Data Pipelines', 'ETL', 'SQL'],
    facts: ['3 source systems', '20+ daily reports', '$1.6B program'],
  },
  {
    slug: 'fabric-pipeline',
    title: 'Data Ingestion Pipeline',
    kind: 'data',
    org: 'Contract',
    category: 'client',
    featured: false,
    featuredSize: 'default',
    hasCaseStudy: false,
    line: 'Raw sources into reporting-ready data.',
    description:
      'Turns raw data in Microsoft Fabric into a clean format for downstream reports and dashboards.',
    skills: ['Microsoft Fabric', 'ETL', 'Data Engineering'],
  },
  {
    slug: 'observatory',
    // Renamed from Nebula Desktop; old links still resolve.
    aliases: ['nebula-desktop'],
    title: 'Observatory',
    kind: 'apps',
    category: 'personal',
    lead: true,
    featured: false,
    hasCaseStudy: false,
    status: 'In progress',
    tag: 'Tauri · Rust',
    line: 'Every coding agent in one Mac window.',
    description:
      'A macOS app for nebula, the daemon that runs coding agents like Claude Code and Codex across a project\'s git worktrees. Every session in every project shows up in one window, with git state, one-click shipping, and Claude usage. Built with Tauri, Rust, and React.',
    skills: ['Tauri', 'Rust', 'TypeScript', 'React'],
    img: imgObservatory,
    url: 'https://github.com/yobazy/observatory',
    demo: {
      href: 'https://github.com/yobazy/observatory/releases/latest/download/Observatory.dmg',
      label: 'Download for macOS',
    },
    caseStudy: {
      problem:
        'Running several coding agents at once across worktrees in a terminal UI means constantly checking which one is stuck on a permission prompt, which branch has unpushed work, and what the week is costing.',
      built:
        'A Tauri app that speaks the same socket protocol as the nebula TUI, so both can be open on the same sessions. Rust handles the daemon connection, git state, and incremental parsing of Claude Code logs for usage. The React side keeps a queue of sessions waiting on you across every project, with notifications that say what each one is asking and buttons to answer permission prompts. Worktrees show their branch status, Ship merges a green PR and cleans up after it, and the sidebar sums up what finished while you were away.',
      outcome:
        'In progress and public on GitHub, with a DMG to download. On first launch it installs nebula at the version it was built for, and after that it updates itself. A sandbox daemon with a fake agent CLI lets me develop it without touching real sessions.',
    },
  },
  {
    slug: 'ghosts-playground',
    // Old links to /projects/playground-visuals still resolve.
    aliases: ['playground-visuals'],
    title: 'ghosts-playground',
    kind: 'web',
    org: 'Personal',
    category: 'visuals',
    page: 'playground',
    status: 'In progress',
    lead: true,
    featured: true,
    featuredSize: 'large',
    hasCaseStudy: true,
    tag: 'Visuals · WebGL',
    line: 'Live visuals for a dark room.',
    url: 'https://ghosts.fyi',
    img: imgPlayground,
    // Shot on ghosts.fyi. Wide items span the full row on the project page.
    media: [
      {
        type: 'video',
        src: ghostsClipKaleido,
        poster: ghostsClipKaleidoPoster,
        alt: 'A silhouette mirrored into a kaleidoscope of neon shapes',
        wide: true,
      },
      {
        type: 'image',
        src: ghostsStillGold,
        alt: 'A figure traced in molten gold, with echoes trailing behind',
      },
      {
        type: 'image',
        src: ghostsStillViolet,
        alt: 'A face and raised hands broken into violet shards',
      },
      {
        type: 'video',
        src: ghostsClipQuad,
        poster: ghostsClipQuadPoster,
        alt: 'The same frame repeated four times in shifting color palettes',
        wide: true,
      },
    ],
    description:
      'A webcam piece for a dark room. Your silhouette cuts a window into moving fluid, wave, and particle fields, and colored echoes of you trail behind. It\'s live at ghosts.fyi: open it with a webcam and step into frame.',
    skills: ['WebGL', 'GLSL', 'Webcam', 'TouchDesigner'],
    caseStudy: {
      problem:
        'Most visuals toys are desktop widgets or face filters. I wanted something that works at party scale: you walk into the room, your silhouette is the mask, and the visuals are already running.',
      built:
        'Plain JavaScript and WebGL2 shaders. Live mode is for the party, with filters like fisheye and VHS, layers, sound reactivity, shuffle, and mixes you can save and share. Studio mode is for making clips. The field behind this site\'s home page is a port of one of its modes.',
      outcome:
        'In progress and public at ghosts.fyi. It needs a webcam, and it was made for a projector in a dark room.',
    },
  },
  {
    slug: 'mixvault',
    title: 'MixVault',
    kind: 'apps',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    status: 'In progress',
    tag: 'Electron · Node',
    line: 'Links in, a clean crate out.',
    description:
      'Desktop crate tool for DJs. Paste SoundCloud, YouTube, or Spotify links and the tracks land in your crate folder. Then match a streaming playlist against your Rekordbox collection and queue what\'s missing.',
    skills: ['Electron', 'React', 'TypeScript', 'yt-dlp'],
    img: imgMixvault,
    caseStudy: {
      problem:
        'Getting a playlist into Rekordbox meant working out by hand which tracks I already owned, finding the rest one by one, and ending up with a folder full of duplicates and low-bitrate rips.',
      built:
        'An Electron app built around one crate folder and a link bar. Jobs run in a queue that skips files already in the crate, and Spotify playlists are read over OAuth (PKCE) and sourced from YouTube. Import reads a Rekordbox collection XML, sorts a playlist into in library, needs review, and missing, and exports an M3U. Crate health reads every file\'s format and bitrate, flags what Rekordbox can\'t import, and groups duplicates by tags and audio hash, with a suggestion for which copy to keep.',
      outcome:
        'In progress. Duplicates go to the system Trash, every change can be undone from the activity journal, and the app asks before touching anything Rekordbox already uses.',
    },
  },
  {
    slug: 'link',
    title: 'Link',
    kind: 'apps',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    status: 'Alpha',
    tag: 'React Native · Supabase',
    line: 'Make a plan. Friends tap to join.',
    description:
      'A mobile app for short-notice plans. Send a plan to a few friends, they join with one tap, and no reply counts as a no. Built with React Native and Supabase, and in alpha on TestFlight.',
    skills: ['React Native', 'Expo', 'TypeScript', 'Supabase'],
    img: imgLink,
    gallery: [
      {
        src: imgLinkInvite,
        alt: 'Three steps of accepting a friend invite: Theo wants to make plans with you, then you and Theo are on Link together',
      },
    ],
    caseStudy: {
      problem:
        'Small plans die in the group chat. Someone floats an idea, it turns into a poll, half the people never answer, and by the time it\'s settled the evening is gone.',
      built:
        'An Expo app on Supabase. A host picks a time with quick chips (now, in 30 minutes, tonight) and invites friends one by one or a whole group in a tap, with a live preview of the card they\'ll see. Join, Maybe, and leave update instantly and roll back if the server says no. Postgres does the gatekeeping: the place only shows once you\'ve joined, writes go through security-definer functions, and a realtime signal table refreshes everyone\'s screens. Plan and group links unfurl in iMessage and WhatsApp as the plan\'s card with a Join button, and push notifications go out through an Edge Function worker with retries.',
      outcome:
        'Version 1.1 is in alpha on TestFlight. The next build adds emoji stickers on plan cards, reactions in each plan\'s feed, time suggestions everyone can vote on, and a personal QR code where each scan is a friend request you approve.',
    },
  },
  {
    slug: 'life-systems',
    title: 'Life Systems',
    kind: 'web',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    status: 'In progress',
    tag: 'React · Prisma',
    line: 'What you own, where it lives, and what it\'s for.',
    description:
      'An app for the things you own. Each need, like the commute, the gym, or rain, is covered, flagged for an upgrade, or still a gap. It also maps where everything lives, picks outfits for the weather and your calendar, and builds packing lists for trips. An assistant answers questions about your own stuff.',
    skills: ['React', 'TypeScript', 'Node.js', 'Prisma'],
    img: imgLifeSystems,
    caseStudy: {
      problem:
        'Buying decisions usually start from the product. I wanted them to start from the need: the commute, the gym, a carry-on trip. Then it\'s obvious what\'s missing, what\'s redundant, and what\'s wearing out.',
      built:
        'A React and Node app on Prisma. A need is a gap, an upgrade, or covered, and that status is always derived, never stored. One item can cover several needs. Around that sit a ranked list of next steps, replacement cycles with due dates, a shopping list that puts things you already own first, and a log of every switch. Places has floor plans you can edit and a 3D model you can walk through, opening closets and drawers to see what\'s inside, with a printable QR label for each shelf. Clothing suggests a look for each occasion from the forecast and your calendar, and Trips turns where and when into a packing list.',
      outcome:
        'In progress. The service layer has no HTTP in it, so auth and a move to Postgres can come later without rewriting the rules, and Playwright tests click through the real app on desktop and phone.',
    },
  },
  {
    slug: 'short-turn',
    title: 'Short Turn',
    kind: 'data',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    status: 'In progress',
    tag: 'Python · MCP',
    line: 'How reliable is the TTC, really?',
    description:
      'Records the TTC\'s live feeds around the clock and grades every route on extra waiting, bunching, and ghost trips, and on how far to trust the official countdowns. A dashboard, an HTTP API, and an MCP server for Claude all read from the same data.',
    skills: ['Python', 'GTFS-Realtime', 'LightGBM', 'React', 'MCP'],
    img: imgShortTurn,
    gallery: [
      {
        src: imgShortTurnGrades,
        alt: 'Report cards grading TTC routes from A to D, worst first',
      },
    ],
    caseStudy: {
      problem:
        'The TTC map and countdowns say where a streetcar is, but not how far to trust them. Positions are about a minute old by the time you see them, and nothing public says which routes bunch up or run ghost trips.',
      built:
        'An asyncio collector polls the GTFS-Realtime feeds into a deduplicated Parquet archive. A daily pipeline snaps vehicles to their route shapes to work out when each one reached each stop, then scores routes on excess wait time, bunching, and ghost trips. A LightGBM quantile model with conformal calibration predicts arrivals as ranges. The live map moves each vehicle to where it probably is now, with a halo for how unsure that is.',
      outcome:
        'In progress. Two findings so far: positions are 60 to 76 seconds old when fetched, and the TTC\'s two realtime feeds use stop IDs that overlap, so joining them naively matches the wrong stops.',
    },
  },
  {
    slug: 'frontleft',
    // Renamed from Festify, then spelled as one word; old links still resolve.
    aliases: ['festify', 'front-left'],
    title: 'FrontLeft',
    kind: 'web',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    status: 'Live',
    tag: 'Next.js · Supabase',
    line: 'Hear the lineup before you buy the ticket.',
    description:
      'Music event discovery for people who care who\'s on the bill. Every upcoming show and festival in your city, with the lineup set like a poster and every artist ready to play before you buy a ticket. A rebuild of my bootcamp project, Festify, in Next.js, Supabase, and the Spotify Web API.',
    skills: ['Next.js', 'TypeScript', 'Supabase', 'Spotify API'],
    img: imgFrontLeft,
    demo: { href: 'https://gofrontleft.vercel.app', label: 'Visit FrontLeft' },
    caseStudy: {
      problem:
        'Listing sites treat a show as a date, a venue, and one headliner photo. Working out whether a night is worth it means looking up the rest of the bill one artist at a time, and EDMTrain and Resident Advisor rarely agree on what\'s on or who\'s playing.',
      built:
        'A sync script pulls events, artists, and gigs from EDMTrain and Resident Advisor into Supabase and fills in artist images from Spotify. Next.js server components render every page from Postgres. The home page reads like a front page for your city: the strongest bill in the next two weeks, what\'s on tonight, a festival, and a big name in a small room. Festivals are set as contact sheets of the whole bill under a loupe that follows your pointer, and event pages list the lineup in the promoter\'s order. Spotify tokens stay on the server.',
      outcome:
        'You can follow artists and save events without an account, and the home page recommends shows, including later dates for artists you follow. Connect Spotify and saved playlists land in your library too. The motion, from house lights on arrival to a logo that kicks at 124 BPM, switches off for reduced motion.',
    },
  },
  {
    slug: 'interview-prep',
    title: 'Interview Prep Dashboard',
    kind: 'web',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    status: 'In progress',
    tag: 'React · Claude CLI',
    line: 'A daily plan for senior interviews.',
    description:
      'Local dashboard for senior software interview prep. Coding, system design, behavioral, and the job search itself in one daily plan, with mock interviews graded by Claude through the CLI.',
    skills: ['React', 'TypeScript', 'Vite', 'Claude'],
    img: imgInterviewPrep,
    caseStudy: {
      problem:
        'Senior interview prep is three tracks at once, and it\'s easy to drill the comfortable one. Progress also lived in status labels that said "confident" long after the practice behind them had gone stale.',
      built:
        'A React dashboard with no backend: state lives in the browser, and Vite dev-server plugins read a markdown prep folder and a job tracker from disk. Home builds a daily plan and a weekly goal, and a readiness gauge only moves on graded evidence, which expires after 21 days. On Record runs recruiter, coding, system design, fundamentals, and behavioral mocks by voice or text, graded through the local Claude CLI, and behavioral answers are checked against a fact sheet of my own stories. Coding solutions run against hidden tests in the browser, and system design is a nine-module course with timed designs scored on a six-part rubric.',
      outcome:
        'In progress. Booked interviews get their own countdown page with the company\'s most-asked problems and a daily target.',
    },
  },
  {
    slug: 'ableton-helper',
    title: 'Ableton Helper',
    kind: 'ai',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    status: 'In progress',
    tag: 'Python · MCP',
    line: 'Loops in, a full arrangement out.',
    description:
      'An arrangement assistant for Ableton Live 12. Put your loops in Session View, ask for tech house, and Claude lays out an arrangement in that genre in one batch, through an MCP server and a Live Remote Script.',
    skills: ['Python', 'MCP', 'Claude', 'Ableton Live'],
    img: imgAbletonHelper,
    url: 'https://github.com/yobazy/ableton-helper',
    caseStudy: {
      problem:
        'Making loops is the fun part. Turning them into a 224-bar track, section by section, is slow. Existing Ableton MCP servers send one request per change, so a single skeleton turns into about a hundred tool calls.',
      built:
        'A Python MCP server that compiles YAML genre templates into bar ranges, guesses which track is the kick, bass, or chords from track and clip names, and turns the plan into a list of operations. A Remote Script inside Live runs the whole list in one main-thread tick over TCP. The Live API code is tested against a fake, so the tests run without Live open.',
      outcome:
        'In progress. A house skeleton that took 108 tool calls takes one, and the whole build is a single undo in Live. A benchmark command measures the difference on your own machine.',
    },
  },
  {
    slug: 'obsidian-rag',
    title: 'Obsidian RAG',
    kind: 'ai',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    tag: 'Python · pgvector',
    line: 'Ask your notes, get your own answers.',
    description:
      'A local RAG pipeline over an Obsidian vault. Notes are chunked, embedded with Voyage AI, and stored in pgvector, and Claude answers from what you wrote and lists the notes it used.',
    skills: ['Python', 'PostgreSQL', 'pgvector', 'Claude'],
    img: imgObsidianRag,
    url: 'https://github.com/yobazy/obsidian-RAG-gpt',
    caseStudy: {
      problem:
        'Years of notes are only useful if you can find them. Keyword search misses anything phrased differently, and a general chatbot answers from the internet instead of from what you wrote down.',
      built:
        'Python scripts around Postgres with pgvector in Docker. Ingestion splits each note into overlapping 400-word chunks, strips Obsidian markup, and skips unchanged files by hash, and a watcher re-ingests a note as soon as it\'s saved. Retrieval drops chunks under a similarity threshold, then pulls in notes linked by [[wikilinks]] before Claude answers in a CLI chat that remembers the conversation.',
      outcome:
        'Every answer lists its source notes with similarity scores. An eval harness scores retrieval and answers against hand-written questions, so I can measure a change to chunking or thresholds before keeping it.',
    },
  },
  {
    slug: 'expecta',
    title: 'Expecta',
    kind: 'web',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    status: 'Hackathon',
    tag: 'React · TypeScript',
    line: 'Is this safe right now? Scan and see.',
    description:
      'Mobile-first product checker for people trying to conceive, pregnant, or nursing. Scan a barcode or paste an ingredient list, and it checks against guidance for your stage and links the source. Built at Cursor\'s Toronto hackathon in July 2026.',
    skills: ['React', 'TypeScript', 'Vite', 'ZXing'],
    img: imgExpecta,
    url: 'https://github.com/yobazy/expecta-cursor-hackathon',
    caseStudy: {
      problem:
        'Whether a product is fine depends on the stage. A retinol serum that\'s out during pregnancy can be a different answer while nursing. Most checkers give one verdict for everyone and no source.',
      built:
        'A React 19 and TypeScript app with five stages, from planning through each trimester to nursing. The camera scans barcodes with ZXing, food lookups go to Open Food Facts, and pasted ingredient lists run against a small sourced rule set. Each result is safe, caution, avoid, or unknown, with the reason and a link to the guidance behind it.',
      outcome:
        'A working prototype built in a day. History and favorites stay in the browser, and the repo writes up the production architecture, API, data model, and safety constraints.',
    },
  },
  {
    slug: 'barberbot',
    title: 'BarberBot',
    kind: 'ai',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    status: 'Pilot',
    tag: 'VAPI · Square',
    line: 'Voice AI that books the chair.',
    description:
      'A VAPI voice assistant piloted at a working barbershop. It answers inbound calls, books appointments, and syncs with GoHighLevel CRM and Square without a person stepping in.',
    skills: ['VAPI', 'Voice AI', 'GoHighLevel', 'Square'],
    img: imgBarberbot,
    imgFit: 'contain',
  },
  {
    slug: 'myfi',
    title: 'MyFi',
    kind: 'web',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    tag: 'Next.js · Supabase',
    line: 'Budgets from multi-bank statements.',
    description:
      'Budgeting dashboard for statements from several banks. Upload them, sort transactions with a rule-based categorizer, chart where the money went, and ask Claude for a monthly summary or questions about your spending. Rebuilt in Next.js and Supabase from an earlier Django and React version.',
    skills: ['Next.js', 'React', 'Supabase', 'TypeScript'],
    img: imgMyfi,
  },
  {
    slug: 'scheduler',
    title: 'Scheduler',
    kind: 'web',
    category: 'earlier',
    featured: false,
    hasCaseStudy: false,
    line: 'Interview slots, booked from the calendar.',
    description: 'Appointment booking app. Book with clients, add and remove bookings.',
    skills: ['React', 'JavaScript', 'CSS/SCSS', 'HTML'],
    img: imgScheduler,
    url: 'https://github.com/yobazy/scheduler',
  },
  {
    slug: 'jungle',
    title: 'Jungle',
    kind: 'web',
    category: 'earlier',
    featured: false,
    hasCaseStudy: false,
    line: 'A plant shop, built to learn Rails.',
    description: 'Mini ecommerce app for plants, built to learn Ruby on Rails.',
    skills: ['React', 'JavaScript', 'Ruby on Rails', 'PostgreSQL'],
    img: imgJungle,
    url: 'https://github.com/yobazy/jungle-rails',
  },
  {
    slug: 'tinyapp',
    title: 'TinyApp',
    kind: 'web',
    category: 'earlier',
    featured: false,
    hasCaseStudy: false,
    line: 'Short URLs in Node and Express.',
    description: 'URL shortener built with Node and Express.',
    skills: ['Node.js', 'Express', 'EJS', 'CSS/SCSS', 'HTML'],
    img: imgTinyapp,
    url: 'https://github.com/yobazy/tinyapp',
  },
  {
    slug: 'reasonable-realities',
    title: 'Reasonable Realities',
    kind: 'web',
    category: 'earlier',
    featured: false,
    hasCaseStudy: false,
    line: 'A marketplace for VR avatars.',
    description: 'Demo marketplace for buying and selling VR avatars.',
    skills: ['JavaScript', 'Express', 'PostgreSQL', 'jQuery', 'AJAX'],
    img: imgReasonable,
    url: 'https://github.com/yobazy/buy-sell-website',
  },
];

// The playground has its own page; every other project opens in the sheet.
export const projectPage = (project) =>
  project.page === 'playground' ? `/projects/${project.slug}` : undefined;

export const featuredProjects = projects.filter((project) => project.featured);

export const getProjectBySlug = (slug) =>
  projects.find((project) => project.slug === slug || project.aliases?.includes(slug));

export const projectsInCategories = (...categories) =>
  projects.filter((project) => categories.includes(project.category));

export const projectsByCategory = (category) =>
  projects.filter((project) => project.category === category);
