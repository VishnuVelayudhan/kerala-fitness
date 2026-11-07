const API_BASE = ''; // Same domain for user site

// Food Databases (Kerala Context) - Kept same
const foodDB = {
    breakfast: {
        veg: [
            { name: "Idli (3 nos) & Sambar", calories: 300, protein: "high-fiber" },
            { name: "Dosa (2 nos) & Coconut Chutney", calories: 350, protein: "moderate" },
            { name: "Puttu (1 cup) & Kadala Curry", calories: 400, protein: "high-protein" },
            { name: "Appam (2 nos) & Veg Stew", calories: 320, protein: "moderate" },
            { name: "Idiyappam (3 nos) & Veg Kurma", calories: 330, protein: "moderate" },
            { name: "Upma (Wheat/Rava) & Banana", calories: 300, protein: "fiber" },
            { name: "Oats Kanjis (Kerala Style)", calories: 250, protein: "fiber" }
        ],
        nonVeg: [
            { name: "Appam & Egg Roast", calories: 400, protein: "high-protein" },
            { name: "Puttu & Fish Curry", calories: 450, protein: "high-protein" },
            { name: "Idiyappam & Chicken Stew", calories: 420, protein: "high-protein" },
            { name: "Bread Omelette (2 eggs)", calories: 350, protein: "high-protein" }
        ]
    },
    lunch: {
        base: [
            { name: "Kerala Red Rice (Matta)", type: "carb" },
            { name: "White Rice", type: "carb" },
            { name: "Chapati", type: "carb" }
        ],
        sides: [
            "Avial (Mixed Veg)", "Thoran (Cabbage/Beans)", "Mezhukkupuratti (Long Beans)",
            "Moru Curry", "Sambar", "Beetroot Pachadi"
        ],
        nonVegSides: [
            "Mathi (Sardine) Fry", "Ayala Curry", "Chicken Roast (Dry)", "Beef Ularthiyathu (Small portion)", "Egg Curry"
        ]
    },
    dinner: {
        veg: [
            { name: "Chapati (2 nos) & Dal Curry", calories: 300 },
            { name: "Wheat Dosa (2 nos) & Chutney", calories: 280 },
            { name: "Kanji & Payar (Moong Dal)", calories: 320 },
            { name: "Fruit Salad & Nuts", calories: 250 }
        ],
        nonVeg: [
            { name: "Chapati & Grilled Fish", calories: 350 },
            { name: "Boiled Eggs (2) & Salad", calories: 200 },
            { name: "Grilled Chicken Salad", calories: 350 }
        ]
    },
    snacks: [
        "Tender Coconut Water", "Buttermilk (Sambharam)", "Nuts (Almonds/Walnuts)",
        "Banana (Robusta)", "Sundal (Chickpea salad)", "Tea/Coffee (No Sugar)"
    ]
};

// Check Auth
// Check Auth
const userData = JSON.parse(localStorage.getItem('fitnessUser'));
if (!userData) {
    window.location.href = 'login.html';
} else {
    // Show Nav
    const mainNav = document.getElementById('main-nav');
    if (mainNav) mainNav.classList.remove('hidden');
}

// DOM Elements
const mainNav = document.getElementById('main-nav');
const homeView = document.getElementById('home-view');
const historyView = document.getElementById('history-view');
const reviewsView = document.getElementById('reviews-view');

const landingSection = document.getElementById('landing-section');
const wizardSection = document.getElementById('wizard-section');
const resultsSection = document.getElementById('results-section');
const form = document.getElementById('fitness-form');
const reviewForm = document.getElementById('review-form');

// Buttons & Steps
const startBtn = document.getElementById('start-btn');
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');

const btnStep1Confirm = document.getElementById('step-1-confirm');
const btnStep2Back = document.getElementById('step-2-back');
const btnStep2Confirm = document.getElementById('step-2-confirm');
const btnStep3Back = document.getElementById('step-3-back');
const resetBtn = document.getElementById('reset-btn');
const logoutBtn = document.getElementById('logout-btn');

// Navigation Logic
document.querySelectorAll('.nav-btn:not(.logout)').forEach(btn => {
    btn.addEventListener('click', () => {
        // Active State
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show View
        const target = btn.dataset.target;
        homeView.classList.add('hidden');
        historyView.classList.add('hidden');
        reviewsView.classList.add('hidden');

        if (target === 'home') {
            homeView.classList.remove('hidden');
        } else if (target === 'history') {
            historyView.classList.remove('hidden');
            fetchHistory();
        } else if (target === 'reviews') {
            reviewsView.classList.remove('hidden');
            fetchReviews();
        }
    });
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('fitnessUser');
    window.location.href = 'login.html';
});

// Wizard Navigation
startBtn.addEventListener('click', () => {
    landingSection.classList.add('hidden');
    wizardSection.classList.remove('hidden');
    step1.classList.remove('hidden');
});

btnStep1Confirm.addEventListener('click', () => {
    if (validateGroup(step1)) {
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
    }
});

