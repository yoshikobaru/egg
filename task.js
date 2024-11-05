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
        
        const now = Date.now();
        const hoursPassedSinceLastClaim = (now - lastClaimTime) / (1000 * 60 * 60);
        
        if (hoursPassedSinceLastClaim >= 24) {
            if (lastClaimedIndex >= bonusValues.length - 1) {
                lastClaimedIndex = -1;
            }
            lastClaimTime = 0;
            saveBonusState();
        }

        bonusButtons.forEach((button, index) => {
            if (index === lastClaimedIndex && hoursPassedSinceLastClaim < 24) {
                setButtonState(button, 'claimed');
            } else if (index === lastClaimedIndex + 1 && (lastClaimedIndex === -1 || hoursPassedSinceLastClaim >= 24)) {
                setButtonState(button, 'unlocked');
            } else {
                setButtonState(button, 'locked');
            }
        });
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
        const now = Date.now();
        const hoursRemaining = 24 - ((now - lastClaimTime) / (1000 * 60 * 60));
        
        if (lastClaimTime && hoursRemaining > 0) {
            const hours = Math.floor(hoursRemaining);
            const minutes = Math.floor((hoursRemaining - hours) * 60);
            alert(`До следующего бонуса осталось: ${hours} ч. ${minutes} мин.`);
            return;
        }
        
        const button = bonusButtons[index];
        const bonusAmount = bonusValues[index];
        let balance = parseInt(localStorage.getItem('balance')) || 0;
        balance += bonusAmount;
        localStorage.setItem('balance', balance.toString());
        
        window.parent.postMessage({ type: 'updateBalance', balance: balance }, '*');
        
        lastClaimedIndex = index;
        lastClaimTime = now;
        saveBonusState();

        setButtonState(button, 'claimed');
        showBonusPopup(bonusAmount);
    }
    
    function updateBonusButtons() {
        const currentTime = Date.now();
        const timeSinceLastClaim = currentTime - lastClaimTime;
        const hoursRemaining = 24 - (timeSinceLastClaim / (1000 * 60 * 60));
        const canClaimBonus = hoursRemaining <= 0;

        bonusButtons.forEach((button, index) => {
            if (index === lastClaimedIndex) {
                setButtonState(button, 'claimed');
            } else if (index === lastClaimedIndex + 1 && canClaimBonus) {
                setButtonState(button, 'unlocked');
            } else {
                setButtonState(button, 'locked');
            }
        });

        if (hoursRemaining > 0) {
            const hours = Math.floor(hoursRemaining);
            const minutes = Math.floor((hoursRemaining - hours) * 60);
            updateBonusTimer(`${hours}ч ${minutes}м`);
        } else {
            hideBonusTimer();
        }
    }

    function setButtonState(button, state) {
        button.classList.remove('claimed', 'unlocked', 'locked');
        button.classList.add(state);
    }

    function updateBonusTimer(seconds) {
        localStorage.setItem('bonusTimeRemaining', seconds);
    }

    function hideBonusTimer() {
        localStorage.removeItem('bonusTimeRemaining');
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

    function initializeTasks() {
        console.log('Инициализация задач');
        
        ['task1', 'task2', 'task3', 'task4'].forEach(taskId => {
            const isCompleted = localStorage.getItem(`${taskId}Completed`) === 'true';
            const taskElement = document.querySelector(`#${taskId}`);
            const circle = document.querySelector(`#${taskId} .task-circle`);
            
            if (taskElement && isCompleted) {
                taskElement.classList.add('completed');
                if (circle) {
                    circle.classList.add('completed-circle');
                }
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
        const circle = document.querySelector(`#${taskId} .task-circle`);
        
        if (taskElement) {
            taskElement.classList.add('completed');
        }
        
        if (button) {
            button.disabled = true;
            button.classList.add('completed-button');
        }
        
        if (circle) {
            circle.classList.add('completed-circle');
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
            alert('Вы уже выолнили это задание!');
            return;
        }
        
        window.open('https://t.me/litwin_community', '_blank');

        let currentBalance = parseInt(localStorage.getItem('balance')) || 0;
        currentBalance += 1000;
        localStorage.setItem('balance', currentBalance.toString());

        localStorage.setItem('task1Completed', 'true');
        console.log('Задание отмечено как выполненное');

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
        
        window.open('https://t.me/LITWIN_TAP_BOT', '_blank');

        let currentBalance = parseInt(localStorage.getItem('balance')) || 0;
        currentBalance += 1000;
        localStorage.setItem('balance', currentBalance.toString());

        localStorage.setItem('task2Completed', 'true');
        console.log('Задание отмечено как выполненное');

        const task2Button = document.getElementById('task2Button');
        if (task2Button) {
            disableTaskButton('task2');
        }

        window.parent.postMessage({ type: 'updateBalance', balance: currentBalance }, '*');
        
        console.log('New balance:', currentBalance);
    }

    function handleTask3Click() {
        const currentLevel = parseInt(localStorage.getItem('currentLevel')) || 1;
        const task3Completed = localStorage.getItem('task3Completed');
        
        if (!task3Completed && currentLevel >= 2) {
            const reward = 1000;
            const currentBalance = parseInt(localStorage.getItem('balance')) || 0;
            localStorage.setItem('balance', (currentBalance + reward).toString());
            localStorage.setItem('task3Completed', 'true');
            
            window.postMessage({ type: 'updateBalance', balance: currentBalance + reward }, '*');
            
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
        
        const isTask4Completed = localStorage.getItem('task4Completed') === 'true';
        
        if (isTask4Completed) {
            alert('Вы уже выполнили это задание!');
            return;
        }
        
        const invitedFriends = parseInt(localStorage.getItem('invitedFriends')) || 0;
        console.log('Количество приглашенных друзей:', invitedFriends);
        
        if (invitedFriends > 0) {
            let currentBalance = parseInt(localStorage.getItem('balance')) || 0;
            currentBalance += 2000;
            localStorage.setItem('balance', currentBalance.toString());

            localStorage.setItem('task4Completed', 'true');
            console.log('Задание риглашения друга отмечено как ыполненное');

            const task4Button = document.getElementById('task4Button');
            if (task4Button) {
                disableTaskButton('task4');
            }

            window.parent.postMessage({ type: 'updateBalance', balance: currentBalance }, '*');
            
            alert('Поздравляем! Вы получили награду за приглашение друга!');
        } else {
            alert('Сначала пригласите друга!');
        }
    }

    function checkAllTasks() {
        console.log('Проверка всех заданий');
        
        // Проверяем подписку на группу
        if (localStorage.getItem('task1Completed') === 'true') {
            console.log('Задание 1 выполнено');
            disableTaskButton('task1');
        }
        
        // Проверяем подписку на бота
        if (localStorage.getItem('task2Completed') === 'true') {
            console.log('Задание 2 выполнено');
            disableTaskButton('task2');
        }
        
        // Проверяем разбитие яйца
        const currentLevel = parseInt(localStorage.getItem('currentLevel')) || 1;
        if (currentLevel >= 2 || localStorage.getItem('task3Completed') === 'true') {
            console.log('Задание 3 выполнено');
            disableTaskButton('task3');
            localStorage.setItem('task3Completed', 'true');
        }
        
        // Проверяем приглашение друга
        const invitedFriends = parseInt(localStorage.getItem('invitedFriends')) || 0;
        if (invitedFriends > 0 || localStorage.getItem('task4Completed') === 'true') {
            console.log('Задание 4 выполнено');
            disableTaskButton('task4');
            localStorage.setItem('task4Completed', 'true');
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM загружен');
        
        initializeBonusSystem();
        
        initializeTasks();
        
        ['task1', 'task2', 'task3', 'task4'].forEach(taskId => {
            const button = document.getElementById(`${taskId}Button`);
            if (button) {
                button.addEventListener('click', window[`handle${taskId.charAt(0).toUpperCase() + taskId.slice(1)}Click`]);
            }
        });
        
        const checkButton = document.getElementById('checkTasksButton');
        if (checkButton) {
            console.log('Кнопка CHECK найдена');
            checkButton.addEventListener('click', function() {
                console.log('Кнопка CHECK нажата');
                checkAllTasks();
            });
        } else {
            console.log('Кнопка CHECK не найдена');
        }
        
        checkAllTasks();
        
        const lastResetDate = localStorage.getItem('lastResetDate');
        const currentDate = new Date().toDateString();
        if (lastResetDate !== currentDate) {
            resetBonuses();
            localStorage.setItem('lastResetDate', currentDate);
        }
    });

    setInterval(updateBonusButtons, 1000);
})();

function resetBonuses() {
    localStorage.setItem('lastClaimedIndex', '-1');
    localStorage.setItem('lastClaimTime', '0');
    updateBonusButtons();
}
