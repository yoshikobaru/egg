let progressBar, balanceElement, canElement, energyElement, bubblesContainer;
let progress, balance, energy, hourlyProfit, tapProfit;
const clicksToFill = 10;

let lastExitTime, accumulatedCoins;
let totalEarnedCoins;
const progressLevels = [100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000];

let isOnline = true;
let syncTimer;
let lastEnergyRegenTime;
let maxEnergy = parseInt(localStorage.getItem('maxEnergy')) || 100;
const energyRegenRate = 1; // Количество энергии, восстанавливаемое за интервал
const energyRegenInterval = 5000; // Интервал восстановления энергии в миллисекундах (5 секунд)

let currentLevel = parseInt(localStorage.getItem('currentLevel')) || 1;
const canImages = [
    'assets/egg.png',
    'assets/bankamango.png',
    'assets/bankablueberry.png',
    'assets/banka4.png',
    'assets/banka5.png',
    'assets/banka6.png',
    'assets/banka7.png',
    'assets/banka8.png'
];
const eggImages = [
    'assets/egg.png',
    'assets/polomka1.png',
    'assets/polomka2.png',
    'assets/polomka3.png',
    'assets/polomka4.png'
];

const canThemes = {
    'assets/bankaClassic.png': {
        primary: 'rgb(18,131,255)',
        secondary: 'rgb(7,119,240)',
        tertiary: 'rgb(1,43,89)'
    },
    'assets/bankamango.png': {
        primary: 'rgb(255,165,0)',
        secondary: 'rgb(255,140,0)',
        tertiary: 'rgb(184,134,11)'
    },
    'assets/bankablueberry.png': {
        primary: 'rgb(76,0,153)',      // Темно-фиолетовый
        secondary: 'rgb(102,0,204)',   // Фиолетовый
        tertiary: 'rgb(51,0,102)'      // Очень темный фиолетовый
    },
    // Добавьте темы для остальных банок здесь
};
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.onEvent('viewportChanged', function() {
        if (window.Telegram.WebApp.isExpanded) {
            // Приложение развернуто
        } else {
            // Приложение свернуто, пользователь пытается выйти
            window.Telegram.WebApp.showConfirm('Вы уверены, что хотите выйти?', function(confirmed) {
                if (confirmed) {
                    // Пользователь подтвердил выход
                    syncDataWithServer(); // Синхронизируем данные перед выходом
                    window.Telegram.WebApp.close();
                }
            });
        }
    });
}

function syncDataWithServer() {
    const telegramId = getTelegramUserId();
    const username = getTelegramUsername();
    if (!telegramId) {
        console.error('Не удалось получить Telegram ID пользователя');
        return;
    }

    const dataToSync = {
        telegramId: telegramId.toString(),
        username: username,
        balance: parseInt(localStorage.getItem('balance')) || 0,
        tapProfit: parseInt(localStorage.getItem('tapProfit')) || 1,
        hourlyProfit: parseInt(localStorage.getItem('hourlyProfit')) || 0,
        totalEarnedCoins: parseInt(localStorage.getItem('totalEarnedCoins')) || 0
    };

    fetch('https://egg-tap.ru/sync-user-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSync)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Данные успешно синхронизированы с сервером:', data);
    })
    .catch(error => {
        console.error('Ошибка при синхронизации данных с сервером:', error);
    });
}

// Добавьте эту функцию, если её ещё нет
function getTelegramUsername() {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
        return window.Telegram.WebApp.initDataUnsafe.user.username || null;
    }
    return null;
}

