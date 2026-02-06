// Масив аукціонів (зберігається в localStorage для тесту)
let auctions = JSON.parse(localStorage.getItem('auctions')) || [];

// Додавання нового аукціону
function createAuction() {
    const name = document.getElementById('itemName').value.trim();
    const startPrice = parseFloat(document.getElementById('startPrice').value);
    const durationHours = parseInt(document.getElementById('duration').value);
    const imageUrl = document.getElementById('itemImage').value.trim() || 'https://via.placeholder.com/300';

    if (!name || isNaN(startPrice) || isNaN(durationHours) || durationHours < 1) {
        alert('Заповніть усі поля правильно!');
        return;
    }

    const endTime = Date.now() + durationHours * 60 * 60 * 1000;

    const auction = {
        id: Date.now(),
        name,
        image: imageUrl,
        startPrice,
        currentPrice: startPrice,
        highestBidder: null,
        endTime,
        active: true
    };

    auctions.push(auction);
    localStorage.setItem('auctions', JSON.stringify(auctions));

    renderAuctions();
    document.getElementById('itemName').value = '';
    document.getElementById('startPrice').value = '';
    document.getElementById('duration').value = '';
    document.getElementById('itemImage').value = '';
}

// Відображення всіх аукціонів
function renderAuctions() {
    const container = document.getElementById('auctions-container');
    container.innerHTML = '';

    auctions.forEach(auction => {
        const timeLeft = Math.max(0, auction.endTime - Date.now());
        const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const isEnded = timeLeft <= 0;

        if (isEnded && auction.active) {
            auction.active = false;
            localStorage.setItem('auctions', JSON.stringify(auctions));
        }

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${auction.name}</h3>
            <img src="${auction.image}" alt="${auction.name}">
            <p>Стартова ціна: ${auction.startPrice} грн</p>
            <p>Поточна ставка: <strong>${auction.currentPrice} грн</strong></p>
            ${auction.highestBidder ? `<p>Лідер: ${auction.highestBidder}</p>` : ''}
            <p>Залишилось: ${isEnded ? 'Аукціон завершено' : `${hoursLeft} год ${minutesLeft} хв`}</p>
            ${!isEnded ? `
                <input type="number" class="bid-input" id="bid${auction.id}" placeholder="Ваша ставка" min="${auction.currentPrice + 1}">
                <button class="bid-button" onclick="placeBid(${auction.id})">Зробити ставку</button>
            ` : '<button disabled>Аукціон завершено</button>'}
        `;
        container.appendChild(card);
    });
}

// Зробити ставку
function placeBid(auctionId) {
    const bidInput = document.getElementById(`bid${auctionId}`);
    const bidAmount = parseFloat(bidInput.value);

    const auction = auctions.find(a => a.id === auctionId);
    if (!auction || !auction.active) return alert('Аукціон завершено');

    if (isNaN(bidAmount) || bidAmount <= auction.currentPrice) {
        alert('Ставка повинна бути вищою за поточну!');
        return;
    }

    auction.currentPrice = bidAmount;
    auction.highestBidder = 'Анонім'; // пізніше можна додати ім'я/емейл

    localStorage.setItem('auctions', JSON.stringify(auctions));
    renderAuctions();
    alert(`Ставка ${bidAmount} грн прийнята!`);
}

// Початкове завантаження
renderAuctions();

// Автооновлення кожні 60 сек (щоб показувати залишений час)
setInterval(renderAuctions, 60000);
