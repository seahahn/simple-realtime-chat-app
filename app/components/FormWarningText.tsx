interface PropTypes {
  warningText: string;
}

const FormWarningText = ({warningText}: PropTypes) => {
  return <em className="text-xs text-red-700 not-italic">{warningText}</em>;
};

export default FormWarningText;
