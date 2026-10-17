module.exports = {
  version: '26.10.8',
  note: '增加登录设备管理功能，可查看账号再哪些设备登录，可踢下线', // 这个为版本描述，无需修改
  subDomain: 'tz', // 此处改成你自己的专属域名。什么是专属域名？请看教程 https://www.it120.cc/help/qr6l4m.html
  merchantId: 951, // 商户ID，可在后台工厂设置-->商户信息查看
  customerServiceType: 'QW', // 客服类型，QW为企业微信，需要在后台系统参数配置企业ID和客服URL，XCX 为小程序的默认客服
  openIdAutoRegister: true, // 用户打开小程序的时候自动注册新用户【用户不存在的时候】
  showStartPage: false, // 启动引导页开关：false=启动直接进首页；true=展示引导轮播页
  couponUseMultiple: true, // 下单是否允许使用多张优惠券
}