import imgScheduler from '../assets/img/proj-scheduler.png';
import imgJungle from '../assets/img/proj-jungle.png';
import imgTinyapp from '../assets/img/proj-tinyapp.png';
import imgReasonable from '../assets/img/proj-reasonable.png';
import imgLink from '../assets/img/link-feed.png';
import imgMyfi from '../assets/img/myfi-dashboard.png';
import imgBarberbot from '../assets/img/barberbot.jpg';

export const playgroundLooks = [
  {
    id: '001',
    slug: 'portal-weather',
    title: 'portal weather',
    note: 'Cold water, fog, silt. The first look that landed.',
  },
  {
    id: '002',
    slug: 'portal-waves',
    title: 'portal waves',
    note: 'Traveling waves inside the body. The field on the homepage.',
  },
  {
    id: '003',
    slug: 'pixelwarm',
    title: 'pixelwarm',
    note: 'Warm mosaic inside the portal.',
  },
  {
    id: '004',
    slug: 'chromeenergy',
    title: 'chromeenergy',
    note: 'Liquid metal, body as instrument.',
  },
  {
    id: '005',
    slug: 'ghosted',
    title: 'ghosted',
    note: 'Strobe afterimages. Delayed selves.',
  },
];

export const projects = [
  {
    slug: 'playground-visuals',
    title: 'Playground Visuals',
    org: 'Personal',
    category: 'visuals',
    kind: 'playground',
    featured: true,
    featuredSize: 'large',
    hasCaseStudy: true,
    line: 'Live looks for a dark room.',
    description:
      'A camera playground: body as portal, traveling fields, saved looks. Built for a room, prototyped at a desk. Still in progress.',
    skills: ['WebGL', 'GLSL', 'Webcam', 'TouchDesigner'],
    caseStudy: {
      problem:
        'Most “visuals” toys are desktop widgets or face filters. I wanted something that reads at rave scale: you walk in, your silhouette is the mask, and the field is already happening.',
      built:
        'Live is the party camera. Studio is the clip workbench. Looks are frozen mixes — portal weather, portal waves, and the ones after. The homepage field is a quiet port of portal waves.',
      outcome:
        'In progress. The piece is the mixer and the saved looks, not a shipped product page. This page is the studio index while it is still moving.',
    },
  },

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
    slug: 'hairstylist',
    title: 'Hairstylist Website',
    org: 'Client',
    category: 'client',
    featured: false,
    featuredSize: 'default',
    hasCaseStudy: false,
    line: 'A site for an independent stylist.',
    description: 'Website for an independent hairstylist.',
    skills: ['Web Development'],
  },
  {
    slug: 'link',
    title: 'Link',
    category: 'personal',
    featured: false,
    hasCaseStudy: false,
    status: 'In progress',
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
    line: 'Budgets from multi-bank statements.',
    description:
      'Budgeting dashboard with a Django REST API and React frontend. Multi-bank statement processing and a rule-based categorization engine.',
    skills: ['Django', 'React', 'REST API', 'PostgreSQL'],
    img: imgMyfi,
  },
  {
    slug: 'barberbot',
    title: 'BarberBot',
    category: 'personal',
    featured: true,
    hasCaseStudy: false,
    line: 'Voice AI that books the chair.',
    description:
      'VAPI voice AI assistant in live pilot with an active barbershop. Handles inbound calls, books appointments, and connects to GoHighLevel CRM and Square, with no human in the loop.',
    skills: ['VAPI', 'Voice AI', 'GoHighLevel', 'Square'],
    img: imgBarberbot,
    imgFit: 'contain',
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
    url: 'https://github.com/yobazy/jungle',
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
  projects.find((project) => project.slug === slug);

export const projectsByCategory = (category) =>
  projects.filter((project) => project.category === category);
