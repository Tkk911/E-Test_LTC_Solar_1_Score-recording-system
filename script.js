// ============================================================
// ระบบบันทึกคะแนน ช่างติดตั้งโซลาร์เซลล์ ระดับ 1
// ============================================================

// ============================================================
// IMAGE DATA - ลิงก์รูปภาพจาก Google Drive
// ============================================================
// 🔹 วิธีแปลงลิงก์ Google Drive ให้ใช้กับ <img> ได้:
//    1. ไปที่ไฟล์ใน Google Drive → แชร์ → ตั้งค่า "ผู้ที่มีลิงก์"
//    2. คัดลอกลิงก์: https://drive.google.com/file/d/[FILE_ID]/view
//    3. นำ FILE_ID มาใส่ในลิงก์รูปแบบใดรูปแบบหนึ่งด้านล่าง:
//       - https://drive.google.com/uc?export=view&id=FILE_ID
//       - https://drive.google.com/thumbnail?id=FILE_ID&sz=w800
//       - https://lh3.googleusercontent.com/d/FILE_ID
// ============================================================

const IMAGE_DATA = {
    // รูปแบบที่ 1 - thumbnail (แนะนำ)
    station1: 'https://drive.google.com/thumbnail?id=1XQVOugN74jlBElrgJybKyGn6Vz4MXqxz&sz=w800',
    station2_01: 'https://drive.google.com/thumbnail?id=1LPxB2DqwX-yEP0imxPdm-DLPnlvtKfya&sz=w800',
    station2_02: 'https://drive.google.com/thumbnail?id=1_5OSWZMacozBkij-t_MIdUsPyIs0pnlw&sz=w800'
};

// ============================================================
// DOM Helpers
// ============================================================
const $ = (id) => document.getElementById(id);

function getVal(id) {
    const el = $(id);
    return el ? parseFloat(el.value) || 0 : 0;
}

function setVal(id, val) {
    const el = $(id);
    if (el) el.value = val;
}

function setText(id, val) {
    const el = $(id);
    if (el) el.textContent = val;
}

function sum() {
    let t = 0;
    for (let i = 0; i < arguments.length; i++) t += arguments[i];
    return t;
}

// ============================================================
// Navigation
// ============================================================
function switchPage(page) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === page);
    });
}

// ============================================================
// Theme
// ============================================================
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    localStorage.setItem('theme', theme);
}

function loadTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
}

// ============================================================
// Station 1
// ============================================================
function calculateStation1() {
    const s1_safety = sum(getVal('s1_safety_ppe'), getVal('s1_safety_wear'), getVal('s1_safety_practice'));
    setText('s1_safety_total', s1_safety.toFixed(1));

    const s1_comp = sum(
        getVal('s1_comp_a'), getVal('s1_comp_b'), getVal('s1_comp_c'),
        getVal('s1_hole_a'), getVal('s1_hole_b'), getVal('s1_hole_c'), getVal('s1_hole_d'),
        getVal('s1_holequal_a'), getVal('s1_holequal_b'), getVal('s1_holequal_c'), getVal('s1_holequal_d'),
        getVal('s1_device_a'), getVal('s1_device_b'), getVal('s1_device_c'), getVal('s1_device_d')
    );
    setText('s1_comp_total', s1_comp.toFixed(1));

    const s1_strength = sum(
        getVal('s1_strength_a'), getVal('s1_strength_b'), getVal('s1_strength_c'), getVal('s1_strength_d'),
        getVal('s1_torque_a'), getVal('s1_torque_b'), getVal('s1_torque_c'), getVal('s1_torque_d')
    );
    setText('s1_strength_total', s1_strength.toFixed(1));

    const s1_clean = getVal('s1_clean');
    setText('s1_clean_total', s1_clean.toFixed(1));

    const total = s1_safety + s1_comp + s1_strength + s1_clean;
    setText('s1_grand_total', total.toFixed(1));
    return total;
}

// ============================================================
// Station 2
// ============================================================
function calculateStation2() {
    const s2_safety = sum(getVal('s2_safety_ppe'), getVal('s2_safety_practice'));
    setText('s2_safety_total', s2_safety.toFixed(1));

    const s2_comp = sum(
        getVal('s2_dist_left'), getVal('s2_dist_right'), getVal('s2_dist_top'),
        getVal('s2_dist_bottom'), getVal('s2_dist_d5'),
        getVal('s2_level_top'), getVal('s2_level_bottom'),
        getVal('s2_panel_care'), getVal('s2_device_complete')
    );
    setText('s2_comp_total', s2_comp.toFixed(1));

    const s2_strength = sum(getVal('s2_stability'), getVal('s2_torque'));
    setText('s2_strength_total', s2_strength.toFixed(1));

    const s2_electrical = sum(
        getVal('s2_mc4'), getVal('s2_continuity'), getVal('s2_copper'), getVal('s2_polarity'),
        getVal('s2_wire_panel'), getVal('s2_wire_conduit'), getVal('s2_wire_spec'),
        getVal('s2_dc_ground'), getVal('s2_dc_polarity'), getVal('s2_dc_color'), getVal('s2_dc_strength')
    );
    setText('s2_electrical_total', s2_electrical.toFixed(1));

    const s2_clean = getVal('s2_clean');
    setText('s2_clean_total', s2_clean.toFixed(1));

    const s2_inspect = sum(getVal('s2_inspect_physical'), getVal('s2_inspect_electrical'));
    setText('s2_inspect_total', s2_inspect.toFixed(1));

    const total = s2_safety + s2_comp + s2_strength + s2_electrical + s2_clean + s2_inspect;
    setText('s2_grand_total', total.toFixed(1));
    return total;
}

// ============================================================
// Knowledge
// ============================================================
function calculateKnowledge() {
    const correct = getVal('knowledgeCorrect');
    const maxScore = 50;
    const score = Math.min((correct / 60) * maxScore, maxScore);
    setVal('knowledgeScore', score.toFixed(2));

    const resultDiv = $('knowledgeResult');
    if (correct >= 30) {
        resultDiv.innerHTML =
            `<span class="pass"><i class="fas fa-check-circle"></i> ผ่าน (${correct}/60 ข้อ) สามารถสอบภาคปฏิบัติต่อไปได้</span>`;
    } else if (correct > 0) {
        resultDiv.innerHTML =
            `<span class="fail"><i class="fas fa-times-circle"></i> ไม่ผ่าน (${correct}/60 ข้อ) ไม่สามารถสอบภาคปฏิบัติต่อไปได้</span>`;
    } else {
        resultDiv.innerHTML =
            `<span class="pending"><i class="fas fa-info-circle"></i> กรุณากรอกจำนวนข้อที่ทำได้</span>`;
    }
    return score;
}

// ============================================================
// All
// ============================================================
function calculateAll() {
    const s1 = calculateStation1();
    const s2 = calculateStation2();
    const knowledge = calculateKnowledge();

    const total = s1 + s2 + knowledge;
    const percent = (total / 250) * 100;

    setText('summaryKnowledge', knowledge.toFixed(1));
    setText('summaryKnowledgePercent', ((knowledge * 20) / 50).toFixed(2));
    setText('summaryPractical', (s1 + s2).toFixed(1));
    setText('summaryPracticalPercent', (((s1 + s2) * 80) / 200).toFixed(2));
    setText('summaryTotal', total.toFixed(1));
    setText('summaryPercent', percent.toFixed(2));

    const statusDiv = $('resultStatus');
    const isPass = percent >= 70 && knowledge >= 25;
    if (knowledge > 0 || s1 > 0 || s2 > 0) {
        statusDiv.innerHTML = isPass ?
            `<span class="pass"><i class="fas fa-check-circle"></i> ผ่านเกณฑ์ (${percent.toFixed(1)}%)</span>` :
            `<span class="fail"><i class="fas fa-times-circle"></i> ไม่ผ่านเกณฑ์ (${percent.toFixed(1)}%)</span>`;
    } else {
        statusDiv.innerHTML = `<span class="pending"><i class="fas fa-spinner fa-pulse"></i> กรุณากรอกข้อมูลให้ครบถ้วน</span>`;
    }

    const final = $('finalResult');
    if (knowledge > 0 || s1 > 0 || s2 > 0) {
        final.textContent = isPass ? '✅ ผ่าน' : '❌ ไม่ผ่าน';
        final.className = 'result-value ' + (isPass ? 'pass' : 'fail');
    } else {
        final.textContent = 'รอประเมิน';
        final.className = 'result-value pending';
    }

    return { s1, s2, knowledge, total, percent };
}

