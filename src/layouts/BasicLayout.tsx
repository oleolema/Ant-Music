import React, { useEffect, useRef } from 'react';
import MusicPlayer from '@/pages/MusicPlayer';
import { Card } from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import useMusicPlayer from '@/hooks/useMusicPlayer';
import { useLocation } from 'umi';

const BasicLayout: React.FC = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { miniVisible } = useModel('miniMusic');
  const { setFull } = useMusicPlayer();
  const location = useLocation();

  useEffect(() => {
    setFull(false);
  }, [location.pathname]);

  useEffect(() => {
    console.info(scrollRef.current);
    if (!scrollRef.current) {
      return;
    }
  }, [scrollRef]);
  // style={{ height: 500, overflowY: 'scroll' }}

  return (
    <div
      className="baseLayout"
      style={{
        height: `calc(100vh ${miniVisible ? '- 77px' : ''} - 48px)`,
        overflowY: 'scroll',
        width: '100%',
      }}
      ref={scrollRef}
    >
      <Card>
        {children}
        <MusicPlayer />
      </Card>
    </div>
  );
};
export default BasicLayout;
