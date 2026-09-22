import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import ShowcaseGrid from '../components/ShowcaseGrid';
import ShowcaseTile from '../components/ShowcaseTile';
import { mediaItems, PIXIESET_URL } from '../data/mediaItems';

const Media = () => {
  const [index, setIndex] = useState(-1);

  return (
    <div className="gallery-page">
      <header className="gallery-header">
        <h1>Media</h1>
        <p>
          Photography from the field.{' '}
          <a href={PIXIESET_URL} target="_blank" rel="noopener noreferrer">
            Full gallery on Pixieset
          </a>
        </p>
      </header>

      <ShowcaseGrid variant="media">
        {mediaItems.map((item, itemIndex) => (
          <ShowcaseTile
            key={item.id}
            title={item.title}
            subtitle={item.location}
            img={item.src}
            orientation={item.orientation}
            onClick={() => setIndex(itemIndex)}
          />
        ))}
      </ShowcaseGrid>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={mediaItems.map((item) => ({ src: item.src, alt: item.title }))}
      />
    </div>
  );
};

export default Media;