// ============================================================
// Sync user info
// ============================================================
function syncUserInfo() {
    const fields = ['candidateName', 'testLocation', 'testDate', 'panelNumber'];
    fields.forEach(f => {
        const val = $(f).value;
        for (let i = 2; i <= 3; i++) {
            const el = $(f + i);
            if (el) el.value = val;
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    ['candidateName', 'testLocation', 'testDate', 'panelNumber'].forEach(id => {
        $(id).addEventListener('input', syncUserInfo);
    });
    for (let i = 2; i <= 3; i++) {
        ['candidateName', 'testLocation', 'testDate', 'panelNumber'].forEach(f => {
            const el = $(f + i);
            if (el) {
                el.addEventListener('input', function() {
                    $(f).value = this.value;
                });
            }
        });
    }
});

// ============================================================
// Save
// ============================================================
function saveData() {
    syncUserInfo();
    const data = {
        candidateName: $('candidateName').value || '',
        testLocation: $('testLocation').value || '',
        testDate: $('testDate').value || '',
        panelNumber: $('panelNumber').value || '',
        s1_safety_ppe: getVal('s1_safety_ppe'),
        s1_safety_wear: getVal('s1_safety_wear'),
        s1_safety_practice: getVal('s1_safety_practice'),
        s1_comp_a: getVal('s1_comp_a'),
        s1_comp_b: getVal('s1_comp_b'),
        s1_comp_c: getVal('s1_comp_c'),
        s1_hole_a: getVal('s1_hole_a'),
        s1_hole_b: getVal('s1_hole_b'),
        s1_hole_c: getVal('s1_hole_c'),
        s1_hole_d: getVal('s1_hole_d'),
        s1_holequal_a: getVal('s1_holequal_a'),
        s1_holequal_b: getVal('s1_holequal_b'),
        s1_holequal_c: getVal('s1_holequal_c'),
        s1_holequal_d: getVal('s1_holequal_d'),
        s1_device_a: getVal('s1_device_a'),
        s1_device_b: getVal('s1_device_b'),
        s1_device_c: getVal('s1_device_c'),
        s1_device_d: getVal('s1_device_d'),
        s1_strength_a: getVal('s1_strength_a'),
        s1_strength_b: getVal('s1_strength_b'),
        s1_strength_c: getVal('s1_strength_c'),
        s1_strength_d: getVal('s1_strength_d'),
        s1_torque_d: getVal('s1_torque_d'),
        s1_clean: getVal('s1_clean'),
        s2_safety_ppe: getVal('s2_safety_ppe'),
        s2_safety_practice: getVal('s2_safety_practice'),
        s2_dist_left: getVal('s2_dist_left'),
        s2_dist_right: getVal('s2_dist_right'),
        s2_dist_top: getVal('s2_dist_top'),
        s2_dist_bottom: getVal('s2_dist_bottom'),
        s2_dist_d5: getVal('s2_dist_d5'),
        s2_level_top: getVal('s2_level_top'),
        s2_level_bottom: getVal('s2_level_bottom'),
        s2_panel_care: getVal('s2_panel_care'),
        s2_device_complete: getVal('s2_device_complete'),
        s2_stability: getVal('s2_stability'),
        s2_torque: getVal('s2_torque'),
        s2_mc4: getVal('s2_mc4'),
        s2_continuity: getVal('s2_continuity'),
        s2_copper: getVal('s2_copper'),
        s2_polarity: getVal('s2_polarity'),
        s2_wire_panel: getVal('s2_wire_panel'),
        s2_wire_conduit: getVal('s2_wire_conduit'),
        s2_wire_spec: getVal('s2_wire_spec'),
        s2_dc_ground: getVal('s2_dc_ground'),
        s2_dc_polarity: getVal('s2_dc_polarity'),
        s2_dc_color: getVal('s2_dc_color'),
        s2_dc_strength: getVal('s2_dc_strength'),
        s2_clean: getVal('s2_clean'),
        s2_inspect_physical: getVal('s2_inspect_physical'),
        s2_inspect_electrical: getVal('s2_inspect_electrical'),
        knowledgeCorrect: getVal('knowledgeCorrect'),
        s1_total: parseFloat($('s1_grand_total').textContent) || 0,
        s2_total: parseFloat($('s2_grand_total').textContent) || 0,
        knowledge_score: parseFloat($('knowledgeScore').value) || 0,
        total: parseFloat($('summaryTotal').textContent) || 0,
        percent: parseFloat($('summaryPercent').textContent) || 0,
    };

    if (!data.candidateName || !data.testLocation) {
        alert('⚠️ กรุณากรอกชื่อ-สกุล และสถานที่ทดสอบ');
        return;
    }

    const GAS_URL =
        'https://script.google.com/macros/s/AKfycbxn5Psa63ILHDuj4BmfSIHG-u82Vk53vqzjpoiWHLkSgH58jqrkKQywEdBIwxNATxSs/exec';

    fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(data),
        })
        .then(() => {
            saveToLocal(data);
            alert('✅ บันทึกข้อมูลสำเร็จ! (ส่งไปยัง Google Sheets และบันทึก Local Storage แล้ว)');
        })
        .catch(() => {
            saveToLocal(data);
            alert('⚠️ ไม่สามารถเชื่อมต่อ Google Sheets ได้ บันทึกไว้ใน Local Storage แทน');
        });
}

function saveToLocal(data) {
    const history = JSON.parse(localStorage.getItem('solarScoreHistory') || '[]');
    history.push({ ...data, timestamp: new Date().toISOString() });
    localStorage.setItem('solarScoreHistory', JSON.stringify(history));
}

// ============================================================
// Load
// ============================================================
function loadData() {
    const history = JSON.parse(localStorage.getItem('solarScoreHistory') || '[]');
    if (history.length === 0) {
        alert('ℹ️ ไม่มีข้อมูลบันทึกใน Local Storage');
        return;
    }
    const last = history[history.length - 1];

    ['candidateName', 'candidateName2', 'candidateName3'].forEach(id => $(id).value = last.candidateName || '');
    ['testLocation', 'testLocation2', 'testLocation3'].forEach(id => $(id).value = last.testLocation || '');
    ['testDate', 'testDate2', 'testDate3'].forEach(id => $(id).value = last.testDate || '');
    ['panelNumber', 'panelNumber2', 'panelNumber3'].forEach(id => $(id).value = last.panelNumber || '');

    const s1Fields = ['s1_safety_ppe', 's1_safety_wear', 's1_safety_practice',
        's1_comp_a', 's1_comp_b', 's1_comp_c',
        's1_hole_a', 's1_hole_b', 's1_hole_c', 's1_hole_d',
        's1_holequal_a', 's1_holequal_b', 's1_holequal_c', 's1_holequal_d',
        's1_device_a', 's1_device_b', 's1_device_c', 's1_device_d',
        's1_strength_a', 's1_strength_b', 's1_strength_c', 's1_strength_d',
        's1_torque_d', 's1_clean'
    ];
    s1Fields.forEach(f => setVal(f, last[f] || 0));

    const s2Fields = ['s2_safety_ppe', 's2_safety_practice',
        's2_dist_left', 's2_dist_right', 's2_dist_top', 's2_dist_bottom', 's2_dist_d5',
        's2_level_top', 's2_level_bottom',
        's2_panel_care', 's2_device_complete',
        's2_stability', 's2_torque',
        's2_mc4', 's2_continuity', 's2_copper', 's2_polarity',
        's2_wire_panel', 's2_wire_conduit', 's2_wire_spec',
        's2_dc_ground', 's2_dc_polarity', 's2_dc_color', 's2_dc_strength',
        's2_clean', 's2_inspect_physical', 's2_inspect_electrical'
    ];
    s2Fields.forEach(f => setVal(f, last[f] || 0));

    setVal('knowledgeCorrect', last.knowledgeCorrect || 0);
    calculateAll();
    alert('✅ โหลดข้อมูลล่าสุดสำเร็จ');
}

// ============================================================
// Clear
// ============================================================
function clearAll() {
    if (!confirm('⚠️ คุณต้องการล้างข้อมูลทั้งหมดใช่หรือไม่?')) return;

    document.querySelectorAll('input[type="number"], input[type="text"], input[type="date"]').forEach(el => {
        if (el.id !== 'knowledgeScore' && !el.id.includes('candidateName') &&
            !el.id.includes('testLocation') && !el.id.includes('testDate') && !el.id.includes('panelNumber')) {
            el.value = '';
        }
    });

    ['candidateName', 'candidateName2', 'candidateName3'].forEach(id => $(id).value = '');
    ['testLocation', 'testLocation2', 'testLocation3'].forEach(id => $(id).value = '');
    ['testDate', 'testDate2', 'testDate3'].forEach(id => $(id).value = '');
    ['panelNumber', 'panelNumber2', 'panelNumber3'].forEach(id => $(id).value = '');

    ['s1_safety_total', 's1_comp_total', 's1_strength_total', 's1_clean_total', 's1_grand_total',
        's2_safety_total', 's2_comp_total', 's2_strength_total', 's2_electrical_total', 's2_clean_total',
        's2_inspect_total', 's2_grand_total',
        'summaryKnowledge', 'summaryKnowledgePercent', 'summaryPractical', 'summaryPracticalPercent',
        'summaryTotal', 'summaryPercent'
    ].forEach(id => setText(id, '0'));

    setVal('knowledgeScore', 0);
    $('knowledgeResult').innerHTML =
        `<span class="pending"><i class="fas fa-info-circle"></i> กรุณากรอกจำนวนข้อที่ทำได้</span>`;
    $('resultStatus').innerHTML =
        `<span class="pending"><i class="fas fa-spinner fa-pulse"></i> กรุณากรอกข้อมูลให้ครบถ้วน</span>`;
    const final = $('finalResult');
    final.textContent = 'รอประเมิน';
    final.className = 'result-value pending';
}

// ============================================================
// Collect All Data
// ============================================================
function collectAllData() {
    syncUserInfo();
    return {
        candidateName: $('candidateName').value || '',
        testLocation: $('testLocation').value || '',
        testDate: $('testDate').value || '',
        panelNumber: $('panelNumber').value || '',
        s1_safety_total: parseFloat($('s1_safety_total').textContent) || 0,
        s1_comp_total: parseFloat($('s1_comp_total').textContent) || 0,
        s1_strength_total: parseFloat($('s1_strength_total').textContent) || 0,
        s1_clean_total: parseFloat($('s1_clean_total').textContent) || 0,
        s1_grand_total: parseFloat($('s1_grand_total').textContent) || 0,
        s2_safety_total: parseFloat($('s2_safety_total').textContent) || 0,
        s2_comp_total: parseFloat($('s2_comp_total').textContent) || 0,
        s2_strength_total: parseFloat($('s2_strength_total').textContent) || 0,
        s2_electrical_total: parseFloat($('s2_electrical_total').textContent) || 0,
        s2_clean_total: parseFloat($('s2_clean_total').textContent) || 0,
        s2_inspect_total: parseFloat($('s2_inspect_total').textContent) || 0,
        s2_grand_total: parseFloat($('s2_grand_total').textContent) || 0,
        knowledgeScore: parseFloat($('knowledgeScore').value) || 0,
        summaryKnowledge: parseFloat($('summaryKnowledge').textContent) || 0,
        summaryPractical: parseFloat($('summaryPractical').textContent) || 0,
        summaryTotal: parseFloat($('summaryTotal').textContent) || 0,
        summaryPercent: parseFloat($('summaryPercent').textContent) || 0,
    };
}

// ============================================================
// Format Date Helpers
// ============================================================
function formatDateTH(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatThaiDateLong(dateStr) {
    if (!dateStr) return 'ครั้งที่ ..........วันที่...........เดือน................................................พ.ศ......................................';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return `ครั้งที่ ..........วันที่...........เดือน................................................พ.ศ......................................`;
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[0], 10) + 543;
    const monthNames = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const monthName = monthNames[month - 1] || '';
    return `ครั้งที่ ….......วันที่… ${day} …เดือน… ${monthName} …พ.ศ.… ${year} …`;
}