// Функция для получения данных с сервера
function fetchDataFromServer() {
    const telegramId = getTelegramUserId();
    if (!telegramId) {
        console.error('Не удалось получить Telegram ID пользователя');
        return;
    }

    fetch(`https://egg-tap.ru/get-user-data?telegramId=${telegramId}`)
    .then(response => response.json())
    .then(data => {
        console.log('Полученные данные с сервера:', data);
        balance = data.balance;
        tapProfit = data.tapProfit;
        hourlyProfit = data.hourlyProfit;
        totalEarnedCoins = data.totalEarnedCoins;
        
        localStorage.setItem('balance', balance.toString());
        localStorage.setItem('tapProfit', tapProfit.toString());
        localStorage.setItem('hourlyProfit', hourlyProfit.toString());
        localStorage.setItem('totalEarnedCoins', totalEarnedCoins.toString());
        
        updateBalanceDisplay();
        updateTapProfit();
        updateHourlyProfit();
        updateProgress();
        console.log('Данные успешно получены с сервера и обновлены');
    })
    .catch(error => {
        console.error('Ошибка при получении данных с сервера:', error);
    });
}
// Функция для получения Telegram ID пользователя
function getTelegramUserId() {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
        return window.Telegram.WebApp.initDataUnsafe.user.id;
    }
    return null;
}
function initializeVariables() {
    console.log('Инициализация переменных');
    balance = parseInt(localStorage.getItem('balance')) || 0;
    if (isNaN(balance)) {
        console.warn('Баланс в localStorage некорректен, сбрасываем на 0');
        balance = 0;
        localStorage.setItem('balance', '0');
    }
    maxEnergy = parseInt(localStorage.getItem('maxEnergy')) || 100;
    energy = parseInt(localStorage.getItem('energy')) || maxEnergy;
    hourlyProfit = parseInt(localStorage.getItem('hourlyProfit')) || 0;
    tapProfit = parseInt(localStorage.getItem('tapProfit')) || 1;
    lastExitTime = parseInt(localStorage.getItem('lastExitTime')) || Date.now();
    accumulatedCoins = parseFloat(localStorage.getItem('accumulatedCoins')) || 0;
    totalEarnedCoins = parseInt(localStorage.getItem('totalEarnedCoins')) || 0;
    console.log('Инициализация: lastExitTime =', new Date(lastExitTime), 'accumulatedCoins =', accumulatedCoins);
    console.log('Баланс после инициализации:', balance);
    console.log('Максимальная энергия после инициализации:', maxEnergy);
}

function updateBalanceDisplay(newBalance) {
    console.log('Вызвана функция updateBalanceDisplay с аргументом:', newBalance);
    
    if (typeof newBalance === 'undefined' || isNaN(newBalance)) {
        console.log('newBalance не определен или NaN, получаем значение из localStorage');
        newBalance = parseInt(localStorage.getItem('balance')) || 0;
    }
    
    newBalance = Math.max(0, Math.floor(newBalance));
    console.log('Обработанный новый баланс:', newBalance);
    
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
        balanceElement.textContent = newBalance.toLocaleString();
        console.log('Баланс обновлен в DOM:', newBalance);
    } else {
    }
    
    localStorage.setItem('balance', newBalance.toString());
    console.log('Баланс сохранен в localStorage:', newBalance);
}
function initializeMainPage() {
    console.log('Вызвана функция initializeMainPage');
    
    progressBar = document.getElementById('progressBar');
    balanceElement = document.getElementById('balance');
    canElement = document.getElementById('can');
    energyElement = document.getElementById('energy');
    bubblesContainer = document.querySelector('.bubbles');
    const tapToBreakButton = document.getElementById('tapToBreakButton');

    console.log('Найденные элементы:', {
        progressBar, balanceElement, canElement, energyElement, bubblesContainer, tapToBreakButton
    });

    if (!progressBar || !balanceElement || !canElement || !energyElement || !bubblesContainer || !tapToBreakButton) {
        console.error('Один или несколько необходимых элементов не найдены');
        return;
    }

    tapProfit = parseInt(localStorage.getItem('tapProfit')) || 1;
    hourlyProfit = parseInt(localStorage.getItem('hourlyProfit')) || 0;

    initializeVariables();
    calculateOfflineEarnings();
    startOfflineEarningInterval();
    updateBalanceDisplay();
    updateProgress();
    updateBalance();
    updateEnergy();
    updateHourlyProfit();
    updateTapProfit();
    updateUserProfile();
    initializeTelegramWebApp();

    isOnline = true;

    canElement.addEventListener('click', handleCanClick);
    tapToBreakButton.addEventListener('click', handleCanClick);

    document.querySelectorAll('.footer-btn').forEach(btn => {
        btn.addEventListener('click', handleFooterButtonClick);
    });

    initializeEnergy();
    regenerateEnergy();
    startEnergyRegenInterval();

    const selectedCan = parseInt(localStorage.getItem('selectedCan')) || 0;
    updateCanImage(selectedCan);
}

