window.addEventListener('message', function(event) {
    if (event.data.type === 'updateTheme') {
        applyTheme(event.data.theme);
    }
});

function applyTheme(theme) {
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    document.documentElement.style.setProperty('--tertiary-color', theme.tertiary);
}

(function() {
    console.log('Скрипт task.js загружен');
    let bonusButtons;
    const bonusValues = [500, 1000, 1500, 2000, 2500, 3000, 3500];
    const cooldownTime = 5 * 1000; // 5 секунд кулдауна
    const bonusTime = 10 * 1000; // 10 секунд бонусного времени
    
    function initializeBonusSystem() {
        bonusButtons = document.querySelectorAll('.bonus-item');
        loadBonusState();
        updateBonusButtons();
        
        const dailyBonusContainer = document.querySelector('.daily-bonus');
        if (dailyBonusContainer) {
            dailyBonusContainer.addEventListener('click', handleBonusClick);
        }
    }

    function loadBonusState() {
        const state = JSON.parse(localStorage.getItem('bonusState')) || {};
        lastClaimedIndex = state.lastClaimedIndex || -1;
        lastClaimTime = state.lastClaimTime || 0;
    }

    function saveBonusState() {
        const state = {
            lastClaimedIndex: lastClaimedIndex,
            lastClaimTime: lastClaimTime
        };
        localStorage.setItem('bonusState', JSON.stringify(state));
    }

    function handleBonusClick(event) {
        const button = event.target.closest('.bonus-item');
        if (button && button.classList.contains('unlocked')) {
            const index = Array.from(bonusButtons).indexOf(button);
            if (index !== -1) {
                claimBonus(index);
            }
        }
    }

    function claimBonus(index) {
        const bonusAmount = bonusValues[index];
        let balance = parseInt(localStorage.getItem('balance')) || 0;
        balance += bonusAmount;
        localStorage.setItem('balance', balance.toString());
        
        window.parent.postMessage({ type: 'updateBalance', balance: balance }, '*');
        
        lastClaimedIndex = index;
        lastClaimTime = Date.now();
        saveBonusState();

        updateBonusButtons();
        showBonusPopup(bonusAmount);
    }
    
    function updateBonusButtons() {
        const currentTime = Date.now();
        const timeSinceLastClaim = currentTime - lastClaimTime;

        let nextUnlockedIndex = lastClaimedIndex + 1;
        if (nextUnlockedIndex >= bonusButtons.length) {
            nextUnlockedIndex = 0;
        }

        const isInCooldown = timeSinceLastClaim < cooldownTime;
        const isInBonusTime = timeSinceLastClaim >= cooldownTime && timeSinceLastClaim < (cooldownTime + bonusTime);

        // Проверяем, закончилось ли бонусное время
        if (timeSinceLastClaim >= (cooldownTime + bonusTime)) {
            // Сбрасываем на первую кнопку
            lastClaimedIndex = -1;
            lastClaimTime = 0;
            saveBonusState();
            nextUnlockedIndex = 0;
        }

        bonusButtons.forEach((button, index) => {
            if (index === nextUnlockedIndex && !isInCooldown) {
                setButtonState(button, 'unlocked');
            } else if (index <= lastClaimedIndex) {
                setButtonState(button, 'claimed');
            } else {
                setButtonState(button, 'locked');
            }
        });

        if (isInBonusTime) {
            const remainingTime = Math.ceil((cooldownTime + bonusTime - timeSinceLastClaim) / 1000);
            updateBonusTimer(remainingTime);
        } else {
            hideBonusTimer();
        }
    }

    function setButtonState(button, state) {
        button.classList.remove('claimed', 'unlocked', 'locked');
        button.classList.add(state);
        const img = button.querySelector('img');
        if (img) {
            img.className = state === 'locked' || state === 'claimed' ? 'locked-coin' : 'bonus-coin';
        }
    }

    function updateBonusTimer(seconds) {
        let timerElement = document.getElementById('bonusTimer');
        if (!timerElement) {
            timerElement = document.createElement('div');
            timerElement.id = 'bonusTimer';
            document.querySelector('.daily-bonus').appendChild(timerElement);
        }
        timerElement.textContent = `Бонусное время: ${seconds} сек`;
    }

    function hideBonusTimer() {
        const timerElement = document.getElementById('bonusTimer');
        if (timerElement) {
            timerElement.remove();
        }
    }

    function showBonusPopup(amount) {
        const popup = document.createElement('div');
        popup.className = 'bonus-popup';
        popup.innerHTML = `
            <div class="bonus-popup-content">
                <h2>Бонус получен!</h2>
                <p>Вы получили ${amount} EggCoin</p>
                <button class="closePopup">OK</button>
            </div>
        `;
        document.body.appendChild(popup);

        popup.querySelector('.closePopup').addEventListener('click', () => {
            popup.remove();
        });
    }

    // Инициализация при загрузке страницы
    document.addEventListener('DOMContentLoaded', initializeBonusSystem);

    // Обновляем состояние кнопок каждую секунду
    setInterval(updateBonusButtons, 1000);
})();