// ============================================================
// Excel Styling Helpers
// ============================================================
const EXCEL_STYLES = {
    fontPrompt: { name: 'Prompt', sz: 10 },
    fontPromptBold: { name: 'Prompt', sz: 10, bold: true },
    fontTitle: { name: 'Prompt', sz: 12, bold: true },
    fontBigTitle: { name: 'Prompt', sz: 14, bold: true },
    fontHeader: { name: 'Prompt', sz: 10, bold: true, color: { rgb: 'FFFFFF' } },
    fontAlert: { name: 'Prompt', sz: 10, bold: true, color: { rgb: 'C00000' } },
    
    fillHeader: { fgColor: { rgb: '4472C4' } },
    fillSubHeader: { fgColor: { rgb: 'E7E6E6' } },
    fillScore: { fgColor: { rgb: 'FFF2CC' } },
    fillMaxScore: { fgColor: { rgb: 'E2EFDA' } },
    fillTotal: { fgColor: { rgb: 'FFC000' } },
    fillHighlight: { fgColor: { rgb: 'FFE699' } },
    
    borderThin: {
        top: { style: 'thin', color: { rgb: 'B0B0B0' } },
        bottom: { style: 'thin', color: { rgb: 'B0B0B0' } },
        left: { style: 'thin', color: { rgb: 'B0B0B0' } },
        right: { style: 'thin', color: { rgb: 'B0B0B0' } }
    },
    borderTableHead: {
        top: { style: 'medium', color: { rgb: '2F5597' } },
        bottom: { style: 'medium', color: { rgb: '2F5597' } },
        left: { style: 'thin', color: { rgb: 'B0B0B0' } },
        right: { style: 'thin', color: { rgb: 'B0B0B0' } }
    },
    borderTotal: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'double', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
    },
    
    alignCenter: { horizontal: 'center', vertical: 'center', wrapText: true },
    alignLeft: { horizontal: 'left', vertical: 'center', wrapText: true },
    alignRight: { horizontal: 'right', vertical: 'center', wrapText: true },
    alignTopLeft: { horizontal: 'left', vertical: 'top', wrapText: true }
};

function setStyledCell(ws, r, c, val, opt = {}) {
    const cellRef = XLSX.utils.encode_cell({ r, c });
    const cell = {};
    
    if (typeof val === 'number') {
        cell.v = val;
        cell.t = 'n';
    } else if (val === null || val === undefined) {
        cell.v = '';
        cell.t = 's';
    } else {
        cell.v = String(val);
        cell.t = 's';
    }
    
    if (opt.f) cell.f = opt.f;
    if (opt.z) cell.z = opt.z;
    
    const style = {};
    style.font = opt.font || EXCEL_STYLES.fontPrompt;
    if (opt.fill) style.fill = opt.fill;
    style.alignment = opt.alignment || EXCEL_STYLES.alignCenter;
    if (opt.border !== false) {
        style.border = opt.border || EXCEL_STYLES.borderThin;
    }
    
    cell.s = style;
    ws[cellRef] = cell;
    return cell;
}

function applyGridBorders(ws, maxR, maxC, defaultStyle = {}) {
    for (let r = 0; r <= maxR; r++) {
        for (let c = 0; c <= maxC; c++) {
            const cellRef = XLSX.utils.encode_cell({ r, c });
            if (!ws[cellRef]) {
                ws[cellRef] = {
                    v: '',
                    t: 's',
                    s: {
                        font: defaultStyle.font || EXCEL_STYLES.fontPrompt,
                        alignment: defaultStyle.alignment || EXCEL_STYLES.alignCenter,
                        border: defaultStyle.border || EXCEL_STYLES.borderThin
                    }
                };
            }
        }
    }
}

// ============================================================
// 1. ชีท: ปะหน้าสรุปรวมคะแนน (Summary Sheet)
// ============================================================
function buildSheetSummaryImproved(data) {
    const ws = {};
    const MAX_ROW = 22;
    const MAX_COL = 7;
    
    const knowledgePercent = (data.knowledgeScore * 20) / 50;
    const pracScore = data.s1_grand_total + data.s2_grand_total;
    const pracPercent = (pracScore * 80) / 200;
    const totalScore = data.knowledgeScore + pracScore;
    const totalPercent = (totalScore / 250) * 100;
    const passed = totalPercent >= 70 && data.knowledgeScore >= 25;
    
    const testDateThai = formatThaiDateLong(data.testDate);
    const candidateName = data.candidateName ? `ชื่อ-สกุล  ผู้เข้ารับการทดสอบ… ${data.candidateName} …` : 'ชื่อ-สกุล  ผู้เข้ารับการทดสอบ….............................................................................................';
    const testLocation = data.testLocation ? `สถานที่ทดสอบ… ${data.testLocation} …` : 'สถานที่ทดสอบ….......................................................................................................................';

    // Header 1-4
    setStyledCell(ws, 0, 0, 'ใบให้คะแนนการทดสอบมาตรฐานฝีมือแรงงานแห่งชาติ  สาขาช่างติดตั้งระบบโซลาร์เซลล์  ระดับ 1', {
        font: EXCEL_STYLES.fontBigTitle, alignment: EXCEL_STYLES.alignCenter, border: false
    });
    setStyledCell(ws, 1, 0, testDateThai, {
        font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter, border: false
    });
    setStyledCell(ws, 2, 0, candidateName, {
        font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter, border: false
    });
    setStyledCell(ws, 3, 0, testLocation, {
        font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter, border: false
    });

    // Table Header (Row 6 / Index 5)
    const headers = ['ลำดับ', 'รายละเอียด', 'คะแนนเต็ม', 'เปอร์เซ็นต์', 'คะแนนที่ได้', 'เปอร์เซนต์ที่ได้', 'หมายเหตุ'];
    headers.forEach((h, idx) => {
        setStyledCell(ws, 5, idx + 1, h, {
            font: EXCEL_STYLES.fontHeader, fill: EXCEL_STYLES.fillHeader, alignment: EXCEL_STYLES.alignCenter, border: EXCEL_STYLES.borderTableHead
        });
    });

    // Row 1: ภาคความรู้ (Row 7 / Index 6)
    setStyledCell(ws, 6, 1, '1', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 6, 2, 'ภาคความรู้', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignLeft });
    setStyledCell(ws, 6, 3, 50, { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter, z: '0.00' });
    setStyledCell(ws, 6, 4, 20, { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter, z: '0.00' });
    setStyledCell(ws, 6, 5, data.knowledgeScore, {
        font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.00'
    });
    setStyledCell(ws, 6, 6, knowledgePercent, {
        f: '=(F7*E7)/D7', font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillMaxScore, alignment: EXCEL_STYLES.alignCenter, z: '0.00'
    });
    setStyledCell(ws, 6, 7, '', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });

    // Row 2: ภาคความสามารถ (Row 8 / Index 7)
    setStyledCell(ws, 7, 1, '2', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 7, 2, 'ภาคความสามารถ', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignLeft });
    setStyledCell(ws, 7, 3, 200, { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter, z: '0.00' });
    setStyledCell(ws, 7, 4, 80, { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter, z: '0.00' });
    setStyledCell(ws, 7, 5, pracScore, {
        f: "='สถานีที่ 1 ภาคปฏิบัติ'!W25+'สถานีที่ 2 ภาคปฏิบัติ'!AC36", font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.00'
    });
    setStyledCell(ws, 7, 6, pracPercent, {
        f: '=(F8*E8)/D8', font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillMaxScore, alignment: EXCEL_STYLES.alignCenter, z: '0.00'
    });
    setStyledCell(ws, 7, 7, '', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });

    // Row Total: รวม (Row 9 / Index 8)
    setStyledCell(ws, 8, 1, '', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 8, 2, 'รวม', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 8, 3, 250, { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter, z: '0.00' });
    setStyledCell(ws, 8, 4, 100, { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter, z: '0.00' });
    setStyledCell(ws, 8, 5, totalScore, {
        f: '=SUM(F7:F8)', font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillTotal, alignment: EXCEL_STYLES.alignCenter, border: EXCEL_STYLES.borderTotal, z: '0.00'
    });
    setStyledCell(ws, 8, 6, totalPercent, {
        f: '=(F9*E9)/250', font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillTotal, alignment: EXCEL_STYLES.alignCenter, border: EXCEL_STYLES.borderTotal, z: '0.00'
    });
    setStyledCell(ws, 8, 7, '', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });

    // Note (Row 11 / Index 10)
    setStyledCell(ws, 10, 0, 'หมายเหตุ     เกณฑ์การตัดสินที่ผ่านการทดสอบรวมภาคความรู้และภาคความสามารถต้องไม่น้อยกว่าร้อยละ 70', {
        font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignLeft, border: false
    });

    // Decision Result (Row 14-15 / Index 13-14)
    setStyledCell(ws, 13, 1, 'ผลการทดสอบมาตรฐานฝีมือแรงงาน', {
        font: EXCEL_STYLES.fontTitle, alignment: EXCEL_STYLES.alignLeft, border: false
    });
    setStyledCell(ws, 13, 5, passed ? '[  ✓  ]' : '[     ]', {
        font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter, border: false
    });
    setStyledCell(ws, 13, 6, 'ผ่าน', {
        font: EXCEL_STYLES.fontTitle, alignment: EXCEL_STYLES.alignLeft, border: false
    });

    setStyledCell(ws, 14, 5, !passed ? '[  ✓  ]' : '[     ]', {
        font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter, border: false
    });
    setStyledCell(ws, 14, 6, 'ไม่ผ่าน', {
        font: EXCEL_STYLES.fontTitle, alignment: EXCEL_STYLES.alignLeft, border: false
    });

    // Signatures (Row 18-22 / Index 17-21)
    setStyledCell(ws, 17, 1, 'ลงชื่อ  ผู้ทดสอบมาตรฐานฝีมือแรงงาน', {
        font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignLeft, border: false
    });
    setStyledCell(ws, 17, 5, 'ลงชื่อ  ผู้รวมคะแนน', {
        font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignLeft, border: false
    });

    setStyledCell(ws, 19, 2, '1.…...................................................', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignLeft, border: false });
    setStyledCell(ws, 19, 5, '1.…...................................................', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignLeft, border: false });
    setStyledCell(ws, 20, 2, '2.…...................................................', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignLeft, border: false });
    setStyledCell(ws, 21, 2, '3.…...................................................', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignLeft, border: false });

    // Merges
    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: 7 } },
        { s: { r: 10, c: 0 }, e: { r: 10, c: 7 } },
        { s: { r: 13, c: 1 }, e: { r: 13, c: 4 } },
        { s: { r: 13, c: 6 }, e: { r: 13, c: 7 } },
        { s: { r: 14, c: 6 }, e: { r: 14, c: 7 } },
        { s: { r: 17, c: 1 }, e: { r: 17, c: 3 } },
        { s: { r: 17, c: 5 }, e: { r: 17, c: 7 } },
        { s: { r: 19, c: 2 }, e: { r: 19, c: 3 } },
        { s: { r: 19, c: 5 }, e: { r: 19, c: 7 } },
        { s: { r: 20, c: 2 }, e: { r: 20, c: 3 } },
        { s: { r: 21, c: 2 }, e: { r: 21, c: 3 } }
    ];

    ws['!cols'] = [
        { wch: 4 }, { wch: 8 }, { wch: 22 }, { wch: 14 },
        { wch: 14 }, { wch: 16 }, { wch: 16 }, { wch: 18 }
    ];

    const rowHeights = {};
    for (let i = 0; i <= MAX_ROW; i++) rowHeights[i] = 22;
    rowHeights[0] = 28;
    rowHeights[5] = 26;
    rowHeights[6] = 24;
    rowHeights[7] = 24;
    rowHeights[8] = 26;
    ws['!rows'] = Object.keys(rowHeights).map(i => ({ hpt: rowHeights[i] }));

    ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: MAX_ROW, c: MAX_COL } });
    return ws;
}

