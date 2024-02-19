import {forwardRef} from "react";
import {Input, InputProps} from "./ui/input";

interface PropTypes extends InputProps {
  labelText?: string;
  labelClassName?: string;
}

const FormInput = forwardRef<HTMLInputElement, PropTypes>(
  (
    {
      labelText,
      labelClassName = "block text-sm font-medium text-gray-700",
      className = "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm",
      type,
      ...props
    },
    ref
  ) => {
    return (
      <div>
        <label className={labelClassName} htmlFor={props.name}>
          {labelText}
        </label>
        <div className="mt-1">
          <Input type={type} className={className} ref={ref} {...props} />
        </div>
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

export default FormInput;
