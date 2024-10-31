(function() {
    const collectionGrid = document.getElementById('collection-grid');
    const marketItems = document.getElementById('market-items');

    
    const canImages = [
        'assets/egg.png',
        'assets/lock.svg',
        'assets/lock.svg',
        'assets/lock.svg',
        'assets/lock.svg',
        'assets/lock.svg',
        'assets/lock.svg',
        'assets/lock.svg'
    ];
    
    // Создаем сетку коллекции
    for (let i = 0; i < 8; i++) {
        const itemElement = document.createElement('div');
        itemElement.className = 'collection-item';
        itemElement.dataset.index = i;
        itemElement.innerHTML = `<img src="${canImages[i]}" alt="Банка ${i + 1}" class="can-icon">`;
        collectionGrid.appendChild(itemElement);
    }
    
    // Обновляем отображение разблокированных банок
    updateUnlockedCans();
    
    // Данные для задания "Выпить LIT"
    const drinkLitData = [
        { level: 1, profit: 1, price: 100 },
        { level: 2, profit: 2, price: 200 },
        { level: 3, profit: 3, price: 400 },
        { level: 4, profit: 4, price: 800 },
        { level: 5, profit: 5, price: 1600 },
        { level: 6, profit: 6, price: 3200 },
        { level: 7, profit: 7, price: 6400 },
        { level: 8, profit: 8, price: 12800 },
        { level: 9, profit: 9, price: 25600 },
        { level: 10, profit: 10, price: 51200 },
    ];
    
    const drinkLitElement = document.createElement('div');
    drinkLitElement.className = 'market-item';
    drinkLitElement.innerHTML = `
        <div class="market-item-header">
            <span class="market-item-level">Ур. <span id="drinkLitLevel">1</span></span>
            <span class="market-item-title">Удар по яичку</span>
            <span class="market-item-profit">
                Прибыль за тап <img src="assets/eggCoin.png" alt="LIT" class="lit-coin-small">+<span id="drinkLitProfit">1</span>
            </span>
        </div>
        <hr class="item-divider">
        <div class="market-item-buy" id="drinkLitButton">
            <img src="assets/eggCoin.png" alt="LIT" class="lit-coin">
            <span class="price-value" id="drinkLitPrice">100</span>
        </div>
    `;
    marketItems.insertBefore(drinkLitElement, marketItems.firstChild);

    let currentDrinkLitLevel = parseInt(localStorage.getItem('drinkLitLevel')) || 0;
    function updateDrinkLitButton() {
        const drinkLitButton = document.getElementById('drinkLitButton');
        const drinkLitPrice = document.getElementById('drinkLitPrice');
        const drinkLitLevel = document.getElementById('drinkLitLevel');
        const drinkLitProfit = document.getElementById('drinkLitProfit');

        if (currentDrinkLitLevel >= drinkLitData.length || localStorage.getItem('drinkLitMaxLevel') === 'true') {
            drinkLitLevel.textContent = drinkLitData[drinkLitData.length - 1].level;
            drinkLitProfit.textContent = drinkLitData[drinkLitData.length - 1].profit;
            drinkLitPrice.textContent = 'MAX';
            drinkLitButton.disabled = true;
            drinkLitButton.textContent = 'Максимальный уровень';
            localStorage.setItem('drinkLitMaxLevel', 'true');
        } else {
            const nextLevel = drinkLitData[currentDrinkLitLevel];
            drinkLitLevel.textContent = nextLevel.level;
            drinkLitProfit.textContent = nextLevel.profit;
            drinkLitPrice.textContent = nextLevel.price;
            drinkLitButton.disabled = false;
        }
        
        localStorage.setItem('drinkLitLevel', currentDrinkLitLevel.toString());
    }

    document.getElementById('drinkLitButton').addEventListener('click', function() {
        if (this.disabled) return;

        const nextLevel = drinkLitData[currentDrinkLitLevel];
        const currentBalance = parseInt(localStorage.getItem('balance')) || 0;
        const currentTapProfit = parseInt(localStorage.getItem('tapProfit')) || 1;

        if (currentBalance >= nextLevel.price) {
            const newBalance = currentBalance - nextLevel.price;
            localStorage.setItem('balance', newBalance.toString());

            const newTapProfit = currentTapProfit + nextLevel.profit;
            localStorage.setItem('tapProfit', newTapProfit.toString());
            
            if (typeof updateTapProfit === 'function') {
                tapProfit = newTapProfit;
                updateTapProfit();
            }

            currentDrinkLitLevel++;
            if (currentDrinkLitLevel >= drinkLitData.length) {
                currentDrinkLitLevel = drinkLitData.length - 1;
                localStorage.setItem('drinkLitMaxLevel', 'true');
            }
            updateDrinkLitButton();

            updateBalance();

            alert(`Вы успешно ударили по яичку и увеличили прибыль за тап на +${nextLevel.profit}!`);
        } else {
            alert('Недостаточно средств для покупки!');
        }
    });

    if (localStorage.getItem('drinkLitMaxLevel') === 'true') {
        currentDrinkLitLevel = drinkLitData.length - 1;
    } 
    updateDrinkLitButton();
    








    const farmData = [
        { level: 1, profit: 100, price: 100 },
        { level: 2, profit: 200, price: 200 },
        { level: 3, profit: 300, price: 400 },
        { level: 4, profit: 400, price: 800 },
        { level: 5, profit: 500, price: 1600 },
        { level: 6, profit: 600, price: 3200 },
        { level: 7, profit: 700, price: 6400 },
        { level: 8, profit: 800, price: 12800 },
        { level: 9, profit: 900, price: 25600 },
        { level: 10, profit: 1000, price: 51200 },
    ];
    
    const farmElement = document.createElement('div');
    farmElement.className = 'market-item';
    farmElement.innerHTML = `
        <div class="market-item-header">
            <span class="market-item-level">Ур. <span id="farmLevel">1</span></span>
            <span class="market-item-title">Купить курочек</span>
            <span class="market-item-profit">
                Прибыль в час <img src="assets/eggCoin.png" alt="LIT" class="lit-coin-small">+<span id="farmProfit">100</span>
            </span>
        </div>
        <hr class="item-divider">
        <div class="market-item-buy" id="farmButton">
            <img src="assets/eggCoin.png" alt="LIT" class="lit-coin">
            <span class="price-value" id="farmPrice">100</span>
        </div>
    `;
    marketItems.appendChild(farmElement);
    
    let currentFarmLevel = parseInt(localStorage.getItem('farmLevel')) || 0;
    
    function updateFarmButton() {
        const farmButton = document.getElementById('farmButton');
        const farmPrice = document.getElementById('farmPrice');
        const farmLevel = document.getElementById('farmLevel');
        const farmProfit = document.getElementById('farmProfit');

        if (currentFarmLevel >= farmData.length || localStorage.getItem('farmMaxLevel') === 'true') {
            farmLevel.textContent = farmData[farmData.length - 1].level;
            farmProfit.textContent = farmData[farmData.length - 1].profit;
            farmPrice.textContent = 'MAX';
            farmButton.disabled = true;
            farmButton.textContent = 'Максимальный уровень';
            localStorage.setItem('farmMaxLevel', 'true');
        } else {
            const nextLevel = farmData[currentFarmLevel];
            farmLevel.textContent = nextLevel.level;
            farmProfit.textContent = nextLevel.profit;
            farmPrice.textContent = nextLevel.price;
            farmButton.disabled = false;
        }
        
        localStorage.setItem('farmLevel', currentFarmLevel.toString());
    }
    
    document.getElementById('farmButton').addEventListener('click', function() {
        if (this.disabled) return;

        const nextLevel = farmData[currentFarmLevel];
        const currentBalance = parseInt(localStorage.getItem('balance')) || 0;
        const currentHourlyProfit = parseInt(localStorage.getItem('hourlyProfit')) || 0;

        if (currentBalance >= nextLevel.price) {
            const newBalance = currentBalance - nextLevel.price;
            localStorage.setItem('balance', newBalance.toString());

            const newHourlyProfit = currentHourlyProfit + nextLevel.profit;
            localStorage.setItem('hourlyProfit', newHourlyProfit.toString());
            
            if (typeof updateHourlyProfit === 'function') {
                hourlyProfit = newHourlyProfit;
                updateHourlyProfit();
            }

            currentFarmLevel++;
            if (currentFarmLevel >= farmData.length) {
                currentFarmLevel = farmData.length - 1;
                localStorage.setItem('farmMaxLevel', 'true');
            }
            updateFarmButton();

            updateBalance();

            alert(`Вы успешно улучшили Фармилку до уровня ${nextLevel.level} и увеличили прибыль в час на +${nextLevel.profit}!`);
        } else {
            alert('Недостаточно средств для покупки!');
        }
    });
    

    if (localStorage.getItem('farmMaxLevel') === 'true') {
        currentFarmLevel = farmData.length - 1;
    }
    updateFarmButton();














    // ... существующий код ...

const energyData = [
    { level: 1, profit: 100, price: 100 },
    { level: 2, profit: 200, price: 200 },
    { level: 3, profit: 300, price: 400 },
    { level: 4, profit: 400, price: 800 },
    { level: 5, profit: 500, price: 1600 },
    { level: 6, profit: 600, price: 3200 },
    { level: 7, profit: 700, price: 6400 },
    { level: 8, profit: 800, price: 12800 },
    { level: 9, profit: 900, price: 25600 },
    { level: 10, profit: 1000, price: 51200 },
];

const energyElement = document.createElement('div');
energyElement.className = 'market-item';
energyElement.innerHTML = `
    <div class="market-item-header">
        <span class="market-item-level">Ур. <span id="energyLevel">1</span></span>
        <span class="market-item-title">Заряд энергии</span>
        <span class="market-item-profit">
            Добавить энергии <img src="assets/eggCoin.png" alt="LIT" class="lit-coin-small">+<span id="energyProfit">100</span>
        </span>
    </div>
    <hr class="item-divider">
    <div class="market-item-buy" id="energyButton">
        <img src="assets/eggCoin.png" alt="LIT" class="lit-coin">
        <span class="price-value" id="energyPrice">100</span>
    </div>
`;
marketItems.appendChild(energyElement);

let currentEnergyLevel = parseInt(localStorage.getItem('energyLevel')) || 0;

function updateEnergyButton() {
    const energyButton = document.getElementById('energyButton');
    const energyPrice = document.getElementById('energyPrice');
    const energyLevel = document.getElementById('energyLevel');
    const energyProfit = document.getElementById('energyProfit');

    if (currentEnergyLevel >= energyData.length || localStorage.getItem('energyMaxLevel') === 'true') {
        energyLevel.textContent = energyData[energyData.length - 1].level;
        energyProfit.textContent = energyData[energyData.length - 1].profit;
        energyPrice.textContent = 'MAX';
        energyButton.disabled = true;
        energyButton.textContent = 'Максимальный уровень';
        localStorage.setItem('energyMaxLevel', 'true');
    } else {
        const nextLevel = energyData[currentEnergyLevel];
        energyLevel.textContent = nextLevel.level;
        energyProfit.textContent = nextLevel.profit;
        energyPrice.textContent = nextLevel.price;
        energyButton.disabled = false;
    }
    
    localStorage.setItem('energyLevel', currentEnergyLevel.toString());
}

document.getElementById('energyButton').addEventListener('click', function() {
    if (this.disabled) return;

    const nextLevel = energyData[currentEnergyLevel];
    const currentBalance = parseInt(localStorage.getItem('balance')) || 0;

    if (currentBalance >= nextLevel.price) {
        const newBalance = currentBalance - nextLevel.price;
        localStorage.setItem('balance', newBalance.toString());

        const currentMaxEnergy = parseInt(localStorage.getItem('maxEnergy')) || 100;
        const newMaxEnergy = currentMaxEnergy + nextLevel.profit;
        localStorage.setItem('maxEnergy', newMaxEnergy.toString());

        // Отправляем сообщение главной странице для обновления максимальной энергии
        window.parent.postMessage({ type: 'updateMaxEnergy', newMaxEnergy: newMaxEnergy }, '*');

        currentEnergyLevel++;
        if (currentEnergyLevel >= energyData.length) {
            currentEnergyLevel = energyData.length - 1;
            localStorage.setItem('energyMaxLevel', 'true');
        }
        updateEnergyButton();

        updateBalance();

        alert(`Вы успешно увеличили максимальную энергию на +${nextLevel.profit}!`);
    } else {
        alert('Недостаточно средств для покупки!');
    }
});

if (localStorage.getItem('energyMaxLevel') === 'true') {
    currentEnergyLevel = energyData.length - 1;
}
updateEnergyButton();

// ... остальной код ...







    // Обновленные данные маркета с уникальными идентификаторами
    const marketData = [
        
        
        

       
    ];
    
    marketData.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'market-item';
        itemElement.innerHTML = `
            <div class="market-item-header">
                <span class="market-item-level">Ур. ${item.level}</span>
                <span class="market-item-title">${item.title}</span>
                <span class="market-item-profit">
                    ${item.profitType === 'energy' 
                        ? `Добавить энергии <img src="assets/eggCoin.png" alt="LIT" class="lit-coin-small">+${item.profit}`
                        : `Прибыль ${item.profitType === 'tap' ? 'за тап' : 'в час'} <img src="assets/eggCoin.png" alt="LIT" class="lit-coin-small">+${item.profit}`
                    }
                </span>
            </div>
            <hr class="item-divider">
            <div class="market-item-buy" data-id="${item.id}">
                <img src="assets/eggCoin.png" alt="LIT" class="lit-coin">
                <span class="price-value">${item.price}</span>
            </div>
            ${item.timer ? `<div class="market-item-timer">${item.timer}</div>` : ''}
        `;
        marketItems.appendChild(itemElement);
    });

    
    // Обновляем обработчик событий
    marketItems.addEventListener('click', function(event) {
        const buyButton = event.target.closest('.market-item-buy');
        if (buyButton) {
            const itemId = parseInt(buyButton.dataset.id);
            const item = marketData.find(item => item.id === itemId);
            if (item) {
                buyItem(item);
            }
        }
    });

    function buyItem(item) {
        const currentBalance = parseInt(localStorage.getItem('balance')) || 0;
        const currentHourlyProfit = parseInt(localStorage.getItem('hourlyProfit')) || 0;
        const currentTapProfit = parseInt(localStorage.getItem('tapProfit')) || 1;

        if (currentBalance >= item.price) {
            // Вычитаем цену из баланса
            const newBalance = currentBalance - item.price;
            localStorage.setItem('balance', newBalance.toString());

            // Увеличиваем соответствую��ую прибыль или энергию
            if (item.profitType === 'hourly') {
                const newHourlyProfit = currentHourlyProfit + item.profit;
                localStorage.setItem('hourlyProfit', newHourlyProfit.toString());
                
                // Обновляем отображение на главной странице, если она открыта
                if (typeof updateHourlyProfit === 'function') {
                    hourlyProfit = newHourlyProfit;
                    updateHourlyProfit();
                }
            } else if (item.profitType === 'tap') {
                const newTapProfit = currentTapProfit + item.profit;
                localStorage.setItem('tapProfit', newTapProfit.toString());
                
                // Обновляем отображение на главной странице, если она открыта
                if (typeof updateTapProfit === 'function') {
                    tapProfit = newTapProfit;
                    updateTapProfit();
                }
            } else if (item.profitType === 'energy') {
                // Отправляем сообщение главной странице для обновления максимальной энергии
                window.parent.postMessage({ type: 'updateMaxEnergy', increase: item.profit }, '*');
            }

            // Обновляем отображение на странице коллекции
            updateCollectionDisplay();

            // Обновляем отображение баланса
            updateBalance();

            alert(`Вы успешно купили "${item.title}"!`);
        } else {
            alert('Недостаточно средств для покупки!');
        }
    }

    function updateCollectionDisplay() {
        // Здесь можно обновить отображение коллекции, если необходимо
        // Например, разблокировать купленный предмет в сетке коллекции
    }

    function updateProfitDisplay() {
        const tapProfitElement = document.getElementById('tapProfit');
        const hourlyProfitElement = document.getElementById('hourlyProfit');
        
        if (tapProfitElement) {
            tapProfitElement.textContent = localStorage.getItem('tapProfit') || '1';
        }
        
        if (hourlyProfitElement) {
            hourlyProfitElement.textContent = localStorage.getItem('hourlyProfit') || '0';
        }
    }

    function updateBalance() {
        const balanceElement = document.getElementById('balance');
        if (balanceElement) {
            balanceElement.textContent = localStorage.getItem('balance') || '0';
        }
    }

    // Вызываем эту функцию при загрузке страницы коллекции
    updateProfitDisplay();
    
    function updateUnlockedCans() {
        const currentLevel = parseInt(localStorage.getItem('currentLevel')) || 1;
        const unlockedCans = parseInt(localStorage.getItem('unlockedCans')) || 1;
        const items = collectionGrid.querySelectorAll('.collection-item');
        items.forEach((item, index) => {
            if (index < unlockedCans) {
                item.classList.add('unlocked');
                item.querySelector('img').src = canImages[index] || 'assets/egg.png';
            } else {
                item.classList.remove('unlocked');
                item.querySelector('img').src = 'assets/lock.svg';
            }
        });
    }
    
    function updateCanImage(index) {
        const canElement = document.getElementById('can');
        if (canElement) {
            canElement.src = canImages[index];
        }
        
        // Обновляем изображение в превью коллекции
        const canPreviewElement = document.querySelector('.can-preview img');
        if (canPreviewElement) {
            canPreviewElement.src = canImages[index];
        }
        
        // Обновляем тему приложения
        updateAppTheme(canImages[index]);
        
        // Сохраняем выбранную банку в localStorage
        localStorage.setItem('selectedCan', index.toString());
    }

    function changeCan(index) {
        if (index >= 0 && index < canImages.length) {
            updateCanImage(index);
            alert('Банка успешно изменена!');
        }
    }

    // Обновляем обработчик клика на элементы коллекции
    collectionGrid.addEventListener('click', function(event) {
        const item = event.target.closest('.collection-item');
        if (item && item.classList.contains('unlocked')) {
            const index = parseInt(item.dataset.index);
            changeCan(index);
        }
    });

    // При загрузке страницы, обновляем изображение банки
    document.addEventListener('DOMContentLoaded', function() {
        const selectedCan = parseInt(localStorage.getItem('selectedCan')) || 0;
        updateCanImage(selectedCan);
    });

    // ... остальной код ...

    // Обновляем отображение при изменении уровня
    window.addEventListener('message', function(event) {
        if (event.data.type === 'levelUp') {
            updateUnlockedCans();
        }
    });

    // Добавьте эту функцию в конец файла
    function adjustPageHeight() {
        const footerHeight = document.querySelector('.footer').offsetHeight;
        document.getElementById('collection-page').style.height = `calc(100% - ${footerHeight}px)`;
    }

    // Вызовите функцию при загрузке страницы и при изменении размера окна
    window.addEventListener('load', adjustPageHeight);
    window.addEventListener('resize', adjustPageHeight);
