// 海子诗歌每日展示系统
document.addEventListener('DOMContentLoaded', function() {
    console.log('[DEBUG] DOM fully loaded and parsed');
    
    // 检查浏览器是否支持localStorage
    if (typeof(Storage) === 'undefined') {
        console.error('[ERROR] 您的浏览器不支持本地存储');
        displayError('您的浏览器不支持本地存储，无法使用每日更新功能。');
        return;
    }

    // 获取当前日期（YYYY-MM-DD格式），以凌晨4点为新一天的开始
    const now = new Date();
    const updateHour = 4; // 凌晨4点更新
    
    // 如果当前时间早于凌晨4点，使用前一天的日期
    if (now.getHours() < updateHour) {
        now.setDate(now.getDate() - 1);
    }
    
    const today = now.toISOString().split('T')[0];
    const lastDisplayDate = localStorage.getItem('lastDisplayDate');
    const storedPoemIndex = localStorage.getItem('poemIndex');
    
    console.log(`[DEBUG] 当前日期: ${today}, 上次展示日期: ${lastDisplayDate}, 存储的诗歌索引: ${storedPoemIndex}`);
    
    // 首先应用每日配色主题
    applyDailyTheme(today);
    
    // 检查是否需要更新诗歌
    if (lastDisplayDate === today && storedPoemIndex !== null) {
        console.log(`[DEBUG] 同一天，显示存储的诗歌 #${storedPoemIndex}`);
        displayPoem(parseInt(storedPoemIndex));
    } else {
        console.log(`[DEBUG] 新的一天或没有存储的诗歌，生成新索引`);
        // 生成基于日期的确定性随机索引
        const poemIndex = generateDailyIndex(today);
        console.log(`[DEBUG] 生成的新索引: ${poemIndex}`);
        
        // 存储今天的日期和诗歌索引
        localStorage.setItem('lastDisplayDate', today);
        localStorage.setItem('poemIndex', poemIndex);
        
        // 显示诗歌
        displayPoem(poemIndex);
    }
});

function generateDailyIndex(dateString) {
    console.log(`[DEBUG] 生成基于日期的索引: ${dateString}`);
    // 使用日期字符串作为随机种子
    let seed = 0;
    for (let i = 0; i < dateString.length; i++) {
        seed += dateString.charCodeAt(i);
    }
    
    // 使用确定性随机算法
    const pseudoRandom = (seed) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };
    
    const randomValue = pseudoRandom(seed);
    const poemIndex = Math.floor(randomValue * poems.length);
    
    console.log(`[DEBUG] 种子: ${seed}, 随机值: ${randomValue}, 最终索引: ${poemIndex}`);
    return poemIndex;
}

function displayPoem(index) {
    console.log(`[DEBUG] 显示诗歌 #${index}`);
    // 验证索引是否有效
    if (index < 0 || index >= poems.length || isNaN(index)) {
        console.error(`[ERROR] 无效的诗歌索引: ${index}`);
        displayError('无法加载诗歌数据。');
        return;
    }
    
    const poem = poems[index];
    console.log(`[DEBUG] 加载诗歌: ${poem.title}`);
    
    const titleElement = document.getElementById('poem-title');
    const contentElement = document.getElementById('poem-content');
    
    if (!titleElement || !contentElement) {
        console.error('[ERROR] 找不到诗歌容器元素');
        return;
    }
    
    titleElement.textContent = poem.title;
    contentElement.innerHTML = poem.content.replace(/\n/g, '<br>');
    
    // 设置滚动功能
    setupScrolling(contentElement);
    
    console.log('[DEBUG] 诗歌显示完成');
}

function setupScrolling(contentElement) {
    // 等待内容渲染完成后进行动态高度调整
    setTimeout(() => {
        adjustDynamicHeight(contentElement);
    }, 100);
}

