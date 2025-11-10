// ========== TELEGRAM WEBAPP ИНТЕГРАЦИЯ ==========
let tg = window.Telegram?.WebApp || {
    expand: function() { console.log('Expand not available'); },
    ready: function() { console.log('Ready not available'); },
    close: function() { console.log('Close not available'); },
    BackButton: {
        show: function() { return this; },
        hide: function() { return this; },
        onClick: function() { return this; }
    },
    MainButton: {
        setText: function() { return this; },
        show: function() { return this; },
        hide: function() { return this; },
        onClick: function() { return this; }
    },
    themeParams: {
        bg_color: '#1a1a2e',
        text_color: '#ffffff',
        hint_color: '#aaaaaa',
        button_color: '#667eea',
        button_text_color: '#ffffff'
    },
    initDataUnsafe: {},
    viewportHeight: window.innerHeight,
    viewportStableHeight: window.innerHeight,
    isExpanded: false
};

// ========== ИНИЦИАЛИЗАЦИЯ TELEGRAM ==========
console.log('🚀 Инициализация Telegram WebApp...');

// Expand на весь экран (КРИТИЧНО!)
try {
    if (tg.expand) {
        tg.expand();
        console.log('✅ Экран расширен');
    }
    if (tg.ready) {
        tg.ready();
        console.log('✅ WebApp готов');
    }
} catch (e) {
    console.warn('⚠️ Ошибка expand/ready:', e);
}

// Кнопка "Назад" (НЕ ЛОМАЕТ БОТ - только в WebApp!)
try {
    if (tg.BackButton && tg.BackButton.show) {
        tg.BackButton.onClick(() => {
            console.log('👈 Закрытие WebApp...');
            if (tg.close) tg.close();
        });
        tg.BackButton.show();
        console.log('✅ Кнопка "Назад" активна');
    }
} catch (e) {
    console.warn('⚠️ Кнопка "Назад" недоступна:', e);
}

// Получаем данные пользователя
const user = tg.initDataUnsafe?.user || {};
const userId = user.id || 'demo';
const userName = user.first_name || 'Гость';

console.log('👤 Пользователь:', userName, '(ID:', userId, ')');

let dreamData = null;

// ========== ПРИМЕНЕНИЕ ТЕМЫ TELEGRAM ==========
function applyTelegramTheme() {
    console.log('🎨 Применяю тему Telegram...');
    try {
        if (tg.themeParams) {
            const root = document.documentElement;
            const body = document.body;
            
            // Устанавливаем CSS переменные
            root.style.setProperty('--tg-bg-color', tg.themeParams.bg_color || '#1a1a2e');
            root.style.setProperty('--tg-text-color', tg.themeParams.text_color || '#ffffff');
            root.style.setProperty('--tg-hint-color', tg.themeParams.hint_color || '#aaaaaa');
            root.style.setProperty('--tg-button-color', tg.themeParams.button_color || '#667eea');
            
            // Применяем фон
            body.style.backgroundColor = tg.themeParams.bg_color || '#1a1a2e';
            body.style.color = tg.themeParams.text_color || '#ffffff';
            
            console.log('✅ Тема применена:', tg.themeParams.bg_color);
        }
    } catch (e) {
        console.warn('⚠️ Ошибка применения темы:', e);
    }
}

// Загрузка при старте
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Приложение загружается...');
    
    // Применяем тему Telegram
    applyTelegramTheme();
    
    try {
        await loadDreamData();
        console.log('✅ Данные загружены:', dreamData);
        
        hideLoader();
        renderAllVisualizations();
        
        console.log('✅ Визуализации готовы!');
    } catch (error) {
        console.error('❌ Ошибка загрузки:', error);
        showError('Не удалось загрузить данные сна');
    }
});

