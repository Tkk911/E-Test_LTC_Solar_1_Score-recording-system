// ============================================================
// ระบบบันทึกคะแนน ช่างติดตั้งโซลาร์เซลล์ ระดับ 1
// ============================================================

// DOM Helpers
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
        resultDiv.innerHTML = `<span class="pass">✅ ผ่าน (${correct}/60 ข้อ) สามารถสอบภาคปฏิบัติต่อไปได้</span>`;
    } else if (correct > 0) {
        resultDiv.innerHTML = `<span class="fail">❌ ไม่ผ่าน (${correct}/60 ข้อ) ไม่สามารถสอบภาคปฏิบัติต่อไปได้</span>`;
    } else {
        resultDiv.innerHTML = `<span class="pending">กรุณากรอกจำนวนข้อที่ทำได้</span>`;
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
            `<span class="pass">✅ ผ่านเกณฑ์ (${percent.toFixed(1)}%)</span>` :
            `<span class="fail">❌ ไม่ผ่านเกณฑ์ (${percent.toFixed(1)}%)</span>`;
    } else {
        statusDiv.innerHTML = `<span class="pending">กรุณากรอกข้อมูลให้ครบถ้วน</span>`;
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

    const GAS_URL = 'https://script.google.com/macros/s/AKfycbwcfuOLUw8irm6E-KR-SDloFiUzoN9PeHlAB9DUL6QaAMeboF6dvmJhikhd6-4d015J/exec';

    // ใช้ no-cors + text/plain เพื่อหลีกเลี่ยงปัญหา CORS Preflight ของ Google Apps Script
    fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(data),
        })
        .then(() => {
            // no-cors ไม่สามารถอ่าน response ได้ แต่ข้อมูลถูกส่งไปแล้ว
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
    $('knowledgeResult').innerHTML = `<span class="pending">กรุณากรอกจำนวนข้อที่ทำได้</span>`;
    $('resultStatus').innerHTML = `<span class="pending">กรุณากรอกข้อมูลให้ครบถ้วน</span>`;
    const final = $('finalResult');
    final.textContent = 'รอประเมิน';
    final.className = 'result-value pending';
}

// ============================================================
// Export Excel
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

function exportExcel() {
    try {
        calculateAll();
        const data = collectAllData();
        const wb = XLSX.utils.book_new();

        const ws1 = XLSX.utils.aoa_to_sheet([
            ['สถานีที่ 1', '', '', '', '', '', '', ''],
            ['ความปลอดภัย', data.s1_safety_total],
            ['ความสมบูรณ์', data.s1_comp_total],
            ['ความแข็งแรง', data.s1_strength_total],
            ['ความสะอาด', data.s1_clean_total],
            ['รวม', data.s1_grand_total]
        ]);
        XLSX.utils.book_append_sheet(wb, ws1, 'สถานีที่ 1');

        const ws2 = XLSX.utils.aoa_to_sheet([
            ['สถานีที่ 2', '', '', '', '', '', '', ''],
            ['ความปลอดภัย', data.s2_safety_total],
            ['ความสมบูรณ์', data.s2_comp_total],
            ['ความแข็งแรง', data.s2_strength_total],
            ['ไฟฟ้า', data.s2_electrical_total],
            ['ความสะอาด', data.s2_clean_total],
            ['ตรวจสอบ', data.s2_inspect_total],
            ['รวม', data.s2_grand_total]
        ]);
        XLSX.utils.book_append_sheet(wb, ws2, 'สถานีที่ 2');

        const ws3 = XLSX.utils.aoa_to_sheet([
            ['สรุปผล', '', '', '', ''],
            ['ภาคความรู้', data.summaryKnowledge],
            ['ภาคปฏิบัติ', data.summaryPractical],
            ['รวม', data.summaryTotal],
            ['ร้อยละ', data.summaryPercent],
            ['ผล', data.summaryPercent >= 70 && data.summaryKnowledge >= 25 ? 'ผ่าน' : 'ไม่ผ่าน']
        ]);
        XLSX.utils.book_append_sheet(wb, ws3, 'สรุปผล');

        const dateStr = new Date().toISOString().slice(0, 10);
        const name = data.candidateName || 'ไม่ระบุชื่อ';
        XLSX.writeFile(wb, `ใบให้คะแนน_${name}_${dateStr}.xlsx`);
        alert('✅ Export Excel สำเร็จ!');
    } catch (e) {
        alert('❌ Export Excel ไม่สำเร็จ: ' + e.message);
    }
}

// ============================================================
// Export PDF (print)
// ============================================================
function exportPDF() {
    calculateAll();
    syncUserInfo();
    const data = collectAllData();

    // Map common info
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

    // Make Station 1 and 2 score columns larger and bolder
    const s1s2_ids = [
        'print_s1_score1', 'print_s1_score2', 'print_s1_score3', 'print_s1_score4', 'print_s1_total',
        'print_s2_score1', 'print_s2_score2', 'print_s2_score3', 'print_s2_score4', 'print_s2_score5', 'print_s2_score6', 'print_s2_total'
    ];
    s1s2_ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.fontSize = '18px';
            el.style.fontWeight = 'bold';
            if (el.previousElementSibling) {
                el.previousElementSibling.style.fontSize = '18px';
                el.previousElementSibling.style.fontWeight = 'bold';
            }
        }
    });

    // Station 1 scores
    if(document.getElementById('print_s1_score1')) document.getElementById('print_s1_score1').textContent = data.s1_safety_total;
    if(document.getElementById('print_s1_score2')) document.getElementById('print_s1_score2').textContent = data.s1_comp_total;
    if(document.getElementById('print_s1_score3')) document.getElementById('print_s1_score3').textContent = data.s1_strength_total;
    if(document.getElementById('print_s1_score4')) document.getElementById('print_s1_score4').textContent = data.s1_clean_total;
    if(document.getElementById('print_s1_total')) document.getElementById('print_s1_total').textContent = data.s1_grand_total;

    // Station 2 scores
    if(document.getElementById('print_s2_score1')) document.getElementById('print_s2_score1').textContent = data.s2_safety_total;
    if(document.getElementById('print_s2_score2')) document.getElementById('print_s2_score2').textContent = data.s2_comp_total;
    if(document.getElementById('print_s2_score3')) document.getElementById('print_s2_score3').textContent = data.s2_strength_total;
    if(document.getElementById('print_s2_score4')) document.getElementById('print_s2_score4').textContent = data.s2_electrical_total;
    if(document.getElementById('print_s2_score5')) document.getElementById('print_s2_score5').textContent = data.s2_clean_total;
    if(document.getElementById('print_s2_score6')) document.getElementById('print_s2_score6').textContent = data.s2_inspect_total;
    if(document.getElementById('print_s2_total')) document.getElementById('print_s2_total').textContent = data.s2_grand_total;

    // Summary scores
    const knowledgePercent = (data.knowledgeScore / 50) * 20 || 0;
    if(document.getElementById('print_sum_know_score')) document.getElementById('print_sum_know_score').textContent = data.knowledgeScore;
    if(document.getElementById('print_sum_know_perc')) document.getElementById('print_sum_know_perc').textContent = knowledgePercent.toFixed(2);
    
    const pracScore = data.s1_grand_total + data.s2_grand_total;
    if(document.getElementById('print_sum_prac_score')) document.getElementById('print_sum_prac_score').textContent = pracScore;
    
    const pracPercent = (pracScore / 200) * 80 || 0;
    if(document.getElementById('print_sum_prac_perc')) document.getElementById('print_sum_prac_perc').textContent = pracPercent.toFixed(2);

    const totalPercentStr = (data.summaryPercent || 0).toFixed(2);
    if(document.getElementById('print_sum_total_score')) document.getElementById('print_sum_total_score').textContent = data.summaryTotal;
    if(document.getElementById('print_sum_total_perc')) document.getElementById('print_sum_total_perc').textContent = totalPercentStr;

    // Pass/Fail
    const passed = data.summaryPercent >= 70 && data.knowledgeScore >= 25;
    if(document.getElementById('print_sum_pass')) document.getElementById('print_sum_pass').textContent = passed ? '✓' : '';
    if(document.getElementById('print_sum_fail')) document.getElementById('print_sum_fail').textContent = !passed ? '✓' : '';

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

    // Hide dropdowns that only have a single "0" option
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

// ============================================================
// Keyboard shortcut
// ============================================================
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        saveData();
    }
});

console.log('✅ ระบบบันทึกคะแนน ช่างติดตั้งโซลาร์เซลล์ ระดับ 1 พร้อมใช้งาน');
console.log('📌 เปลี่ยนธีม: setTheme("light" | "dark" | "pastel")');