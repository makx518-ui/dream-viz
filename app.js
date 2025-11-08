// Telegram WebApp или заглушка для локального теста
let tg = window.Telegram?.WebApp || {
    expand: function() {},
    MainButton: {
        setText: function() { return this; },
        show: function() { return this; },
        onClick: function() { return this; }
    }
};

if (tg.expand) tg.expand();

let dreamData = null;

// Загрузка при старте
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Приложение загружается...');
    
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
    const urlParams = new URLSearchParams(window.location.search);
    const dreamId = urlParams.get('id');
    
    if (dreamId) {
        try {
            const response = await fetch(`https://YOUR-GITHUB-USERNAME.github.io/dream-viz/data/${dreamId}.json`);
            dreamData = await response.json();
            console.log('📥 Загружены данные сна:', dreamId);
        } catch (e) {
            console.warn('⚠️ Не удалось загрузить данные, используем тестовые');
            dreamData = getTestDreamData();
        }
    } else {
        console.log('📝 Используем тестовые данные');
        dreamData = getTestDreamData();
    }
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
    
    setTimeout(() => {
        loader.style.transition = 'opacity 0.5s';
        loader.style.opacity = '0';
        
        setTimeout(() => {
            loader.style.display = 'none';
            app.style.display = 'block';
            console.log('✅ Loader скрыт, контент показан');
        }, 500);
    }, 1000);
}

// Показать ошибку
function showError(message) {
    console.error('💥 Показываем ошибку:', message);
    const loader = document.getElementById('loader');
    loader.innerHTML = `
        <div class="loader-content">
            <div style="font-size: 80px;">😔</div>
            <div style="margin-top: 20px; font-size: 18px;">${message}</div>
        </div>
    `;
}

// Рендер всех визуализаций
function renderAllVisualizations() {
    console.log('🎨 Рендерим визуализации...');
    
    try {
        renderMindMap();
        console.log('✅ Mind Map готов');
    } catch (e) {
        console.error('❌ Ошибка Mind Map:', e);
    }
    
    try {
        renderEmotionJourney();
        console.log('✅ Emotion Journey готов');
    } catch (e) {
        console.error('❌ Ошибка Emotion Journey:', e);
    }
    
    try {
        renderArchetypeWheel();
        console.log('✅ Archetype Wheel готов');
    } catch (e) {
        console.error('❌ Ошибка Archetype Wheel:', e);
    }
    
    try {
        renderSymbolNetwork();
        console.log('✅ Symbol Network готов');
    } catch (e) {
        console.error('❌ Ошибка Symbol Network:', e);
    }
    
    try {
        renderInsightsPanel();
        console.log('✅ Insights Panel готов');
    } catch (e) {
        console.error('❌ Ошибка Insights Panel:', e);
    }
    
    try {
        renderMetricsPanel();
        console.log('✅ Metrics Panel готов');
    } catch (e) {
        console.error('❌ Ошибка Metrics Panel:', e);
    }
}

// 1. MIND MAP
function renderMindMap() {
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

// 2. EMOTION JOURNEY
function renderEmotionJourney() {
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
function renderInsightsPanel() {
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
function renderMetricsPanel() {
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

// Закрытие модального окна
document.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    const modalClose = document.querySelector('.modal-close');
    
    if (e.target === modal || e.target === modalClose) {
        modal.style.display = 'none';
    }
});

// Telegram кнопка
if (tg.MainButton) {
    tg.MainButton.setText('Закрыть').show().onClick(() => tg.close());
}

console.log('✅ app.js загружен полностью!');
