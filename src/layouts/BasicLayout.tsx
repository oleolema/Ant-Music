import React, { useEffect, useRef } from 'react';
import MusicPlayer from '@/pages/MusicPlayer';
import { Card } from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import { useLocation } from 'umi';
import { Scrollbars } from 'react-custom-scrollbars';

const BasicLayout: React.FC = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { miniVisible } = useModel('miniMusic');
  const location = useLocation();
  const { setFull } = useModel('full');

  useEffect(() => {
    setFull(false);
  }, [location.pathname]);

  useEffect(() => {
    // @ts-ignore
    scrollRef.current = document.querySelector(`#baseLayout div`);
    console.info(scrollRef.current);
  }, []);

  return (
    <Scrollbars
      id="baseLayout"
      className="baseLayout"
      style={{
        height: `calc(100vh ${miniVisible ? '- 77px' : ''} - 48px)`,
        width: '100%',
      }}
      hideTracksWhenNotNeeded
    >
      <Card>
        {children}
        <MusicPlayer />
      </Card>
    </Scrollbars>
  );
};
export default BasicLayout;
