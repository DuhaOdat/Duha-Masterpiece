// دالة لتحميل الجوائز وجلب نقاط المستخدم
document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('jwtToken'); // استرجاع التوكن
    const userId = localStorage.getItem('userId'); // استرجاع userId

    try {
        // جلب نقاط المستخدم من API
        const pointsResponse = await fetch(`https://localhost:44396/api/bloodDonation/GetPatientPointByUserId/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!pointsResponse.ok) {
            throw new Error('Failed to fetch points data.');
        }

        const pointsData = await pointsResponse.json();
        const currentPoints = pointsData.currentPoints;
        console.log('Current Points:', currentPoints);

        // جلب بيانات الجوائز من API
        const rewardsResponse = await fetch('https://localhost:44396/api/bloodDonation/getAllRewards', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!rewardsResponse.ok) {
            throw new Error('Failed to fetch rewards data.');
        }

        const rewards = await rewardsResponse.json();
        console.log('Rewards:', rewards);

        // عرض الجوائز وتفعيل زر المطالبة بناءً على نقاط المستخدم
        displayRewards(rewards, currentPoints);

    } catch (error) {
        console.error(error);
        alert('Failed to load data.');
    }
});

// دالة لعرض الجوائز وتفعيل زر المطالبة بناءً على النقاط
function displayRewards(rewards, currentPoints) {
    const rewardsContainer = document.getElementById('rewardsContainer'); // تحديد العنصر الذي يحتوي على الجوائز

    rewardsContainer.innerHTML = ''; // مسح أي محتوى موجود

    // تكرار عبر كل جائزة وعرضها ديناميكيًا
    rewards.forEach(reward => {
        const rewardElement = document.createElement('div');
        rewardElement.classList.add('col-lg-4', 'col-md-6', 'mb-4');
        
        // تفعيل زر المطالبة إذا كانت النقاط كافية
        const isClaimable = currentPoints >= reward.pointsRequired;
        rewardElement.innerHTML = `
            <div class="card border-0 shadow-sm h-100 card-custom-bg">
                <div class="card-body text-center">
                    <h5 class="card-title">${reward.rewardName}</h5>
                    <p class="card-text">${reward.description}</p>
                    <p class="text-primary">Points Required: ${reward.pointsRequired}</p>
                    <button class="btn btn-success claim-btn" onclick="claimReward(${reward.rewardId}, '${reward.rewardName}')" ${isClaimable ? '' : 'disabled'}>
                        Claim
                    </button>
                </div>
            </div>
        `;
        rewardsContainer.appendChild(rewardElement);
    });
}

// دالة `claimReward` للمطالبة بالجائزة
async function claimReward(rewardId, rewardName) {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('jwtToken');

    try {
        // استدعاء API للمطالبة بالجائزة
        const claimResponse = await fetch(`https://localhost:44396/api/bloodDonation/claimReward`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, rewardId })
        });

        if (!claimResponse.ok) {
            throw new Error('Failed to claim reward.');
        }

        // إظهار رسالة نجاح
        alert(`Congratulations! You have claimed the ${rewardName} reward.`);
        // هنا يمكنك تحديث النقاط وإعادة تحميل الجوائز إذا أردت

    } catch (error) {
        console.error(error);
        alert('Failed to claim reward.');
    }
}
document.addEventListener('DOMContentLoaded', async function () {
    const userId = localStorage.getItem('userId'); // احصل على الـ UserId من localStorage
    const token = localStorage.getItem('jwtToken');

    // Load Patient Points and Donation Requests
    loadPatientPoints(userId, token);
    loadPendingDonationRequests(userId, token);
});

// Load Patient Points
async function loadPatientPoints(userId, token) {
    try {
        const response = await fetch(`https://localhost:44396/api/bloodDonation/GetPatientPointByUserId/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch points data.');
        }

        const data = await response.json();
        console.log(data);

        if (data && data.currentPoints !== undefined && data.totalPoints !== undefined) {
            document.getElementById('currentPoints').innerText = `Your Current Points: ${data.currentPoints} / ${data.totalPoints}`;
            const progressPercentage = (data.currentPoints / data.totalPoints) * 100;
            document.getElementById('progress').style.width = `${progressPercentage}%`;
        } else {
            document.getElementById('currentPoints').innerText = 'Points data is unavailable.';
        }

    } catch (error) {
        console.error(error);
        document.getElementById('currentPoints').innerText = 'Failed to load points data.';
    }
}