window.updateTapProfit = function(newTapProfit) {
    if (typeof newTapProfit !== 'undefined' && !isNaN(newTapProfit)) {
        tapProfit = newTapProfit;
    }
    localStorage.setItem('tapProfit', tapProfit.toString());
    
    const tapProfitProfileElement = document.querySelector('.profit-item:first-child .profit-value');
    if (tapProfitProfileElement) {
        tapProfitProfileElement.innerHTML = `<img src="assets/eggCoin.png" alt="LIT" class="lit-coin-small">+<span>${tapProfit.toLocaleString()}</span>`;
    }

    const tapProfitElement = document.getElementById('tapProfit');
    if (tapProfitElement) {
        tapProfitElement.textContent = tapProfit.toLocaleString();
    }
};

function updateHourlyProfit(newHourlyProfit) {
    if (typeof newHourlyProfit !== 'undefined' && !isNaN(newHourlyProfit)) {
        hourlyProfit = newHourlyProfit;
    }
    localStorage.setItem('hourlyProfit', hourlyProfit.toString());
    
    const hourlyProfitElement = document.getElementById('hourlyProfit');
    if (hourlyProfitElement) {
        hourlyProfitElement.textContent = hourlyProfit.toLocaleString();
    }
}

function updateUserProfile() {
    if (window.Telegram && window.Telegram.WebApp) {
        const webApp = window.Telegram.WebApp;
        webApp.ready();
        
        // Проверяем, инициализированы ли данные
        if (webApp.initDataUnsafe && webApp.initDataUnsafe.user) {
            const user = webApp.initDataUnsafe.user;
            document.getElementById('profileName').textContent = user.first_name + (user.last_name ? ' ' + user.last_name : '');
            document.getElementById('profileUsername').textContent = user.username ? '@' + user.username : '';
            if (user.photo_url) {
                document.getElementById('profilePic').src = user.photo_url;
            }
        } else {
            console.error('Данные пользователя недоступны');
            // Можно добавить здесь код для отображения заглушки или сообщения об ошибке
        }
    } else {
        console.error('Telegram WebApp не инициализирован');
    }
}

// Вызываем функцию после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
    }
    updateUserProfile();
    syncDataWithServer(); // Добавьте эту строку
});

// Добавляем обработчик события viewportChanged
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.onEvent('viewportChanged', updateUserProfile);
}

function initializeTelegramWebApp() {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        console.log('WebApp инициализирован:', window.Telegram.WebApp.initDataUnsafe);
        
        // Получаем данные пользователя
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        if (user) {
            const telegramId = user.id.toString();
            const username = user.username || null;
            
            // Сохраняем username в localStorage
            localStorage.setItem('username', username);
            
            // Отправляем данные на сервер
            syncUserDataWithServer(telegramId, username);
        } else {
            console.error('Данные пользователя недоступны');
        }
    } else {
        console.error('Telegram WebApp не доступен');
    }
}

function syncUserDataWithServer(telegramId, username) {
    const dataToSync = {
        telegramId: telegramId,
        username: username
    };

    fetch('https://egg-tap.ru/sync-user-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSync)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(`HTTP error! status: ${response.status}, message: ${err.error}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Данные получены с сервера:', data);
        if (data.user) {
            // Обновляем локальные данные только если они отличаются от серверных
            if (parseInt(localStorage.getItem('balance')) !== data.user.balance) {
                localStorage.setItem('balance', data.user.balance.toString());
                updateBalanceDisplay();
            }
            if (parseInt(localStorage.getItem('tapProfit')) !== data.user.tapProfit) {
                localStorage.setItem('tapProfit', data.user.tapProfit.toString());
                updateTapProfit();
            }
            if (parseInt(localStorage.getItem('hourlyProfit')) !== data.user.hourlyProfit) {
                localStorage.setItem('hourlyProfit', data.user.hourlyProfit.toString());
                updateHourlyProfit();
            }
            if (parseInt(localStorage.getItem('totalEarnedCoins')) !== data.user.totalEarnedCoins) {
                localStorage.setItem('totalEarnedCoins', data.user.totalEarnedCoins.toString());
                updateProgress();
            }
        }
    })
    .catch(error => {
        console.error('Ошибка при синхронизации данных с сервером:', error);
    });
}

