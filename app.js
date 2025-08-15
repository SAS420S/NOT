// টেলিগ্রাম ওয়েব অ্যাপ ইনিশিয়ালাইজ
Telegram.WebApp.ready();
Telegram.WebApp.expand();
Telegram.WebApp.setHeaderColor('#0088cc');
Telegram.WebApp.setBackgroundColor('#f5f5f5');

// DOM এলিমেন্টস সিলেক্ট
const elements = {
    userAvatar: document.getElementById('user-avatar'),
    userName: document.getElementById('user-name'),
    userUsername: document.getElementById('user-username'),
    userId: document.getElementById('user-id'),
    userBalance: document.getElementById('user-balance'),
    watchAdBtn: document.getElementById('watch-ad-btn'),
    adContainer: document.getElementById('ad-container'),
    progressContainer: document.getElementById('progress-container'),
    progressBar: document.getElementById('progress-bar'),
    refCode: document.getElementById('ref-code'),
    copyRefBtn: document.getElementById('copy-ref-btn'),
    refCount: document.getElementById('ref-count'),
    refEarnings: document.getElementById('ref-earnings'),
    refLevel: document.getElementById('ref-level'),
    withdrawBtn: document.getElementById('withdraw-btn'),
    notification: document.getElementById('notification'),
    notificationIcon: document.getElementById('notification-icon'),
    notificationMessage: document.getElementById('notification-message')
};

// অ্যাপ স্টেট ম্যানেজমেন্ট
const state = {
    balance: 0,
    referrals: 0,
    refEarnings: 0,
    refLevel: 1,
    isWatchingAd: false,
    adTimer: null,
    adProgress: 0,
    userData: null
};

// ইউজার ডাটা লোড
function loadUserData() {
    // টেলিগ্রাম থেকে ইউজার ডাটা পেতে
    const tgUser = Telegram.WebApp.initDataUnsafe.user;
    
    if (tgUser) {
        state.userData = {
            id: tgUser.id,
            firstName: tgUser.first_name || '',
            lastName: tgUser.last_name || '',
            username: tgUser.username ? `@${tgUser.username}` : 'No username',
            photoUrl: tgUser.photo_url || 'assets/images/default-avatar.png',
            language: tgUser.language_code || 'en'
        };
    } else {
        // ডেমো ডাটা (যদি টেলিগ্রাম থেকে ডাটা না পাওয়া যায়)
        state.userData = {
            id: Math.floor(Math.random() * 1000000),
            firstName: 'Guest',
            lastName: 'User',
            username: 'No username',
            photoUrl: 'assets/images/default-avatar.png',
            language: 'en'
        };
    }
    
    // স্টোরেজ থেকে অ্যাপ ডাটা লোড
    const savedData = localStorage.getItem('appState');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        Object.assign(state, parsedData);
    }
    
    updateUI();
}

// ইউজার ইন্টারফেস আপডেট
function updateUI() {
    // ইউজার ইনফো
    elements.userAvatar.src = state.userData.photoUrl;
    elements.userName.textContent = `${state.userData.firstName} ${state.userData.lastName}`;
    elements.userUsername.textContent = state.userData.username;
    elements.userId.textContent = `ID: ${state.userData.id}`;
    
    // রেফারেল কোড
    elements.refCode.value = `REF${state.userData.id}`;
    
    // ব্যালেন্স এবং রেফারেল ইনফো
    elements.userBalance.textContent = `$${state.balance.toFixed(2)}`;
    elements.refCount.textContent = state.referrals;
    elements.refEarnings.textContent = `$${state.refEarnings.toFixed(2)}`;
    elements.refLevel.textContent = state.refLevel;
    
    // লেভেল আপডেট
    const newLevel = Math.floor(state.referrals / 5) + 1;
    if (newLevel !== state.refLevel) {
        state.refLevel = newLevel;
        showNotification(`🎉 Level up! You reached level ${state.refLevel}`);
    }
    
    // স্টেট সেভ
    localStorage.setItem('appState', JSON.stringify(state));
}

// নোটিফিকেশন সিস্টেম
function showNotification(message, type = 'success') {
    elements.notification.className = 'notification';
    elements.notification.classList.add(type);
    elements.notificationMessage.textContent = message;
    
    // আইকন সেট
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️'
    };
    elements.notificationIcon.textContent = icons[type] || 'ℹ️';
    
    // নোটিফিকেশন শো
    elements.notification.classList.add('show');
    
    // অটো হাইড
    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 3000);
}

