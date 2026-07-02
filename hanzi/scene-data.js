var SCENE_CATEGORIES = [
  { id: "全部", icon: "📋", label: "全部" },
  // { id: "家具", icon: "🪑", label: "家具" },
  // { id: "厨房", icon: "🍳", label: "厨房" },
  // { id: "卫浴", icon: "🧹", label: "卫浴清洁" },
  // { id: "家电", icon: "📺", label: "家电" },
  // { id: "穿戴", icon: "👕", label: "家纺穿戴" },
  // { id: "收纳", icon: "📦", label: "收纳杂物" },
  // { id: "文具", icon: "✏️", label: "文具工具" },
  // { id: "美食", icon: "🍜", label: "美食" },
  // { id: "便民", icon: "🏪", label: "便民" },
  // { id: "游乐", icon: "🎡", label: "游乐" },
  // { id: "政务", icon: "🏛️", label: "政务" },
  // { id: "出行", icon: "🚄", label: "出行" },
  // { id: "山野", icon: "⛰️", label: "山野" },
  // { id: "古迹", icon: "🏯", label: "古迹" },
  // { id: "工坊", icon: "🛠️", label: "工坊" },
  // { id: "动物园", icon: "🦁", label: "动物园" },
];

var SCENE_CATEGORY_META = {};
SCENE_CATEGORIES.forEach(function (cat) {
  SCENE_CATEGORY_META[cat.id] = cat;
});

function makeSceneObjects(groups) {
  return groups.reduce(function (items, group) {
    return items.concat(
      group.words.split(/[、，；;]+/).map(function (label) {
        label = label.trim();
        var match = label.match(/[\u4e00-\u9fa5]/);
        return {
          char: match ? match[0] : label.charAt(0),
          label: label,
          category: group.category,
        };
      })
    );
  }, []);
}

