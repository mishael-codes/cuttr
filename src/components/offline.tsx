const Offline: React.FC = () => {
  return (
    <div className="w-full h-[70vh] flex items-center justify-center flex-col">
        <h1>You are <span className="text-accent font-semibold">offline</span></h1>
        <p>Please <span className="text-accent font-semibold">connect</span> to the internet</p>
    </div>
  );
};

export default Offline;
