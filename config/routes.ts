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
        path: '/recommend/disc',
        name: 'recommend.disc',
        icon: 'crown',
        component: './Recommend/RecommendDisc/index',
      },
      {
        path: '/music-list',
        component: './DiscMusicList/index',
        hideInMenu: true,
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
