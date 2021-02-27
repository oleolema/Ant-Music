export default [
  {
    path: '/',
    component: '../layouts/BasicLayout',
    menu: {
      flatMenu: true,
      hideInMenu: false,
      hideChildrenInMenu: false,
    },
    routes: [
      {
        path: '/',
        redirect: '/recommend/disc',
      },
      {
        path: '/playing',
        name: 'playing',
        icon: 'PlayCircle',
        component: './PlayingList/index',
      },
      {
        path: '/music-list',
        component: './DiscMusicList/index',
        hideInMenu: true,
      },
      {
        path: '/artist-music-list',
        component: './ArtistMusicList/index',
        hideInMenu: true,
      },
      {
        path: '/search',
        component: './Search/index',
        hideInMenu: true,
      },
      {
        path: '/history',
        name: 'history',
        icon: 'history',
        component: './HistoryMusicList/index',
      },
      {
        path: '/recommend/disc',
        name: 'recommend.disc',
        icon: 'crown',
        component: './Recommend/RecommendDisc/index',
      },
      {
        path: '/ranking',
        name: 'rankingList',
        icon: 'crown',
        routes: [
          {
            path: '/ranking/musicRanking',
            name: 'musicRanking',
            component: './RankingList/index',
          },
          {
            path: '/ranking/artistRanking',
            name: 'artistRanking',
            component: './ArtistTopList/index',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
