// টেলিগ্রাম ওয়েব অ্যাপ ইনিশিয়ালাইজ
Telegram.WebApp.ready();
Telegram.WebApp.expand();

// অ্যাপ স্টেট
const state = {
    currentPage: 'home-page',
    user: {
        id: null,
        firstName: 'User',
        lastName: '',
        username: null,
        photoUrl: 'assets/images/default-avatar.png',
        language: 'en',
        joinDate: new Date().toISOString().split('T')[0]
    },
    balance: 1.10,
    totalAds: 193,
    todayAds: 23,
    targetAds: 1000,
    referrals: 5,
    refEarnings: 0.50
};

// DOM এলিমেন্টস
const elements = {
    // ইউজার ইনফো
    userAvatar: document.getElementById('user-avatar'),
    userName: document.getElementById('user-name'),
    userBalance: document.getElementById('user-balance'),
    
    // হোম পেজ
    totalAds: document.getElementById('total-ads'),
    todayAds: document.getElementById('today-ads'),
    targetAds: document.getElementById('target-ads'),
    progressBar: document.getElementById('progress-bar'),
    watchAdBtn: document.getElementById('watch-ad-btn'),
    adContainer: document.getElementById('ad-container'),
    
    // উইথড্রয় পেজ
    withdrawAmount: document.getElementById('withdraw-amount'),
    withdrawMethod: document.getElementById('withdraw-method'),
    submitWithdraw: document.getElementById('submit-withdraw'),
    
    // রেফারেল পেজ
    referralCode: document.getElementById('referral-code'),
    copyCode: document.getElementById('copy-code'),
    refCount: document.getElementById('ref-count'),
    refEarnings: document.getElementById('ref-earnings'),
    
    // প্রোফাইল পেজ
    profileAvatar: document.getElementById('profile-avatar'),
    profileName: document.getElementById('profile-name'),
    profileUsername: document.getElementById('profile-username'),
    profileId: document.getElementById('profile-id'),
    joinDate: document.getElementById('join-date'),
    userLanguage: document.getElementById('user-language'),
    
    // নেভিগেশন
    navButtons: document.querySelectorAll('.nav-btn'),
    pages: document.querySelectorAll('.page')
};

// অ্যাপ ইনিশিয়ালাইজেশন
function initApp() {
    // টেলিগ্রাম ইউজার ডাটা লোড
    loadTelegramUser();
    
    // UI আপডেট
    updateUI();
    
    // ইভেন্ট লিসেনার সেটআপ
    setupEventListeners();
}

// টেলিগ্রাম ইউজার ডাটা লোড
function loadTelegramUser() {
    const tgUser = Telegram.WebApp.initDataUnsafe.user;
    
    if (tgUser) {
        state.user.id = tgUser.id;
        state.user.firstName = tgUser.first_name || 'User';
        state.user.lastName = tgUser.last_name || '';
        state.user.username = tgUser.username ? `@${tgUser.username}` : null;
        state.user.photoUrl = tgUser.photo_url || state.user.photoUrl;
        state.user.language = tgUser.language_code || 'en';
    } else {
        // ডেমো ডাটা (যদি টেলিগ্রাম থেকে ডাটা না পাওয়া যায়)
        state.user.id = Math.floor(Math.random() * 1000000);
        state.user.username = 'demo_user';
    }
}

// UI আপডেট
function updateUI() {
    // ইউজার ইনফো
    elements.userAvatar.src = state.user.photoUrl;
    elements.userName.textContent = state.user.firstName;
    elements.userBalance.textContent = state.balance.toFixed(2);
    
    // হোম পেজ
    elements.totalAds.textContent = state.totalAds;
    elements.todayAds.textContent = state.todayAds;
    elements.targetAds.textContent = state.targetAds;
    
    // প্রোগ্রেস বার আপডেট
    const progressPercent = (state.todayAds / state.targetAds) * 100;
    elements.progressBar.style.width = `${progressPercent}%`;
    
    // রেফারেল পেজ
    elements.referralCode.value = `REF${state.user.id}`;
    elements.refCount.textContent = state.referrals;
    elements.refEarnings.textContent = state.refEarnings.toFixed(2);
    
    // প্রোফাইল পেজ
    elements.profileAvatar.src = state.user.photoUrl;
    elements.profileName.textContent = state.user.firstName + (state.user.lastName ? ` ${state.user.lastName}` : '');
    elements.profileUsername.textContent = state.user.username || 'No username';
    elements.profileId.textContent = `ID: ${state.user.id}`;
    elements.joinDate.textContent = state.user.joinDate;
    elements.userLanguage.textContent = state.user.language === 'en' ? 'English' : 'Other';
    
    // পেজ ভিজিবিলিটি
    elements.pages.forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(state.currentPage).classList.add('active');
    
    // নেভিগেশন বাটন স্টাইল
    elements.navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === state.currentPage);
    });
}

// ইভেন্ট লিসেনার সেটআপ
function setupEventListeners() {
    // নেভিগেশন বাটন
    elements.navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            state.currentPage = btn.dataset.page;
            updateUI();
        });
    });
    
    // Ad বাটন
    elements.watchAdBtn.addEventListener('click', watchAd);
    
    // উইথড্রয় সাবমিট
    elements.submitWithdraw.addEventListener('click', submitWithdrawal);
    
    // রেফারেল কোড কপি
    elements.copyCode.addEventListener('click', copyReferralCode);
}

// Ad দেখার ফাংশন
function watchAd() {
    elements.watchAdBtn.disabled = true;
    elements.watchAdBtn.classList.remove('pulse');
    elements.watchAdBtn.textContent = 'Ad is playing...';
    
    // ডেমো Ad টাইমার
    setTimeout(() => {
        // ব্যালেন্স আপডেট
        state.balance += 0.01;
        state.totalAds += 1;
        state.todayAds += 1;
        
        // UI আপডেট
        updateUI();
        
        // বাটন রিসেট
        elements.watchAdBtn.disabled = false;
        elements.watchAdBtn.classList.add('pulse');
        elements.watchAdBtn.textContent = '👁️ Watch Ad (+0.01 USDT)';
        
        // নোটিফিকেশন
        Telegram.WebApp.showAlert('You earned 0.01 USDT!');
    }, 3000);
}

// উইথড্রয় সাবমিট
function submitWithdrawal() {
    const amount = parseFloat(elements.withdrawAmount.value);
    
    if (isNaN(amount) {
        Telegram.WebApp.showAlert('Please enter a valid amount');
        return;
    }
    
    if (amount < 10) {
        Telegram.WebApp.showAlert('Minimum withdrawal amount is 10.00 USDT');
        return;
    }
    
    if (amount > state.balance) {
        Telegram.WebApp.showAlert('Insufficient balance');
        return;
    }
    
    const method = elements.withdrawMethod.value;
    
    // উইথড্রয় রিকোয়েস্ট
    Telegram.WebApp.sendData(JSON.stringify({
        action: 'withdraw',
        amount: amount,
        method: method,
        userId: state.user.id
    }));
    
    // ডেমো হিসেবে ব্যালেন্স আপডেট
    state.balance -= amount;
    updateUI();
    
    Telegram.WebApp.showAlert(`Withdrawal request of ${amount.toFixed(2)} USDT has been submitted!`);
}

// রেফারেল কোড কপি
function copyReferralCode() {
    elements.referralCode.select();
    document.execCommand('copy');
    Telegram.WebApp.showAlert('Referral code copied to clipboard!');
}

// অ্যাপ শুরু
initApp();