function adjustDynamicHeight(contentElement) {
    // 临时移除高度限制来测量内容实际需要的高度
    const originalMaxHeight = contentElement.style.maxHeight;
    contentElement.style.maxHeight = 'none';
    contentElement.style.height = 'auto';
    
    // 测量内容的自然高度
    const naturalHeight = contentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    // 更积极的空间利用 - 减少预留空间，增加内容显示区域
    const maxAllowedHeight = viewportHeight - 200; // 减少预留空间从300px到200px
    
    console.log(`[DEBUG] 诗歌自然高度: ${naturalHeight}px, 视窗高度: ${viewportHeight}px, 最大允许高度: ${maxAllowedHeight}px`);
    
    // 优化的高度计算策略 - 更倾向于完整显示
    let optimalHeight;
    if (naturalHeight <= maxAllowedHeight * 0.7) {
        // 短诗和中短诗：完全使用自然高度
        optimalHeight = naturalHeight;
        console.log('[DEBUG] 短诗/中短诗 - 使用自然高度完整显示');
    } else if (naturalHeight <= maxAllowedHeight * 0.9) {
        // 中长诗歌：优先完整显示，使用更大比例的屏幕空间
        optimalHeight = Math.min(naturalHeight, maxAllowedHeight * 0.85);
        console.log('[DEBUG] 中长诗歌 - 使用85%屏幕高度，尽量完整显示');
    } else if (naturalHeight <= maxAllowedHeight) {
        // 接近屏幕高度的诗歌：完整显示
        optimalHeight = naturalHeight;
        console.log('[DEBUG] 接近屏幕高度诗歌 - 完整显示');
    } else {
        // 超长诗歌：使用最大可用空间
        optimalHeight = maxAllowedHeight;
        console.log('[DEBUG] 超长诗歌 - 使用最大可用空间');
    }
    
    // 确保最小高度
    optimalHeight = Math.max(optimalHeight, 200);
    
    // 应用计算出的最优高度
    contentElement.style.height = `${optimalHeight}px`;
    contentElement.style.maxHeight = `${optimalHeight}px`;
    
    // 检查是否仍需滚动
    const needsScroll = naturalHeight > optimalHeight;
    const scrollPercentage = needsScroll ? ((naturalHeight - optimalHeight) / naturalHeight * 100).toFixed(1) : 0;
    
    console.log(`[DEBUG] 设置高度: ${optimalHeight}px, 是否需要滚动: ${needsScroll}, 隐藏内容: ${scrollPercentage}%`);
    
    if (!needsScroll) {
        console.log('[DEBUG] ✅ 诗歌完整显示，无需滚动');
        // 隐藏滚动条因为不需要滚动
        contentElement.style.overflowY = 'hidden';
    } else {
        console.log(`[DEBUG] ⚠️ 诗歌需要滚动浏览，${scrollPercentage}%内容需要滚动查看`);
        contentElement.style.overflowY = 'auto';
    }
}

function displayError(message) {
    console.error(`[ERROR] ${message}`);
    const contentElement = document.getElementById('poem-content');
    if (contentElement) {
        contentElement.innerHTML = `<p class="error">${message}</p>`;
    }
}

