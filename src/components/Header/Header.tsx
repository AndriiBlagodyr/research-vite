type HeaderProps = {
  name: string;
};

export default function Header({ name }: HeaderProps) {
  return (
    <>
      <span>{name}</span>
      <div>Header: {import.meta.env.VITE_API_URL} </div>
    </>
  );
}