// Загрузка данных
async function loadDreamData() {
    // НОВОЕ: Читаем данные из Telegram WebApp
    const urlParams = new URLSearchParams(window.location.search);
    const dreamDataEncoded = urlParams.get('data');
    
    if (dreamDataEncoded) {
        try {
            console.log('📦 Получены данные от бота, декодирую...');
            console.log('📦 Длина base64:', dreamDataEncoded.length);
            
            // ========== ПРАВИЛЬНОЕ ДЕКОДИРОВАНИЕ UTF-8 ==========
            
            // Шаг 1: Декодируем URL-safe base64
            // Заменяем - на + и _ на / (URL-safe base64)
            let base64 = dreamDataEncoded.replace(/-/g, '+').replace(/_/g, '/');
            
            // Добавляем padding если нужно
            while (base64.length % 4) {
                base64 += '=';
            }
            
            // Шаг 2: Декодируем base64 в бинарные данные
            const binaryString = atob(base64);
            console.log('✅ Base64 декодирован, длина:', binaryString.length);
            
            // Шаг 3: Преобразуем в массив байтов
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            // Шаг 4: Декодируем UTF-8 правильно!
            const utf8Decoder = new TextDecoder('utf-8');
            const jsonString = utf8Decoder.decode(bytes);
            
            console.log('✅ UTF-8 декодирован!');
            console.log('📝 Первые 200 символов:', jsonString.substring(0, 200));
            
            // Шаг 5: Парсим JSON
            dreamData = JSON.parse(jsonString);
            
            console.log('📥 Загружены данные из Telegram!');
            console.log('📊 Символов:', dreamData.symbols?.length || 0);
            console.log('💫 Эмоций:', dreamData.emotions?.length || 0);
            console.log('🎴 Архетипов:', dreamData.archetypes?.length || 0);
            
            return;
        } catch (e) {
            console.error('❌ Ошибка декодирования данных:', e);
            console.error('❌ Stack:', e.stack);
            console.warn('⚠️ Переключаюсь на тестовые данные');
        }
    }
    
    // Если не получилось - используем тестовые данные
    console.log('📝 Используем тестовые данные');
    dreamData = getTestDreamData();
}

// Тестовые данные
function getTestDreamData() {
    return {
        id: 'test_001',
        text: 'Я летел над океаном и встретил незнакомца...',
        symbols: [
            { name: 'Океан', meaning: 'Подсознание, эмоции', connections: ['Полёт', 'Свобода'] },
            { name: 'Полёт', meaning: 'Освобождение, стремление', connections: ['Океан', 'Незнакомец'] },
            { name: 'Незнакомец', meaning: 'Тень, неизвестное Я', connections: ['Полёт'] },
            { name: 'Свобода', meaning: 'Желание изменений', connections: ['Океан', 'Полёт'] }
        ],
        emotions: [
            { time: 'Начало', emotion: 'Свобода', intensity: 8 },
            { time: 'Развитие', emotion: 'Тревога', intensity: 5 },
            { time: 'Кульминация', emotion: 'Любопытство', intensity: 7 },
            { time: 'Завершение', emotion: 'Умиротворение', intensity: 6 }
        ],
        archetypes: [
            { name: 'Искатель', icon: '🧭', description: 'Поиск новых горизонтов', manifestation: 'Полёт над океаном символизирует поиск свободы' },
            { name: 'Тень', icon: '🎭', description: 'Скрытые аспекты личности', manifestation: 'Незнакомец представляет неизведанные части вашего Я' },
            { name: 'Мудрец', icon: '📚', description: 'Внутреннее знание', manifestation: 'Океан как источник древней мудрости' }
        ],
        insights: [
            { icon: '🎯', title: 'Поиск свободы', text: 'Сон указывает на стремление к освобождению от текущих ограничений' },
            { icon: '💫', title: 'Встреча с Тенью', text: 'Незнакомец символизирует неинтегрированные аспекты личности' },
            { icon: '🌊', title: 'Эмоциональная глубина', text: 'Океан отражает богатство вашего внутреннего мира' },
            { icon: '✨', title: 'Трансформация', text: 'Полёт означает готовность к переменам и росту' }
        ],
        metrics: {
            emotionalBalance: 7.5,
            intensity: 6.5,
            lucidity: 8,
            symbolDensity: 4
        }
    };
}

// Скрыть loader
function hideLoader() {
    console.log('🌙 Скрываем loader...');
    const loader = document.getElementById('loader');
    const app = document.getElementById('app');
    
    // Персонализируем заголовок
    const header = document.querySelector('.header h1');
    if (header && userName !== 'Гость') {
        header.textContent = `🌙 ${userName}, твой сон`;
    }
    
    setTimeout(() => {
        loader.style.transition = 'opacity 0.5s';
        loader.style.opacity = '0';
        
        setTimeout(() => {
            loader.style.display = 'none';
            app.style.display = 'block';
        }, 500);
    }, 500);
}

