// --- BILINGUAL DICTIONARY ---
const L = {
    en: {
        warning: "SYNTHETIC DEMONSTRATION DATA ONLY. Not for actual public health use.",
        title: "Trichy Vector Watch",
        subtitle: "Prototype for PHC Dengue Surveillance",
        totalCases: "Total Cases",
        avgVector: "Avg Vector Index",
        highRisk: "High Risk Wards",
        actionsCompleted: "Actions Completed",
        wardMap: "Ward Map",
        priorityList: "Ward Priority List",
        filterAll: "All Wards",
        filterHigh: "High Risk",
        filterMedium: "Medium Risk",
        filterLow: "Low Risk",
        obsForm: "New Observation",
        selectWard: "Ward",
        obsType: "Observation Type",
        optCase: "Dengue Case",
        optBreeding: "Breeding Site",
        optWater: "Standing Water",
        notes: "Notes",
        submit: "Submit",
        charts: "Risk Distribution",
        waterFlag: "Water Flag Alert",
        markActioned: "Mark Actioned",
        actioned: "Actioned"
    },
    ta: {
        warning: "செயற்கை தரவு மட்டுமே. உண்மையான பயன்பாட்டிற்கு அல்ல.",
        title: "திருச்சி வெக்டர் வாட்ச்",
        subtitle: "PHC டெங்கு கண்காணிப்பு முன்மாதிரி",
        totalCases: "மொத்த வழக்குகள்",
        avgVector: "சராசரி வெக்டர் குறியீடு",
        highRisk: "அதிக ஆபத்து வார்டுகள்",
        actionsCompleted: "முடிக்கப்பட்ட செயல்கள்",
        wardMap: "வார்டு வரைபடம்",
        priorityList: "வார்டு முன்னுரிமைப் பட்டியல்",
        filterAll: "அனைத்து வார்டுகள்",
        filterHigh: "அதிக ஆபத்து",
        filterMedium: "நடுத்தர ஆபத்து",
        filterLow: "குறைந்த ஆபத்து",
        obsForm: "புதிய கவனிப்பு",
        selectWard: "வார்டு",
        obsType: "கவனிப்பு வகை",
        optCase: "டெங்கு வழக்கு",
        optBreeding: "இனப்பெருக்க தளம்",
        optWater: "தேங்கிய நீர்",
        notes: "குறிப்புகள்",
        submit: "சமர்ப்பி",
        charts: "ஆபத்து பரவல்",
        waterFlag: "நீர் எச்சரிக்கை",
        markActioned: "செயல்படுத்தப்பட்டது",
        actioned: "முடிந்தது"
    }
};

let currentLang = 'en';
let wardsData = [];
let chartInstance = null;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    initLanguageToggle();
    await loadData();
    renderMap();
    renderDashboard();
    initForm();
    
    document.getElementById('risk-filter').addEventListener('change', renderList);
});

// --- DATA MANAGEMENT ---
async function loadData() {
    // Check LocalStorage first for persistence in prototype
    const stored = localStorage.getItem('trichyWards');
    if (stored) {
        wardsData = JSON.parse(stored);
    } else {
        // Fallback to fetch or generate synthetic if missing
        try {
            const res = await fetch('data/wards.json');
            wardsData = await res.json();
        } catch (e) {
            console.warn("Failed to load wards.json. Generating fallback synthetic data.");
            wardsData = generateFallbackData();
        }
        saveData();
    }
}

function saveData() {
    localStorage.setItem('trichyWards', JSON.stringify(wardsData));
}

function generateFallbackData() {
    const data = [];
    for(let i=1; i<=45; i++) {
        const cases = Math.floor(Math.random() * 15);
        const vectorIndex = Math.floor(Math.random() * 50);
        const riskScore = vectorIndex + (cases * 3);
        data.push({
            id: `W${i}`,
            name: `Ward ${i}`,
            vectorIndex,
            cases,
            riskScore,
            riskLevel: riskScore >= 70 ? 'High' : (riskScore >= 40 ? 'Medium' : 'Low'),
            drivers: ["Water stagnation", "Waste pile"],
            recommendedAction: "Fogging & source reduction",
            actioned: false
        });
    }
    return data;
}

// --- RENDERING ---
function renderDashboard() {
    updateSummary();
    renderList();
    renderChart();
    populateFormSelect();
    renderWaterFlag();
    updateMapColors();
}

function updateSummary() {
    let totalCases = 0, totalVector = 0, highRisk = 0, actions = 0;
    
    wardsData.forEach(w => {
        totalCases += w.cases;
        totalVector += w.vectorIndex;
        if (w.riskLevel === 'High') highRisk++;
        if (w.actioned) actions++;
    });

    document.getElementById('stat-cases').innerText = totalCases;
    document.getElementById('stat-vector').innerText = (totalVector / wardsData.length || 0).toFixed(1);
    document.getElementById('stat-high').innerText = highRisk;
    document.getElementById('stat-actions').innerText = actions;
}