// Добавляем вкладки категорий
const categoryTabs = document.createElement('div');
categoryTabs.className = 'category-tabs';
categoryTabs.innerHTML = `
    <button class="category-tab active" data-category="tap">ТАП</button>
    <button class="category-tab" data-category="hour">ЧАС</button>
    <button class="category-tab" data-category="energy">ЭНЕРГИЯ</button>
`;
marketItems.insertBefore(categoryTabs, marketItems.firstChild);

// Создаем контейнеры для каждой категории улучшений
const tapUpgrades = document.createElement('div');
tapUpgrades.className = 'upgrade-category active';
tapUpgrades.id = 'tap-upgrades';

const hourUpgrades = document.createElement('div');
hourUpgrades.className = 'upgrade-category';
hourUpgrades.id = 'hour-upgrades';

const energyUpgrades = document.createElement('div');
energyUpgrades.className = 'upgrade-category';
energyUpgrades.id = 'energy-upgrades';

// Перемещаем существующие улучшения в соответствующие категории
const existingUpgrades = marketItems.querySelectorAll('.market-item');
existingUpgrades.forEach(upgrade => {
    const profitText = upgrade.querySelector('.market-item-profit').textContent.toLowerCase();
    if (profitText.includes('тап')) {
        tapUpgrades.appendChild(upgrade);
    } else if (profitText.includes('час')) {
        hourUpgrades.appendChild(upgrade);
    } else if (profitText.includes('энергии')) {
        energyUpgrades.appendChild(upgrade);
    }
});

