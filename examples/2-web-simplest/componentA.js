import dlog from "./dloggger.js";

const componentA = function() {
  dlog.log({
    componentA:
      "dlog used for automated function logging (reoved and added with dlog cli"
  });
  tlog.log({
    globalLogging:
      "global logging - to save requiring into file before use, for manual logging."
  });
};

export default componentA;