// ============================================================
// 2. ชีท: สถานีที่ 1 ภาคปฏิบัติ (Station 1 Sheet)
// ============================================================
function buildSheet1Improved(data) {
    const ws = {};
    const MAX_ROW = 24;
    const MAX_COL = 22;

    const ppe = getVal('s1_safety_ppe'),
        wear = getVal('s1_safety_wear'),
        prac = getVal('s1_safety_practice');
    const compA = getVal('s1_comp_a'),
        compB = getVal('s1_comp_b'),
        compC = getVal('s1_comp_c');
    const holeA = getVal('s1_hole_a'),
        holeB = getVal('s1_hole_b'),
        holeC = getVal('s1_hole_c'),
        holeD = getVal('s1_hole_d');
    const hqA = getVal('s1_holequal_a'),
        hqB = getVal('s1_holequal_b'),
        hqC = getVal('s1_holequal_c'),
        hqD = getVal('s1_holequal_d');
    const devA = getVal('s1_device_a'),
        devB = getVal('s1_device_b'),
        devC = getVal('s1_device_c'),
        devD = getVal('s1_device_d');
    const strA = getVal('s1_strength_a'),
        strB = getVal('s1_strength_b'),
        strC = getVal('s1_strength_c'),
        strD = getVal('s1_strength_d');
    const torD = getVal('s1_torque_d');
    const clean = getVal('s1_clean');

    const s1_safety = ppe + wear + prac;
    const s1_comp = compA + compB + compC + holeA + holeB + holeC + holeD + hqA + hqB + hqC + hqD + devA + devB + devC + devD;
    const s1_strength = strA + strB + strC + strD + torD;
    const s1_total = s1_safety + s1_comp + s1_strength + clean;

    const testDateThai = formatThaiDateLong(data.testDate);
    const candidateName = data.candidateName ? `ชื่อ-สกุล  ผู้เข้ารับการทดสอบ… ${data.candidateName} …` : 'ชื่อ-สกุล  ผู้เข้ารับการทดสอบ….............................................................................................';
    const testLocation = data.testLocation ? `สถานที่ทดสอบ… ${data.testLocation} …` : 'สถานที่ทดสอบ….......................................................................................................................';
    const panelNumber = data.panelNumber ? `หมายเลขแผงทดสอบ… ${data.panelNumber} …` : 'หมายเลขแผงทดสอบ…...................................................................................................................................';

    // Headers 1-4
    setStyledCell(ws, 0, 0, 'ใบให้คะแนนการทดสอบมาตรฐานฝีมือแรงงานแห่งชาติ  สาขาช่างติดตั้งโซลาร์เซลล์  ระดับ 1', {
        font: EXCEL_STYLES.fontTitle, alignment: EXCEL_STYLES.alignCenter, border: false
    });
    setStyledCell(ws, 0, 21, 'สถานีที่ 1', {
        font: EXCEL_STYLES.fontHeader, fill: EXCEL_STYLES.fillHeader, alignment: EXCEL_STYLES.alignCenter, border: EXCEL_STYLES.borderThin
    });
    setStyledCell(ws, 1, 0, testDateThai, { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter, border: false });
    setStyledCell(ws, 2, 0, candidateName, { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter, border: false });
    setStyledCell(ws, 3, 0, testLocation, { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignLeft, border: false });
    setStyledCell(ws, 3, 16, panelNumber, { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignLeft, border: false });

    // Table Header (Row 5 / Index 4)
    setStyledCell(ws, 4, 0, 'ลำดับ', { font: EXCEL_STYLES.fontHeader, fill: EXCEL_STYLES.fillHeader });
    setStyledCell(ws, 4, 1, 'หัวข้อ', { font: EXCEL_STYLES.fontHeader, fill: EXCEL_STYLES.fillHeader });
    setStyledCell(ws, 4, 4, 'ลักษณะการตรวจ  อักษรกำกับสัดส่วนหรือวัสดุ', { font: EXCEL_STYLES.fontHeader, fill: EXCEL_STYLES.fillHeader });
    setStyledCell(ws, 4, 21, 'คะแนนเต็ม', { font: EXCEL_STYLES.fontHeader, fill: EXCEL_STYLES.fillHeader });
    setStyledCell(ws, 4, 22, 'คะแนนที่ได้', { font: EXCEL_STYLES.fontHeader, fill: EXCEL_STYLES.fillHeader });

    // --- ข้อ 1: ความปลอดภัย (Row 6-9 / Index 5-8) ---
    setStyledCell(ws, 5, 0, '1', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 5, 1, 'ความปลอดภัย', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 5, 4, 'การตรวจสอบอุปกรณ์ PPE(2)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 5, 9, 'ใส่ PPE(3)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 5, 13, 'ปฏิบัติงานตามหลักความปลอดภัย (5)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 5, 21, 10, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillMaxScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 5, 22, s1_safety, {
        f: '=F7+J7+N7', font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0'
    });

    // Sub-scores Row 7 (Index 6)
    setStyledCell(ws, 6, 5, ppe, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 6, 9, wear, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 6, 13, prac, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });

    // Criteria Row 8 & 9 (Index 7 & 8)
    setStyledCell(ws, 7, 4, 'ไม่ตรวจสอบอุปกรณ์หัก', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 7, 9, 'ไม่สวมใส่ ใช้ไม่ถูกต้อง', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 7, 13, 'ไม่ปฏิบัติตามหลักความปลอดภัย ผิดครั้งละ 1 คะแนน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 8, 4, 'อุปกรณ์ละ 1 คะแนน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 8, 9, 'ตัดจุดละ 1 คะแนน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });

    // --- ข้อ 2: ความสมบูรณ์ตรงตามแบบ (Row 10-14 / Index 9-13) ---
    setStyledCell(ws, 9, 0, '2', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 9, 1, 'ความสมบูรณ์ตรงตามแบบ', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 9, 4, 'ระยะ d1 =  d3 (15)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 9, 8, 'ขนาดรูเจาะ (10)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 9, 12, 'ความสมบูรณ์ของรูเจาะ(5)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 9, 16, 'อุปกรณ์ครบถ้วน (10)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 9, 21, 40, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillMaxScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 9, 22, s1_comp, {
        f: '=F11+G11+H11+J11+K11+L11+M11+N11+O11+P11+Q11+R11+S11+T11+U11', font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0'
    });

    // Row 11: Sub-scores (Index 10) & Types
    setStyledCell(ws, 10, 1, 'A = แบบที่ 1', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignLeft });
    setStyledCell(ws, 10, 5, compA, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 10, 6, compB, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 10, 7, compC, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 10, 9, holeA, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 10, 10, holeB, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 10, 11, holeC, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 10, 12, holeD, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 10, 13, hqA, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 10, 14, hqB, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 10, 15, hqC, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 10, 16, hqD, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 10, 17, devA, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 10, 18, devB, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 10, 19, devC, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 10, 20, devD, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });

    // Labels row (Row 12 / Index 11)
    setStyledCell(ws, 11, 1, 'B = แบบที่ 2', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignLeft });
    setStyledCell(ws, 11, 5, 'A(5)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 11, 6, 'B(5)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 11, 7, 'C(5)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 11, 9, 'A(3)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 11, 10, 'B(3)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 11, 11, 'C(0)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 11, 12, 'D(4)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 11, 13, 'A(1.5)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 11, 14, 'B(1.5)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 11, 15, 'C(0)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 11, 16, 'D(2)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 11, 17, 'A(2.5)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 11, 18, 'B(2.5)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 11, 19, 'C(2.5)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 11, 20, 'D(2.5)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });

    // Criteria Row 13 & 14 (Index 12 & 13)
    setStyledCell(ws, 12, 1, 'C = แบบที่ 3', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignLeft });
    setStyledCell(ws, 12, 4, '±  3 mm', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 12, 8, 'เลือกดอกสว่านถูกต้อง', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 12, 12, 'แตกร้าว / ไม่แตกร้าว', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 12, 16, 'ใส่อุปกรณ์ครบถ้วนตามแบบ', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });

    setStyledCell(ws, 13, 1, 'D = แบบที่ 4', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignLeft });
    setStyledCell(ws, 13, 4, 'ผิด 1 จุดได้ 0 คะแนน  ต่อชิ้นงาน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 13, 8, 'ผิด 1 จุดได้ 0 คะแนน  ต่อชิ้นงาน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 13, 12, 'ผิด 1 จุดได้ 0 คะแนน  ต่อชิ้นงาน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 13, 16, 'ผิด 1 จุดได้ 0 คะแนน  ต่อชิ้นงาน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });

    // --- ข้อ 3: ความแข็งแรง (Row 15-20 / Index 14-19) ---
    setStyledCell(ws, 14, 0, '3', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 14, 1, 'ความแข็งแรง', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 14, 4, 'ทดสอบความมั่นคง (35)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 14, 12, 'ทดสอบด้วยประแจทอร์ค (35)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 14, 21, 40, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillMaxScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 14, 22, s1_strength, {
        f: '=F16+H16+J16+L16+T16', font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0'
    });

    // Scores Row 16 / Index 15
    setStyledCell(ws, 15, 5, strA, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 15, 7, strB, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 15, 9, strC, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 15, 11, strD, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 15, 13, 0, { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 15, 15, 0, { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 15, 17, 0, { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 15, 19, torD, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });

    // Labels Row 17 / Index 16
    setStyledCell(ws, 16, 5, 'A(10)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 16, 7, 'B(10)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 16, 9, 'C(10)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 16, 11, 'D(5)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 16, 13, 'A(0)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 16, 15, 'B(0)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 16, 17, 'C(0)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 16, 19, 'D(5)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });

    // Criteria Row 19 & 20 (Index 18 & 19)
    setStyledCell(ws, 18, 4, 'มีความมั่นคง', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 19, 4, 'ผิด 1 หักจุดละ 2.5 คะแนน  ต่อชิ้นงาน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 19, 12, 'ผิด  หักจุดละ 5 คะแนน  ต่อชิ้นงาน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });

    // --- ข้อ 4: ความสะอาด (Row 21-24 / Index 20-23) ---
    setStyledCell(ws, 20, 0, '4', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 20, 1, 'ความสะอาด', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 20, 4, 'ความสะอาดบริเวณปฏิบัติงาน (10)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 20, 21, 10, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillMaxScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 20, 22, clean, {
        f: '=F22', font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0'
    });

    setStyledCell(ws, 21, 5, clean, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 22, 4, 'พิจารณารอบบริเวณปฏิบัติงาน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 23, 4, 'ผิดหักจุดละ 2 คะแนน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });

    // --- Total Row (Row 25 / Index 24) ---
    setStyledCell(ws, 24, 0, 'รวม', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignRight });
    setStyledCell(ws, 24, 21, 100, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillTotal, alignment: EXCEL_STYLES.alignCenter, border: EXCEL_STYLES.borderTotal, z: '0.0' });
    setStyledCell(ws, 24, 22, s1_total, {
        f: '=SUM(W6,W10,W15,W21)', font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillTotal, alignment: EXCEL_STYLES.alignCenter, border: EXCEL_STYLES.borderTotal, z: '0.0'
    });

    // Merges
    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 20 } },
        { s: { r: 0, c: 21 }, e: { r: 0, c: 22 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 22 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 22 } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: 15 } },
        { s: { r: 3, c: 16 }, e: { r: 3, c: 22 } },
        { s: { r: 4, c: 4 }, e: { r: 4, c: 20 } },
        
        // Item 1 Merges
        { s: { r: 5, c: 0 }, e: { r: 8, c: 0 } },
        { s: { r: 5, c: 1 }, e: { r: 8, c: 1 } },
        { s: { r: 5, c: 4 }, e: { r: 5, c: 8 } },
        { s: { r: 5, c: 9 }, e: { r: 5, c: 12 } },
        { s: { r: 5, c: 13 }, e: { r: 5, c: 20 } },
        { s: { r: 5, c: 21 }, e: { r: 8, c: 21 } },
        { s: { r: 5, c: 22 }, e: { r: 8, c: 22 } },
        { s: { r: 7, c: 4 }, e: { r: 7, c: 8 } },
        { s: { r: 7, c: 9 }, e: { r: 7, c: 12 } },
        { s: { r: 7, c: 13 }, e: { r: 8, c: 20 } },
        { s: { r: 8, c: 4 }, e: { r: 8, c: 8 } },
        { s: { r: 8, c: 9 }, e: { r: 8, c: 12 } },

        // Item 2 Merges
        { s: { r: 9, c: 0 }, e: { r: 13, c: 0 } },
        { s: { r: 9, c: 4 }, e: { r: 9, c: 7 } },
        { s: { r: 9, c: 8 }, e: { r: 9, c: 11 } },
        { s: { r: 9, c: 12 }, e: { r: 9, c: 15 } },
        { s: { r: 9, c: 16 }, e: { r: 9, c: 20 } },
        { s: { r: 9, c: 21 }, e: { r: 13, c: 21 } },
        { s: { r: 9, c: 22 }, e: { r: 13, c: 22 } },
        { s: { r: 12, c: 4 }, e: { r: 12, c: 7 } },
        { s: { r: 12, c: 8 }, e: { r: 12, c: 11 } },
        { s: { r: 12, c: 12 }, e: { r: 12, c: 15 } },
        { s: { r: 12, c: 16 }, e: { r: 12, c: 20 } },
        { s: { r: 13, c: 4 }, e: { r: 13, c: 7 } },
        { s: { r: 13, c: 8 }, e: { r: 13, c: 11 } },
        { s: { r: 13, c: 12 }, e: { r: 13, c: 15 } },
        { s: { r: 13, c: 16 }, e: { r: 13, c: 20 } },

        // Item 3 Merges
        { s: { r: 14, c: 0 }, e: { r: 19, c: 0 } },
        { s: { r: 14, c: 1 }, e: { r: 19, c: 1 } },
        { s: { r: 14, c: 4 }, e: { r: 14, c: 11 } },
        { s: { r: 14, c: 12 }, e: { r: 14, c: 20 } },
        { s: { r: 14, c: 21 }, e: { r: 19, c: 21 } },
        { s: { r: 14, c: 22 }, e: { r: 19, c: 22 } },
        { s: { r: 18, c: 4 }, e: { r: 18, c: 11 } },
        { s: { r: 19, c: 4 }, e: { r: 19, c: 11 } },
        { s: { r: 19, c: 12 }, e: { r: 19, c: 20 } },

        // Item 4 Merges
        { s: { r: 20, c: 0 }, e: { r: 23, c: 0 } },
        { s: { r: 20, c: 1 }, e: { r: 23, c: 1 } },
        { s: { r: 20, c: 4 }, e: { r: 20, c: 20 } },
        { s: { r: 20, c: 21 }, e: { r: 23, c: 21 } },
        { s: { r: 20, c: 22 }, e: { r: 23, c: 22 } },
        { s: { r: 22, c: 4 }, e: { r: 22, c: 20 } },
        { s: { r: 23, c: 4 }, e: { r: 23, c: 20 } },

        // Total Merge
        { s: { r: 24, c: 0 }, e: { r: 24, c: 20 } }
    ];

    ws['!cols'] = [
        { wch: 6 }, { wch: 22 }, { wch: 3 }, { wch: 3 }, { wch: 24 },
        { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 },
        { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 },
        { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 },
        { wch: 5 }, { wch: 12 }, { wch: 14 }
    ];

    const rowHeights = {};
    for (let i = 0; i <= MAX_ROW; i++) rowHeights[i] = 24;
    rowHeights[0] = 28;
    rowHeights[4] = 26;
    rowHeights[24] = 26;
    ws['!rows'] = Object.keys(rowHeights).map(i => ({ hpt: rowHeights[i] }));

    applyGridBorders(ws, MAX_ROW, MAX_COL);
    ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: MAX_ROW, c: MAX_COL } });
    return ws;
}