// Добавляем категории улучшений в маркет
marketItems.appendChild(tapUpgrades);
marketItems.appendChild(hourUpgrades);
marketItems.appendChild(energyUpgrades);
// Обработчик переключения вкладок
categoryTabs.addEventListener('click', function(event) {
    if (event.target.classList.contains('category-tab')) {
        const category = event.target.dataset.category;
        
        // Обновляем активную вкладку
        categoryTabs.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
        event.target.classList.add('active');
        
        // Показываем соответствующую группу улучшений
        document.querySelectorAll('.upgrade-category').forEach(group => group.classList.remove('active'));
        document.getElementById(`${category}-upgrades`).classList.add('active');
    }
});
const hourlyIncomeData = [
    { level: 1, profit: 100, price: 100 },
    { level: 2, profit: 200, price: 200 },
    { level: 3, profit: 300, price: 400 },
    { level: 4, profit: 400, price: 800 },
    { level: 5, profit: 500, price: 1600 },
    { level: 6, profit: 600, price: 3200 },
    { level: 7, profit: 700, price: 6400 },
    { level: 8, profit: 800, price: 12800 },
    { level: 9, profit: 900, price: 25600 },
    { level: 10, profit: 1000, price: 51200 },
];

const hourlyIncomeElement = document.createElement('div');
hourlyIncomeElement.className = 'market-item';
hourlyIncomeElement.innerHTML = `
    <div class="market-item-header">
        <span class="market-item-level">Ур. <span id="hourlyIncomeLevel">1</span></span>
        <span class="market-item-title">Курочки не спят</span>
        <span class="market-item-profit">
            Прибыль в час <img src="assets/eggCoin.png" alt="LIT" class="lit-coin-small">+<span id="hourlyIncomeProfit">100</span>
        </span>
    </div>
    <hr class="item-divider">
    <div class="market-item-buy" id="hourlyIncomeButton">
        <img src="assets/eggCoin.png" alt="LIT" class="lit-coin">
        <span class="price-value" id="hourlyIncomePrice">100</span>
    </div>
`;
hourUpgrades.appendChild(hourlyIncomeElement);

