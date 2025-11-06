// Получение параметров из URL
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        data: params.get('data')
    };
}

// Декодирование данных из Base64
function decodeData(encodedData) {
    try {
        const jsonString = atob(encodedData);
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Ошибка декодирования данных:', error);
        return null;
    }
}

// Демо данные для тестирования
const DEMO_DATA = {
    id: "demo_dream_12345",
    user_id: 123456,
    timestamp: "20250105_143000",
    dream_text: "Я летел над городом на закате...",
    interpretation: "Полная трактовка сна...",
    symbols: [
        {
            name: "Полёт",
            meaning: "Символизирует свободу, освобождение от ограничений и стремление к высшим целям",
            connections: ["Небо", "Город"]
        },
        {
            name: "Закат",
            meaning: "Переходный период, завершение одного этапа и начало нового",
            connections: ["Полёт", "Город"]
        },
        {
            name: "Город",
            meaning: "Представляет структуру жизни, социальные связи и организованность",
            connections: ["Полёт", "Закат"]
        },
        {
            name: "Небо",
            meaning: "Духовность, бесконечные возможности и высшие стремления",
            connections: ["Полёт"]
        }
    ],
    emotions: [
        {
            time: "Начало сна",
            emotion: "Восторг",
            intensity: 9
        },
        {
            time: "В полёте",
            emotion: "Свобода",
            intensity: 10
        },
        {
            time: "Над городом",
            emotion: "Спокойствие",
            intensity: 7
        },
        {
            time: "На закате",
            emotion: "Умиротворение",
            intensity: 8
        }
    ],
    archetypes: [
        {
            name: "Искатель",
            icon: "🧭",
            description: "Стремление к новым горизонтам и познанию неизведанного",
            manifestation: "Проявился через образ полёта - желание вырваться за пределы привычного и исследовать новые возможности"
        },
        {
            name: "Мудрец",
            icon: "🔮",
            description: "Поиск истины и понимания глубинных смыслов",
            manifestation: "Закат символизирует мудрость перехода, понимание цикличности жизни"
        },
        {
            name: "Свободный дух",
            icon: "🕊️",
            description: "Независимость, освобождение от условностей",
            manifestation: "Способность подняться над городом отражает внутреннюю свободу и независимость от социальных рамок"
        }
    ],
    insights: [
        {
            icon: "💡",
            title: "Стремление к трансформации",
            text: "Полёт в сновидении указывает на готовность к личностной трансформации. Вы находитесь на пороге важных изменений в жизни."
        },
        {
            icon: "🌟",
            title: "Освобождение от ограничений",
            text: "Способность летать символизирует преодоление внутренних барьеров. Подсознание сигнализирует о готовности выйти за рамки привычного."
        },
        {
            icon: "🎯",
            title: "Поиск высшей цели",
            text: "Взгляд на город с высоты отражает потребность увидеть жизнь в более широкой перспективе и найти своё истинное предназначение."
        },
        {
            icon: "⚡",
            title: "Переходный период",
            text: "Закат в сновидении символизирует завершение одного жизненного этапа. Это естественный и необходимый процесс перед новым началом."
        }
    ],
    metrics: {
        emotionalBalance: 8,
        intensity: 9,
        lucidity: 7,
        symbolDensity: 8
    }
};

// Загрузка данных
async function loadDreamData(dreamId, encodedData) {
    try {
        // Если есть данные в URL - используем их!
        if (encodedData) {
            console.log('Загружаю данные из URL');
            const data = decodeData(encodedData);
            if (data) {
                console.log('Данные успешно декодированы:', data);
                return data;
            }
        }
        
        // Если нет данных в URL или это демо - используем демо данные
        if (!dreamId || dreamId === 'demo') {
            console.log('Используем демо данные');
            return DEMO_DATA;
        }

        // Пока возвращаем демо данные
        console.log('Используем демо данные (данные в URL не найдены)');
        return DEMO_DATA;
        
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        throw error;
    }
}

// Отображение метрик
function displayMetrics(metrics) {
    document.getElementById('emotionalBalance').textContent = metrics.emotionalBalance + '/10';
    document.getElementById('intensity').textContent = metrics.intensity + '/10';
    document.getElementById('lucidity').textContent = metrics.lucidity + '/10';
    document.getElementById('symbolDensity').textContent = metrics.symbolDensity + '/10';
    
    // Анимация заполнения
    setTimeout(() => {
        document.getElementById('emotionalBalanceFill').style.width = (metrics.emotionalBalance * 10) + '%';
        document.getElementById('intensityFill').style.width = (metrics.intensity * 10) + '%';
        document.getElementById('lucidityFill').style.width = (metrics.lucidity * 10) + '%';
        document.getElementById('symbolDensityFill').style.width = (metrics.symbolDensity * 10) + '%';
    }, 300);
}

