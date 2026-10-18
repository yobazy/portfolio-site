import XrayGallery from '../components/XrayGallery';

// Mockup page: the x-ray gallery on its own, for trying the feel.
const XrayLab = () => (
  <div className="xray-page">
    <header className="xray-head">
      <h1 className="page-title">X-ray</h1>
      <p>A mockup for the demos. Drag the frames. Where a frame crosses another project, you see through it.</p>
    </header>
    <XrayGallery className="is-lab" />
  </div>
);

export default XrayLab;