function updateProgress() {
    // Находим текущий уровень
    currentLevel = 1;
    for (let i = 0; i < progressLevels.length; i++) {
        if (totalEarnedCoins >= progressLevels[i]) {
            currentLevel = i + 1;
        } else {
            break;
        }
    }

    // Вычисляем процент прогресса дл�� текущего уровня
    let progressPercentage;
    if (currentLevel > progressLevels.length) {
        // Если достигнут максимальный уровень
        progressPercentage = 100;
    } else {
        // Вычисляем прогресс между текущим и следующим уровнем
        const levelStart = currentLevel > 1 ? progressLevels[currentLevel - 2] : 0;
        const levelEnd = progressLevels[currentLevel - 1];
        const progress = totalEarnedCoins - levelStart;
        const levelRange = levelEnd - levelStart;
        progressPercentage = (progress / levelRange) * 100;
        
        // Ограничиваем процент от 0 до 100
        progressPercentage = Math.max(0, Math.min(100, progressPercentage));
    }

    // Обновляем визуальный прогресс-бар
    progressBar.style.width = `${progressPercentage}%`;
    
    const eggIndex = Math.floor(progressPercentage / 20);
    const eggImage = document.getElementById('can');
    if (eggImage) {
        const newEggSrc = eggImages[Math.min(eggIndex, eggImages.length - 1)];
        console.log(`Прогресс: ${progressPercentage.toFixed(2)}%, индекс яйца: ${eggIndex}, новое изображение: ${newEggSrc}`);
        eggImage.src = newEggSrc;
    }
    
    const levelDisplay = document.getElementById('levelDisplay');
    if (levelDisplay) {
        levelDisplay.textContent = `Breaks ${currentLevel}`;
    }

    // Сохраняем значения
    localStorage.setItem('totalEarnedCoins', totalEarnedCoins.toString());
    localStorage.setItem('currentLevel', currentLevel.toString());
    
    // Отправляем сообщение странице коллекции об изменении уровня
    window.postMessage({ type: 'levelUp', level: currentLevel }, '*');
}
function updateBalance(amount) {
    console.log('Вызвана функция updateBalance с аргументом:', amount);
    let currentBalance = parseInt(localStorage.getItem('balance')) || 0;
    if (isNaN(currentBalance)) {
        console.warn('Текущий баланс в localStorage нкорректен, сбрасываем на 0');
        currentBalance = 0;
    }
    currentBalance += amount;
    updateBalanceDisplay(currentBalance);
    console.log('Новый баланс:', currentBalance);
}


function updateEnergy() {
    energyElement.textContent = `${energy}/100`;
    localStorage.setItem('energy', energy.toString());
}

function createBubble() {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    const size = Math.random() * 10 + 5;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    const startAngle = Math.random() * Math.PI * 2;
    const startRadius = 75; // Половина ширины банки
    const endRadius = 100 + Math.random() * 50;
    
    const startX = Math.cos(startAngle) * startRadius;
    const startY = Math.sin(startAngle) * startRadius;
    
    bubble.style.left = `calc(50% + ${startX}px)`;
    bubble.style.top = `calc(50% + ${startY}px)`;
    
    const endX = Math.cos(startAngle) * endRadius;
    const endY = Math.sin(startAngle) * endRadius;
    
    const tx = endX - startX;
    const ty = endY - startY;
    
    bubble.style.setProperty('--tx', `${tx}px`);
    bubble.style.setProperty('--ty', `${ty}px`);
    
    bubblesContainer.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1000);
}

// Добавьте эту функцию
function createMango() {
    console.log('Creating a mango'); // Отладочное сообщение
    const mango = document.createElement('div');
    mango.classList.add('mango');
    
    const size = Math.random() * 20 + 10;
    mango.style.width = `${size}px`;
    mango.style.height = `${size}px`;
    
    const startAngle = Math.random() * Math.PI * 2;
    const startRadius = 75;
    const endRadius = 100 + Math.random() * 50;
    
    const startX = Math.cos(startAngle) * startRadius;
    const startY = Math.sin(startAngle) * startRadius;
    
    mango.style.left = `calc(50% + ${startX}px)`;
    mango.style.top = `calc(50% + ${startY}px)`;
    
    const endX = Math.cos(startAngle) * endRadius;
    const endY = Math.sin(startAngle) * endRadius;
    
    const tx = endX - startX;
    const ty = endY - startY;
    
    mango.style.setProperty('--tx', `${tx}px`);
    mango.style.setProperty('--ty', `${ty}px`);
    
    bubblesContainer.appendChild(mango);
    setTimeout(() => mango.remove(), 1000);
}

