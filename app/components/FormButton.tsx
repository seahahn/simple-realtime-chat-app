import {forwardRef} from "react";
import {Button, ButtonProps} from "./ui/button";

interface PropTypes extends ButtonProps {
  buttonText: string;
}

const FormButton = forwardRef<HTMLButtonElement, PropTypes>(
  (
    {
      buttonText,
      className = "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black",
      ...props
    },
    ref
  ) => {
    return (
      <Button className={className} ref={ref} {...props}>
        {buttonText}
      </Button>
    );
  }
);
FormButton.displayName = "FormButton";

export default FormButton;
