import imgScheduler from '../assets/img/proj-scheduler.png';
import imgJungle from '../assets/img/proj-jungle.png';
import imgTinyapp from '../assets/img/proj-tinyapp.png';
import imgReasonable from '../assets/img/proj-reasonable.png';
import imgLink from '../assets/img/link-screens.jpg';
import imgCnDiagram from '../assets/img/cn-integration-diagram.svg';
import imgMyfi from '../assets/img/myfi-dashboard.png';
import imgBarberbot from '../assets/img/barberbot.jpg';
import imgPlayground from '../assets/img/ghosts-playground.jpg';
import imgNebulaDesktop from '../assets/img/nebula-desktop.jpg';
import imgLifeSystems from '../assets/img/life-systems.jpg';
import imgMixvault from '../assets/img/mixvault.jpg';
import imgInterviewPrep from '../assets/img/interview-prep.jpg';
import imgExpecta from '../assets/img/expecta.jpg';
import imgFestify from '../assets/img/festify.jpg';

export const projects = [
  {
    slug: '360-ops',
    title: '360 Internal Operations',
    org: 'Metrolinx',
    category: 'professional',
    featured: true,
    featuredSize: 'large',
    hasCaseStudy: true,
    line: 'Daily ops platform for the rail network.',
    description:
      'Daily workflow platform for the operations team. React frontend, Node.js backend, MongoDB. Tech lead. Owned end to end.',
    skills: ['React', 'Node.js', 'MongoDB'],
    caseStudy: {
      problem:
        'Operations ran across disconnected tools. Daily work lived in spreadsheets, email, and one-off dashboards, so nobody had a shared picture of what was happening on the network.',
      built:
        'A React and Node.js platform that became the daily surface for the operations team. I led the work end to end: data model, APIs, frontend, and the workflows people actually use.',
      outcome:
        'One place to run the day instead of a pile of side systems. The team works from a live operational picture instead of stitching it together by hand.',
    },
  },
  {
    slug: 'cn-integration',
    title: 'CN-Metrolinx Integration',
    org: 'Metrolinx',
    category: 'professional',
    featured: true,
    featuredSize: 'default',
    hasCaseStudy: true,
    line: 'Live rail data between two organizations.',
    description:
      'Five containerized microservices on Azure Container Apps with event-driven architecture. 20 queues, 10 RabbitMQ consumers, real-time rail data every 10-30s. Multi-org data isolation across CN and Metrolinx.',
    skills: ['Azure Container Apps', 'RabbitMQ', 'Microservices', 'Kubernetes'],
    img: imgCnDiagram,
    caseStudy: {
      problem:
        'CN and Metrolinx needed to share live rail data without collapsing two organizations into one system. Updates had to land every 10-30 seconds, and each org had to stay isolated.',
      built:
        'Five microservices on Azure Container Apps. Event-driven: 20 queues, 10 RabbitMQ consumers, Kubernetes around the edges. Multi-org isolation is part of the design, not a later patch.',
      outcome:
        'Real-time rail data moves between the two networks without a shared database or a brittle nightly sync.',
    },
  },
  {
    slug: 'urbaneyes',
    title: 'UrbanEyes',
    org: 'UrbanEyes',
    category: 'professional',
    featured: true,
    featuredSize: 'default',
    hasCaseStudy: true,
    line: 'Maps and listings, rebuilt in Next.js.',
    description:
      'Ported the codebase to Next.js, shipped map features, and deployed to Vercel.',
    skills: ['Next.js', 'React', 'Vercel', 'Maps'],
    caseStudy: {
      problem:
        'The product was stuck on an older React stack. Maps and listing flows were the core of the product and needed to move to something that could ship and host independently.',
      built:
        'I ported the app to Next.js, built the map features, and deployed to Vercel so the team could iterate without a heavy ops layer.',
      outcome:
        'The live product runs on Next.js. Maps are part of the main flow, not a side experiment.',
    },
  },
  {
    slug: 'azure-pipelines',
    title: 'Azure Data Pipelines',
    org: 'ONxpress',
    category: 'professional',
    featured: false,
    featuredSize: 'default',
    hasCaseStudy: false,
    line: '20+ daily reports for a $1.6B program.',
    description:
      'Unified three source systems with automated business rules and transformations, powering 20+ daily operational reports for Finance and ops. Part of a $1.6B rail infrastructure program.',
    skills: ['Azure', 'Data Pipelines', 'ETL', 'SQL'],
  },
  {
    slug: 'fabric-pipeline',
    title: 'Data Ingestion Pipeline',
    org: 'Contract',
    category: 'client',
    featured: false,
    featuredSize: 'default',
    hasCaseStudy: false,
    line: 'Raw sources into reporting-ready data.',
    description:
      'Transforms raw data sources from Microsoft Fabric into presentation-ready format for downstream reporting and dashboards.',
    skills: ['Microsoft Fabric', 'ETL', 'Data Engineering'],
  },
  {
    slug: 'nebula-desktop',
    title: 'Nebula Desktop',
    category: 'personal',
    lead: true,
    featured: false,
    hasCaseStudy: false,
    status: 'In progress',
    tag: 'Tauri · Rust',
    line: 'A desktop cockpit for coding agents.',
    description:
      'macOS client for the nebula agent daemon. Every agent session across every project and worktree in one window, with git state, one-click shipping, and Claude usage. Tauri, Rust, and React.',
    skills: ['Tauri', 'Rust', 'TypeScript', 'React'],
    img: imgNebulaDesktop,
    url: 'https://github.com/yobazy/nebula-desktop',
    caseStudy: {
      problem:
        'Running several coding agents at once across worktrees in a terminal UI means constantly checking which one is stuck on a permission prompt, which branch has unpushed work, and what the week is costing.',
      built:
        'A Tauri app that speaks the same socket protocol as the nebula TUI, so both run side by side on the same sessions. Rust handles the daemon connection, git state, and incremental parsing of Claude Code logs for usage. The React side has a cross-project "waiting on you" queue with notifications, worktree bands with branch status, and Commit & push that hands the job to an idle agent and waits until it finishes its turn. Settings are written to the same files the TUI reads.',
      outcome:
        'In progress and public on GitHub. A one-line setup script installs nebula at the pinned protocol version and builds the app, and a sandbox daemon with a fake agent CLI lets me develop without touching real sessions.',
    },
  },
  {
    slug: 'ghosts-playground',
    // Old links to /projects/playground-visuals still resolve.
    aliases: ['playground-visuals'],
    title: 'ghosts-playground',
    org: 'Personal',
    category: 'visuals',
    kind: 'playground',
    status: 'In progress',
    lead: true,
    featured: true,
    featuredSize: 'large',
    hasCaseStudy: true,
    tag: 'Visuals · WebGL',
    line: 'Live visuals for a dark room.',
    url: 'https://ghosts.fyi',
    img: imgPlayground,
    description:
      'A camera playground: body as portal, traveling fields. Built for a room, prototyped at a desk, and live at ghosts.fyi. Open it with a webcam and step into frame.',
    skills: ['WebGL', 'GLSL', 'Webcam', 'TouchDesigner'],
    caseStudy: {
      problem:
        'Most “visuals” toys are desktop widgets or face filters. I wanted something that reads at rave scale: you walk in, your silhouette is the mask, and the field is already happening.',
      built:
        'Live is the party camera. Studio is the clip workbench. The field behind the homepage is a quiet port of one of its modes.',
      outcome:
        'In progress, and public. The piece is the live mixer, not a product page, so the best way to see it is to try it.',
    },
  },

  {
    slug: 'barberbot',
    title: 'BarberBot',
    category: 'personal',
    featured: true,
    hasCaseStudy: false,
    status: 'Live pilot',
    tag: 'VAPI · Square',
    line: 'Voice AI that books the chair.',
    description:
      'VAPI voice AI assistant in live pilot with an active barbershop. Handles inbound calls, books appointments, and connects to GoHighLevel CRM and Square, with no human in the loop.',
    skills: ['VAPI', 'Voice AI', 'GoHighLevel', 'Square'],
    img: imgBarberbot,
    imgFit: 'contain',
  },
  {
    slug: 'life-systems',
    title: 'Life Systems',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    status: 'In progress',
    tag: 'React · Prisma',
    line: 'Own less, cover more.',
    description:
      'Tracks the situations your stuff has to cover, and whether each one is covered, flagged for an upgrade, or still a gap. One item library, linked to as many use cases as it serves, with an assistant you can ask what to buy next.',
    skills: ['React', 'TypeScript', 'Node.js', 'Prisma'],
    img: imgLifeSystems,
    caseStudy: {
      problem:
        'Buying decisions usually start from the product. I wanted them to start from the need: the commute, the gym, a carry-on trip. Then it is obvious what is missing, what is redundant, and what is wearing out.',
      built:
        'A React and Node app on Prisma. A use case is a gap, an upgrade, or covered, and that status is always derived, never stored. Primaries, backups, and candidates hang off each use case, and one item can cover several. On top of that: a ranked next-steps list, replacement cycles with due dates, a shopping list that puts owned candidates first, a side-by-side compare view, an event log of every switch, and an assistant that answers questions about your own gaps.',
      outcome:
        'In progress. The service layer has no HTTP in it, so auth and a move to Postgres can come later without rewriting the rules.',
    },
  },
  {
    slug: 'mixvault',
    title: 'MixVault',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    status: 'In progress',
    tag: 'Electron · Node',
    line: 'Links in, a clean crate out.',
    description:
      'Desktop crate tool for DJs. Paste SoundCloud, YouTube, or Spotify links and the tracks land in a crate folder, then match a streaming playlist against your Rekordbox collection and queue what is missing.',
    skills: ['Electron', 'React', 'TypeScript', 'yt-dlp'],
    img: imgMixvault,
    caseStudy: {
      problem:
        'Getting a playlist into Rekordbox meant working out by hand which tracks I already owned, finding the rest one by one, and ending up with a folder full of duplicates and low-bitrate rips.',
      built:
        'An Electron app built around one crate folder and a link bar. Jobs run in a sequential queue that skips files already in the crate, and Spotify playlists are read over OAuth (PKCE) and sourced from YouTube. Import reads a Rekordbox collection XML, sorts a playlist into in library, needs review, and missing, and exports an M3U. Crate health reads every file\'s format and bitrate, flags what Rekordbox can\'t import, and groups duplicates by tags and audio hash, suggesting which copy to keep.',
      outcome:
        'In progress. Duplicates go to the system Trash rather than being deleted, and the app asks before touching anything Rekordbox already uses.',
    },
  },
  {
    slug: 'interview-prep',
    title: 'Interview Prep Dashboard',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    status: 'In progress',
    tag: 'React · Claude CLI',
    line: 'A daily plan for senior interviews.',
    description:
      'Local dashboard for senior software interview prep: coding, system design, and behavioral in one daily plan, with mock interviews graded through the Claude CLI.',
    skills: ['React', 'TypeScript', 'Vite', 'Claude'],
    img: imgInterviewPrep,
    caseStudy: {
      problem:
        'Senior interview prep is three tracks at once, and it is easy to drill the comfortable one. Progress also lived in status labels that said "confident" long after the practice behind them had gone stale.',
      built:
        'A React dashboard with no backend: state lives in the browser, and Vite dev-server plugins read a markdown prep folder from disk. Home builds a daily plan and a weekly goal, and a readiness gauge moves from Not ready to Interview ready only on graded evidence that expires after 21 days. On Record runs behavioral, coding, system design, and recruiter-screen mocks by voice or text, graded through the local Claude CLI. Coding solutions run against hidden tests in the browser, and system design is a nine-module course with timed designs scored on a six-part rubric.',
      outcome:
        'In progress. Booked interviews get their own countdown page with the company\'s most-asked problems and a daily target.',
    },
  },
  {
    slug: 'obsidian-rag',
    title: 'Obsidian RAG',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    tag: 'Python · pgvector',
    line: 'Ask your notes, get your own answers.',
    description:
      'A local RAG pipeline over an Obsidian vault. Notes are chunked and embedded with Voyage AI into pgvector, and Claude answers from what you actually wrote, citing the notes it used.',
    skills: ['Python', 'PostgreSQL', 'pgvector', 'Claude'],
    url: 'https://github.com/yobazy/obsidian-RAG-gpt',
    caseStudy: {
      problem:
        'Years of notes are only useful if you can find them. Keyword search misses anything phrased differently, and a general chatbot answers from the internet, not from what you wrote down.',
      built:
        'Python scripts around Postgres with pgvector in Docker. Ingestion chunks each note into overlapping 400-word windows, strips Obsidian markup, and skips unchanged files by hash, and a watcher re-ingests a note the moment it is saved. Retrieval drops chunks under a similarity threshold, then pulls in notes linked by [[wikilinks]] before Claude answers in a CLI chat that remembers the conversation.',
      outcome:
        'Every answer lists its source notes with similarity scores, and an eval harness scores retrieval and answers against hand-written questions, so changes to chunking or thresholds are measured instead of guessed.',
    },
  },
  {
    slug: 'expecta',
    title: 'Expecta',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    status: 'Hackathon',
    tag: 'React · TypeScript',
    line: 'Is this safe right now? Scan and see.',
    description:
      'Mobile-first product checker for people trying to conceive, pregnant, or nursing. Scan a barcode or paste an ingredient list, and it checks against guidance for your stage and links the source. Built at Cursor\'s Toronto hackathon, July 2026.',
    skills: ['React', 'TypeScript', 'Vite', 'ZXing'],
    img: imgExpecta,
    url: 'https://github.com/yobazy/expecta-cursor-hackathon',
    caseStudy: {
      problem:
        'Whether a product is fine depends on the stage: a retinol serum that is out during pregnancy can be a different answer while nursing. Most checkers give one verdict for everyone and no source.',
      built:
        'A React 19 and TypeScript app with five stages, from planning through each trimester to nursing. The camera scans barcodes with ZXing, food lookups go to Open Food Facts, and pasted ingredient lists run against a small sourced rule set. Each result is safe, caution, avoid, or unknown, with the reason and a link to the guidance behind it.',
      outcome:
        'A working prototype built in a day, with no backend: history and favorites stay in the browser. The production architecture, API, data model, and safety constraints are written up in the repo.',
    },
  },
  {
    slug: 'ableton-helper',
    title: 'Ableton Helper',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    status: 'In progress',
    tag: 'Python · MCP',
    line: 'Loops in, a full arrangement out.',
    description:
      'An AI arrangement assistant for Ableton Live 12. Put your loops in Session View, ask for tech house, and Claude lays out a genre-shaped arrangement in one batch through an MCP server and a Live Remote Script.',
    skills: ['Python', 'MCP', 'Claude', 'Ableton Live'],
    caseStudy: {
      problem:
        'Making loops is the fun part. Turning them into a 224-bar track, section by section, is slow. Existing Ableton MCP servers send one request per change, so a single skeleton turns into about a hundred tool calls.',
      built:
        'A Python MCP server that compiles YAML genre templates into bar ranges, guesses which track is the kick, bass, or chords from track and clip names, and turns the plan into a list of operations. A Remote Script inside Live runs the whole list in one main-thread tick over TCP. The Live API code is tested against a fake, so it runs without Live open.',
      outcome:
        'In progress. A house skeleton that took 108 tool calls takes one, and the whole build is a single undo in Live. A benchmark command measures the difference on your own machine.',
    },
  },
  {
    slug: 'festify',
    title: 'Festify',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    tag: 'Next.js · Supabase',
    line: 'Hear the lineup before you buy the ticket.',
    description:
      'EDM event companion. Browse upcoming shows and festivals from EDMTrain and Resident Advisor, see who is playing, and preview every artist on Spotify. A ground-up rebuild of my bootcamp project in Next.js, Supabase, and the Spotify Web API.',
    skills: ['Next.js', 'TypeScript', 'Supabase', 'Spotify API'],
    img: imgFestify,
    url: 'https://github.com/yobazy/festify-2.0',
    caseStudy: {
      problem:
        'Festival lineups are walls of names. Working out whether a show is worth it means looking up artists one by one, and listings from different sources rarely agree on what is on or who is playing.',
      built:
        'A sync script pulls events, artists, and gigs from EDMTrain and Resident Advisor into Supabase, then backfills artist images from Spotify. The Next.js App Router renders pages on the server from Postgres. Event pages order the lineup by artist popularity, artist pages preview top tracks, and a playlists page ranks upcoming events by lineup strength: headliner pull, depth, festival size, and how soon they are. Spotify tokens never reach the browser: search and top tracks go through server routes with a cached client-credentials token.',
      outcome:
        'Follow artists and save events without an account, and the home page recommends shows, including later dates for artists you follow. Sign in and connect Spotify, and saved playlists follow in your Spotify library too.',
    },
  },
  {
    slug: 'link',
    title: 'Link',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    status: 'In progress',
    tag: 'React Native · Supabase',
    line: 'Hangouts without the group chat.',
    description:
      'Alpha mobile app for short-notice plans. A host sends a hangout to a few friends, people join in one tap, and silence counts as a no. React Native and Supabase.',
    skills: ['React Native', 'Expo', 'TypeScript', 'Supabase'],
    img: imgLink,
  },
  {
    slug: 'myfi',
    title: 'MyFi',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    tag: 'Django · React',
    line: 'Budgets from multi-bank statements.',
    description:
      'Budgeting dashboard with a Django REST API and React frontend. Multi-bank statement processing and a rule-based categorization engine.',
    skills: ['Django', 'React', 'REST API', 'PostgreSQL'],
    img: imgMyfi,
  },
  {
    slug: 'scheduler',
    title: 'Scheduler',
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

export const featuredProjects = projects.filter((project) => project.featured);

export const getProjectBySlug = (slug) =>
  projects.find((project) => project.slug === slug || project.aliases?.includes(slug));

export const projectsInCategories = (...categories) =>
  projects.filter((project) => categories.includes(project.category));

export const projectsByCategory = (category) =>
  projects.filter((project) => project.category === category);