function handleCanClick() {
    console.log('handleCanClick вызван'); // Добавляем отладочный вывод
    
    if (energy > 0) {
        canElement.classList.add('shake');
        setTimeout(() => canElement.classList.remove('shake'), 200);

        const selectedCan = localStorage.getItem('selectedCan') || '0';
        const canSrc = canImages[parseInt(selectedCan)];

        console.log('Selected can:', canSrc);

        // Создаем эффекты в зависимости от типа банки
        if (canSrc === 'assets/bankamango.png') {
            console.log('Creating mangoes and coconuts');
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    createFruit('mango');
                    createFruit('coconut');
                }, Math.random() * 200);
            }
        } else if (canSrc === 'assets/bankablueberry.png') {
            console.log('Creating blueberries');
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    createFruit('blueberry');
                }, Math.random() * 200);
            }
        } else {
            console.log('Creating bubbles');
            for (let i = 0; i < 7; i++) {
                setTimeout(() => {
                    createBubble();
                }, Math.random() * 200);
            }
        }

        showTapProfit();
        updateBalance(tapProfit);
        updateTotalEarnedCoins(tapProfit);
        updateProgress();

        energy = Math.max(0, energy - 1);
        localStorage.setItem('energy', energy.toString());
        updateEnergyDisplay();

        if (syncTimer) {
            clearTimeout(syncTimer);
        }

        syncTimer = setTimeout(() => {
            syncDataWithServer();
        }, 3000);
    }
}

function updateTotalEarnedCoins(amount) {
    totalEarnedCoins = parseInt(localStorage.getItem('totalEarnedCoins')) || 0;
    totalEarnedCoins += amount;
    localStorage.setItem('totalEarnedCoins', totalEarnedCoins.toString());
    console.log('Обновлено totalEarnedCoins:', totalEarnedCoins);
}
function showTapProfit() {
    const profitElement = document.createElement('div');
    profitElement.className = 'tap-profit';
    profitElement.textContent = `+${tapProfit}`;

    const canRect = canElement.getBoundingClientRect();
    const canCenterX = canRect.left + canRect.width / 2;
    const canCenterY = canRect.top + canRect.height / 2;

    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * (canRect.width / 2);
    const x = canCenterX + Math.cos(angle) * radius;
    const y = canCenterY + Math.sin(angle) * radius;

    profitElement.style.left = `${x}px`;
    profitElement.style.top = `${y}px`;

    document.body.appendChild(profitElement);

    setTimeout(() => {
        profitElement.style.opacity = '0';
        profitElement.style.transform = 'translateY(-20px)';
        setTimeout(() => profitElement.remove(), 500);
    }, 10);
}

function regenerateEnergy() {
    const currentTime = Date.now();
    const timePassed = currentTime - lastEnergyRegenTime;
    const energyToRegen = Math.floor(timePassed / energyRegenInterval) * energyRegenRate;

    if (energyToRegen > 0) {
        energy = Math.min(energy + energyToRegen, maxEnergy);
        lastEnergyRegenTime = currentTime - (timePassed % energyRegenInterval);
        
        updateEnergyDisplay();
        localStorage.setItem('lastEnergyRegenTime', lastEnergyRegenTime.toString());
    }
}

function startEnergyRegenInterval() {
    setInterval(regenerateEnergy, energyRegenInterval);
}

function handleFooterButtonClick(event) {
    const page = event.target.closest('.footer-btn').dataset.page;
    loadPage(page);

    // Обновляем активную кнопку
    document.querySelectorAll('.footer-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.footer-btn').classList.add('active');
}
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById(`${pageName}-page`).style.display = 'block';

    document.querySelectorAll('.footer-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.footer-btn[data-page="${pageName}"]`).classList.add('active');

    if (pageName === 'friends') {
        updateFriendsCanImage(parseInt(localStorage.getItem('selectedCan')) || 0);
    }
}

