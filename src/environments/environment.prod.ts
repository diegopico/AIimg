export const environment = {
  production: true,
  /*
  serverRootUrl: 'https://127.0.0.1:7085',
  basePathUrl: 'https://127.0.0.1:7085/api',
  baseHubUrl: 'https://127.0.0.1:7085/hubs',
  baseChatUrl: 'https://127.0.0.1:7085/chatHub',
  crmChatHubUrl: 'https://127.0.0.1:7085/crmChatHub',
  baseApiUrl: 'https://127.0.0.1:7085/api',
  socketUrl: 'https://127.0.0.1:7085/socket.io',
  */
  /*
  serverRootUrl: 'https://api.aisolutionshub.ec',
  basePathUrl: 'https://api.aisolutionshub.ec/api',
  baseHubUrl: 'https://api.aisolutionshub.ec/hubs',
  baseChatUrl: 'https://api.aisolutionshub.ec/chatHub',
  crmChatHubUrl: 'https://api.aisolutionshub.ec/crmChatHub',
  baseApiUrl: 'https://api.aisolutionshub.ec/api',
  socketUrl: 'https://api.aisolutionshub.ec/socket.io',
  */
  baseApiUrl:     'http://157.100.250.13:8001/api',
  basePathUrl:    'http://157.100.250.13:8001/api',
  apiUrlPHP: `${document.getElementsByTagName('base')[0].href}/assets/php`, // 'http://
  apiEndpoint:    'api/products/images', // Este endpoint Base Sql Server 

  defaultUsername: 'guest',
  guesUserPassword: '123456',
  recaptcha: {
    siteKey: '6Lc2ypYqAAAAAJRTRT0usZNgq-FwY4X_1TsOVST6'
  }, // '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'  },
};
