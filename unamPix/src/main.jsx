import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from '@pheralb/toast';
import { Main } from "./Main/Main";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Main />
      <Toaster />
    </BrowserRouter>
  </StrictMode>
);
