import React from "react";
import { render } from "react-dom";
import devOnlyException from "../dlogger";
//elogger({ devOnlyException })

const rootElement = document.getElementById("react-app");

render(<div> Hello World! </div>, rootElement);