function renderList() {
    const filter = document.getElementById('risk-filter').value;
    const container = document.getElementById('ward-list');
    container.innerHTML = '';

    let filtered = wardsData;
    if (filter !== 'all') {
        filtered = wardsData.filter(w => w.riskLevel === filter);
    }

    filtered.sort((a, b) => b.riskScore - a.riskScore).forEach(w => {
        const div = document.createElement('div');
        div.className = `ward-item ${w.riskLevel}`;
        div.innerHTML = `
            <div class="ward-header">
                <h4>${w.name} (Risk: ${w.riskScore})</h4>
                <button class="btn ${w.actioned ? '' : 'btn-primary'}" onclick="toggleAction('${w.id}')">
                    ${w.actioned ? L[currentLang].actioned : L[currentLang].markActioned}
                </button>
            </div>
            <p>Cases: ${w.cases} | Vector Idx: ${w.vectorIndex}</p>
            <p><small>${w.recommendedAction}</small></p>
        `;
        container.appendChild(div);
    });
}

// --- INTERACTIVITY ---
window.toggleAction = function(id) {
    const ward = wardsData.find(w => w.id === id);
    if (ward) {
        ward.actioned = !ward.actioned;
        saveData();
        renderDashboard();
    }
};

function initForm() {
    const form = document.getElementById('obs-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const wardId = document.getElementById('form-ward').value;
        const type = document.getElementById('form-type').value;
        
        const ward = wardsData.find(w => w.id === wardId);
        if(ward) {
            if(type === 'case') ward.cases += 1;
            else ward.vectorIndex += 5;
            
            ward.riskScore = ward.vectorIndex + (ward.cases * 3);
            ward.riskLevel = ward.riskScore >= 70 ? 'High' : (ward.riskScore >= 40 ? 'Medium' : 'Low');
            ward.actioned = false; // Reset action on new observation
            
            saveData();
            renderDashboard();
            form.reset();
        }
    });
}

function populateFormSelect() {
    const select = document.getElementById('form-ward');
    select.innerHTML = '';
    wardsData.forEach(w => {
        const opt = document.createElement('option');
        opt.value = w.id;
        opt.innerText = w.name;
        select.appendChild(opt);
    });
}

// --- SVG MAP ---
function renderMap() {
    // Generates a responsive stylized grid to represent wards
    let svgHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none">`;
    const cols = 9;
    const rows = 5;
    const w = 100 / cols;
    const h = 100 / rows;
    
    let index = 0;
    for(let r=0; r<rows; r++) {
        for(let c=0; c<cols; c++) {
            if (index >= 45) break; // Prototype limit
            const wardId = `W${index + 1}`;
            svgHTML += `<rect id="map-${wardId}" x="${c*w}" y="${r*h}" width="${w-1}" height="${h-1}" rx="1" class="ward-path" onclick="highlightList('${wardId}')">
                <title>Ward ${index + 1}</title>
            </rect>`;
            index++;
        }
    }
    svgHTML += `</svg>`;
    document.getElementById('map-container').innerHTML = svgHTML;
}

function updateMapColors() {
    wardsData.forEach(w => {
        const el = document.getElementById(`map-${w.id}`);
        if(el) {
            if(w.riskLevel === 'High') el.style.fill = 'var(--risk-high)';
            else if(w.riskLevel === 'Medium') el.style.fill = 'var(--risk-medium)';
            else el.style.fill = 'var(--risk-low)';
        }
    });
}

window.highlightList = function(id) {
    document.getElementById('risk-filter').value = 'all';
    renderList();
    // Scroll to item concept (simplified for proto)
    alert(`Selected: ${id}. Check priority list.`);
};

// --- CHARTS ---
function renderChart() {
    const ctx = document.getElementById('riskChart').getContext('2d');
    
    const counts = { High: 0, Medium: 0, Low: 0 };
    wardsData.forEach(w => counts[w.riskLevel]++);

    if (chartInstance) chartInstance.destroy();
    
    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['High Risk', 'Medium Risk', 'Low Risk'],
            datasets: [{
                data: [counts.High, counts.Medium, counts.Low],
                backgroundColor: ['#cf6679', '#ffb74d', '#81c784'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#fff' } }
            }
        }
    });
}

function renderWaterFlag() {
    document.getElementById('flag-card').innerHTML = `
        <h2 data-i18n="waterFlag">${L[currentLang].waterFlag}</h2>
        <div style="background:#2a2a2a; padding:15px; border-radius:8px; border-left:4px solid #ffcc00;">
            <p><strong>Drain ID:</strong> SYN-DR-402</p>
            <p><strong>Signal:</strong> Temephos Resistance detected (Synthetic)</p>
            <p><strong>Loc:</strong> Ward 12 Area</p>
            <p style="margin-top:10px; color:#bb86fc;"><em>Action: Switch to Bti larvicide</em></p>
        </div>
    `;
}

// --- LANGUAGE TOGGLE ---
function initLanguageToggle() {
    document.getElementById('lang-toggle').addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ta' : 'en';
        document.getElementById('lang-toggle').innerText = currentLang === 'en' ? 'தமிழ்' : 'English';
        applyTranslations();
    });
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (L[currentLang][key]) {
            el.innerText = L[currentLang][key];
        }
    });
    renderDashboard(); // Re-render lists and dynamic elements
}