// Добавьте эту функцию для сброса бонусов (например, раз в день)
function resetBonuses() {
    localStorage.setItem('lastClaimedIndex', '-1');
    localStorage.setItem('lastClaimTime', '0');
    updateBonusButtons();
}

// Вызывайте эту функцию при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeBonusSystem();
    
    // Проверка и сброс бонусов раз в день
    const lastResetDate = localStorage.getItem('lastResetDate');
    const currentDate = new Date().toDateString();
    if (lastResetDate !== currentDate) {
        resetBonuses();
        localStorage.setItem('lastResetDate', currentDate);
    }
});

// Обновляем состояние кнопо каждые 5 секунд
setInterval(updateBonusButtons, 5000);






function initializeTasks() {
    console.log('Инициализация задач');
    
    ['task1', 'task2', 'task3', 'task4'].forEach(taskId => {
        const isCompleted = localStorage.getItem(`${taskId}Completed`) === 'true';
        const taskElement = document.querySelector(`#${taskId}`);
        
        if (taskElement && isCompleted) {
            taskElement.classList.add('completed');
            const button = document.getElementById(`${taskId}Button`);
            if (button) {
                button.disabled = true;
            }
        }
    });
}

function disableTaskButton(taskId) {
    const taskElement = document.querySelector(`#${taskId}`);
    const button = document.getElementById(`${taskId}Button`);
    
    if (taskElement) {
        taskElement.classList.add('completed');
    }
    
    if (button) {
        button.disabled = true;
    }
    
    localStorage.setItem(`${taskId}Completed`, 'true');
}

function enableTaskButton(taskId) {
    const button = document.getElementById(`${taskId}Button`);
    if (button) {
        button.disabled = false;
        button.parentElement.classList.remove('completed');
        localStorage.removeItem(`${taskId}Style`);
    }
}

function handleTask1Click() {
    console.log('Task 1 clicked');
    
    if (localStorage.getItem('task1Completed') === 'true') {
        alert('Вы уже выполнили это задание!');
        return;
    }
    
    // Открываем ссылку на группу в Telegram
    window.open('https://t.me/litwin_community', '_blank');

    // Обновляем баланс
    let currentBalance = parseInt(localStorage.getItem('balance')) || 0;
    currentBalance += 1000;
    localStorage.setItem('balance', currentBalance.toString());

    // Отмечаем задание как выполненное
    localStorage.setItem('task1Completed', 'true');
    console.log('Задание отмечено как выполненное');

    // Обновляем отображение задания
    const task1Button = document.getElementById('task1Button');
    if (task1Button) {
        disableTaskButton('task1');
    }
    window.parent.postMessage({ type: 'updateBalance', balance: currentBalance }, '*');
    
    console.log('New balance:', currentBalance);
}