// Отображение символов
function displaySymbols(symbols) {
    const grid = document.getElementById('symbolsGrid');
    grid.innerHTML = '';
    
    symbols.forEach(symbol => {
        const card = document.createElement('div');
        card.className = 'symbol-card';
        
        const connectionsHTML = symbol.connections && symbol.connections.length > 0
            ? `<div class="symbol-connections">
                ${symbol.connections.map(conn => `<span class="connection-tag">${conn}</span>`).join('')}
               </div>`
            : '';
        
        card.innerHTML = `
            <div class="symbol-name">${symbol.name}</div>
            <div class="symbol-meaning">${symbol.meaning}</div>
            ${connectionsHTML}
        `;
        
        grid.appendChild(card);
    });
}

// Отображение эмоций
function displayEmotions(emotions) {
    const timeline = document.getElementById('emotionsTimeline');
    timeline.innerHTML = '';
    
    emotions.forEach(emotion => {
        const item = document.createElement('div');
        item.className = 'emotion-item';
        
        item.innerHTML = `
            <div class="emotion-header">
                <span class="emotion-time">${emotion.time}</span>
                <span class="emotion-name">${emotion.emotion}</span>
            </div>
            <div class="emotion-intensity">
                <div class="intensity-bar">
                    <div class="intensity-fill" style="width: ${emotion.intensity * 10}%"></div>
                </div>
                <span class="intensity-value">${emotion.intensity}/10</span>
            </div>
        `;
        
        timeline.appendChild(item);
    });
}

// Отображение архетипов
function displayArchetypes(archetypes) {
    const grid = document.getElementById('archetypesGrid');
    grid.innerHTML = '';
    
    archetypes.forEach(archetype => {
        const card = document.createElement('div');
        card.className = 'archetype-card';
        
        card.innerHTML = `
            <div class="archetype-header">
                <div class="archetype-icon">${archetype.icon}</div>
                <div class="archetype-name">${archetype.name}</div>
            </div>
            <div class="archetype-description">${archetype.description}</div>
            <div class="archetype-manifestation">
                <strong>Проявление:</strong> ${archetype.manifestation}
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Отображение инсайтов
function displayInsights(insights) {
    const list = document.getElementById('insightsList');
    list.innerHTML = '';
    
    insights.forEach(insight => {
        const card = document.createElement('div');
        card.className = 'insight-card';
        
        card.innerHTML = `
            <div class="insight-header">
                <div class="insight-icon">${insight.icon}</div>
                <div class="insight-title">${insight.title}</div>
            </div>
            <div class="insight-text">${insight.text}</div>
        `;
        
        list.appendChild(card);
    });
}

// Переключение вкладок
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const panes = document.querySelectorAll('.tab-pane');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Убираем active у всех
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.add('hidden'));
            
            // Добавляем active к выбранной
            tab.classList.add('active');
            const targetTab = tab.getAttribute('data-tab');
            document.getElementById(`${targetTab}-tab`).classList.remove('hidden');
        });
    });
}

// Показ ошибки
function showError(message) {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('content').classList.add('hidden');
    document.getElementById('error').classList.remove('hidden');
    document.getElementById('errorMessage').textContent = message;
}

// Показ контента
function showContent() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('error').classList.add('hidden');
    document.getElementById('content').classList.remove('hidden');
}

// Инициализация
async function init() {
    try {
        // Получаем параметры
        const params = getURLParams();
        
        console.log('Dream ID:', params.id);
        console.log('Encoded Data:', params.data ? 'Есть данные' : 'Нет данных');
        
        // Загружаем данные (из URL или демо)
        const data = await loadDreamData(params.id, params.data);
        
        console.log('Данные загружены:', data);
        
        // Отображаем данные
        displayMetrics(data.metrics);
        displaySymbols(data.symbols);
        displayEmotions(data.emotions);
        displayArchetypes(data.archetypes);
        displayInsights(data.insights);
        
        // Настраиваем вкладки
        setupTabs();
        
        // Показываем контент
        showContent();
        
    } catch (error) {
        console.error('Ошибка инициализации:', error);
        showError('Не удалось загрузить данные сна. Попробуйте позже.');
    }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', init);