let currentHourlyIncomeLevel = parseInt(localStorage.getItem('hourlyIncomeLevel')) || 0;

function updateHourlyIncomeButton() {
    const hourlyIncomeButton = document.getElementById('hourlyIncomeButton');
    const hourlyIncomePrice = document.getElementById('hourlyIncomePrice');
    const hourlyIncomeLevel = document.getElementById('hourlyIncomeLevel');
    const hourlyIncomeProfit = document.getElementById('hourlyIncomeProfit');

    if (currentHourlyIncomeLevel >= hourlyIncomeData.length || localStorage.getItem('hourlyIncomeMaxLevel') === 'true') {
        hourlyIncomeLevel.textContent = hourlyIncomeData[hourlyIncomeData.length - 1].level;
        hourlyIncomeProfit.textContent = hourlyIncomeData[hourlyIncomeData.length - 1].profit;
        hourlyIncomePrice.textContent = 'MAX';
        hourlyIncomeButton.disabled = true;
        hourlyIncomeButton.textContent = 'Максимальный уровень';
        localStorage.setItem('hourlyIncomeMaxLevel', 'true');
    } else {
        const nextLevel = hourlyIncomeData[currentHourlyIncomeLevel];
        hourlyIncomeLevel.textContent = nextLevel.level;
        hourlyIncomeProfit.textContent = nextLevel.profit;
        hourlyIncomePrice.textContent = nextLevel.price;
        hourlyIncomeButton.disabled = false;
    }
    
    localStorage.setItem('hourlyIncomeLevel', currentHourlyIncomeLevel.toString());
}

