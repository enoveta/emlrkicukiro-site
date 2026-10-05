import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

export default function GalleryLightbox({ photos, index, onClose }) {
  return (
    <Lightbox
      open
      close={onClose}
      index={index}
      slides={photos.map((p) => ({ src: p.src, alt: p.alt, title: p.caption }))}
      plugins={[Zoom]}
    />
  );
}
