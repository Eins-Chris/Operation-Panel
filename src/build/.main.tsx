import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import "../styles/.main.css"
import Background from './background.tsx'
import Content from './content.tsx'
import Nav from './nav.tsx'

export type Sites = "home" | "devices";

const Main = () => {
  const [site, setSite] = useState<Sites>('home'); // <- State statt normale Variable

  return (
    <>
      <Background />
      <Content site={site} />
      <Nav site={site} setSite={setSite} />
    </>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