// ============================================================
// 3. ชีท: สถานีที่ 2 ภาคปฏิบัติ (Station 2 Sheet)
// ============================================================
function buildSheet2Improved(data) {
    const ws = {};
    const MAX_ROW = 35;
    const MAX_COL = 28;

    const s2_ppe = getVal('s2_safety_ppe'),
        s2_prac = getVal('s2_safety_practice');
    const distL = getVal('s2_dist_left'),
        distR = getVal('s2_dist_right'),
        distT = getVal('s2_dist_top'),
        distB = getVal('s2_dist_bottom'),
        distD5 = getVal('s2_dist_d5');
    const lvlTop = getVal('s2_level_top'),
        lvlBot = getVal('s2_level_bottom'),
        panCare = getVal('s2_panel_care'),
        devComp = getVal('s2_device_complete');
    const stability = getVal('s2_stability'),
        torque = getVal('s2_torque');
    const mc4 = getVal('s2_mc4'),
        cont = getVal('s2_continuity'),
        copper = getVal('s2_copper'),
        polar = getVal('s2_polarity'),
        wPanel = getVal('s2_wire_panel'),
        wCond = getVal('s2_wire_conduit'),
        wSpec = getVal('s2_wire_spec'),
        dcGnd = getVal('s2_dc_ground'),
        dcPol = getVal('s2_dc_polarity'),
        dcCol = getVal('s2_dc_color'),
        dcStr = getVal('s2_dc_strength');
    const clean = getVal('s2_clean'),
        inspPhy = getVal('s2_inspect_physical'),
        inspElec = getVal('s2_inspect_electrical');

    const s2_safety = s2_ppe + s2_prac;
    const s2_comp = distL + distR + distT + distB + distD5 + lvlTop + lvlBot + panCare + devComp;
    const s2_strength = stability + torque;
    const s2_electrical = mc4 + cont + copper + polar + wPanel + wCond + wSpec + dcGnd + dcPol + dcCol + dcStr;
    const s2_inspect = inspPhy + inspElec;
    const s2_total = s2_safety + s2_comp + s2_strength + s2_electrical + clean + s2_inspect;

    const testDateThai = formatThaiDateLong(data.testDate);
    const candidateName = data.candidateName ? `ชื่อ-สกุล  ผู้เข้ารับการทดสอบ… ${data.candidateName} …` : 'ชื่อ-สกุล  ผู้เข้ารับการทดสอบ….............................................................................................................';
    const testLocation = data.testLocation ? `สถานที่ทดสอบ… ${data.testLocation} …` : 'สถานที่ทดสอบ….....................................................................................................................................';
    const panelNumber = data.panelNumber ? `หมายเลขแผงทดสอบ… ${data.panelNumber} …` : 'หมายเลขแผงทดสอบ…...................................................................................................................................';

    // Headers 1-5
    setStyledCell(ws, 0, 0, 'ใบให้คะแนนการทดสอบมาตรฐานฝีมือแรงงานแห่งชาติ  สาขาช่างติดตั้งโซลาร์เซลล์  ระดับ 1', {
        font: EXCEL_STYLES.fontTitle, alignment: EXCEL_STYLES.alignCenter, border: false
    });
    setStyledCell(ws, 0, 27, 'สถานีที่ 2', {
        font: EXCEL_STYLES.fontHeader, fill: EXCEL_STYLES.fillHeader, alignment: EXCEL_STYLES.alignCenter, border: EXCEL_STYLES.borderThin
    });
    setStyledCell(ws, 1, 0, testDateThai, { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter, border: false });
    setStyledCell(ws, 2, 0, candidateName, { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter, border: false });
    setStyledCell(ws, 3, 0, testLocation, { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignLeft, border: false });
    setStyledCell(ws, 3, 16, panelNumber, { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignLeft, border: false });
    setStyledCell(ws, 4, 0, '** หมายเหตุ  หากมีการลัดวงจรที่ระบบไฟฟ้า  หรือสลับขั้วสาย  ไม่ต้องตรวจหัวข้ออื่น (ถือว่าไม่ผ่านการทดสอบ)', {
        font: EXCEL_STYLES.fontAlert, alignment: EXCEL_STYLES.alignLeft, border: false
    });

    // Table Header (Row 6 / Index 5)
    setStyledCell(ws, 5, 0, 'ลำดับ', { font: EXCEL_STYLES.fontHeader, fill: EXCEL_STYLES.fillHeader });
    setStyledCell(ws, 5, 1, 'หัวข้อ', { font: EXCEL_STYLES.fontHeader, fill: EXCEL_STYLES.fillHeader });
    setStyledCell(ws, 5, 4, 'ลักษณะการตรวจ  อักษรกำกับสัดส่วนหรือวัสดุ', { font: EXCEL_STYLES.fontHeader, fill: EXCEL_STYLES.fillHeader });
    setStyledCell(ws, 5, 27, 'คะแนนเต็ม', { font: EXCEL_STYLES.fontHeader, fill: EXCEL_STYLES.fillHeader });
    setStyledCell(ws, 5, 28, 'คะแนนที่ได้', { font: EXCEL_STYLES.fontHeader, fill: EXCEL_STYLES.fillHeader });

    // --- ข้อ 1: ความปลอดภัย (Row 7-10 / Index 6-9) ---
    setStyledCell(ws, 6, 0, '1', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 6, 1, 'ความปลอดภัย', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 6, 4, 'การตรวจสอบและใช้อุปกรณ์ PPE (4)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 6, 17, 'ปฏิบัติงานตามหลักความปลอดภัย (6)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 6, 27, 10, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillMaxScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 6, 28, s2_safety, {
        f: '=F8+R8', font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0'
    });

    // Scores Row 8 / Index 7
    setStyledCell(ws, 7, 5, s2_ppe, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 7, 17, s2_prac, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });

    // Criteria Row 9-10 / Index 8-9
    setStyledCell(ws, 8, 4, 'ใส่อุปกรณ์ไม่ชำรุดและครบถ้วน ผิด  1 จุด หัก 2 คะแนน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 8, 17, 'ปฏิบัติงานโดยคำนึงถึงความปลอดภัยต่อบุคคลและทรัพย์สิน ปฏิบัติงานไม่ปลอดภัย หักครั้งละ 3 คะแนน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });

    // --- ข้อ 2: ความสมบูรณ์ตรงตามแบบ (Row 11-16 / Index 10-15) ---
    setStyledCell(ws, 10, 0, '2', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 10, 1, 'ความสมบูรณ์ตรงตามแบบ', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 10, 4, 'ระยะ  3  จุด (15)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 10, 17, 'ระดับน้ำ (5)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 10, 21, 'การเคลื่อนย้ายรักษาแผง (5)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 10, 24, 'อุปกรณ์ครบถ้วน (10)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 10, 27, 35, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillMaxScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 10, 28, s2_comp, {
        f: '=F13+I13+L13+N13+P13+R13+T13+V13+Y13', font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0'
    });

    // Sub-headers line 2 (Row 12 / Index 11)
    setStyledCell(ws, 11, 4, 'ระยะ d1 =  d3 (6)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 11, 10, 'd5 = d7', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 11, 12, 'd8 = d10', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 11, 14, 'd6 = d9', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 11, 17, 'รางยึดด้านบน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 11, 19, 'รางยึดด้านล่าง', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });

    // Scores Row 13 / Index 12
    setStyledCell(ws, 12, 5, distL, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 12, 8, distR, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 12, 11, distT, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 12, 13, distB, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 12, 15, distD5, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 12, 17, lvlTop, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 12, 19, lvlBot, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 12, 21, panCare, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 12, 24, devComp, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });

    // Labels Row 14 / Index 13
    setStyledCell(ws, 13, 5, 'ด้านซ้าย(3)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 13, 8, 'ด้านขวา(3)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 13, 11, 'ด้านบน(3)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 13, 13, 'ด้านล่าง(3)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 13, 15, '(3)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 13, 17, '(2.5)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 13, 19, '(2.5)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 13, 21, '(5)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 13, 24, '(10)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });

    // Criteria Row 15 & 16 (Index 14 & 15)
    setStyledCell(ws, 14, 4, 'ระยะแตกต่าง  ±  3 mm', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 14, 17, 'ระดับลูกน้ำ', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 14, 21, 'ปฏิบัติโดยไม่ทำให้แผงเสียหาย', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 14, 24, 'ใส่อุปกรณ์ถูกต้องตามแบบ', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });

    setStyledCell(ws, 15, 17, 'เลยขีด ได้ 0 คะแนน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 15, 21, 'หากพบ ให้ 0 คะแนน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 15, 24, 'ผิด 1 จุด หัก 3 คะแนน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });

    // --- ข้อ 3: ความแข็งแรง (Row 17-21 / Index 16-20) ---
    setStyledCell(ws, 16, 0, '3', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 16, 1, 'ความแข็งแรงของโครงสร้างรองรับเซลล์แสงอาทิตย์', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 16, 4, 'ทดสอบความมั่นคงรวมของแผงเซลล์แสงอาทิตย์ (6)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 16, 17, 'ทดสอบด้วยประแจทอร์ค (14)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 16, 27, 20, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillMaxScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 16, 28, s2_strength, {
        f: '=F18+R18', font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0'
    });

    // Scores Row 18 / Index 17
    setStyledCell(ws, 17, 5, stability, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 17, 17, torque, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });

    // Criteria Row 20-21 / Index 19-20
    setStyledCell(ws, 19, 4, 'มีความมั่นคงไม่โยกคลอนในแนวระนาบ (ทดสอบโดยไม่กระชาก)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 19, 17, 'ผิด  หักจุดละ 7 คะแนน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });

    // --- ข้อ 4: ตู้ DC และเดินสายไฟฟ้า (Row 22-28 / Index 21-27) ---
    setStyledCell(ws, 21, 0, '4', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 21, 1, 'การประกอบตู้ DC  และเดินสายไฟฟ้า', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 21, 4, 'การเชื่อมต่อสาย PV  Connector  และแผงโซลาร์เซลล์ (10)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 21, 12, 'การต่อสาย', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 21, 14, 'ระบบท่อเดิน', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 21, 16, 'ติดตั้งภายในตู้ไฟฟ้า DC (5)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 21, 27, 20, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillMaxScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 21, 28, s2_electrical, {
        f: '=F25+H25+J25+L25+N25+P25+R25+T25+V25+X25+Z25', font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0'
    });

    // Sub-headers labels line 1 & 2 (Row 23 & 24 / Index 22 & 23)
    setStyledCell(ws, 22, 4, 'วิธีการเข้าหัวสาย MC4(2.5)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 22, 6, 'ความต่อเนื่อง(2.5)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 22, 8, 'ไม่มีทองแดงโผล่(2.5)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 22, 10, 'ตรวจสอบขั้วไฟฟ้า(2.5)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 22, 12, 'ที่แผง(1)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 22, 14, 'สายไฟฟ้า(4)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 22, 16, 'ความถูกต้องตามแบบ(1)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 22, 18, 'สายดิน(1)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 22, 20, 'ขั้วไฟฟ้า(1)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 22, 22, 'สีของสายไฟ(1)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 22, 24, 'ความแข็งแรง(1)', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });

    // Scores Row 25 / Index 24
    setStyledCell(ws, 24, 5, mc4, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 24, 7, cont, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 24, 9, copper, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 24, 11, polar, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 24, 13, wPanel, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 24, 15, wCond, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 24, 17, wSpec, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 24, 19, dcGnd, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 24, 21, dcPol, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 24, 23, dcCol, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 24, 25, dcStr, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });

    // Criteria Row 27 / Index 26
    setStyledCell(ws, 26, 4, 'ให้เรียกผู้ทดสอบในขณะปฏิบัติงานเพื่อตรวจสอบ องค์ประกอบไม่ครบไม่มั่นคง ได้ 0 คะแนน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 26, 6, 'ทดสอบโดยมัลติมิเตอร์ หากพบว่าไม่ต่อเนื่อง 1 จุด ได้ 0 คะแนน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 26, 8, 'สายทองแดงโผล่เกิน 1mm ได้ 0 คะแนน ต่อจุด', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 26, 10, 'ตรวจสอบขั้วไฟฟ้า หากพบสลับขั้ว ได้ 0 คะแนน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 26, 12, 'ไม่ต่อเนื่อง/ไม่มั่นคง ได้ 0', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 26, 14, 'ท่อไม่เสียรูป มั่นคง ผิดพลาด 1 จุด ได้ 0', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 26, 16, 'เลือกอุปกรณ์ตามแบบ', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 26, 18, 'ต่อสายดินมั่นคง', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 26, 20, 'ไม่สลับขั้ว/ไม่ลัดวงจร', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 26, 22, 'ตรวจสีสายไฟถูกต้อง', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 26, 24, 'ความแข็งแรงจุดต่อ', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });

    // --- ข้อ 5: ความสะอาด (Row 29-32 / Index 28-31) ---
    setStyledCell(ws, 28, 0, '5', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 28, 1, 'ความสะอาด', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 28, 4, 'ความสะอาดบริเวณปฏิบัติงาน (5)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 28, 27, 5, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillMaxScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 28, 28, clean, {
        f: '=F30', font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0'
    });

    setStyledCell(ws, 29, 5, clean, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 30, 4, 'ผิด หักจุดละ 2.5 คะแนน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });

    // --- ข้อ 6: ตรวจสอบและรายงาน (Row 33-35 / Index 32-34) ---
    setStyledCell(ws, 32, 0, '6', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 32, 1, 'การตรวจสอบและรายงาน', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 32, 4, 'ตรวจสอบและบันทึกผลทางกายภาพ  (5)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 32, 17, 'ตรวจสอบความต่อเนื่องทางไฟฟ้า (5)', { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillSubHeader });
    setStyledCell(ws, 32, 27, 10, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillMaxScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 32, 28, s2_inspect, {
        f: '=F34+R34', font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0'
    });

    setStyledCell(ws, 33, 5, inspPhy, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 33, 17, inspElec, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillScore, alignment: EXCEL_STYLES.alignCenter, z: '0.0' });
    setStyledCell(ws, 34, 4, 'พบมีการรายงานผิด 1 จุดได้  0 คะแนน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });
    setStyledCell(ws, 34, 17, 'พบมีการรายงานผิด 1 จุดได้  0 คะแนน', { font: EXCEL_STYLES.fontPrompt, alignment: EXCEL_STYLES.alignCenter });

    // --- Total Row (Row 36 / Index 35) ---
    setStyledCell(ws, 35, 0, 'รวม', { font: EXCEL_STYLES.fontPromptBold, alignment: EXCEL_STYLES.alignRight });
    setStyledCell(ws, 35, 27, 100, { font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillTotal, alignment: EXCEL_STYLES.alignCenter, border: EXCEL_STYLES.borderTotal, z: '0.0' });
    setStyledCell(ws, 35, 28, s2_total, {
        f: '=SUM(AC7,AC11,AC17,AC22,AC29,AC33)', font: EXCEL_STYLES.fontPromptBold, fill: EXCEL_STYLES.fillTotal, alignment: EXCEL_STYLES.alignCenter, border: EXCEL_STYLES.borderTotal, z: '0.0'
    });

    // Merges
    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 26 } },
        { s: { r: 0, c: 27 }, e: { r: 0, c: 28 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 28 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 28 } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: 15 } },
        { s: { r: 3, c: 16 }, e: { r: 3, c: 28 } },
        { s: { r: 4, c: 0 }, e: { r: 4, c: 28 } },
        { s: { r: 5, c: 4 }, e: { r: 5, c: 26 } },

        // Item 1 Merges
        { s: { r: 6, c: 0 }, e: { r: 9, c: 0 } },
        { s: { r: 6, c: 1 }, e: { r: 9, c: 1 } },
        { s: { r: 6, c: 4 }, e: { r: 6, c: 16 } },
        { s: { r: 6, c: 17 }, e: { r: 6, c: 26 } },
        { s: { r: 6, c: 27 }, e: { r: 9, c: 27 } },
        { s: { r: 6, c: 28 }, e: { r: 9, c: 28 } },
        { s: { r: 8, c: 4 }, e: { r: 9, c: 16 } },
        { s: { r: 8, c: 17 }, e: { r: 9, c: 26 } },

        // Item 2 Merges
        { s: { r: 10, c: 0 }, e: { r: 15, c: 0 } },
        { s: { r: 10, c: 1 }, e: { r: 15, c: 1 } },
        { s: { r: 10, c: 4 }, e: { r: 10, c: 16 } },
        { s: { r: 10, c: 17 }, e: { r: 10, c: 20 } },
        { s: { r: 10, c: 21 }, e: { r: 10, c: 23 } },
        { s: { r: 10, c: 24 }, e: { r: 10, c: 26 } },
        { s: { r: 10, c: 27 }, e: { r: 15, c: 27 } },
        { s: { r: 10, c: 28 }, e: { r: 15, c: 28 } },
        { s: { r: 11, c: 4 }, e: { r: 11, c: 9 } },
        { s: { r: 11, c: 10 }, e: { r: 11, c: 11 } },
        { s: { r: 11, c: 12 }, e: { r: 11, c: 13 } },
        { s: { r: 11, c: 14 }, e: { r: 11, c: 15 } },
        { s: { r: 11, c: 17 }, e: { r: 11, c: 18 } },
        { s: { r: 11, c: 19 }, e: { r: 11, c: 20 } },
        { s: { r: 14, c: 4 }, e: { r: 15, c: 16 } },
        { s: { r: 14, c: 17 }, e: { r: 14, c: 20 } },
        { s: { r: 14, c: 21 }, e: { r: 14, c: 23 } },
        { s: { r: 14, c: 24 }, e: { r: 14, c: 26 } },
        { s: { r: 15, c: 17 }, e: { r: 15, c: 20 } },
        { s: { r: 15, c: 21 }, e: { r: 15, c: 23 } },
        { s: { r: 15, c: 24 }, e: { r: 15, c: 26 } },

        // Item 3 Merges
        { s: { r: 16, c: 0 }, e: { r: 20, c: 0 } },
        { s: { r: 16, c: 1 }, e: { r: 20, c: 1 } },
        { s: { r: 16, c: 4 }, e: { r: 16, c: 16 } },
        { s: { r: 16, c: 17 }, e: { r: 16, c: 26 } },
        { s: { r: 16, c: 27 }, e: { r: 20, c: 27 } },
        { s: { r: 16, c: 28 }, e: { r: 20, c: 28 } },
        { s: { r: 19, c: 4 }, e: { r: 20, c: 16 } },
        { s: { r: 19, c: 17 }, e: { r: 20, c: 26 } },

        // Item 4 Merges
        { s: { r: 21, c: 0 }, e: { r: 27, c: 0 } },
        { s: { r: 21, c: 1 }, e: { r: 27, c: 1 } },
        { s: { r: 21, c: 4 }, e: { r: 21, c: 11 } },
        { s: { r: 21, c: 12 }, e: { r: 21, c: 13 } },
        { s: { r: 21, c: 14 }, e: { r: 21, c: 15 } },
        { s: { r: 21, c: 16 }, e: { r: 21, c: 26 } },
        { s: { r: 21, c: 27 }, e: { r: 27, c: 27 } },
        { s: { r: 21, c: 28 }, e: { r: 27, c: 28 } },
        { s: { r: 22, c: 4 }, e: { r: 23, c: 5 } },
        { s: { r: 22, c: 6 }, e: { r: 23, c: 7 } },
        { s: { r: 22, c: 8 }, e: { r: 23, c: 9 } },
        { s: { r: 22, c: 10 }, e: { r: 23, c: 11 } },
        { s: { r: 22, c: 12 }, e: { r: 23, c: 13 } },
        { s: { r: 22, c: 14 }, e: { r: 23, c: 15 } },
        { s: { r: 22, c: 16 }, e: { r: 23, c: 17 } },
        { s: { r: 22, c: 18 }, e: { r: 23, c: 19 } },
        { s: { r: 22, c: 20 }, e: { r: 23, c: 21 } },
        { s: { r: 22, c: 22 }, e: { r: 23, c: 23 } },
        { s: { r: 22, c: 24 }, e: { r: 23, c: 26 } },
        { s: { r: 26, c: 4 }, e: { r: 27, c: 5 } },
        { s: { r: 26, c: 6 }, e: { r: 27, c: 7 } },
        { s: { r: 26, c: 8 }, e: { r: 27, c: 9 } },
        { s: { r: 26, c: 10 }, e: { r: 27, c: 11 } },
        { s: { r: 26, c: 12 }, e: { r: 27, c: 13 } },
        { s: { r: 26, c: 14 }, e: { r: 27, c: 15 } },
        { s: { r: 26, c: 16 }, e: { r: 27, c: 17 } },
        { s: { r: 26, c: 18 }, e: { r: 27, c: 19 } },
        { s: { r: 26, c: 20 }, e: { r: 27, c: 21 } },
        { s: { r: 26, c: 22 }, e: { r: 27, c: 23 } },
        { s: { r: 26, c: 24 }, e: { r: 27, c: 26 } },

        // Item 5 Merges
        { s: { r: 28, c: 0 }, e: { r: 31, c: 0 } },
        { s: { r: 28, c: 1 }, e: { r: 31, c: 1 } },
        { s: { r: 28, c: 4 }, e: { r: 28, c: 26 } },
        { s: { r: 28, c: 27 }, e: { r: 31, c: 27 } },
        { s: { r: 28, c: 28 }, e: { r: 31, c: 28 } },
        { s: { r: 30, c: 4 }, e: { r: 31, c: 26 } },

        // Item 6 Merges
        { s: { r: 32, c: 0 }, e: { r: 34, c: 0 } },
        { s: { r: 32, c: 1 }, e: { r: 34, c: 1 } },
        { s: { r: 32, c: 4 }, e: { r: 32, c: 16 } },
        { s: { r: 32, c: 17 }, e: { r: 32, c: 26 } },
        { s: { r: 32, c: 27 }, e: { r: 34, c: 27 } },
        { s: { r: 32, c: 28 }, e: { r: 34, c: 28 } },
        { s: { r: 34, c: 4 }, e: { r: 34, c: 16 } },
        { s: { r: 34, c: 17 }, e: { r: 34, c: 26 } },

        // Total Merge
        { s: { r: 35, c: 0 }, e: { r: 35, c: 26 } }
    ];

    ws['!cols'] = [
        { wch: 6 }, { wch: 22 }, { wch: 3 }, { wch: 3 }, { wch: 20 },
        { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 },
        { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 },
        { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 },
        { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 },
        { wch: 5 }, { wch: 5 }, { wch: 12 }, { wch: 14 }
    ];

    const rowHeights = {};
    for (let i = 0; i <= MAX_ROW; i++) rowHeights[i] = 24;
    rowHeights[0] = 28;
    rowHeights[4] = 22;
    rowHeights[5] = 26;
    rowHeights[35] = 26;
    ws['!rows'] = Object.keys(rowHeights).map(i => ({ hpt: rowHeights[i] }));

    applyGridBorders(ws, MAX_ROW, MAX_COL);
    ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: MAX_ROW, c: MAX_COL } });
    return ws;
}