// 对每个物品加上分类标签
var SCENES_RAW = [
  {
    img: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/scene_home.png",
    name: "家里",
    objects: makeSceneObjects([
      { category: "家具", words: "桌子、椅子、床、窗户、电灯、柜子" },
      {
        category: "厨房",
        words: "杯子、锅具、饭碗、筷子、勺子、盘子、水壶、菜刀、锅铲、灶台",
      },
      {
        category: "卫浴",
        words: "盆子、水桶、毛巾、镜子、扫帚、拖把、抹布",
      },
      { category: "家电", words: "风扇、电视、空调、洗衣机、冰箱" },
      { category: "穿戴", words: "枕头、被子、地毯、鞋子、窗帘" },
      { category: "收纳", words: "篮子、收纳盒、门锁、花瓶、垃圾桶" },
      { category: "文具", words: "书本、笔杆、纸张、剪刀" },
    ]),
  },
  {
    img: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/scene_park.png",
    name: "公园",
    objects: makeSceneObjects([
      {
        category: "植物",
        words:
          "大树、花朵、小草、柳树、荷花、荷叶、月季、牡丹、芦苇、松柏、樱花、桂花、蒲公英、藤蔓、竹林、睡莲",
      },
      {
        category: "动物",
        words:
          "小鸟、小鱼、蝴蝶、蜜蜂、青蛙、鸽子、蜻蜓、麻雀、野鸭、锦鲤、瓢虫、知了、松鼠、蚂蚁",
      },
      {
        category: "水景",
        words: "水池、湖泊、喷泉、小船、溪流、荷塘、水潭、游船",
      },
      {
        category: "设施",
        words:
          "小桥、凉亭、长椅、小路、路灯、台阶、篱笆、健身器材、观景台、石桌、石凳、指示牌、垃圾桶、长廊",
      },
      {
        category: "景物",
        words:
          "石头、白云、风、假山、树荫、露珠、彩虹、阳光、晚霞、薄雾、落叶、青苔、沙土、山丘",
      },
      {
        category: "游玩",
        words:
          "儿童滑梯、皮球、风筝、秋千、摇摇马、泡泡机、滑板、飞盘、渔网、小水桶",
      },
      { category: "人物", words: "老人、小朋友、游客、散步的人、骑行者" },
    ]),
  },
  {
    img: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/scene_school.png",
    name: "学校",
    objects: makeSceneObjects([
      {
        category: "文具",
        words:
          "书本、铅笔、本子、黑板、直尺、图画、黑板擦、粉笔、橡皮、卷笔刀、彩笔、墨水、钢笔、水彩、油画棒、修正带、文件夹、剪刀、胶水、订书机、量角器、三角板、彩纸、蜡笔、作业本、答题卡",
      },
      {
        category: "家具",
        words: "大门、课桌、椅子、窗户、讲台、储物柜、讲台桌、窗帘、书架",
      },
      { category: "收纳", words: "书包、文具盒、文件袋、收纳盒、笔袋" },
      {
        category: "建筑",
        words: "教学楼、楼梯、走廊、围墙、校门、报告厅、艺术楼、实验楼",
      },
      {
        category: "场地",
        words:
          "操场、课堂、图书馆、食堂、实验室、美术室、音乐室、医务室、阶梯教室、跑道、草坪、升旗台",
      },
      {
        category: "体育",
        words:
          "皮球、篮球架、跳绳、足球、羽毛球、乒乓球、呼啦圈、毽子、跳远沙坑、接力棒、平衡木、跳马",
      },
      {
        category: "设施",
        words:
          "铃铛、时钟、国旗、卫生间、饮水机、监控、宣传栏、公告栏、广播、消防栓、照明灯",
      },
      {
        category: "人物",
        words: "老师、学生、校长、保安、保洁、值日生、班长、值日生、体育委员",
      },
      {
        category: "乐器",
        words: "笛子、钢琴、古筝、口琴、鼓、小提琴、沙锤、电子琴",
      },
      {
        category: "景物",
        words: "校园小花、校园大树、草坪、花坛、绿植、藤蔓、月季、樟树",
      },
      {
        category: "教具",
        words: "地球仪、挂图、模型、白板、磁性贴、三角教具",
      },
    ]),
  },
  {
    img: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/scene_supermarket.png",
    name: "超市",
    objects: makeSceneObjects([
      {
        category: "水果",
        words:
          "苹果、香蕉、梨子、橙子、葡萄、西瓜、桃子、草莓、芒果、荔枝、龙眼、哈密瓜、火龙果、猕猴桃、蓝莓、樱桃、榴莲、木瓜、石榴",
      },
      {
        category: "生鲜",
        words:
          "鱼、猪肉、鸡蛋、青菜、萝卜、黄瓜、蘑菇、鲜虾、螃蟹、牛肉、羊肉、鸡肉、鸭肉、鹅肉、生蚝、扇贝、带鱼、鲫鱼、生菜、白菜、番茄、茄子、冬瓜、土豆、辣椒、芹菜、韭菜、玉米、莲藕、山药、豆腐、鸭血",
      },
      {
        category: "粮油",
        words:
          "大米、面条、面粉、食用油、食盐、白糖、小米、黑米、红豆、绿豆、黄豆、花生、芝麻、生抽、老抽、醋、蚝油、花椒、八角、粉条、粉丝",
      },
      {
        category: "零食饮品",
        words:
          "牛奶、饼干、面包、干果、饮料、冰淇淋、酒水、茶叶、酸奶、果冻、薯片、巧克力、糖果、糕点、矿泉水、果汁、奶茶、咖啡、啤酒、红酒、坚果、海苔、肉干",
      },
      {
        category: "日用",
        words:
          "纸巾、肥皂、水桶、购物篮、购物车、洗衣液、洗洁精、拖把、扫帚、毛巾、牙刷、牙膏、脸盆、垃圾袋、衣架、保鲜膜、一次性餐具、保温杯",
      },
      {
        category: "收银",
        words: "价签、收银台、扫码枪、小票、收银机、塑料袋、会员卡",
      },
      {
        category: "冷冻速食",
        words: "速冻饺子、汤圆、牛排、速冻包子、火腿、培根、冰淇淋、冷冻薯条",
      },
      {
        category: "烘焙熟食",
        words: "蛋糕、蛋挞、卤味、烤鸭、馒头、花卷、烤肠、凉拌菜",
      },
    ]),
  },
  {
    img: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/scene_sea.png",
    name: "海边",
    objects: makeSceneObjects([
      {
        category: "海水沙滩",
        words:
          "大海、波浪、沙滩、浪花、潮水、浅滩、海滨、碧海、泥沙、潮沟、滩涂、海面、海浪、潮汐",
      },
      {
        category: "海洋动物",
        words:
          "小鱼、虾、螃蟹、海鸥、鲸鱼、海龟、鲨鱼、章鱼、鱿鱼、海豚、海狮、海象、水母、海星、海胆、皮皮虾、小丑鱼、金枪鱼、扇贝、牡蛎、海鸟、白鹭",
      },
      {
        category: "贝藻珊瑚",
        words: "贝壳、海藻、珊瑚、海螺、海草、海带、珍珠贝、花蛤、蛏子",
      },
      {
        category: "船具渔具",
        words:
          "小船、帆船、快艇、渔网、鱼竿、渔船、游艇、橡皮艇、渔篓、鱼叉、浮标、船桨、船帆",
      },
      {
        category: "海岸景物",
        words:
          "礁石、海岛、海崖、椰子树、沙滩岩石、红树林、沙丘、海湾、码头、灯塔、栈桥",
      },
      {
        category: "沙滩用品",
        words:
          "遮阳伞、沙滩桶、小铲子、游泳圈、沙滩椅、太阳帽、沙滩拖鞋、冲浪板、小水桶、捞鱼网、遮阳帽、沙滩垫",
      },
      {
        category: "游玩人物",
        words: "游客、渔民、小朋友、冲浪者、赶海人、潜水员",
      },
      {
        category: "天象风光",
        words: "海风、落日、朝霞、晚霞、蓝天、白云、海鸥群",
      },
    ]),
  },
  {
    img: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/scene_traffic.png",
    name: "交通",
    objects: makeSceneObjects([
      {
        category: "道路车辆",
        words:
          "汽车、自行车、摩托车、电动车、卡车、出租车、货车、拖车、房车、厢式车、小轿车、越野车、三轮车、洒水车、消防车、救护车、公交车、搅拌车、渣土车、校车、共享单车、共享电驴、皮卡车、观光车",
      },
      {
        category: "公共交通",
        words:
          "巴士、地铁、轻轨、火车、车站、高铁站、长途客车、有轨电车、城际列车、客运大巴、观光缆车、摆渡车",
      },
      {
        category: "航空",
        words: "飞机、机场、直升机、客机、客机跑道、停机坪、候机厅、通航小飞机",
      },
      {
        category: "水上交通",
        words:
          "轮船、轮渡、港口、帆船、快艇、渡口、游船、游艇、渔船、气垫船、游轮、码头、客船",
      },
      {
        category: "道路设施",
        words:
          "马路、大桥、红绿灯、隧道、人行道、护栏、路标、天桥、斑马线、减速带、路灯、隔离栏、地下通道、匝道、环岛、指示牌、收费站、人行天桥",
      },
      {
        category: "服务场地",
        words:
          "加油站、停车场、缆车、充电桩、换电站、洗车行、汽修店、租车行、高速服务区、车辆检测站",
      },
      {
        category: "交通人物",
        words: "司机、乘客、交警、行人、乘务员、驾驶员",
      },
    ]),
  },
  {
    img: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/animal.png",
    name: "动物园",
    objects: makeSceneObjects([
      {
        category: "猛兽",
        words: "狮子、老虎、狐狸、狼、熊、豹子、美洲豹、鬣狗、猞猁",
      },
      {
        category: "草食动物",
        words:
          "大象、长颈鹿、斑马、袋鼠、河马、犀牛、骆驼、梅花鹿、熊猫、羚羊、羊驼、牦牛、麋鹿、驯鹿、山羊、绵羊",
      },
      {
        category: "鸟类",
        words:
          "孔雀、鹦鹉、鸵鸟、天鹅、企鹅、老鹰、丹顶鹤、白鹭、火烈鸟、猫头鹰、啄木鸟、鸽子、金刚鹦鹉",
      },
      {
        category: "水爬动物",
        words: "海豹、鳄鱼、海狮、海象、蜥蜴、巨蟒、乌龟、水獭",
      },
      {
        category: "灵长动物",
        words: "猴子、金丝猴、黑猩猩、大猩猩、狒狒、长臂猿",
      },
      { category: "小型萌兽", words: "松鼠、兔子、龙猫、土拨鼠、刺猬" },
      { category: "人员", words: "饲养员、兽医、游客、讲解员" },
      {
        category: "园区设施",
        words: "动物园、围栏、笼舍、草料、观景台、投喂台、水池、树木、指示牌",
      },
    ]),
  },

  {
    img: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/scene_farm.png",
    name: "农场",
    objects: makeSceneObjects([
      {
        category: "田地作物",
        words:
          "田地、禾苗、麦子、稻谷、青菜、瓜果、菜花、菜苗、谷穗、玉米、红薯、土豆、棉花、花生、大豆、辣椒、黄瓜、白菜、萝卜、甘蔗、油菜、高粱、小葱、大蒜、草莓、葡萄",
      },
      {
        category: "家畜",
        words: "奶牛、马、猪、小羊、兔子、水牛、黄牛、毛驴、驴、梅花鹿",
      },
      {
        category: "家禽",
        words: "小鸡、鸭子、大鹅、公鸡、母鸡、鸳鸯、火鸡",
      },
      {
        category: "农具",
        words:
          "犁耙、镰刀、农用车、水桶、竹篓、锄头、铁锹、扁担、箩筐、洒水壶、脱粒机、喷雾器、木铲、柴刀、麻袋",
      },
      {
        category: "农场设施",
        words:
          "水井、大棚、粮仓、农屋、畜圈、围栏、池塘、水渠、晒谷场、谷堆、水泵、柴房、鸡舍、牛棚、羊圈、渔网、小桥、地膜、仓库",
      },
      {
        category: "植物昆虫",
        words:
          "水果、肥料、青草、蜜蜂、蚕宝宝、果树、野花、稻草、桑叶、藤蔓、蝴蝶、蜻蜓、蚯蚓、瓢虫、蚂蚱",
      },
      {
        category: "农副产品",
        words: "鸡蛋、牛奶、蜂蜜、蚕丝、柴火、干草、菜籽、面粉",
      },
      {
        category: "农场人物",
        words: "农民、农夫、牧童、养殖户、采摘工人",
      },
    ]),
  },
  {
    img: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/icon_food.png",
    name: "美食",
    objects: makeSceneObjects([
      {
        category: "市场食材",
        words:
          "菜市场、生鲜市场、水果店、干货店、粮油店、水产市场、肉铺、牛羊肉店、调味品店、豆制品店、海鲜加工店",
      },
      {
        category: "早餐面点",
        words:
          "早餐铺、包子铺、馄饨铺、面馆、拉面馆、饺子馆、粥铺、肠粉店、水饺店、面食铺、馒头店、煎饼摊",
      },
      {
        category: "正餐餐馆",
        words:
          "火锅店、烧烤店、自助餐厅、农家乐、药膳馆、小炒店、中餐厅、西餐厅、烤肉店、牛排馆、寿司店、料理店、家常菜馆、大排档、砂锅店、汤锅店、素食馆、私房菜、海鲜酒楼",
      },
      {
        category: "小吃夜宵",
        words:
          "小吃街、麻辣烫店、螺蛳粉店、串串店、卤味店、熟食铺、卤菜摊、烧腊店、夜宵摊、炸串店",
      },
      {
        category: "甜品烘焙",
        words:
          "甜品屋、蛋糕店、冰淇淋店、烘焙工坊、糖水铺、冰粉店、糕点铺、零食店、干果铺",
      },
      {
        category: "饮品酒茶",
        words:
          "茶叶店、奶茶店、酒庄、酸奶店、咖啡屋、果汁店、酒水商行、酒行、茶馆",
      },
    ]),
  },
  {
    img: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/icon_community_services.png",
    name: "便民",
    objects: makeSceneObjects([
      {
        category: "服饰零售",
        words: "服装店、童装店、饰品店、箱包店、皮鞋店、母婴店",
      },
      {
        category: "宠物花鸟",
        words: "玩具店、花店、宠物店、爬宠馆、鸟市、绿植店",
      },
      {
        category: "数码家电",
        words: "眼镜店、钟表店、手机店、家电城、钟表维修、手机维修、家电维修",
      },
      {
        category: "家居建材",
        words:
          "家具店、五金店、渔具店、窗帘店、家纺店、门窗店、纱窗门店、灯具店",
      },
      {
        category: "生活服务",
        words:
          "打印店、裁缝铺、洗衣店、干洗店、修鞋铺、配钥匙店、照相馆、冲印店、裁缝改衣店、开锁店、废品回收站、彩票店",
      },
      {
        category: "美容护理",
        words: "理发店、美妆店、美甲店、美容养生馆、足疗店",
      },
      {
        category: "餐饮生鲜",
        words:
          "水果店、生鲜店、菜市场、便利店、超市、面包店、蛋糕店、奶茶店、小吃店、早餐铺、熟食店、卤味店、烟酒铺、茶叶店、调味品店、粮油店、肉铺、水产店",
      },
      {
        category: "文礼手作",
        words:
          "文具店、书店、礼品店、陶艺店、十字绣店、棉被加工店、缝纫店、药材铺、汽车美容店、维修铺",
      },
    ]),
  },
  {
    img: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/icon_playground.png",
    name: "游乐",
    objects: makeSceneObjects([
      {
        category: "阅读艺术",
        words:
          "图书馆、书店、文具店、画室、琴行、棋院、舞蹈教室、书画展厅、音乐厅、藏书阁",
      },
      {
        category: "手工非遗",
        words: "陶艺馆、DIY 手工坊、非遗体验馆、非遗工坊、木偶戏院",
      },
      {
        category: "科普展馆",
        words: "科技馆、博物馆、美术馆、天文馆、地质馆、昆虫馆、恐龙馆",
      },
      {
        category: "青少活动",
        words: "少年宫、文化馆、青少年活动中心、托管班",
      },
      {
        category: "动植物馆",
        words: "动物园、植物园、海洋馆、蝴蝶谷、多肉大棚、鳄鱼园、孔雀园",
      },
      {
        category: "游乐休闲",
        words: "游乐园、水上乐园、密室剧场、露营基地、电影院、剧场",
      },
      {
        category: "运动场馆",
        words:
          "游泳馆、滑雪场、滑冰场、蹦床馆、攀岩馆、篮球场、羽毛球馆、乒乓球馆、跆拳道馆、马术场、射箭馆、台球室、健身房",
      },
    ]),
  },
  {
    img: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/icon_public_services.png",
    name: "政务",
    objects: makeSceneObjects([
      {
        category: "政务服务",
        words:
          "社区居委会、政务大厅、税务局、医保服务中心、社保大厅、不动产登记中心、车管所、出入境大厅、人才服务中心、婚姻登记处、土地所",
      },
      {
        category: "公共营业",
        words:
          "银行、邮局、移动 / 电信营业厅、电力营业厅、自来水公司、燃气营业厅、广电营业厅",
      },
      {
        category: "安全司法",
        words:
          "消防站、派出所、消防体验馆、交通安全体验馆、戒毒馆、司法所、法律援助中心、应急救援中心",
      },
      {
        category: "公益民生",
        words:
          "养老院、红十字站、疾控中心、卫生院、妇幼保健院、救助站、福利院、退役军人服务站、殡仪馆、公墓",
      },
      {
        category: "纪念文化",
        words:
          "档案馆、烈士陵园、纪念馆、党史纪念馆、图书馆、文化馆、博物馆、青少年活动中心",
      },
      {
        category: "观测科普",
        words:
          "气象局、气象观测站、水文站、水文观测点、农耕文化馆、航空体验馆、人防科普馆、地震观测站、检测中心",
      },
      {
        category: "城市管理",
        words:
          "环卫所、污水处理厂、公交调度中心、市场监管所、公园管理处、市容管理站、林业站、水利所",
      },
    ]),
  },
  {
    img: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/icon_transport.png",
    name: "出行",
    objects: makeSceneObjects([
      {
        category: "交通枢纽",
        words:
          "机场、码头、火车站候车厅、高铁站、长途汽车站、公交总站、城乡公交站、地铁站、轻轨站、有轨电车站、城际站、轮渡渡口、游船码头、直升机场、通用机场、索道站、客运换乘中心、旅游集散中心、轮渡候船厅、长途候车室",
      },
      {
        category: "住宿营地",
        words:
          "酒店、民宿、木屋民宿、青年旅社、公寓、温泉度假村、度假山庄、房车营地、农家乐、渔家乐、树屋民宿、帐篷露营地、窑洞民宿、水上船屋、胶囊旅馆、钟点房、康养疗养院、乡村别院、海岛小屋、山林野宿、亲子营地、别墅度假屋、自驾露营基地",
      },
      {
        category: "车辆服务",
        words:
          "加油站、停车场、洗车行、汽修店、租车行、高速服务区、新能源充电站、换电站、机动车检测站、汽车 4S 店、汽车美容改装店、轮胎店、道路救援点、共享单车 / 电动车租赁点、驾校考场、报废车回收场",
      },
      {
        category: "物流仓储",
        words:
          "快递驿站、物流仓库、快递分拣中心、冷链仓库、货运市场、铁路货场、航空货站、零担货运网点、电商前置仓、保税仓、普通仓储园、同城跑腿中转站、大件物流中心、农产品仓储市场、危化品仓库、国际货运中心、自提柜站点",
      },
      {
        category: "景区出行",
        words:
          "景区观光车站、游客服务中心、观光车停靠点、山地换乘站、港口候船区、景区停车场",
      },
    ]),
  },
  {
    img: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/icon_mountains.png",
    name: "山野",
    objects: makeSceneObjects([
      {
        category: "树林花园",
        words:
          "山林、竹林、红树林、银杏林、樱花园、杜鹃谷、松树林、枫林、梅园、花谷、热带雨林、柏树林、槐树林、桃林、枣林、核桃林、丁香谷、月季园、野花丛、灌木丛、白桦林、橡树林",
      },
      {
        category: "水域湿地",
        words:
          "溪流、湖泊、芦苇荡、温泉泉眼、荷池、瀑布、山泉、江河、水潭、湿地、浅滩、冰川、水塘、河谷、暗河、涌泉、沼泽、浅涧、平湖、飞瀑",
      },
      {
        category: "地貌",
        words:
          "草原、梯田、沙漠、戈壁、溶洞、峡谷、山丘、悬崖、平原、雪地、高山、冰川、石林、丹霞、山谷、丘陵、岩壁、草甸、冻土、火山、黄土坡",
      },
      {
        category: "农旅采摘",
        words:
          "采摘园、采摘大棚、茶园、梨园、桃林、花圃、牧场、葡萄园、橘园、苹果园、草药园、桑园、草莓园、蓝莓园、草药山、菌菇基地、牧草坡",
      },
      {
        category: "休闲设施",
        words:
          "观景台、垂钓园、温泉馆、露营地、登山道、木栈道、山间凉亭、山野木屋、徒步驿站、野餐区、攀岩点、索道、观景长廊、休息石凳",
      },
      {
        category: "山野动植物",
        words:
          "野兔、小鹿、飞鸟、松鼠、野蜂、蝴蝶、蕨类、野藤、苔藓、野草、野果、菌菇、山茶花、野菊",
      },
      {
        category: "山野天象景物",
        words:
          "云雾、山风、晚霞、晨雾、落日、星空、松雾、山雨、积雪、落叶、青苔",
      },
    ]),
  },
  {
    img: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/icon_historic_sites.png",
    name: "古迹",
    objects: makeSceneObjects([
      {
        category: "古城村桥",
        words:
          "古镇、古城、古村落、古桥、古井、古道、古渡口、古码头、石巷、城门洞、古驿道、水磨坊、古码头、石板路、过街楼",
      },
      {
        category: "宗教礼制",
        words:
          "祠堂、寺庙、道观、文庙、药王庙、关帝庙、土地庙、藏经阁、佛塔、禅院、尼庵、妈祖庙、城隍庙、月老祠、舍利塔、三清殿、大雄宝殿、拜殿、祭坛、放生池",
      },
      {
        category: "城防军事",
        words:
          "城楼、烽火台、关隘、古城墙、炮台、敌楼、瓮城、箭楼、马道、兵寨、古堡、城墙垛口、营盘",
      },
      {
        category: "碑刻陵墓",
        words:
          "石窟、碑林、古墓、陵园、皇陵、摩崖石刻、石像、石翁仲、石碑、墓志铭、石阙、地宫、神道、碑亭、崖墓、石刻造像、经幢",
      },
      {
        category: "传统建筑",
        words:
          "古塔、古园林、亭台、牌坊、钟楼、鼓楼、书院、古戏台、水榭、回廊、照壁、假山、花窗、马头墙、四合院落、绣楼、文昌阁、魁星楼、廊桥、水亭、藏书楼",
      },
      {
        category: "出土古物",
        words: "青铜器、古陶器、瓷器、石碑、石斧、古铜镜、玉器、竹简、石刻拓片",
      },
      {
        category: "古代设施遗迹",
        words: "古运河、堰坝、水车、古粮仓、驿馆、石磨、吊脚楼、石舫、古栈道",
      },
    ]),
  },
  {
    img: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/icon_workshop.png",
    name: "工坊",
    objects: makeSceneObjects([
      {
        category: "传统工艺",
        words:
          "造纸坊、陶瓷窑、染布坊、打铁铺、织布坊、竹编坊、木雕坊、泥塑坊、漆器坊、制笔坊、缫丝坊、刻砚坊、油纸伞坊、花灯坊、草编坊、铜器坊、银饰铺、年画作坊、扎染工坊、藤编坊、篆刻工坊、玉雕坊、剪纸作坊、香烛坊",
      },
      {
        category: "食品加工",
        words:
          "榨油坊、酿酒坊、糕点加工厂、酱菜坊、豆腐坊、酱醋坊、挂面坊、蜜饯坊、磨坊、红糖坊、茶叶作坊、腊肉熏坊、米粉坊、年糕坊、腐竹坊、麦芽糖坊、榨糖坊、咸菜作坊、馒头作坊",
      },
      {
        category: "工业加工",
        words:
          "木材加工厂、印刷厂、服装厂、家具厂、塑料加工厂、五金加工厂、纺织厂、包装厂、石材加工厂、纸品加工厂",
      },
      {
        category: "手作工坊",
        words:
          "皮具工坊、玻璃工坊、首饰坊、石雕坊、陶艺手作、香薰工坊、蜡烛工坊、银饰工坊、黏土手作、皮具修复坊、琉璃工坊、串珠工坊、版画工坊",
      },
      {
        category: "维修修缮工坊",
        words: "修鞋铺、修表坊、修车工坊、木器修补坊、古物修复坊、配锁工坊",
      },
      {
        category: "农耕物料工坊",
        words: "篾器铺、农具锻造坊、蓑衣作坊、箩筐工坊",
      },
    ]),
  },

  {
    img: "https://cdn.jsdelivr.net/gh/wjzcd2011/yuxiaoxiong/hanzi/scene_hospital.png",
    name: "医院",
    objects: makeSceneObjects([
      { category: "医护人物", words: "医生、护士、护工、病人" },
      {
        category: "诊疗空间",
        words: "病房、诊室、药房、手术室、病房门、挂号台、缴费窗口",
      },
      {
        category: "医疗器械",
        words:
          "输液、针管、体温计、担架、救护车、CT机、B超、血压计、注射器、听诊器、轮椅、拐杖、氧气罐、体检仪、消毒灯",
      },
      {
        category: "药品护理",
        words:
          "药品、绷带、纱布、创可贴、药片、药水、口罩、消毒水、棉签、点滴、病历本",
      },
      {
        category: "身体部位",
        words: "心脏、大脑、眼睛、牙齿、肠胃、骨骼、伤口",
      },
      {
        category: "病房用品",
        words: "病床、枕头、被子、牙椅、电梯、走廊、手术",
      },
    ]),
  },
];

var SCENES = SCENES_RAW;
