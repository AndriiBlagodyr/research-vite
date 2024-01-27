type PhotoCellDataProps = {
  imageUrl: string;
  size?: number;
};

export default function PhotoCellData({
  imageUrl,
  size = 55,
}: PhotoCellDataProps) {
  return <img src={imageUrl} alt='' width={`${size}px`} height={`${size}px`} />;
}