// ============================================================
// 4. ชีท: ใบเทียบคะแนนภาคความรู้ (Knowledge Comparison Sheet)
// ============================================================
function buildSheetKnowledgeImproved(data) {
    const ws = {};
    const MAX_ROW = 61;
    const MAX_COL = 4;
    const userCorrect = Math.round(data.knowledgeCorrect || 0);

    setStyledCell(ws, 0, 0, 'ตารางเทียบคะแนนภาคความรู้', {
        font: EXCEL_STYLES.fontBigTitle, alignment: EXCEL_STYLES.alignCenter, border: false
    });

    const kHeaders = [
        'จำนวนข้อสอบ',
        'ข้อที่ทำได้',
        'คะแนนที่ได้ (เต็ม 50 คะแนน)',
        'คิดเป็น 20 เปอร์เซ็นต์ จากคะแนนทั้งหมด',
        'คะแนนไม่น้อยกว่าร้อยละ 50 ของคะแนนภาคความรู้'
    ];
    kHeaders.forEach((h, idx) => {
        setStyledCell(ws, 1, idx, h, {
            font: EXCEL_STYLES.fontHeader, fill: EXCEL_STYLES.fillHeader, alignment: EXCEL_STYLES.alignCenter, border: EXCEL_STYLES.borderTableHead
        });
    });

    for (let i = 1; i <= 60; i++) {
        const rowIdx = i + 1;
        const excelRow = i + 2;
        const isUserScore = (i === userCorrect);
        const isPass = i >= 30;
        const passText = isPass ? 'ผ่าน  สามารถสอบภาคความสามารถต่อไปได้' : 'ไม่ผ่าน  ไม่สามารถสอบภาคความสามารถต่อไปได้';
        
        const rowStyle = {
            font: isUserScore ? EXCEL_STYLES.fontPromptBold : EXCEL_STYLES.fontPrompt,
            fill: isUserScore ? EXCEL_STYLES.fillHighlight : (i % 2 === 0 ? EXCEL_STYLES.fillSubHeader : null),
            border: EXCEL_STYLES.borderThin
        };

        setStyledCell(ws, rowIdx, 0, 60, { ...rowStyle, alignment: EXCEL_STYLES.alignCenter });
        setStyledCell(ws, rowIdx, 1, i, { ...rowStyle, alignment: EXCEL_STYLES.alignCenter });
        setStyledCell(ws, rowIdx, 2, (i / 60) * 50, {
            ...rowStyle, f: `=(B${excelRow}/A${excelRow})*50`, alignment: EXCEL_STYLES.alignCenter, z: '0.00'
        });
        setStyledCell(ws, rowIdx, 3, ((i / 60) * 50 * 20) / 50, {
            ...rowStyle, f: `=(C${excelRow}*20)/50`, alignment: EXCEL_STYLES.alignCenter, z: '0.00'
        });
        setStyledCell(ws, rowIdx, 4, passText, {
            ...rowStyle, alignment: EXCEL_STYLES.alignLeft, font: isPass ? (isUserScore ? EXCEL_STYLES.fontPromptBold : EXCEL_STYLES.fontPrompt) : { name: 'Prompt', sz: 10, color: { rgb: 'A00000' } }
        });
    }

    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }
    ];

    ws['!cols'] = [
        { wch: 14 }, { wch: 14 }, { wch: 28 }, { wch: 34 }, { wch: 45 }
    ];

    const rowHeights = {};
    for (let i = 0; i <= MAX_ROW; i++) rowHeights[i] = 20;
    rowHeights[0] = 28;
    rowHeights[1] = 26;
    ws['!rows'] = Object.keys(rowHeights).map(i => ({ hpt: rowHeights[i] }));

    applyGridBorders(ws, MAX_ROW, MAX_COL);
    ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: MAX_ROW, c: MAX_COL } });
    return ws;
}