// 内嵌诗歌数据
const poems = [
    {
        title: "面朝大海，春暖花开",
        content: "从明天起，做一个幸福的人\n喂马、劈柴，周游世界\n从明天起，关心粮食和蔬菜\n我有一所房子，面朝大海，春暖花开\n\n从明天起，和每一个亲人通信\n告诉他们我的幸福\n那幸福的闪电告诉我的\n我将告诉每一个人\n\n给每一条河每一座山取一个温暖的名字\n陌生人，我也为你祝福\n愿你有一个灿烂的前程\n愿你有情人终成眷属\n愿你在尘世获得幸福\n我也愿面朝大海，春暖花开"
    },
    {
        title: "亚洲铜",
        content: "亚洲铜，亚洲铜\n祖父死在这里，父亲死在这里，我也会死在这里\n你是唯一的一块埋人的地方\n\n亚洲铜，亚洲铜\n爱怀疑和爱飞翔的是鸟，淹没一切的是海水\n你的主人却是青草，住在自己小小的天宇里\n\n亚洲铜，亚洲铜\n看见了吗？那两只白鸽子，它是屈原遗落在沙滩上的白骨\n你的主人却是青草，住在自己小小的天宇里"
    },
    {
        title: "祖国（或以梦为马）",
        content: "我要做远方的忠诚的儿子\n和物质的短暂情人\n和所有以梦为马的诗人一样\n我不得不和烈士和小丑走在同一道路上\n\n万人都要将火熄灭 我一人独将此火高高举起\n此火为大 开花落英于神圣的祖国\n和所有以梦为马的诗人一样\n我籍此火得度一生的茫茫黑夜\n\n此火为大 祖国的语言和乱石投筑的梁山城寨\n以梦为马的敦煌——那七月也会寒冷的骨骼\n如白雪的柴和坚硬的条条白雪 横放在众神之山\n和所有以梦为马的诗人一样\n我投入此火 这三者是囚禁我的灯盏吐出光辉\n\n万人都要从我刀口走过 去建筑祖国的语言\n我甘愿一切从头开始\n和所有以梦为马的诗人一样\n我也愿将牢底坐穿\n\n众神创造物中只有我最易朽\n带着不可抗拒的死亡的速度\n只有粮食是我珍爱 我将她紧紧抱住\n抱住她在故乡生儿育女\n和所有以梦为马的诗人一样\n我也愿将自己埋葬在四周高高的山上\n守望平静的家园\n\n面对大河我无限惭愧\n我年华虚度 空有一身疲倦\n和所有以梦为马的诗人一样\n岁月易逝 一滴不剩 水滴中有一匹马儿一命归天\n\n千年后如若我再生于祖国的河岸\n千年后我再次拥有中国的稻田 和周天子的雪山 天马踢踏\n和所有以梦为马的诗人一样\n我选择永恒的事业\n\n我的事业 就是要成为太阳的一生\n他从古到今——'日'——他无比辉煌无比光明\n和所有以梦为马的诗人一样\n最后我被黄昏的众神抬入不朽的太阳\n太阳是我的名字\n太阳是我的一生\n太阳的山顶埋葬 诗歌的尸体——千年王国和我\n骑着五千年凤凰和名字叫'马'的龙——我必将失败\n但诗歌本身以太阳必将胜利"
    },
    {
        title: "春天，十个海子",
        content: "春天，十个海子全都复活\n在光明的景色中\n嘲笑这一个野蛮而悲伤的海子\n你这么长久地沉睡到底是为了什么？\n\n春天，十个海子低低地怒吼\n围着你和我跳舞、唱歌\n扯乱你的黑头发，骑上你飞奔而去，尘土飞扬\n你被劈开的疼痛在大地弥漫\n\n在春天，野蛮而复仇的海子\n就剩这一个，最后一个\n这是黑夜的儿子，沉浸于冬天，倾心死亡\n不能自拔，热爱着空虚而寒冷的乡村\n\n那里的谷物高高堆起，遮住了窗子\n它们一半用于一家六口人的嘴，吃和胃\n一半用于农业，他们自己繁殖\n大风从东吹到西，从北刮到南，无视黑夜和黎明\n你所说的曙光究竟是什么意思"
    },
    {
        title: "活在珍贵的人间",
        content: "活在这珍贵的人间\n太阳强烈，水波温柔\n一层层白云覆盖着\n我踩在青草上，感到自己是彻底干净的黑土块\n\n活在这珍贵的人间\n泥土高溅，扑打面颊\n活在这珍贵的人间\n人类和植物一样幸福\n爱情和雨水一样幸福"
    },
    {
        title: "夜色",
        content: "在夜色中\n我有三次受难：流浪、爱情、生存\n我有三种幸福：诗歌、王位、太阳\n\n他人的城里\n有三种星，是另外三种人\n抚摸自己的心\n一颗我写诗的心\n一颗我爱姑娘的心\n一颗我回家的心"
    },
    {
        title: "九月",
        content: "目击众神死亡的草原上野花一片\n远在远方的风比远方更远\n我的琴声呜咽泪水全无\n我把这远方的远归还草原\n\n一个叫木头，一个叫马尾\n我的琴声呜咽泪水全无\n远方只有在死亡中凝聚野花一片\n明月如镜高悬草原映照千年岁月\n\n我的琴声呜咽泪水全无\n只身打马过草原"
    },
    {
        title: "黑夜的献诗",
        content: "黑夜从大地上升起\n遮住了光明的天空\n丰收后荒凉的大地\n黑夜从你内部升起\n\n你从远方来，我到远方去\n遥远的路程经过这里\n天空一无所有\n为何给我安慰\n\n走在路上放声歌唱\n大风刮过山岗\n上面是无边的天空\n在天空下面我歌唱风和故乡"
    },
    {
        title: "麦地",
        content: "别人看见你\n觉得你温暖，美丽\n我则站在你痛苦质问的中心\n被你灼伤\n我站在太阳痛苦的芒上\n\n麦地\n神秘的质问者啊\n当我痛苦地站在你的面前\n你不能说我一无所有\n你不能说我两手空空"
    },
    {
        title: "村庄",
        content: "村庄在五谷丰盛的山谷里\n住着我心爱的姑娘\n她的窗户朝向昨夜的星空\n关着，一如我的眼睛\n\n村庄，这是我青年时代的房屋\n我做梦的麦田和哭泣的榆树\n我爱过的姑娘已嫁给别人\n成了别人怀中的月亮"
    },
    {
        title: "日记",
        content: "姐姐，今夜我在德令哈，夜色笼罩\n姐姐，我今夜只有戈壁\n\n草原尽头我两手空空\n悲痛时握不住一颗泪滴\n\n姐姐，今夜我在德令哈\n这是雨水中一座荒凉的城\n\n除了那些路过的和居住的\n德令哈...今夜\n这是唯一的，最后的，抒情\n这是唯一的，最后的，草原\n我把石头还给石头\n让胜利的胜利\n今夜青稞只属于他自己\n一切都在生长\n今夜我只有美丽的戈壁 空空\n姐姐，今夜我不关心人类，我只想你"
    },
    {
        title: "历史",
        content: "我的恋人\n是一条血红的河流\n她不停地流淌\n关于苍凉，关于死亡\n\n历史这条河流\n流进黄昏\n流过废墟和尸骨\n她摇摇晃晃\n\n在夜里，血红的河流\n流淌在少年的身体里\n历史，血红的河流\n给我生命"
    },
    {
        title: "明天醒来我会在哪一只鞋子里",
        content: "明天醒来我会在哪一只鞋子里\n我不知道\n我也不知道今夜的露水是否会打湿我的梦\n\n每一个睡去的人\n都被他的鞋子所抛弃\n走向黎明\n走向黎明的路上\n\n每一双鞋子都有着它的足印\n迈向明天\n迈向明天\n\n明天醒来我会在哪一只鞋子里"
    },
    {
        title: "幸福",
        content: "告诉你吧，世界\n我——不——相——信！\n纵使你脚下有一千名挑战者\n那就把我算作第一千零一名\n\n我不相信天是蓝的\n我不相信雷的回声\n我不相信梦是假的\n我不相信死无报应\n\n如果海洋注定要决堤\n就让所有的苦水都注入我心中\n如果陆地注定要上升\n就让人类重新选择生存的峰顶"
    },
    {
        title: "秋日黄昏",
        content: "火红的秋日黄昏\n在一个人的黄昏里\n听你我争辩\n辩论的是那些\n\n秋天，我想你\n想你在秋天里远游\n远方也许有你的脚印\n远方也许有你的方向\n\n秋日的黄昏\n说给我听\n这一切的事情"
    },
    {
        title: "桃花",
        content: "桃花朵朵开\n每一朵都不为我而开\n桃花朵朵谢\n每一朵都是为我而谢\n\n桃花美丽\n桃花美丽与我无关\n我有一座小房子\n面朝桃花\n\n桃花开桃花谢\n桃花开桃花谢的时候\n我还在这里"
    },
    {
        title: "车过黄河",
        content: "给你车过黄河的冲动和撞击\n给你理想的冲动和撞击\n黄河，黄河\n\n当火车经过黄河\n我看见了\n黄河，黄河\n\n给你一个黄河的情人\n给你一个黄河的诗人\n黄河，黄河\n\n让风吹去我的眼泪\n让风吹去我的忧伤"
    },
    {
        title: "思念前生",
        content: "我爱过的那个姑娘\n她今在何方\n我想她一定很美\n光着脚丫\n\n我想她一定很美\n像天上的云\n像地上的云影\n我想她一定很美\n\n曾经我们如此相爱\n现在我们各自流浪\n她在想我吗\n她还记得我吗\n\n我想她一定很美"
    },
    {
        title: "七月不远",
        content: "七月不远\n性不远\n爱情不远\n马鼻子下，清风\n一匹枣红马，它的眼睛\n\n哦不，它的眼睛不远\n七月不远\n枣红马不远\n\n当七月来临\n草原上，草原上\n那些美丽的骑手和马\n和我擦肩而过"
    },
    {
        title: "海水没顶",
        content: "海水没顶我头上的天空\n一半火焰一半海水\n你是我生命的全部秘密\n没有你我就不能呼吸\n\n海水没顶\n海水没顶\n淹没所有的言语和诗歌\n淹没所有的美丽和骄傲\n\n在海水中\n我看见自己\n在海水中\n我看见你"
    },
    {
        title: "八月之杯",
        content: "八月逝去 山峦清晰\n河水平滑起伏\n此刻才见天空\n天空高过往日\n\n有时我想过\n八月之杯中安坐真正的诗人\n仰视来去不定的云朵\n也许我一辈子也不会将你看清\n一只空杯子 装满了我破碎的诗行\n一只空杯子——可曾听见我的叫喊!\n一只空杯子内的父亲啊\n内心的鞭子将我们绑在一起抽打"
    },
    {
        title: "秋天深了",
        content: "秋天深了，神的家中鹰在集合\n神的故乡鹰在言语\n秋天深了，王在写诗\n在这个世界上秋天深了\n得到的尚未得到\n该丧失的早已丧失"
    },
    {
        title: "用我们横陈于地上的骸骨",
        content: "用我们横陈于地上的骸骨\n在沙滩上写下：青春。然后背起衰老的父亲\n时日漫长 方向中断\n动物般的恐惧充塞我们的诗歌\n\n谁的声音能抵达秋之子夜 长久喧响\n掩盖我们横陈于地上的骸骨——\n秋已来临\n没有丝毫的宽恕和温情：秋已来临"
    }
];