// Показать ошибку
function showError(message) {
    const loader = document.getElementById('loader');
    loader.innerHTML = `
        <div class="loader-content">
            <div style="font-size: 80px;">❌</div>
            <div class="loader-text" style="color: #ec4899;">${message}</div>
        </div>
    `;
}

// Рендерим все визуализации
function renderAllVisualizations() {
    renderMindMap();
    renderEmotionChart();
    renderArchetypeWheel();
    renderSymbolNetwork();
    renderInsights();
    renderMetrics();
    setupModal();
}

// 1. MIND MAP
function renderMindMap() {
    console.log('🧠 Рисую Mind Map...');
    console.log('📊 dreamData:', dreamData);
    console.log('📊 symbols:', dreamData?.symbols);
    
    // Проверка данных
    if (!dreamData || !dreamData.symbols || dreamData.symbols.length === 0) {
        console.error('❌ Mind Map: нет данных symbols!');
        const container = d3.select('#mindmap');
        container.html('<div style="padding: 40px; text-align: center; color: #a0a8cc;">⚠️ Нет данных для карты символов</div>');
        return;
    }
    
    const container = d3.select('#mindmap');
    const width = container.node().getBoundingClientRect().width;
    const height = 400;
    
    container.selectAll('*').remove();
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    const root = {
        name: 'СОН',
        children: dreamData.symbols.map(s => ({
            name: s.name,
            meaning: s.meaning
        }))
    };
    
    console.log('✅ Mind Map: ' + dreamData.symbols.length + ' символов');
    
    const treeLayout = d3.tree().size([width - 100, height - 100]);
    const hierarchy = d3.hierarchy(root);
    treeLayout(hierarchy);
    
    svg.selectAll('.link')
        .data(hierarchy.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkVertical()
            .x(d => d.x + 50)
            .y(d => d.y + 50));
    
    const nodes = svg.selectAll('.node')
        .data(hierarchy.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x + 50}, ${d.y + 50})`)
        .on('click', (event, d) => showSymbolDetails(d.data));
    
    nodes.append('circle')
        .attr('r', d => d.depth === 0 ? 30 : 20)
        .attr('fill', d => d.depth === 0 ? '#7c3aed' : '#3b82f6');
    
    nodes.append('text')
        .attr('dy', d => d.depth === 0 ? 40 : 30)
        .text(d => d.data.name);
    
    nodes.style('opacity', 0)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .style('opacity', 1);
}

function showSymbolDetails(symbol) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2 style="margin-bottom: 20px; color: #7c3aed;">${symbol.name}</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #a0a8cc;">
            ${symbol.meaning || 'Центральный символ сна'}
        </p>
    `;
    
    modal.style.display = 'block';
}

// 2. EMOTION CHART  
function renderEmotionChart() {
    const ctx = document.getElementById('emotionChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dreamData.emotions.map(e => e.time),
            datasets: [{
                label: 'Интенсивность эмоций',
                data: dreamData.emotions.map(e => e.intensity),
                borderColor: '#ec4899',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 10,
                pointBackgroundColor: '#ec4899'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const emotion = dreamData.emotions[context.dataIndex];
                            return `${emotion.emotion}: ${emotion.intensity}/10`;
                        }
                    },
                    backgroundColor: 'rgba(26, 33, 67, 0.95)',
                    titleColor: '#e0e6ff',
                    bodyColor: '#a0a8cc',
                    borderColor: '#7c3aed',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: { color: '#a0a8cc' },
                    grid: { color: 'rgba(45, 53, 97, 0.3)' }
                },
                x: {
                    ticks: { color: '#a0a8cc' },
                    grid: { color: 'rgba(45, 53, 97, 0.3)' }
                }
            }
        }
    });
}

// 3. ARCHETYPE WHEEL
function renderArchetypeWheel() {
    const container = document.getElementById('archetypeWheel');
    container.innerHTML = '';
    
    dreamData.archetypes.forEach((archetype, index) => {
        const card = document.createElement('div');
        card.className = 'archetype-card';
        card.innerHTML = `
            <div class="archetype-icon">${archetype.icon}</div>
            <div class="archetype-name">${archetype.name}</div>
            <div class="archetype-desc">${archetype.description}</div>
        `;
        
        card.addEventListener('click', () => showArchetypeDetails(archetype));
        
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        card.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, index * 150);
        
        container.appendChild(card);
    });
}