function handleFooterButtonClick(event) {
    const page = event.target.closest('.footer-btn').dataset.page;
    showPage(page);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.footer-btn').forEach(btn => {
        btn.addEventListener('click', handleFooterButtonClick);
    });

    showPage('main');
    initializeTelegramWebApp();
    initializeMainPage();
});

// Запуск регенерации эергии
setInterval(regenerateEnergy, 5000);

function calculateOfflineEarnings() {
    const currentTime = Date.now();
    const timeDiff = (currentTime - lastExitTime) / 1000; // разница в скундах
    const maxOfflineTime = 5 * 60 * 60; // 5 часов в секундах

    console.log('Расчет офлайн-заработка: timeDiff =', timeDiff, 'секуд');

    if (timeDiff > 0) {
        const earnedCoins = Math.min(timeDiff, maxOfflineTime) * (hourlyProfit / 3600);
        accumulatedCoins += earnedCoins;
        const earnedWholeCoins = Math.floor(accumulatedCoins);
        balance += earnedWholeCoins;
        totalEarnedCoins += earnedWholeCoins;
        accumulatedCoins -= earnedWholeCoins;

        console.log('Заработано монет:', earnedCoins, 'Целых монет:', earnedWholeCoins);
        console.log('Новый баланс:', balance, 'Остаток:', accumulatedCoins);

        updateBalanceDisplay(balance);
        updateProgress();
    }

    lastExitTime = currentTime;
    localStorage.setItem('lastExitTime', lastExitTime.toString());
    localStorage.setItem('accumulatedCoins', accumulatedCoins.toString());
}

function startOfflineEarningInterval() {
    setInterval(() => {
        if (!isOnline) {
            const earnedCoins = (hourlyProfit / 3600) * (1 / 60); // монеты за 1 секунду
            accumulatedCoins += earnedCoins;
            if (accumulatedCoins >= 1) {
                const earnedWholeCoins = Math.floor(accumulatedCoins);
                balance += earnedWholeCoins;
                totalEarnedCoins += earnedWholeCoins;
                accumulatedCoins -= earnedWholeCoins;
                updateBalanceDisplay(balance);
                updateProgress();
                console.log('Интервал: заработано', earnedWholeCoins, 'монет. Новый баланс:', balance);
            }
            localStorage.setItem('accumulatedCoins', accumulatedCoins.toString());
        }
    }, 1000); // обновляем каждую секунду
}

function saveExitTime() {
    isOnline = false;
    const exitTime = Date.now();
    localStorage.setItem('lastExitTime', exitTime.toString());
    console.log('Сохранено время выхода:', new Date(exitTime));
}

window.addEventListener('beforeunload', () => {
    saveExitTime();
    syncDataWithServer();
});
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Страница скрыта (пользователь переключился на другую вкладку)
        syncDataWithServer();
    }
});
window.addEventListener('focus', () => {
    if (!isOnline) {
        isOnline = true;
        console.log('Вовращение в игру, расчет офлайн-зарабтка');
        calculateOfflineEarnings();
    }
});

// Добавьте этот код в конец файла main.js
window.addEventListener('message', function(event) {
    if (event.data.type === 'updateBalance') {
        const newBalance = event.data.balance;
        updateBalanceDisplay(newBalance);
    }
});


// Добавьте обработчик события storage
window.addEventListener('storage', function(event) {
    if (event.key === 'balance') {
        updateBalanceDisplay();
    }
});
window.addEventListener('message', function(event) {
    if (event.data.type === 'updateBalance') {
        const newBalance = event.data.balance;
        updateBalanceDisplay(newBalance);
    }
});

function initializeEnergy() {
    maxEnergy = parseInt(localStorage.getItem('maxEnergy')) || 100;
    energy = parseInt(localStorage.getItem('energy')) || maxEnergy;
    lastEnergyRegenTime = parseInt(localStorage.getItem('lastEnergyRegenTime')) || Date.now();
    updateEnergyDisplay();
}