// Ad লোড করার ফাংশন
function loadAd() {
    if (state.isWatchingAd) return;
    
    state.isWatchingAd = true;
    elements.watchAdBtn.disabled = true;
    elements.progressContainer.style.display = 'block';
    
    // ডেমো Ad ডাটা
    const ads = [
        {
            title: "Special Offer!",
            content: "Get 50% discount on your next purchase",
            duration: 10
        },
        {
            title: "New Game Launch",
            content: "Install and earn $1 instantly",
            duration: 15
        },
        {
            title: "Limited Time Deal",
            content: "Only today - 70% off premium subscription",
            duration: 12
        }
    ];
    
    const randomAd = ads[Math.floor(Math.random() * ads.length)];
    
    // Ad কন্টেন্ট শো
    elements.adContainer.innerHTML = `
        <div class="ad-content">
            <h4>${randomAd.title}</h4>
            <p>${randomAd.content}</p>
        </div>
        <div class="ad-timer" id="ad-timer">${randomAd.duration}s</div>
    `;
    
    const adTimerElement = document.getElementById('ad-timer');
    let timeLeft = randomAd.duration;
    state.adProgress = 0;
    
    // টাইমার সেট
    state.adTimer = setInterval(() => {
        timeLeft--;
        state.adProgress = ((randomAd.duration - timeLeft) / randomAd.duration) * 100;
        elements.progressBar.style.width = `${state.adProgress}%`;
        adTimerElement.textContent = `${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(state.adTimer);
            finishAd();
        }
    }, 1000);
}

// Ad শেষ হলে
function finishAd() {
    clearInterval(state.adTimer);
    state.isWatchingAd = false;
    elements.watchAdBtn.disabled = false;
    elements.progressContainer.style.display = 'none';
    
    // আয় ক্যালকুলেট (লেভেল অনুযায়ী)
    const earnings = 0.10 * state.refLevel;
    state.balance += earnings;
    
    // UI আপডেট
    updateUI();
    
    // নোটিফিকেশন
    showNotification(`🎉 You earned $${earnings.toFixed(2)} from watching the ad!`);
    
    // Ad কন্টেইনার রিসেট
    setTimeout(() => {
        elements.adContainer.innerHTML = `
            <div class="ad-content">
                <h4>Ad Completed!</h4>
                <p>You can watch another ad to earn more</p>
            </div>
        `;
    }, 2000);
}

// রেফারেল চেক
function checkReferral() {
    const initData = Telegram.WebApp.initData;
    if (initData.start_param) {
        const refCode = initData.start_param;
        if (refCode.startsWith('REF') && refCode !== `REF${state.userData.id}`) {
            state.referrals += 1;
            state.refEarnings += 0.50;
            updateUI();
            showNotification(`🎊 Thanks for joining via referral! You got bonus $0.50`);
        }
    }
}

// ইভেন্ট হ্যান্ডলারস
function setupEventListeners() {
    // Ad বাটন
    elements.watchAdBtn.addEventListener('click', loadAd);
    
    // রেফারেল কোড কপি
    elements.copyRefBtn.addEventListener('click', () => {
        elements.refCode.select();
        document.execCommand('copy');
        showNotification('Referral code copied to clipboard!');
    });
    
    // উইথড্রয়
    elements.withdrawBtn.addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('withdraw-amount').value);
        const method = document.getElementById('withdraw-method').value;
        
        if (isNaN(amount)) {
            showNotification('Please enter a valid amount', 'error');
            return;
        }
        
        if (amount < 5) {
            showNotification('Minimum withdrawal is $5', 'error');
            return;
        }
        
        if (amount > state.balance) {
            showNotification('Insufficient balance', 'error');
            return;
        }
        
        // উইথড্রয় রিকোয়েস্ট
        Telegram.WebApp.sendData(JSON.stringify({
            action: 'withdraw',
            amount: amount,
            method: method,
            userId: state.userData.id
        }));
        
        // ডেমো হিসেবে ব্যালেন্স আপডেট
        state.balance -= amount;
        updateUI();
        
        showNotification(`Withdrawal request of $${amount.toFixed(2)} via ${method.toUpperCase()} has been sent!`);
    });
}

// অ্যাপ ইনিশিয়ালাইজেশন
function initApp() {
    loadUserData();
    checkReferral();
    setupEventListeners();
    
    // ডেমো ডাটা (প্রথম লোডে)
    if (state.referrals === 0 && state.balance === 0) {
        state.referrals = Math.floor(Math.random() * 3);
        state.refEarnings = state.referrals * 0.50;
        updateUI();
    }
}

// অ্যাপ স্টার্ট
initApp();