// 每日配色主题系统
const colorSchemes = [
    {
        name: '暖阳晨光',
        description: '温暖的晨光，田园诗意',
        colors: {
            primaryBg: '#faf8f3',
            textColor: '#3d3026',
            accentColor: '#d4a574',
            highlightColor: '#e8b86d',
            borderColor: '#e6ddd1'
        }
    },
    {
        name: '静谧蓝灰',
        description: '宁静的黄昏天空，深邃思考',
        colors: {
            primaryBg: '#f8f9fa',
            textColor: '#2c3e50',
            accentColor: '#7f8c8d',
            highlightColor: '#95a5a6',
            borderColor: '#ecf0f1'
        }
    },
    {
        name: '柔和粉调',
        description: '春天的花瓣，浪漫温柔',
        colors: {
            primaryBg: '#fdf9f7',
            textColor: '#4a3c3a',
            accentColor: '#c8a2a0',
            highlightColor: '#deb5b3',
            borderColor: '#f0e8e6'
        }
    },
    {
        name: '翠绿清韵',
        description: '新绿的嫩叶，自然清新',
        colors: {
            primaryBg: '#f8fdf8',
            textColor: '#2d4a2b',
            accentColor: '#7c9885',
            highlightColor: '#95b19a',
            borderColor: '#e8f5e8'
        }
    },
    {
        name: '古典墨韵',
        description: '传统墨色书法，古典美感',
        colors: {
            primaryBg: '#fefefd',
            textColor: '#2b2b2b',
            accentColor: '#666666',
            highlightColor: '#8a8a8a',
            borderColor: '#f0f0f0'
        }
    },
    {
        name: '暮色紫调',
        description: '黄昏的紫色天空，神秘诗意',
        colors: {
            primaryBg: '#faf9fc',
            textColor: '#3c2f4a',
            accentColor: '#8b7ca6',
            highlightColor: '#a395b7',
            borderColor: '#f0ebf5'
        }
    },
    {
        name: '秋日暖褐',
        description: '秋天的暖色调，成熟深邃',
        colors: {
            primaryBg: '#fdf8f5',
            textColor: '#3e2723',
            accentColor: '#a1785c',
            highlightColor: '#bc9077',
            borderColor: '#f3e8e0'
        }
    }
];

