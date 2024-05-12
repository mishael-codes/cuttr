const Truncate = (str: string, n: number) => {// shorten link length in their respective containers
  const truncatedString: string =
    str.length > n ? str.substring(0, n - 1) + "..." : str;
  return truncatedString;
};

export default Truncate;