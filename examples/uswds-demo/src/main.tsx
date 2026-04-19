import React from "react";
import { createRoot } from "react-dom/client";
import "@trussworks/react-uswds/lib/uswds.css";
import "./styles.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(<App />);