// ============================================================
// Export Excel - ฉบับสมบูรณ์ 4 แผ่นงานตามมาตรฐาน
// ============================================================
function exportExcel() {
    try {
        calculateAll();
        syncUserInfo();
        const data = collectAllData();
        data.knowledgeCorrect = getVal('knowledgeCorrect');
        
        const wb = XLSX.utils.book_new();

        const wsSummary = buildSheetSummaryImproved(data);
        const wsStation1 = buildSheet1Improved(data);
        const wsStation2 = buildSheet2Improved(data);
        const wsKnowledge = buildSheetKnowledgeImproved(data);

        XLSX.utils.book_append_sheet(wb, wsSummary, 'ปะหน้าสรุปรวมคะแนน');
        XLSX.utils.book_append_sheet(wb, wsStation1, 'สถานีที่ 1 ภาคปฏิบัติ');
        XLSX.utils.book_append_sheet(wb, wsStation2, 'สถานีที่ 2 ภาคปฏิบัติ');
        XLSX.utils.book_append_sheet(wb, wsKnowledge, 'ใบเทียบคะแนนภาคความรู้');

        const dateStr = data.testDate || new Date().toISOString().slice(0, 10);
        const name = (data.candidateName || 'ไม่ระบุชื่อ').replace(/[\\/:*?"<>|]/g, '_');
        const fileName = `ใบให้คะแนน_โซลาร์เซลล์_ระดับ1_${name}_${dateStr}.xlsx`;
        
        XLSX.writeFile(wb, fileName);
        alert(`✅ Export Excel สำเร็จ!\n📄 ชื่อไฟล์: ${fileName}\n📑 รวม 4 แผ่นงานมาตรฐานเรียบร้อย`);
    } catch (e) {
        alert('❌ Export Excel ไม่สำเร็จ: ' + e.message);
        console.error(e);
    }
}

// ============================================================
// Image Preview - ฟังก์ชันเปิดรูปภาพใน Popup
// ============================================================
function openImagePreview(type) {
    let imageUrl = '';
    let title = '';
    let caption = '';

    switch(type) {
        case 'station1':
            imageUrl = IMAGE_DATA.station1;
            title = '📐 แบบประกอบการให้คะแนน สถานีที่ 1 (ABCD.jpg)';
            caption = 'แบบประกอบการให้คะแนน สถานีที่ 1 - หลังคา (แบบ A, B, C , D)';
            break;
        case 'station2_01':
            imageUrl = IMAGE_DATA.station2_01;
            title = '📐 ภาพประกอบการให้คะแนน สถานีที่ 2 (ติดตั้งแผง 01.jpg)';
            caption = 'การวัดระยะติดตั้งแผงโซลาร์เซลล์ (ภาพที่ 1)';
            break;
        case 'station2_02':
            imageUrl = IMAGE_DATA.station2_02;
            title = '📐 ภาพประกอบการให้คะแนน สถานีที่ 2 (ติดตั้งแผง 02.jpg)';
            caption = 'การวัดระยะติดตั้งแผงโซลาร์เซลล์ (ภาพที่ 2)';
            break;
        default:
            alert('ไม่พบภาพประกอบ');
            return;
    }

    // ตรวจสอบว่ามีลิงก์รูปภาพหรือไม่
    if (!imageUrl || imageUrl === '' || imageUrl.includes('YOUR_FILE_ID')) {
        alert('⚠️ กรุณาเปลี่ยน YOUR_FILE_ID เป็น File ID จริงจาก Google Drive');
        return;
    }

    const modal = document.getElementById('imageModal');
    const img = document.getElementById('modalImage');
    const titleEl = document.getElementById('modalTitle');
    const captionEl = document.getElementById('modalCaption');

    titleEl.innerHTML = `<i class="fas fa-image"></i> ${title}`;
    img.src = imageUrl;
    captionEl.textContent = caption;

    // รีเซ็ตการซูม
    img.classList.remove('zoomed');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ============================================================
// Close Image Preview
// ============================================================
function closeImagePreview(event) {
    if (event && event.target !== event.currentTarget) return;
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================================
// Image Zoom - คลิกที่รูปเพื่อซูม
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const modalImg = document.getElementById('modalImage');
    if (modalImg) {
        modalImg.addEventListener('click', function() {
            this.classList.toggle('zoomed');
        });
    }

    // ปิด Modal ด้วยปุ่ม ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImagePreview();
        }
    });
});

