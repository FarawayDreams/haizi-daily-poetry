// 海子诗歌每日展示系统
document.addEventListener('DOMContentLoaded', function() {
    console.log('[DEBUG] DOM fully loaded and parsed');
    
    // 检查浏览器是否支持localStorage
    if (typeof(Storage) === 'undefined') {
        console.error('[ERROR] 您的浏览器不支持本地存储');
        displayError('您的浏览器不支持本地存储，无法使用每日更新功能。');
        return;
    }

    // 获取当前日期（YYYY-MM-DD格式）
    const today = new Date().toISOString().split('T')[0];
    const lastDisplayDate = localStorage.getItem('lastDisplayDate');
    const storedPoemIndex = localStorage.getItem('poemIndex');
    
    console.log(`[DEBUG] 当前日期: ${today}, 上次展示日期: ${lastDisplayDate}, 存储的诗歌索引: ${storedPoemIndex}`);
    
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
    console.log('[DEBUG] 诗歌显示完成');
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
    // ...（保持原有诗歌数据不变）...
];