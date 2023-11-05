type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  type?: 'submit';
};

export default function Button({ children, type, ...props }: Props) {
  return (
    <button {...props} type={type || 'button'}>
      {children}
    </button>
  );
}
