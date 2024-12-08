
type ButtonProps = {
  className: string;
  text: string
  onClick: () => void;
};

const Button = ({className, text, onClick}: ButtonProps) => {

  return (
    <button onClick={onClick} className={" text-white font-semibold rounded-sm px-1 py-6 w-full " + className} >
      {text}
    </button>
  )
}

export default Button
