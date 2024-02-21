const InputLongLink = ({text}: {text: string}) => {
  return (
    <div className="mt-10 flex items-center justify-center flex-col">
      <p>
        {text}
      </p>
      <input
        type="url"
        name="url"
        id="url"
        className="w-80 h-4 p-6 rounded-lg bg-transparent border border-accent focus:outline-none focus:border-2 mt-2"
        placeholder="https://www.example.com"
      />
      <button className="w-80 rounded-lg bg-accent font-bold text-background p-3 mt-4 border border-accent hover:bg-transparent hover:text-accent transition-all">
        Shorten
      </button>
    </div>
  );
};

export default InputLongLink;