document.getElementById('hourlyIncomeButton').addEventListener('click', function() {
    if (this.disabled) return;

    const nextLevel = hourlyIncomeData[currentHourlyIncomeLevel];
    const currentBalance = parseInt(localStorage.getItem('balance')) || 0;
    const currentHourlyProfit = parseInt(localStorage.getItem('hourlyProfit')) || 0;

    if (currentBalance >= nextLevel.price) {
        const newBalance = currentBalance - nextLevel.price;
        localStorage.setItem('balance', newBalance.toString());

        const newHourlyProfit = currentHourlyProfit + nextLevel.profit;
        localStorage.setItem('hourlyProfit', newHourlyProfit.toString());
        
        if (typeof updateHourlyProfit === 'function') {
            hourlyProfit = newHourlyProfit;
            updateHourlyProfit();
        }

        currentHourlyIncomeLevel++;
        if (currentHourlyIncomeLevel >= hourlyIncomeData.length) {
            currentHourlyIncomeLevel = hourlyIncomeData.length - 1;
            localStorage.setItem('hourlyIncomeMaxLevel', 'true');
        }
        updateHourlyIncomeButton();

        updateBalance();

        alert(`Вы успешно улучшили почасовой доход до уровня ${nextLevel.level} и увеличили прибыль в час на +${nextLevel.profit}!`);
    } else {
        alert('Недостаточно средств для покупки!');
    }
});