btnStep2Back.addEventListener('click', () => {
    step2.classList.add('hidden');
    step1.classList.remove('hidden');
});

btnStep2Confirm.addEventListener('click', () => {
    if (validateGroup(step2)) {
        step2.classList.add('hidden');
        step3.classList.remove('hidden');
    }
});

btnStep3Back.addEventListener('click', () => {
    step3.classList.add('hidden');
    step2.classList.remove('hidden');
});

form.addEventListener('submit', handleFormSubmit);
resetBtn.addEventListener('click', resetApp);
reviewForm.addEventListener('submit', handleReviewSubmit);

// Validation Helper
function validateGroup(groupElement) {
    const inputs = groupElement.querySelectorAll('input, select');
    let isValid = true;
    inputs.forEach(input => {
        if (!input.checkValidity()) {
            input.reportValidity();
            isValid = false;
        }
    });
    return isValid;
}

// Plan Generation & History Save
async function handleFormSubmit(e) {
    e.preventDefault();

    // Gather Data
    const formData = {
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        weight: parseFloat(document.getElementById('weight').value),
        height: parseFloat(document.getElementById('height').value),
        goal: document.getElementById('goal').value,
        speed: document.getElementById('speed').value,
        currentStatus: document.getElementById('current-status').value,
        activity: document.getElementById('activity').value,
        foodPref: document.getElementById('food-pref').value,
        lunchPref: document.getElementById('lunch-pref').value,
    };

    // Calculate
    const bmi = calculateBMI(formData.height, formData.weight);
    const dietPlan = generateDietPlan(formData);
    const tips = generateTips(formData, bmi);

    // Save History
    try {
        await fetch(`${API_BASE}/api/history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: userData.id,
                date: new Date().toLocaleDateString(),
                weight: formData.weight,
                height: formData.height,
                bmi: bmi.value,
                bmiCategory: bmi.category,
                goal: formData.goal
            })
        });
    } catch (err) {
        console.error("Failed to save history", err);
    }

    // Render
    displayResults(bmi, dietPlan, tips, formData);
}

// History API
async function fetchHistory() {
    const list = document.getElementById('history-list');
    const msg = document.getElementById('no-history-msg');

    try {
        const res = await fetch(`${API_BASE}/api/history?userId=${userData.id}`);
        const data = await res.json();

        list.innerHTML = '';
        if (data.length === 0) {
            msg.classList.remove('hidden');
        } else {
            msg.classList.add('hidden');
            data.forEach(item => {
                const row = `
                    <tr>
                        <td>${item.date}</td>
                        <td>${item.weight} kg</td>
                        <td>${item.bmi_value}</td>
                        <td>${item.bmi_category}</td>
                        <td>${item.goal}</td>
                    </tr>
                `;
                list.innerHTML += row;
            });
        }
    } catch (err) {
        console.error("Error fetching history", err);
    }
}

// Helper to escape HTML and prevent Stored XSS
function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, function(tag) {
        const chars = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' };
        return chars[tag] || tag;
    });
}

// Reviews API
async function fetchReviews() {
    const list = document.getElementById('reviews-list');
    try {
        const res = await fetch(`${API_BASE}/api/reviews`);
        const data = await res.json();

        list.innerHTML = data.map(r => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-user">${escapeHTML(r.username)}</span>
                    <span class="review-rating">${'★'.repeat(Math.min(5, Math.max(1, r.rating || 5)))}</span>
                </div>
                <div class="review-comment">${escapeHTML(r.comment)}</div>
                <div class="review-date">${new Date(r.created_at).toLocaleDateString()}</div>
            </div>
        `).join('');
    } catch (err) {
        console.error(err);
    }
}

async function handleReviewSubmit(e) {
    e.preventDefault();
    const ratingEl = document.querySelector('input[name="rating"]:checked');
    const commentEl = document.getElementById('review-comment');

    if (!ratingEl) {
        alert("Please select a rating");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: userData.id,
                username: userData.username,
                rating: parseInt(ratingEl.value),
                comment: commentEl.value
            })
        });

        if (res.ok) {
            alert("Review submitted!");
            reviewForm.reset();
            fetchReviews();
        } else {
            alert("Failed to submit review");
        }
    } catch (err) {
        console.error(err);
    }
}

// ... Keep calculateBMI, generateDietPlan, etc. ...

function calculateBMI(cm, kg) {
    const meters = cm / 100;
    const value = (kg / (meters * meters)).toFixed(1);
    let category = "";
    let color = "";

    if (value < 18.5) { category = "Underweight"; color = "#FF9800"; }
    else if (value < 25) { category = "Normal Weight"; color = "#43A047"; }
    else if (value < 30) { category = "Overweight"; color = "#FB8C00"; }
    else { category = "Obese"; color = "#E53935"; }

    return { value, category, color };
}

function generateDietPlan(data) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const plan = [];

    for (let i = 0; i < 7; i++) {
        plan.push({
            day: days[i],
            meals: getDailyMeals(data, i)
        });
    }
    return plan;
}

