import { initConnection } from "./connection.js";
import { resetClientState } from "./state.js";
import { navigate } from "./router.js";

initConnection();
resetClientState();
navigate("title");