if (localStorage.getItem('hourlyIncomeMaxLevel') === 'true') {
    currentHourlyIncomeLevel = hourlyIncomeData.length - 1;
}
updateHourlyIncomeButton();


const eggTapData = [
    { level: 1, profit: 2, price: 100 },
    { level: 2, profit: 4, price: 200 },
    { level: 3, profit: 8, price: 400 },
    { level: 4, profit: 16, price: 800 },
    { level: 5, profit: 32, price: 1600 },
    { level: 6, profit: 64, price: 3200 },
    { level: 7, profit: 128, price: 6400 },
    { level: 8, profit: 256, price: 12800 },
    { level: 9, profit: 512, price: 25600 },
    { level: 10, profit: 1024, price: 51200 },
];

const eggTapElement = document.createElement('div');
eggTapElement.className = 'market-item';
eggTapElement.innerHTML = `
    <div class="market-item-header">
        <span class="market-item-level">Ур. <span id="eggTapLevel">1</span></span>
        <span class="market-item-title">Улучшить яйцо</span>
        <span class="market-item-profit">
            Прибыль за тап <img src="assets/eggCoin.png" alt="LIT" class="lit-coin-small">+<span id="eggTapProfit">2</span>
        </span>
    </div>
    <hr class="item-divider">
    <div class="market-item-buy" id="eggTapButton">
        <img src="assets/eggCoin.png" alt="LIT" class="lit-coin">
        <span class="price-value" id="eggTapPrice">100</span>
    </div>
`;
tapUpgrades.appendChild(eggTapElement);

