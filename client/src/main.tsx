import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { StagewiseToolbarWrapper } from "./components/StagewiseToolbarWrapper";

// Create main app root
createRoot(document.getElementById("root")!).render(<App />);

// Create separate root for stagewise toolbar
if (process.env.NODE_ENV === 'development') {
  const toolbarContainer = document.createElement('div');
  toolbarContainer.id = 'stagewise-toolbar-root';
  document.body.appendChild(toolbarContainer);
  createRoot(toolbarContainer).render(<StagewiseToolbarWrapper />);
}
