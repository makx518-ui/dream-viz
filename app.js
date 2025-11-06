// Функция для получения параметра из URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Функция для обновления элемента на странице
function updateElementContent(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = content;
    } else {
        console.warn(`Элемент с id '${elementId}' не найден.`);
    }
}

// Основная логика при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM загружен, читаю параметры из URL...");

    // Получаем параметры из URL
    const dreamText = getUrlParameter('dream_text');
    const interpretation = getUrlParameter('interpretation');
    const dreamDataStr = getUrlParameter('dream_data');

    let dreamData = null;
    if (dreamDataStr) {
        try {
            // Декодируем JSON-строку в объект
            dreamData = JSON.parse(decodeURIComponent(dreamDataStr));
            console.log("Полученные структурированные данные:", dreamData);
        } catch (e) {
            console.error("Ошибка декодирования dream_data:", e);
        }
    }

    // Обновляем метрики, если они есть в dreamData.metrics
    if (dreamData && dreamData.metrics) {
        updateElementContent('emotionalBalanceValue', dreamData.metrics.emotionalBalance || '-');
        updateElementContent('intensityValue', dreamData.metrics.intensity || '-');
        updateElementContent('lucidityValue', dreamData.metrics.lucidity || '-');
        updateElementContent('symbolDensityValue', dreamData.metrics.symbolDensity || '-');
    } else {
        console.warn("Структурированные данные (dream_data) не получены или не декодированы. Используется пустые значения.");
    }

    // Обновляем текст сна и трактовку, если они есть
    if (dreamText) {
        updateElementContent('dreamTextDisplay', dreamText);
    }
    if (interpretation) {
        updateElementContent('interpretationDisplay', interpretation);
    }

    // Если данных нет, можно оставить старое поведение или показать сообщение
    if (!dreamData && !dreamText && !interpretation) {
        console.log("Данные не переданы. Показываем пустую визуализацию.");
    }
});