let currentEggTapLevel = parseInt(localStorage.getItem('eggTapLevel')) || 0;

function updateEggTapButton() {
    const eggTapButton = document.getElementById('eggTapButton');
    const eggTapPrice = document.getElementById('eggTapPrice');
    const eggTapLevel = document.getElementById('eggTapLevel');
    const eggTapProfit = document.getElementById('eggTapProfit');

    if (currentEggTapLevel >= eggTapData.length || localStorage.getItem('eggTapMaxLevel') === 'true') {
        eggTapLevel.textContent = eggTapData[eggTapData.length - 1].level;
        eggTapProfit.textContent = eggTapData[eggTapData.length - 1].profit;
        eggTapPrice.textContent = 'MAX';
        eggTapButton.disabled = true;
        eggTapButton.textContent = 'Максимальный уровень';
        localStorage.setItem('eggTapMaxLevel', 'true');
    } else {
        const nextLevel = eggTapData[currentEggTapLevel];
        eggTapLevel.textContent = nextLevel.level;
        eggTapProfit.textContent = nextLevel.profit;
        eggTapPrice.textContent = nextLevel.price;
        eggTapButton.disabled = false;
    }
    
    localStorage.setItem('eggTapLevel', currentEggTapLevel.toString());
}

document.getElementById('eggTapButton').addEventListener('click', function() {
    if (this.disabled) return;

    const nextLevel = eggTapData[currentEggTapLevel];
    const currentBalance = parseInt(localStorage.getItem('balance')) || 0;
    const currentTapProfit = parseInt(localStorage.getItem('tapProfit')) || 1;

    if (currentBalance >= nextLevel.price) {
        const newBalance = currentBalance - nextLevel.price;
        localStorage.setItem('balance', newBalance.toString());

        const newTapProfit = currentTapProfit + nextLevel.profit;
        localStorage.setItem('tapProfit', newTapProfit.toString());
        
        if (typeof updateTapProfit === 'function') {
            tapProfit = newTapProfit;
            updateTapProfit();
        }

        currentEggTapLevel++;
        if (currentEggTapLevel >= eggTapData.length) {
            currentEggTapLevel = eggTapData.length - 1;
            localStorage.setItem('eggTapMaxLevel', 'true');
        }
        updateEggTapButton();

        updateBalance();

        alert(`Вы успешно улучшили яйцо до уровня ${nextLevel.level} и увеличили прибыль за тап на +${nextLevel.profit}!`);
    } else {
        alert('Недостаточно средств для покупки!');
    }
});

