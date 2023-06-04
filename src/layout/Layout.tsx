import React, { useEffect, useState } from "react";
import { classJoin } from "../helpers/utils";
import "./Layout.scss";

const MOBILE_WIDTH = 800;
const MIN_WIDTH = 600;
const MIN_HEIGHT = 600;
const EM_SIZE = 16;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [compact, setCompact] = useState(false);
  
  useEffect(() => {
    const onResize = () => {
      const scale = Math.min(window.innerWidth / MIN_WIDTH, window.innerHeight / MIN_HEIGHT, 1.0);
      document.documentElement.style.fontSize = scale * EM_SIZE + "px";
      
      setCompact(window.innerWidth < MOBILE_WIDTH);
    };
    
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      document.documentElement.style.fontSize = "";
    };
  }, []);
  
  return (
    <div className={classJoin("Layout", compact && "compact")}>
      {children}
    </div>
  );
}