function handleTask2Click() {
    console.log('Task 2 clicked');
    
    if (localStorage.getItem('task2Completed') === 'true') {
        alert('Вы уже выполнили это задание!');
        return;
    }
    
    // Открываем ссылку на группу в Telegram
    window.open('https://t.me/LITWIN_TAP_BOT', '_blank');
    
    // Обновляем баланс
    let currentBalance = parseInt(localStorage.getItem('balance')) || 0;
    currentBalance += 1000;
    localStorage.setItem('balance', currentBalance.toString());
    
    // Отмечаем задание как выполненное
    localStorage.setItem('task2Completed', 'true');
    console.log('Задание отмечено как выполненное');
    
    // Обновляем отображение задания
    const task2Button = document.getElementById('task2Button');
    if (task2Button) {
        disableTaskButton('task2');
    }

    // Отправляем сообщение об обновлении баланса
    window.parent.postMessage({ type: 'updateBalance', balance: currentBalance }, '*');
    
    console.log('New balance:', currentBalance);
}

function handleTask3Click() {
    const currentLevel = parseInt(localStorage.getItem('currentLevel')) || 1;
    const task3Completed = localStorage.getItem('task3Completed');
    
    if (!task3Completed && currentLevel >= 2) { // Проверяем, что яйцо было сломано хотя бы раз (уровень 2 или выше)
        const reward = 1000;
        const currentBalance = parseInt(localStorage.getItem('balance')) || 0;
        localStorage.setItem('balance', (currentBalance + reward).toString());
        localStorage.setItem('task3Completed', 'true');
        
        // Обновляем отображене баланса
        window.postMessage({ type: 'updateBalance', balance: currentBalance + reward }, '*');
        
        // Отключаем кнопку
        disableTaskButton('task3');
        
        alert('Поздравляем! Вы получили награду за первое разбитое яйцо!');
    } else if (task3Completed) {
        alert('Вы уже выполнили это задание!');
    } else {
        alert('Сначала нужно полностью разбить яйцо!');
    }
}

function handleTask4Click() {
    console.log('Task 4 clicked');
    
    // Проверяем состояние задания
    const isTask4Completed = localStorage.getItem('task4Completed') === 'true';
    
    if (isTask4Completed) {
        alert('Вы уже выполнили это задание!');
        return;
    }
    
    // Получаем количество приглашенных друзей из localStorage
    const invitedFriends = parseInt(localStorage.getItem('invitedFriends')) || 0;
    console.log('Количество приглашенных друзей:', invitedFriends);
    
    if (invitedFriends > 0) {
        // Обновляем баланс
        let currentBalance = parseInt(localStorage.getItem('balance')) || 0;
        currentBalance += 2000; // Награда за приглашение друга
        localStorage.setItem('balance', currentBalance.toString());

        // Отмечаем задание как выполненное
        localStorage.setItem('task4Completed', 'true');
        console.log('Задание приглашения друга отмечено как выполненное');

        // Обновляем отображение задания
        const task4Button = document.getElementById('task4Button');
        if (task4Button) {
            disableTaskButton('task4');
        }

        // Отправляем сообщение об обновлении баланса
        window.parent.postMessage({ type: 'updateBalance', balance: currentBalance }, '*');
        
        alert('Поздравляем! Вы получили награду за приглашение друга!');
    } else {
        alert('Сначала пригласите друга!');
    }
}

// Вызываем функцию инициализации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен');
    
    // Инициализация задач
    initializeTasks();
    
    // Добавляем обработчики для всех кнопок
    const task1Button = document.getElementById('task1Button');
    if (task1Button) {
        task1Button.addEventListener('click', handleTask1Click);
    }
    
    const task2Button = document.getElementById('task2Button');
    if (task2Button) {
        task2Button.addEventListener('click', handleTask2Click);
    }
    
    const task3Button = document.getElementById('task3Button');
    if (task3Button) {
        task3Button.addEventListener('click', handleTask3Click);
    }
    
    const task4Button = document.getElementById('task4Button');
    if (task4Button) {
        task4Button.addEventListener('click', handleTask4Click);
    }
});