if (localStorage.getItem('eggTapMaxLevel') === 'true') {
    currentEggTapLevel = eggTapData.length - 1;
}
updateEggTapButton();

// В начале файла после объявления констант добавьте:
function initializeGameState() {
    // Устанавливаем базовые значения, если они отсутствуют
    if (!localStorage.getItem('tapProfit')) {
        localStorage.setItem('tapProfit', '1');
    }
    if (!localStorage.getItem('hourlyProfit')) {
        localStorage.setItem('hourlyProfit', '0');
    }
    if (!localStorage.getItem('maxEnergy')) {
        localStorage.setItem('maxEnergy', '100');
    }
    
    // Сбрасываем значения к базовым
    let tapProfit = 1; // Базовое значение
    let hourlyProfit = 0; // Базовое значение
    
    // Учитываем все улучшения
    if (localStorage.getItem('drinkLitLevel')) {
        const level = parseInt(localStorage.getItem('drinkLitLevel'));
        for (let i = 0; i < level; i++) {
            tapProfit += drinkLitData[i].profit;
        }
    }
    
    if (localStorage.getItem('eggTapLevel')) {
        const level = parseInt(localStorage.getItem('eggTapLevel'));
        for (let i = 0; i < level; i++) {
            tapProfit += eggTapData[i].profit;
        }
    }
    
    if (localStorage.getItem('farmLevel')) {
        const level = parseInt(localStorage.getItem('farmLevel'));
        for (let i = 0; i < level; i++) {
            hourlyProfit += farmData[i].profit;
        }
    }
    
    if (localStorage.getItem('hourlyIncomeLevel')) {
        const level = parseInt(localStorage.getItem('hourlyIncomeLevel'));
        for (let i = 0; i < level; i++) {
            hourlyProfit += hourlyIncomeData[i].profit;
        }
    }
    
    // Сохраняем пересчитанные значения
    localStorage.setItem('tapProfit', tapProfit.toString());
    localStorage.setItem('hourlyProfit', hourlyProfit.toString());
    
    // Обновляем отображение на странице
    updateProfitDisplay();
}

// Вызываем функцию при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeGameState);
})();
