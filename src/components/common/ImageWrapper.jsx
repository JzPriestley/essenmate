export default function ImageWrapper({ src, alt }) {
  return (
    <div className="image-wrapper">
      <img src={src} alt={alt} />
    </div>
  );
}