function updateEnergyDisplay() {
    const energyElement = document.getElementById('energy');
    if (energyElement) {
        energyElement.textContent = `${energy}/${maxEnergy}`;
    }
    localStorage.setItem('energy', energy.toString());
    localStorage.setItem('maxEnergy', maxEnergy.toString());
}

function updateMaxEnergy(increase) {
    maxEnergy += increase;
    energy = Math.min(energy + increase, maxEnergy); // Увеличиваем текущую энергию, но не больше нового максимума
    updateEnergyDisplay();
    localStorage.setItem('maxEnergy', maxEnergy.toString());
    localStorage.setItem('energy', energy.toString());
}

// Обновляем обработчик сообщений
window.addEventListener('message', function(event) {
    if (event.data.type === 'updateMaxEnergy') {
        maxEnergy = event.data.newMaxEnergy;
        energy = Math.min(energy, maxEnergy); // Убедимся, что текущая энергия не превышает новый максимум
        updateEnergyDisplay();
    }
    // ... обработка других типов сообщений ...
});

window.updateCanImage = function(index) {
    const canElement = document.getElementById('can');
    if (canElement) {
        const newCanSrc = canImages[index];
        canElement.src = newCanSrc;
        updateAppTheme(newCanSrc);
        updateFriendsCanImage(index);
        localStorage.setItem('selectedCan', index.toString());
    }
};

function updateAppTheme(canSrc) {
    const theme = canThemes[canSrc] || canThemes['assets/bankaClassic.png'];
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    document.documentElement.style.setProperty('--tertiary-color', theme.tertiary);
    
    // Отправляем сообщение об изменении темы другим страницам
    const frames = document.querySelectorAll('iframe');
    frames.forEach(frame => {
        frame.contentWindow.postMessage({ type: 'updateTheme', theme: theme }, '*');
    });
}

function createFruit(type) {
    console.log(`Creating a ${type}`); // Отладочное сообщение
    const fruit = document.createElement('div');
    fruit.classList.add('fruit', type);
    
    const size = Math.random() * 20 + 10;
    fruit.style.width = `${size}px`;
    fruit.style.height = `${size}px`;
    
    const startAngle = Math.random() * Math.PI * 2;
    const startRadius = 75;
    const endRadius = 100 + Math.random() * 50;
    
    const startX = Math.cos(startAngle) * startRadius;
    const startY = Math.sin(startAngle) * startRadius;
    
    fruit.style.left = `calc(50% + ${startX}px)`;
    fruit.style.top = `calc(50% + ${startY}px)`;
    
    const endX = Math.cos(startAngle) * endRadius;
    const endY = Math.sin(startAngle) * endRadius;
    
    const tx = endX - startX;
    const ty = endY - startY;
    
    fruit.style.setProperty('--tx', `${tx}px`);
    fruit.style.setProperty('--ty', `${ty}px`);
    
    bubblesContainer.appendChild(fruit);
    setTimeout(() => fruit.remove(), 1000);
}

function updateFriendsCanImage(index) {
    console.log('Вызвана функция updateFriendsCanImage с индексом:', index);
    const canSrc = canImages[index];
    console.log('Новый источник изображения банки:', canSrc);
    const cansImage = document.getElementById('cansImage');
    if (cansImage) {
        if (canSrc === 'assets/bankamango.png') {
            cansImage.src = 'assets/twobankamango.png';
        } else if (canSrc === 'assets/bankablueberry.png') {
            cansImage.src = 'assets/twobankablueberry.png';
        } else {
            cansImage.src = 'assets/addFriend.png';
        }
        console.log('Новое изображение установлено:', cansImage.src);
    } else {
        console.error('Элемент cansImage не найден');
    }
}
//
function updateCanImage(index) {
    console.log('Вызвана функция updateCanImage с индексом:', index);
    const canElement = document.getElementById('can');
    if (canElement) {
        const newCanSrc = canImages[index];
        console.log('овый источник изображения банки:', newCanSrc);
        canElement.src = newCanSrc;
        updateAppTheme(newCanSrc);
        updateFriendsCanImage(index);
        localStorage.setItem('selectedCan', index.toString());
    } else {
        console.error('Элемент can не найден');
    }
}

function openTaskLink(url) {
    // Проверяем, доступен ли Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        // Если да, используем метод openTelegramLink
        window.Telegram.WebApp.openTelegramLink(url);
    } else {
        // Если нет, открываем ссылку в новом окне
        window.open(url, '_blank');
    }
}

