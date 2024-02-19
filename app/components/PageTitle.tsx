interface PropTypes {
  titleText: string;
}

const PageTitle = ({titleText}: PropTypes) => {
  return (
    <header className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{titleText}</h2>
    </header>
  );
};

export default PageTitle;
