import ReactLoading from "react-loading";

const Loader = () => {
  return (
    <div className="flex gap-7 h-screen w-screen bg-white dark:bg-black content-center items-center justify-center text-center">
      <ReactLoading height={200} width={200} />
    </div>
  );
};

export default Loader;