function showArchetypeDetails(archetype) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 80px; margin-bottom: 20px;">${archetype.icon}</div>
            <h2 style="margin-bottom: 15px; color: #7c3aed;">${archetype.name}</h2>
            <p style="font-size: 16px; margin-bottom: 20px; color: #a0a8cc;">${archetype.description}</p>
            <div style="background: rgba(124, 58, 237, 0.1); padding: 20px; border-radius: 12px; border-left: 4px solid #7c3aed;">
                <h3 style="margin-bottom: 10px; color: #fbbf24;">Проявление в твоём сне:</h3>
                <p style="color: #e0e6ff;">${archetype.manifestation}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// 4. SYMBOL NETWORK
function renderSymbolNetwork() {
    console.log('🌐 Рисую Symbol Network...');
    console.log('📊 dreamData:', dreamData);
    console.log('📊 symbols:', dreamData?.symbols);
    
    // Проверка данных
    if (!dreamData || !dreamData.symbols || dreamData.symbols.length === 0) {
        console.error('❌ Symbol Network: нет данных symbols!');
        const container = d3.select('#symbolNetwork');
        container.html('<div style="padding: 40px; text-align: center; color: #a0a8cc;">⚠️ Нет данных для сети связей</div>');
        return;
    }
    
    const container = d3.select('#symbolNetwork');
    const width = container.node().getBoundingClientRect().width;
    const height = 400;
    
    container.selectAll('*').remove();
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    const nodes = dreamData.symbols.map((s, i) => ({ id: s.name, group: i }));
    
    const links = [];
    dreamData.symbols.forEach(symbol => {
        if (symbol.connections) {
            symbol.connections.forEach(conn => {
                links.push({ source: symbol.name, target: conn });
            });
        }
    });
    
    console.log('✅ Symbol Network: ' + nodes.length + ' узлов, ' + links.length + ' связей');
    
    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2));
    
    const link = svg.append('g').selectAll('line').data(links).enter()
        .append('line').attr('class', 'symbol-link');
    
    const node = svg.append('g').selectAll('g').data(nodes).enter()
        .append('g').attr('class', 'symbol-node')
        .call(d3.drag()
            .on('start', (e, d) => {
                if (!e.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x; d.fy = d.y;
            })
            .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
            .on('end', (e, d) => {
                if (!e.active) simulation.alphaTarget(0);
                d.fx = null; d.fy = null;
            }));
    
    node.append('circle').attr('r', 12).attr('fill', (d, i) => d3.schemeCategory10[i % 10]);
    node.append('text').attr('dx', 15).attr('dy', 5).text(d => d.id)
        .style('fill', '#e0e6ff').style('font-size', '12px');
    
    simulation.on('tick', () => {
        link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
        node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
}

// 5. INSIGHTS PANEL
function renderInsights() {
    const container = document.getElementById('insightsPanel');
    container.innerHTML = '';
    
    dreamData.insights.forEach((insight, index) => {
        const card = document.createElement('div');
        card.className = 'insight-card';
        card.innerHTML = `
            <div class="insight-icon">${insight.icon}</div>
            <div class="insight-title">${insight.title}</div>
            <div class="insight-text">${insight.text}</div>
        `;
        
        card.style.opacity = '0';
        card.style.transform = 'translateX(-20px)';
        card.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
        }, index * 100);
        
        container.appendChild(card);
    });
}

// 6. METRICS PANEL
function renderMetrics() {
    const container = document.getElementById('metricsPanel');
    container.innerHTML = '';
    
    const metrics = [
        { label: 'Эмоциональный баланс', value: dreamData.metrics.emotionalBalance },
        { label: 'Интенсивность', value: dreamData.metrics.intensity },
        { label: 'Осознанность', value: dreamData.metrics.lucidity },
        { label: 'Плотность символов', value: dreamData.metrics.symbolDensity }
    ];
    
    metrics.forEach(metric => {
        const card = document.createElement('div');
        card.className = 'metric-card';
        card.innerHTML = `
            <div class="metric-value">${metric.value}</div>
            <div class="metric-label">${metric.label}</div>
        `;
        container.appendChild(card);
    });
}

// Modal setup
function setupModal() {
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('modal');
        const modalClose = document.querySelector('.modal-close');
        
        if (e.target === modal || e.target === modalClose) {
            modal.style.display = 'none';
        }
    });
}

// Telegram кнопка
if (tg.MainButton) {
    tg.MainButton.setText('Закрыть').show().onClick(() => tg.close());
}

console.log('✅ app.js загружен полностью!');
