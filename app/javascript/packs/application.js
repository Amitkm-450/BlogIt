import "../stylesheets/application.css";
import ReactRailsUJS from "react_ujs";
import App from "../src/App";

import "../src/common/i18n";
import { setAuthHeaders, registerIntercepts } from "apis/axios";
import { initializeLogger } from "common/logger";

initializeLogger();
registerIntercepts();
setAuthHeaders();

const componentsContext = { App };
ReactRailsUJS.getConstructor = name => {
  return componentsContext[name];
};
