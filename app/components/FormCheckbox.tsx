import {forwardRef} from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import {Checkbox} from "./ui/checkbox";

interface PropTypes extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  labelText: string;
}

const FormCheckbox = forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, PropTypes>(
  ({labelText, className, ...props}, ref) => (
    <div className="flex items-center">
      <Checkbox className={className} ref={ref} {...props} />
      <label className="ml-2 block text-sm text-gray-900" htmlFor={props.name}>
        {labelText}
      </label>
    </div>
  )
);
FormCheckbox.displayName = "FormCheckbox";

export default FormCheckbox;
