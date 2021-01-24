import React from "react";
import MusicPlayer from "@/pages/MusicPlayer";

const BasicLayout: React.FC = ({children}) => {

  return <>{children}
    <MusicPlayer/>
  </>
}
export default BasicLayout;