// ============================================================
// Export PDF (print)
// ============================================================
function exportPDF() {
    calculateAll();
    syncUserInfo();
    const data = collectAllData();

    const name = data.candidateName || '';
    const loc = data.testLocation || '';
    const panel = data.panelNumber || '';

    ['print_s1_name', 'print_s2_name', 'print_sum_name'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = name;
    });
    ['print_s1_loc', 'print_s2_loc', 'print_sum_loc'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = loc;
    });
    ['print_s1_panel', 'print_s2_panel'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = panel;
    });

    const s1s2_ids = [
        'print_s1_score1', 'print_s1_score2', 'print_s1_score3', 'print_s1_score4', 'print_s1_total',
        'print_s2_score1', 'print_s2_score2', 'print_s2_score3', 'print_s2_score4', 'print_s2_score5',
        'print_s2_score6', 'print_s2_total'
    ];
    s1s2_ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.fontSize = '20px';
            el.style.fontWeight = 'bold';
            if (el.previousElementSibling) {
                el.previousElementSibling.style.fontSize = '20px';
                el.previousElementSibling.style.fontWeight = 'bold';
            }
        }
    });

    document.querySelectorAll('select').forEach(el => {
        if (el.id) {
            const printEl = document.getElementById('p_' + el.id);
            if (printEl) {
                const max = el.options[el.options.length - 1].value;
                printEl.textContent = `${el.value}/${max}`;
            }
        }
    });

    const lrEl = document.getElementById('p_s2_dist_lr');
    if (lrEl) {
        const leftEl = document.getElementById('s2_dist_left');
        const rightEl = document.getElementById('s2_dist_right');
        const left = parseFloat(leftEl?.value) || 0;
        const right = parseFloat(rightEl?.value) || 0;
        const maxLeft = parseFloat(leftEl?.options[leftEl.options.length - 1].value) || 0;
        const maxRight = parseFloat(rightEl?.options[rightEl.options.length - 1].value) || 0;
        lrEl.textContent = `${left + right}/${maxLeft + maxRight}`;
    }

    if (document.getElementById('print_s1_score1')) document.getElementById('print_s1_score1').textContent = data
        .s1_safety_total;
    if (document.getElementById('print_s1_score2')) document.getElementById('print_s1_score2').textContent = data
        .s1_comp_total;
    if (document.getElementById('print_s1_score3')) document.getElementById('print_s1_score3').textContent = data
        .s1_strength_total;
    if (document.getElementById('print_s1_score4')) document.getElementById('print_s1_score4').textContent = data
        .s1_clean_total;
    if (document.getElementById('print_s1_total')) document.getElementById('print_s1_total').textContent = data
        .s1_grand_total;

    if (document.getElementById('print_s2_score1')) document.getElementById('print_s2_score1').textContent = data
        .s2_safety_total;
    if (document.getElementById('print_s2_score2')) document.getElementById('print_s2_score2').textContent = data
        .s2_comp_total;
    if (document.getElementById('print_s2_score3')) document.getElementById('print_s2_score3').textContent = data
        .s2_strength_total;
    if (document.getElementById('print_s2_score4')) document.getElementById('print_s2_score4').textContent = data
        .s2_electrical_total;
    if (document.getElementById('print_s2_score5')) document.getElementById('print_s2_score5').textContent = data
        .s2_clean_total;
    if (document.getElementById('print_s2_score6')) document.getElementById('print_s2_score6').textContent = data
        .s2_inspect_total;
    if (document.getElementById('print_s2_total')) document.getElementById('print_s2_total').textContent = data
        .s2_grand_total;

    const knowledgePercent = (data.knowledgeScore / 50) * 20 || 0;
    if (document.getElementById('print_sum_know_score')) document.getElementById('print_sum_know_score')
        .textContent = data.knowledgeScore;
    if (document.getElementById('print_sum_know_perc')) document.getElementById('print_sum_know_perc')
        .textContent = knowledgePercent.toFixed(2);

    const pracScore = data.s1_grand_total + data.s2_grand_total;
    if (document.getElementById('print_sum_prac_score')) document.getElementById('print_sum_prac_score')
        .textContent = pracScore;

    const pracPercent = (pracScore / 200) * 80 || 0;
    if (document.getElementById('print_sum_prac_perc')) document.getElementById('print_sum_prac_perc')
        .textContent = pracPercent.toFixed(2);

    const totalPercentStr = (data.summaryPercent || 0).toFixed(2);
    if (document.getElementById('print_sum_total_score')) document.getElementById('print_sum_total_score')
        .textContent = data.summaryTotal;
    if (document.getElementById('print_sum_total_perc')) document.getElementById('print_sum_total_perc')
        .textContent = totalPercentStr;

    const passed = data.summaryPercent >= 70 && data.knowledgeScore >= 25;
    if (document.getElementById('print_sum_pass')) document.getElementById('print_sum_pass').textContent = passed ?
        '✓' : '';
    if (document.getElementById('print_sum_fail')) document.getElementById('print_sum_fail').textContent = !passed ?
        '✓' : '';

    window.print();
}

// ============================================================
// Auto-calculate
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    switchPage('station1');

    document.querySelectorAll('select, input[type="number"]').forEach(el => {
        el.addEventListener('input', function() {
            clearTimeout(this._timer);
            this._timer = setTimeout(calculateAll, 200);
        });
    });

    $('knowledgeCorrect').addEventListener('input', function() {
        clearTimeout(this._timer);
        this._timer = setTimeout(calculateAll, 200);
    });

    document.querySelectorAll('select').forEach(select => {
        if (select.options.length === 1 && select.options[0].value === "0") {
            if (select.parentElement && select.parentElement.tagName === 'SPAN') {
                select.parentElement.style.display = 'none';
            } else {
                select.style.display = 'none';
            }
        }
    });

    calculateAll();
});

document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        saveData();
    }
});

console.log('✅ ระบบบันทึกคะแนน ช่างติดตั้งโซลาร์เซลล์ ระดับ 1 พร้อมใช้งาน');
console.log('📌 เปลี่ยนธีม: setTheme("light" | "dark" | "pastel")');
console.log('📌 รูปภาพจาก Google Drive: เปลี่ยน YOUR_FILE_ID ใน IMAGE_DATA');
console.log('📌 ตัวอย่างลิงก์: https://drive.google.com/uc?export=view&id=YOUR_FILE_ID');