function getDailyMeals(data, dayIndex) {
    const { foodPref, goal } = data;
    const isVeg = foodPref === 'veg';

    // Breakfast Selection
    let breakfastOptions = [...foodDB.breakfast.veg];
    if (!isVeg) breakfastOptions = [...breakfastOptions, ...foodDB.breakfast.nonVeg];
    // Filter for fat loss (prefer high protein/fiber)
    if (goal === 'fat-loss') {
        breakfastOptions = breakfastOptions.filter(i => i.calories < 350);
    } // Muscle gain prefers higher protein options usually found in non-veg or specific veg items

    // Randomize
    const breakfast = getRandom(breakfastOptions);

    // Lunch Selection
    let lunch = "";
    const rice = goal === 'fat-loss' ? "1/2 cup Matta Rice" : "1 cup Matta Rice";
    const vegSide = getRandom(foodDB.lunch.sides);

    if (isVeg) {
        lunch = `${rice} + ${vegSide} + Curd/Dal`;
    } else {
        const nvSide = getRandom(foodDB.lunch.nonVegSides);
        lunch = `${rice} + ${vegSide} + ${nvSide}`;
    }

    // Dinner Selection
    let dinnerOptions = [...foodDB.dinner.veg];
    if (!isVeg) dinnerOptions = [...dinnerOptions, ...foodDB.dinner.nonVeg];

    if (goal === 'muscle-gain' || goal === 'weight-gain') {
        // Allow slightly heavier dinners
        dinnerOptions.push({ name: "Chapati (3 nos) & Paneer/Chicken", calories: 450 });
    } else {
        // Fat loss strict
        dinnerOptions = dinnerOptions.filter(i => i.calories < 350);
    }
    const dinner = getRandom(dinnerOptions);

    // Snack
    const snack = getRandom(foodDB.snacks);

    return {
        breakfast: breakfast.name,
        lunch: lunch,
        dinner: dinner.name,
        snack: snack
    };
}

function generateTips(data, bmi) {
    const tips = [];

    // Water intake
    const water = (data.weight * 0.033).toFixed(1);
    tips.push(`Hydrate: Drink at least ${water} - ${(parseFloat(water) + 0.5).toFixed(1)} liters daily.`);

    // Calorie & Goal Tips
    if (data.goal === 'fat-loss') {
        tips.push("Calorie Deficit: Burn more than you eat today.");
        tips.push("Protein Power: Prioritize Fish, Eggs, or Dal.");
        tips.push("Move More: Aim for 8k-10k steps every day.");
        if (bmi.category.includes("Over") || data.currentStatus === 'overweight') tips.push("Cut Oil: Use less coconut oil in Thorans.");
    } else if (data.goal === 'muscle-gain') {
        tips.push("Protein First: Include egg whites or chickpeas in every meal.");
        tips.push("Lift Heavy: Strength train 4-5 times a week.");
        tips.push("Fuel Up: Have a banana or toast pre-workout.");
    } else { // weight gain
        tips.push("Eat Big: Add healthy fats (ghee/coconut oil) to rice.");
        tips.push("Snack Smart: Nuts, dates, and banana shakes.");
        tips.push("Consistency: Don't skip meals; eat every 3-4 hours.");
    }

    if (data.gender === 'female') {
        tips.push("Iron Boost: Add dates and leafy greens to your diet.");
    }

    return tips;
}

function displayResults(bmi, plan, tips, data) {
    // Hide form, show results
    wizardSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // BMI
    const bmiEl = document.getElementById('bmi-display');
    const bmiCatEl = document.getElementById('bmi-category');
    bmiEl.textContent = bmi.value;
    bmiCatEl.textContent = bmi.category;
    bmiCatEl.style.color = bmi.color;

    // Tips
    const tipList = document.getElementById('quick-tips-list');
    tipList.innerHTML = tips.map(t => `<li>${t}</li>`).join('');

    // Diet Grid
    const container = document.getElementById('diet-plan-container');
    container.innerHTML = plan.map(day => `
        <div class="card day-card">
            <div class="day-header">${day.day}</div>
            
            <div class="meal-block">
                <div class="meal-label">Breakfast</div>
                <div class="meal-name">${day.meals.breakfast}</div>
            </div>
            
            <div class="meal-block">
                <div class="meal-label">Lunch</div>
                <div class="meal-name">${day.meals.lunch}</div>
            </div>

            <div class="meal-block">
                <div class="meal-label">Evening Snack</div>
                <div class="meal-name">${day.meals.snack}</div>
            </div>

            <div class="meal-block">
                <div class="meal-label">Dinner</div>
                <div class="meal-name">${day.meals.dinner}</div>
            </div>
        </div>
    `).join('');
}

function resetApp() {
    resultsSection.classList.add('hidden');
    landingSection.classList.remove('hidden');

    // Reset form and steps
    document.getElementById('fitness-form').reset();
    step1.classList.remove('hidden');
    step2.classList.add('hidden');
    step3.classList.add('hidden');
    wizardSection.classList.add('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
