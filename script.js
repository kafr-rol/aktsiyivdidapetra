// Імітація бази даних (відсотки проданої частки)
let soldPercent = {
    '1': 42,  // Кав'ярня
    '2': 18   // NFT
};

// Твоє реальне посилання на Mono (вже вставлене)
const MONO_JAR_BASE = 'https://send.monobank.ua/jar/4rBKwfHWvA';

// Функція покупки
function buyShare(itemId, percent, price, description) {
    if (!confirm(`Купити ${percent}% за ${price} грн?`)) return;

    // Генеруємо посилання на оплату в Mono
    const amountInKop = price * 100; // Mono приймає суму в копійках
    const monoLink = `${MONO_JAR_BASE}?amount=${amountInKop}&description=${encodeURIComponent(description)}`;

    // Відкриваємо посилання для оплати
    window.open(monoLink, '_blank');

    // Імітація успішної оплати (для тесту) — через 5 сек оновлюємо відсоток
    // В реальності тут буде webhook від Mono або Firebase
    setTimeout(() => {
        soldPercent[itemId] += percent;
        if (soldPercent[itemId] > 100) soldPercent[itemId] = 100;
        document.getElementById(`sold${itemId}`).textContent = soldPercent[itemId];
        alert(`Дякуємо за покупку! Тепер продано ${soldPercent[itemId]}%`);
    }, 5000);

}
