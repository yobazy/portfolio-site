import zionCanyon from '../assets/media/zion-canyon.jpg';
import canyonWall from '../assets/media/canyon-wall.jpg';
import switchback from '../assets/media/switchback.jpg';
import desertRoad from '../assets/media/desert-road.jpg';
import redCliff from '../assets/media/red-cliff.jpg';
import slotLight from '../assets/media/slot-light.jpg';
import juniper from '../assets/media/juniper.jpg';
import rockFace from '../assets/media/rock-face.jpg';
import canyonFloor from '../assets/media/canyon-floor.jpg';
import pineLedge from '../assets/media/pine-ledge.jpg';
import layeredWall from '../assets/media/layered-wall.jpg';

export const PIXIESET_URL = 'https://bkvisuals100.pixieset.com/';

export const mediaItems = [
  {
    id: 'zion-canyon',
    title: 'Kolob Canyon',
    location: 'Utah',
    src: zionCanyon,
    featured: true,
    orientation: 'landscape',
  },
  {
    id: 'slot-light',
    title: 'Slot light',
    location: 'Utah',
    src: slotLight,
    featured: true,
    orientation: 'portrait',
  },
  {
    id: 'juniper',
    title: 'Juniper',
    location: 'Utah',
    src: juniper,
    featured: true,
    orientation: 'portrait',
  },
  {
    id: 'rock-face',
    title: 'Rock face',
    location: 'Utah',
    src: rockFace,
    featured: false,
    orientation: 'portrait',
  },
  {
    id: 'canyon-wall',
    title: 'Canyon wall',
    location: 'Utah',
    src: canyonWall,
    featured: false,
    orientation: 'landscape',
  },
  {
    id: 'canyon-floor',
    title: 'Canyon floor',
    location: 'Utah',
    src: canyonFloor,
    featured: false,
    orientation: 'portrait',
  },
  {
    id: 'switchback',
    title: 'Switchback',
    location: 'Utah',
    src: switchback,
    featured: false,
    orientation: 'landscape',
  },
  {
    id: 'layered-wall',
    title: 'Layered wall',
    location: 'Utah',
    src: layeredWall,
    featured: false,
    orientation: 'portrait',
  },
  {
    id: 'desert-road',
    title: 'Desert road',
    location: 'Utah',
    src: desertRoad,
    featured: false,
    orientation: 'landscape',
  },
  {
    id: 'pine-ledge',
    title: 'Pine ledge',
    location: 'Utah',
    src: pineLedge,
    featured: false,
    orientation: 'portrait',
  },
  {
    id: 'red-cliff',
    title: 'Red cliff',
    location: 'Utah',
    src: redCliff,
    featured: false,
    orientation: 'landscape',
  },
];

export const featuredMedia = mediaItems.filter((item) => item.featured);
