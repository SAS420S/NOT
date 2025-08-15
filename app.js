// টেলিগ্রাম ওয়েব অ্যাপ ইনিশিয়ালাইজ
Telegram.WebApp.ready();
Telegram.WebApp.expand();

// DOM এলিমেন্টস
const elements = {
    userName: document.querySelector('.user-name'),
    balanceAmount: document.querySelector('.balance-amount'),
    navButtons: document.querySelectorAll('.nav-btn'),
    views: document.querySelectorAll('.view'),
    watchAdBtn: document.querySelector('.watch-ad-btn'),
    withdrawBtn: document.querySelector('.withdraw-btn'),
    copyBtn: document.querySelector('.copy-btn')
};

// অ্যাপ স্টেট
const state = {
    currentView: 'home-view',
    balance: 1.10,
    totalAds: 193,
    todayAds: 23,
    targetAds: 1000,
    referrals: 5,
    refEarnings: 0.50
};

// ইনিশিয়ালাইজেশন
function initApp() {
    // টেলিগ্রাম ইউজার ডাটা সেট করুন
    const tgUser = Telegram.WebApp.initDataUnsafe.user;
    if (tgUser) {
        elements.userName.textContent = tgUser.first_name || 'User';
        // অন্যান্য ইউজার ডাটা সেট করতে পারেন
    }
    
    // UI আপডেট
    updateUI();
    
    // ইভেন্ট লিসেনারস
    setupEventListeners();
}

// UI আপডেট
function updateUI() {
    // ব্যালেন্স আপডেট
    elements.balanceAmount.textContent = state.balance.toFixed(2);
    
    // প্রোগ্রেস বার আপডেট
    const progressPercent = (state.todayAds / state.targetAds) * 100;
    document.querySelector('.progress-bar').style.width = `${progressPercent}%`;
    
    // সক্রিয় ভিউ সেট
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(state.currentView).classList.add('active');
    
    // সক্রিয় নেভ বাটন সেট
    elements.navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === state.currentView) {
            btn.classList.add('active');
        }
    });
}

// ইভেন্ট লিসেনারস
function setupEventListeners() {
    // নেভিগেশন বাটন
    elements.navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            state.currentView = btn.dataset.view;
            updateUI();
        });
    });
    
    // Ad বাটন
    elements.watchAdBtn.addEventListener('click', () => {
        // Ad দেখানোর লজিক
        elements.watchAdBtn.disabled = true;
        elements.watchAdBtn.textContent = 'Loading Ad...';
        
        // ডেমো Ad টাইমার
        setTimeout(() => {
            // ব্যালেন্স আপডেট
            state.balance += 0.01;
            state.totalAds += 1;
            state.todayAds += 1;
            
            // UI আপডেট
            updateUI();
            elements.watchAdBtn.disabled = false;
            elements.watchAdBtn.textContent = 'Watch Ad';
            
            // নোটিফিকেশন
            Telegram.WebApp.showAlert('You earned 0.01 USDT!');
        }, 2000);
    });
    
    // উইথড্রয় বাটন
    elements.withdrawBtn.addEventListener('click', () => {
        const amount = parseFloat(document.querySelector('.withdraw-amount').value);
        
        if (amount < 10) {
            Telegram.WebApp.showAlert('Minimum withdrawal is 10.00 USDT');
            return;
        }
        
        if (amount > state.balance) {
            Telegram.WebApp.showAlert('Insufficient balance');
            return;
        }
        
        // উইথড্রয় রিকোয়েস্ট
        Telegram.WebApp.sendData(JSON.stringify({
            action: 'withdraw',
            amount: amount,
            currency: 'USDT'
        }));
        
        Telegram.WebApp.showAlert(`Withdrawal request of ${amount.toFixed(2)} USDT has been sent!`);
    });
    
    // কপি বাটন
    elements.copyBtn.addEventListener('click', () => {
        const refCode = document.querySelector('.referral-code');
        refCode.select();
        document.execCommand('copy');
        Telegram.WebApp.showAlert('Referral code copied!');
    });
}

// অ্যাপ শুরু
initApp();