function initializeFriendsPageFromMain() {
    const friendsPage = document.getElementById('friends-page');
    if (friendsPage) {
        const inviteButton = friendsPage.querySelector('#inviteButton');
        if (inviteButton) {
            console.log('Кнопка найдена в main.js, добавляем обработчик');
            inviteButton.addEventListener('click', window.handleInviteButtonClick);
        } else {
            console.error('Кнопка приглашения не найдена в main.js');
        }
    }
}
/*
function loadAdsgramScript() {
    return new Promise((resolve, reject) => {
        if (window.Adsgram) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://sad.adsgram.ai/js/sad.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

let AdController;
async function initAdsgram() {
    try {
        await loadAdsgramScript();
        console.log('Adsgram SDK loaded successfully');
        AdController = window.Adsgram.init({ blockId: "4178" }); 
    } catch (error) {
        console.error('Error loading Adsgram SDK:', error);
    }
}

document.addEventListener('DOMContentLoaded', initAdsgram);

async function watchAd() {
    if (!AdController) {
        await initAdsgram();
    }
    try {
        const result = await AdController.show();
        console.log('User watched ad', result);
        const telegramId = getTelegramUserId();
        if (!telegramId) {
            console.error('Telegram ID not found');
            return;
        }
        const response = await fetch(`https://egg-tap.ru/reward?userid=${telegramId}`);
        const data = await response.json();
        if (data.success) {
            applyAdBonus();
        }
    } catch (error) {
        console.error('Error showing ad:', error);
    }
}

function applyAdBonus() {
    const bonusDuration = 30000; // 30 seconds
    const originalTapProfit = tapProfit;
    tapProfit += 100;
    updateTapProfit();
    setTimeout(() => {
        tapProfit = originalTapProfit;
        updateTapProfit();
    }, bonusDuration);
}
*/
// Вызовите эту функцию при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeFriendsPageFromMain);
// Получение данных с сервера при инициализации
document.addEventListener('DOMContentLoaded', fetchDataFromServer);

// Добавьте в начало файла main.js
async function preloadImages() {
    const imagesToPreload = [
        'assets/egg.png',
        'assets/polomka3.png', // Добавьте изображение для экрана загрузки
        ...canImages,
        ...eggImages,
        'assets/eggCoin.png',
        'assets/addFriend.png',
        'assets/twobankamango.png',
        'assets/twobankablueberry.png'
    ];

    const imagePromises = imagesToPreload.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
        });
    });

    return Promise.all(imagePromises);
}

async function initializeApp() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.getElementById('loadingBar');
    const loadingText = document.getElementById('loadingText');
    let progress = 0;

    try {
        // Начинаем параллельную инициализацию всех компонентов
        const initPromises = [
            preloadImages(),
            initializeVariables(),
            fetchDataFromServer(),
            initializeTelegramWebApp()
        ];

        const loadingSteps = [
            { text: 'LOADING...', weight: 30 },
            { text: 'LOADING...', weight: 30 },
            { text: 'LOADING...', weight: 40 }
        ];

        // Запускаем все промисы параллельно
        const results = await Promise.allSettled(initPromises.map(async (promise, index) => {
            try {
                const result = await promise;
                progress += loadingSteps[index]?.weight || 0;
                loadingBar.style.width = `${progress}%`;
                loadingText.textContent = loadingSteps[index]?.text || 'Загрузка...';
                return result;
            } catch (error) {
                console.error('Ошибка инициализации:', error);
                return null;
            }
        }));

        // Инициализируем остальные компоненты
        initializeMainPage();
        initializeFriendsPageFromMain();
        startOfflineEarningInterval();
        startEnergyRegenInterval();

        // Плавно скрываем экран загрузки
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = '';
        }, 500);

    } catch (error) {
        console.error('Критическая ошибка при инициализации:', error);
        loadingText.textContent = 'Ошибка загрузки...';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 2000);
    }
}

// Убедимся, что функция вызывается только один раз
let initialized = false;
document.addEventListener('DOMContentLoaded', () => {
    if (!initialized) {
        initialized = true;
        initializeApp();
    }
});