function applyDailyTheme(dateString) {
    // 计算基于日期的主题索引
    const themeIndex = calculateDailyThemeIndex(dateString);
    const selectedTheme = colorSchemes[themeIndex];
    
    console.log(`[DEBUG] 应用每日主题: ${selectedTheme.name} (索引: ${themeIndex})`);
    console.log(`[DEBUG] 主题描述: ${selectedTheme.description}`);
    
    // 应用CSS自定义属性
    const root = document.documentElement;
    root.style.setProperty('--paper', selectedTheme.colors.primaryBg);
    root.style.setProperty('--ink', selectedTheme.colors.textColor);
    root.style.setProperty('--accent', selectedTheme.colors.accentColor);
    root.style.setProperty('--highlight', selectedTheme.colors.highlightColor);
    
    // 更新背景点状图案颜色
    updateBackgroundPattern(selectedTheme.colors.borderColor);
    
    console.log(`[DEBUG] ✅ 主题 "${selectedTheme.name}" 应用成功`);
}

function calculateDailyThemeIndex(dateString) {
    // 计算从年初开始的天数
    const date = new Date(dateString);
    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
    
    // 使用7天周期轮换主题
    const themeIndex = dayOfYear % colorSchemes.length;
    
    console.log(`[DEBUG] 日期: ${dateString}, 年内第${dayOfYear}天, 主题索引: ${themeIndex}`);
    
    return themeIndex;
}

function updateBackgroundPattern(borderColor) {
    // 动态更新背景点状图案的颜色
    const body = document.body;
    body.style.backgroundImage = `radial-gradient(${borderColor} 1px, transparent 1px)`;
}