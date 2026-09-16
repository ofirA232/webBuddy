import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Dev-only visual editing toolbar. Loaded dynamically so it never enters the production bundle.
if (import.meta.env.DEV) {
  import("./components/StagewiseToolbarWrapper").then(({ StagewiseToolbarWrapper }) => {
    const toolbarContainer = document.createElement("div");
    toolbarContainer.id = "stagewise-toolbar-root";
    document.body.appendChild(toolbarContainer);
    createRoot(toolbarContainer).render(<StagewiseToolbarWrapper />);
  });
}
