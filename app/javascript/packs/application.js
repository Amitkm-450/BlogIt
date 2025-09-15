import "../stylesheets/application.scss";
import ReactRailsUJS from "react_ujs";
import App from "../src/App";

import { setAuthHeaders, registerIntercepts } from "apis/axios";
import { initializeLogger } from "common/logger";

initializeLogger();
registerIntercepts();
setAuthHeaders();

const componentsContext = { App };
ReactRailsUJS.getConstructor = name => {
  return componentsContext[name];
};
