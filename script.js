// 海子诗歌每日展示系统
document.addEventListener('DOMContentLoaded', function() {
    // 检查浏览器是否支持localStorage
    if (typeof(Storage) === 'undefined') {
        displayError('您的浏览器不支持本地存储，无法使用每日更新功能。');
        return;
    }

    // 获取当前日期（YYYY-MM-DD格式）
    const today = new Date().toISOString().split('T')[0];
    const lastDisplayDate = localStorage.getItem('lastDisplayDate');
    const storedPoemIndex = localStorage.getItem('poemIndex');
    
    // 检查是否需要更新诗歌
    if (lastDisplayDate === today && storedPoemIndex !== null) {
        // 如果是同一天，显示存储的诗歌
        displayPoem(parseInt(storedPoemIndex));
    } else {
        // 新的一天，获取随机诗歌
        fetchPoems()
            .then(poems => {
                const poemIndex = getDailyPoemIndex(poems.length, today);
                localStorage.setItem('lastDisplayDate', today);
                localStorage.setItem('poemIndex', poemIndex);
                displayPoem(poemIndex);
            })
            .catch(error => {
                displayError('加载诗歌数据失败: ' + error.message);
            });
    }
});

// 获取诗歌数据
function fetchPoems() {
    return fetch('poems.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('网络请求失败: ' + response.statusText);
            }
            return response.json();
        });
}

// 基于日期的确定性随机索引生成
function getDailyPoemIndex(totalPoems, dateString) {
    // 将日期字符串转换为种子值
    let seed = 0;
    for (let i = 0; i < dateString.length; i++) {
        seed = (seed << 5) - seed + dateString.charCodeAt(i);
        seed = seed & seed; // 转换为32位整数
    }
    
    // 使用种子生成确定性的随机索引
    return Math.abs(seed) % totalPoems;
}

// 显示诗歌
function displayPoem(index) {
    fetchPoems()
        .then(poems => {
            if (index >= 0 && index < poems.length) {
                document.getElementById('poem-title').textContent = poems[index].title;
                document.getElementById('poem-content').textContent = poems[index].content;
            } else {
                displayError('诗歌索引无效');
            }
        })
        .catch(error => {
            displayError('加载诗歌数据失败: ' + error.message);
        });
}

// 错误处理
function displayError(message) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="error">
            <h2>发生错误</h2>
            <p>${message}</p>
            <p>请刷新页面重试</p>
        </div>
    `;
    
    // 添加错误样式
    const style = document.createElement('style');
    style.textContent = `
        .error {
            text-align: center;
            padding: 30px;
            color: #8c2e0b;
        }
        .error h2 {
            margin-bottom: 15px;
        }
    `;
    document.head.appendChild(style);
}