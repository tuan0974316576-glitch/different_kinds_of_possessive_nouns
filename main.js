const keyPart1 = "sk-or-v1-";
        const keyPart2 = "99843d0bae6f77f25b0bf50875a3cc23d9556e7e77d73b2a8828e9b690319381"; 
        const OPENROUTER_API_KEY = keyPart1 + keyPart2;

async function checkAnswerWithAI(studentAnswer, questionChinese, ruleDesc, standardAnswer) {
            const prompt = `你是一個專業且寬容的英文老師，正在批改學生的翻譯題。
中文題目：「${questionChinese}」
主要考驗的文法規則：「${ruleDesc}」
其中一個標準答案是：「${standardAnswer}」

學生提交的答案：「${studentAnswer}」

請判斷學生的答案是否可以接受。
判斷標準：
1. 允許合理的同義詞 (例如 guest/customer/client, picture/photo, colour/color 等)。
2. 允許美式/英式拼寫差異。
3. 允許不影響理解的極微小拼字錯誤。
4. 句意必須與中文題目一致 (注意情態動詞的語氣，例如可能 might/may vs 應該 should)。
5. 寬容對待省略句法：如果題目規則是教導「省略寫法」(例如直接加 p.p.、直接加形容詞、介詞)，但學生寫了完整的關係代名詞子句 (例如加上了 who is, which was 等完整結構)，請務必判定為正確 (isCorrect: true)！
6. 只有在文法結構徹底錯誤時 (例如該用 of 卻用錯了 's，或是動詞形態完全用錯)，才判定為錯誤 (isCorrect: false)。

請以 JSON 格式回覆，必須包含以下兩個欄位：
"isCorrect": true 或 false
"explanation": 如果錯了，請用繁體中文簡短解釋錯在哪裡。如果答對了，但學生寫了完整子句而沒有使用簡化寫法，請給予鼓勵，並溫馨補充「這句完全正確！不過其實也可以簡化成...」。只輸出 JSON，不要其他廢話。`;

            try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": window.location.href, 
                        "X-Title": "English Grammar Game"
                    },
                    body: JSON.stringify({
                        "model": "google/gemini-2.5-flash", 
                        "messages": [ {"role": "user", "content": prompt} ]
                    })
                });

                if (!response.ok) throw new Error("API error");
                const data = await response.json();
                let reply = data.choices[0].message.content.trim();
                
                // 清理 AI 可能包含的 Markdown 標籤 (例如 ```json ... ```)
                if (reply.startsWith("```json")) {
                    reply = reply.replace(/^```json/, '').replace(/```$/, '').trim();
                } else if (reply.startsWith("```")) {
                    reply = reply.replace(/^```/, '').replace(/```$/, '').trim();
                }

                const result = JSON.parse(reply);
                return {
                    isCorrect: result.isCorrect === true || result.isCorrect === "true",
                    explanation: result.explanation || ""
                };
            } catch (error) {
                console.error("AI Check failed:", error);
                return { isCorrect: false, explanation: "AI 系統繁忙，請參考標準答案。" };
            }
        }


        // ------------------------------------------------------------------
        // 1. 分類定義與解釋對照表 
        // ------------------------------------------------------------------
const categories = [
            { id: 1, name: "簡單形容詞 / 數字+量詞" },
            { id: 2, name: "有生命的 (人/動物/地方 's)" }, // ROW 1

            { id: 3, name: "有...的 (with)" },
            { id: 4, name: "沒有...的 (without)" }, // ROW 2

            { id: 5, name: "關於...的 (about)" },
            { id: 10, name: "死物的死物 (the...of...)" }, // ROW 3

            { id: 6, name: "主動動詞 / Modal Verb" },
            { id: 9, name: "句子 + 的" }, // ROW 4

            { id: 7, name: "被動動詞 (p.p.)" },
            { id: 8, name: "複合形容詞 (afraid of...等)" }, // ROW 5

            { id: 11, name: "地方 + 的" },
            { id: 12, name: "時間 + 的" } // ROW 6
        ];

function showNotes() {
            document.getElementById('startOverlay').style.display = 'none';
            document.getElementById('notesOverlay').style.display = 'flex';
            
            const notesContent = document.getElementById('notes-content');
            
            // 讀取 notes.js 裡面設定好的排版內容 (grammarNotesHTML)
            if (notesContent.innerHTML.trim() === '') {
                notesContent.innerHTML = grammarNotesHTML;
            }
        }

        function hideNotes() {
            document.getElementById('notesOverlay').style.display = 'none';
            document.getElementById('startOverlay').style.display = 'block';
        }
        
let selectedCategories = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // 預設全選 12 款

        function renderOptions() {
            const container = document.getElementById('optionsContainer');
            if(!container) return; // 避免找不到元素的報錯
            container.innerHTML = '';
            categories.forEach(cat => {
                const isChecked = selectedCategories.includes(cat.id) ? 'checked' : '';
                container.innerHTML += `
                    <label class="option-label">
                        <input type="checkbox" class="option-checkbox" value="${cat.id}" ${isChecked}>
                        ${cat.name}
                    </label>
                `;
            });
        }

        function selectAllOptions(selectAll) {
            const checkboxes = document.querySelectorAll('.option-checkbox');
            checkboxes.forEach(cb => cb.checked = selectAll);
        }

        function startGameSession() {
            // 在按開始遊戲時，即時讀取玩家勾選了哪些
            const checkboxes = document.querySelectorAll('.option-checkbox');
            selectedCategories = [];
            checkboxes.forEach(cb => {
                if (cb.checked) selectedCategories.push(parseInt(cb.value));
            });

            if (selectedCategories.length === 0) {
                alert("請至少選擇一種「的」！");
                return;
            }

            document.getElementById('startOverlay').style.display = 'none';
            document.getElementById('game-area').style.display = 'block';
            initGame(false);
        }

        // 當網頁載入時，立刻在畫面上畫出選項
        window.addEventListener('DOMContentLoaded', () => {
            renderOptions();
        });
const ruleToCategory = {
    15: 1, 3: 1,  // Adjective(15) 和 Numbers(3) 都屬於 Cat 1
    1: 2, 2: 2,   // 's 屬於 Cat 2
    7: 3, 8: 4, 13: 5, 5: 6, 6: 6, 14: 7, 10: 8, 9: 9, 4: 10, 12: 11, 11: 12
};

const ruleExplanations = {
            1: "「的」前面是人稱擁有的物品，使用 's 形式。",
            2: "「的」前面是動物、地方或機構擁有的事物，使用 's 或 of 形式皆可。",
            3: "這屬於「數字+量詞」，數字和量詞之間需加連字號 (-)，且量詞只寫單數 (不加 s)。",
            4: "這屬於「死物的死物」，通常使用 of 連接且兩詞順序調轉；特定詞如 solution/answer 則配 to。",
            5: "後置修飾：包含主動動詞，使用 who/which + 動詞（時態需配合中文）。",
            6: "後置修飾：包含情態動詞modal verb (can/will/should 等)，使用 who/which/that + modal + 動詞。",
            7: "表示「有...的」，擁有某特徵或物品，使用介系詞 with，或 who/which has。",
            8: "表示「沒有...的」，不具有某特徵，使用介系詞 without，或 who/which does not have。",
            9: "後置修飾：直接將「主語+動詞」的句子放在名詞後方，關係代名詞可省略。",
            10: "這屬於「複合形容詞」，當形容詞帶著介詞尾巴時（如 afraid of），必須放在名詞後方。",
            11: "將時間詞後置在名詞後方 (如 in the past, tomorrow)。注意特定時間需配 正確 介詞。",
            12: "將地方副詞 (here/there) 或介詞片語 (on the table) 後置在名詞後方修飾。",
            13: "表示關於的，使用介系詞 about。",
            14: "表示被動動作 (如被寫、被製造)，直接將過去分詞 (p.p.) 放在名詞後方。",
            15: "簡單形容詞：單個單字或連字號形容詞，放在名詞「前方」修飾。"
        };
    

        // ------------------------------------------------------------------
        // 3. 遊戲狀態與 DOM
        // ------------------------------------------------------------------
        let currentQIndex = 0;
        let score = 0;
        let currentQ = null;
        let shuffledQuestions = [];
        let gameHistory = []; 
        let currentPhase = 1; // 1 = 選擇分類, 2 = 寫句子
        
        // Timer
        let timeLeft = 30;
        let timerInterval = null;
        let defaultPhase1Time = 30;
        let defaultPhase2Time = 40;
        
        const dom = {
            gameArea: document.getElementById('game-area'),
            endScreen: document.getElementById('end-screen'),
            qCurrent: document.getElementById('q-current'),
            qTotal: document.getElementById('q-total'),
            timerBar: document.getElementById('timer-bar'),
            timerText: document.getElementById('timer-text'),
            score: document.getElementById('score'),
            chineseDisplay: document.getElementById('chinese-display'),
            categoryGrid: document.getElementById('category-grid'),
            typingArea: document.getElementById('typing-area'),
            englishInput: document.getElementById('english-input'),
            submitSentenceBtn: document.getElementById('submit-sentence-btn'),
            feedbackArea: document.getElementById('feedback-area'),
            nextBtn: document.getElementById('next-btn'),
            backBtn: document.getElementById('back-btn')
        };

        // 音效系統
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        function playTone(freq, type, duration) {
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        }
        function playBeep(freq = 800, dur = 0.1) { playTone(freq, 'sine', dur); }

        const sfx = {
            click: () => playTone(600, 'triangle', 0.05),
            correct: () => { playTone(660, 'square', 0.1); setTimeout(() => playTone(880, 'square', 0.2), 100); },
            wrong: () => playTone(200, 'sawtooth', 0.3),
            win: () => { playTone(440, 'sine', 0.1); setTimeout(() => playTone(554, 'sine', 0.1), 100); setTimeout(() => playTone(659, 'sine', 0.2), 200); },
            countdown: () => playBeep(880, 0.1),
            timeup: () => playTone(150, 'sawtooth', 0.5)
        };

    // ------------------------------------------------------------------
        // ★ 遊戲邏輯 (升級版出題機制)
        // ------------------------------------------------------------------
        function initGame(isRetry = false) {
            currentQIndex = 0;
            score = 0;
            gameHistory = [];
            
            dom.endScreen.style.display = 'none';
            dom.gameArea.style.display = 'block';

            if (!isRetry) {
                let allowedRules = Object.keys(ruleToCategory)
                                         .filter(rule => selectedCategories.includes(ruleToCategory[rule]))
                                         .map(Number);
                
                // 1. 過濾題庫並按規則分類
                let pools = {};
                questionBank.forEach(q => {
                    const qRules = q.rules || [q.rule];
                    // 找出這題符合的規則中，第一個允許的規則作為主要分類
                    const matchedRule = qRules.find(r => allowedRules.includes(r));
                    if (matchedRule) {
                        if (!pools[matchedRule]) pools[matchedRule] = [];
                        pools[matchedRule].push(q);
                    }
                });

                // 2. 打亂每個分類裡的題目
                for (let rule in pools) {
                    pools[rule].sort(() => Math.random() - 0.5);
                }

                // 3. 輪流從每個分類抽一題，確保題型多樣化，直到抽滿 10 題
                let selected = [];
                let poolKeys = Object.keys(pools);
                
                // 計算過濾後總共有多少題
                let totalAvailable = Object.values(pools).reduce((sum, arr) => sum + arr.length, 0);
                const maxQ = Math.min(10, totalAvailable);

                while (selected.length < maxQ && poolKeys.length > 0) {
                    // 隨機打亂池子的順序，這樣每次遊戲優先抽到的題型也會不同
                    poolKeys.sort(() => Math.random() - 0.5);
                    
                    for (let i = poolKeys.length - 1; i >= 0; i--) {
                        if (selected.length >= maxQ) break;
                        
                        let key = poolKeys[i];
                        if (pools[key].length > 0) {
                            selected.push(pools[key].pop());
                        } else {
                            poolKeys.splice(i, 1); // 這個分類的題目抽完了，將它移除
                        }
                    }
                }
                
                // 4. 最後將抽出來的這 10 題徹底打亂順序出題
                shuffledQuestions = selected.sort(() => Math.random() - 0.5);
            } 

            if (shuffledQuestions.length === 0) {
                alert("這幾類剛好沒有對應的題目，請重新選擇！");
                goBackToMenu();
                return;
            }

            dom.qTotal.innerText = shuffledQuestions.length;
            renderCategories();
            loadQuestion();
        }

        function renderCategories() {
            dom.categoryGrid.innerHTML = '';
            categories.forEach(cat => {
                const btn = document.createElement('button');
                btn.className = 'category-btn';
                btn.innerText = cat.name;
                btn.onclick = () => handleCategoryClick(cat.id, cat.name);
                dom.categoryGrid.appendChild(btn);
            });
        }

        function loadQuestion() {
            if (currentQIndex >= shuffledQuestions.length) {
                endGame();
                return;
            }

            currentPhase = 1;
            currentQ = shuffledQuestions[currentQIndex];
            
            dom.qCurrent.innerText = currentQIndex + 1;
            dom.score.innerText = score;
            dom.chineseDisplay.innerText = currentQ.chinese;
            
            // 重置 UI 狀態
            dom.categoryGrid.style.display = 'grid';
            Array.from(dom.categoryGrid.children).forEach(btn => btn.disabled = false);
            dom.typingArea.style.display = 'none';
            dom.englishInput.value = '';
            dom.englishInput.disabled = false;
            
            dom.submitSentenceBtn.style.display = 'block';
            dom.submitSentenceBtn.disabled = false;
            dom.submitSentenceBtn.innerText = "提交句子";
            
            dom.feedbackArea.innerHTML = '';
            dom.nextBtn.style.display = 'none';
            dom.backBtn.style.display = 'inline-block';

            startTimer(defaultPhase1Time);
        }

        function startTimer(seconds) {
            clearInterval(timerInterval);
            timeLeft = seconds; 
            updateTimerUI();
            
            timerInterval = setInterval(() => {
                timeLeft -= 0.1;
                
                if (timeLeft <= 3.0 && timeLeft > 0) {
                    if (Math.abs(timeLeft % 1) < 0.1) sfx.countdown();
                }

                if (timeLeft <= 0) {
                    timeLeft = 0;
                    handleTimeout();
                }
                updateTimerUI();
            }, 100);
        }

        function stopTimer() { clearInterval(timerInterval); }

        function updateTimerUI() {
            dom.timerText.innerText = Math.abs(timeLeft).toFixed(1);
            let totalTime = currentPhase === 1 ? defaultPhase1Time : defaultPhase2Time;
            let pct = (timeLeft / totalTime) * 100;
            dom.timerBar.style.width = `${pct}%`;
            
            if (timeLeft <= 5) dom.timerBar.style.backgroundColor = 'var(--danger-color)';
            else dom.timerBar.style.backgroundColor = 'var(--primary-color)';
        }

       function handleTimeout() {
            stopTimer();
            sfx.timeup();
            
            const qRules = currentQ.rules || [currentQ.rule];
            const correctCatNames = qRules.map(r => categories.find(c => c.id === ruleToCategory[r]).name).join(" 或 ");
            const correctAnsStr = currentQ.correct_tokens[0].join(' ');
            
            if (currentPhase === 1) {
                Array.from(dom.categoryGrid.children).forEach(btn => btn.disabled = true);
                showFeedback(false, `⏰ 時間到！<br>正確分類: <strong>${correctCatNames}</strong><br>標準句子: <strong>${correctAnsStr}</strong>`);
                recordHistory(false, "Timeout", false, "Timeout", false);
                showNextBtn();
            } else {
                dom.submitSentenceBtn.style.display = 'none';
                dom.englishInput.disabled = true;
                showFeedback(false, `⏰ 時間到！<br>標準句子: <strong>${correctAnsStr}</strong>`);
                let finalCatName = currentQ.selectedRule ? categories.find(c => c.id === ruleToCategory[currentQ.selectedRule]).name : correctCatNames;
                recordHistory(true, finalCatName, false, "Timeout", false);
                showNextBtn();
            }
        }

        // --- 階段一：判斷分類 ---
function handleCategoryClick(selectedId, selectedName) {
            sfx.click();
            stopTimer();
            Array.from(dom.categoryGrid.children).forEach(btn => btn.disabled = true);

            const qRules = currentQ.rules || [currentQ.rule];
            const correctCatIds = qRules.map(r => ruleToCategory[r]);
            const correctCatNames = correctCatIds.map(id => categories.find(c => c.id === id).name).join(" 或 ");
            const correctAnsStr = currentQ.correct_tokens[0].join(' '); 

            if (correctCatIds.includes(selectedId)) {
                // 答對了 (只要選中其中一個合法的就算對)
                currentQ.selectedRule = qRules.find(r => ruleToCategory[r] === selectedId); 
                score += 5;
                dom.score.innerText = score;
                sfx.correct();
                
                dom.categoryGrid.style.display = 'none';
                dom.typingArea.style.display = 'flex';
                dom.englishInput.focus();
                dom.backBtn.style.display = 'none';
                
                currentPhase = 2;
                startTimer(defaultPhase2Time); 
            } else {
                // 答錯了，把所有可能的解釋都列出來
                sfx.wrong();
                const explanation = qRules.map(r => `<strong>[${categories.find(c => c.id === ruleToCategory[r]).name}]</strong>: ${ruleExplanations[r]}`).join("<br>");
                
                let msg = `❌ 選擇錯誤！<br>
                           正確分類可以是：<strong>${correctCatNames}</strong><br>
                           <div class="explanation-hint" style="text-align:left;">💡 解釋：<br>${explanation}</div><br>
                           標準句子參考：<strong>${correctAnsStr}</strong>`;
                showFeedback(false, msg);
                recordHistory(false, selectedName, false, "(未進入)", false);
                showNextBtn();
            }
        }

        function formatTextForComparison(text) {
            return text.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.,!?;]*$/, '');
        }

        // --- 階段二：檢查輸入的句子 (整合 AI) ---
async function checkSentence() {
            if (dom.submitSentenceBtn.disabled) return;
            
            sfx.click();
            stopTimer();

            const userTyping = dom.englishInput.value;
            const formattedUserInput = formatTextForComparison(userTyping);
            
            const correctAnswers = currentQ.correct_tokens.map(arr => arr.join(' '));
            const formattedCorrectAnswers = correctAnswers.map(formatTextForComparison);
            
            let isMatch = formattedCorrectAnswers.includes(formattedUserInput);
            let usedAI = false;
            let aiExplanation = ""; 
            
            dom.submitSentenceBtn.disabled = true;
            dom.englishInput.disabled = true;

            // 🌟 核心：根據玩家在第一階段選擇的分類，來決定傳給 AI 的文法規則要求！
            let appliedRule = currentQ.selectedRule || (currentQ.rules ? currentQ.rules[0] : currentQ.rule);
            let correctCatId = ruleToCategory[appliedRule];
            let correctCatName = categories.find(c => c.id === correctCatId).name;
            let ruleDesc = ruleExplanations[appliedRule];

            if (!isMatch && formattedUserInput !== "") {
                usedAI = true;
                dom.submitSentenceBtn.innerText = "🤖 AI 判斷中...";
                const aiResult = await checkAnswerWithAI(userTyping, currentQ.chinese, ruleDesc, correctAnswers[0]);
                isMatch = aiResult.isCorrect;
                aiExplanation = aiResult.explanation;
            }
            
            dom.submitSentenceBtn.style.display = 'none';

            if (isMatch) {
                score += 5; 
                dom.score.innerText = score;
                let msg = usedAI ? "🎉 完美！AI 認可了你的同義詞/寫法！" : "🎉 完美！分類與句子完全正確！";
                let badge = usedAI ? `<span class="ai-badge">AI 判定</span>` : "";
                
                showFeedback(true, msg + badge);
                sfx.correct();
                recordHistory(true, correctCatName, true, userTyping, usedAI, aiExplanation);
            } else {
                let badge = usedAI ? `<span class="ai-badge">AI 判定</span>` : "";
                let explanationHtml = aiExplanation ? `<br><div style="color:#d35400; font-size:15px; margin-top:8px; text-align:left; background:#fff3cd; padding:8px; border-radius:6px; border:1px solid #ffeeba;">🤖 <strong>AI 點評：</strong>${aiExplanation}</div>` : "";
                
                showFeedback(false, `❌ 句子有誤！${badge}<br>標準寫法: <strong>${correctAnswers[0]}</strong>${explanationHtml}`);
                sfx.wrong();
                recordHistory(true, correctCatName, false, userTyping, usedAI, aiExplanation);
            }
            
            showNextBtn();
        }

        // 紀錄錯題與歷史
      function recordHistory(isCatCorrect, userCatName, isSentenceCorrect, userSentence, usedAI, aiExplanation = "") {
            const qRules = currentQ.rules || [currentQ.rule];
            let correctCatNames = qRules.map(r => categories.find(c => c.id === ruleToCategory[r]).name).join(" 或 ");
            let correctSentence = currentQ.correct_tokens[0].join(' ');
            let isCompletelyCorrect = isCatCorrect && isSentenceCorrect;
            
            // 組合所有的解釋以供結算畫面顯示
            let explanation = qRules.map(r => `[${categories.find(c => c.id === ruleToCategory[r]).name}] ${ruleExplanations[r]}`).join("<br>");

            gameHistory.push({
                originalObj: currentQ, 
                questionText: currentQ.chinese,
                isCorrect: isCompletelyCorrect,
                isCatCorrect: isCatCorrect,
                correctCatName: correctCatNames, // 顯示所有可能的正確答案
                userCatName: userCatName,
                isSentenceCorrect: isSentenceCorrect,
                correctSentence: correctSentence,
                userSentence: userSentence,
                usedAI: usedAI,
                aiExplanation: aiExplanation,
                explanation: explanation
            });
        }
        function showFeedback(isSuccess, msg) {
            let colorClass = isSuccess ? 'text-correct' : 'text-wrong';
            dom.feedbackArea.innerHTML = `<div class="feedback-text ${colorClass}">${msg}</div>`;
        }

        function showNextBtn() {
            dom.nextBtn.style.display = 'block';
            dom.backBtn.style.display = 'none';
        }

        function nextQuestion() {
            sfx.click();
            currentQIndex++;
            loadQuestion();
        }

        function retryWrongQuestions() {
            const wrongQuestions = gameHistory.filter(h => !h.isCorrect).map(h => h.originalObj);
            if (wrongQuestions.length === 0) {
                alert("沒有錯題可以重做！");
                return;
            }
            shuffledQuestions = wrongQuestions;
            initGame(true);
        }

        function endGame() {
            stopTimer();
            dom.gameArea.style.display = 'none';
            dom.endScreen.style.display = 'block';
            sfx.win();

            const totalQ = shuffledQuestions.length;
            const percentage = Math.round((score / (totalQ * 10)) * 100); 

            const wrongAnswers = gameHistory.filter(h => !h.isCorrect);
            let analysisHTML = '';
            
            if (wrongAnswers.length > 0) {
                analysisHTML = `
                    <div class="error-analysis">
                        <h3 style="color:var(--danger-color)">錯誤複習 (${wrongAnswers.length} 題):</h3>
                        ${wrongAnswers.map(item => `
                            <div class="error-item">
                                <div style="margin-bottom:8px; font-weight:bold; color:#333;">題目: ${item.questionText}</div>
                                ${!item.isCatCorrect 
                                    ? `<div style="color:var(--danger-color)">❌ <strong>分類錯誤:</strong> 你選了 ${item.userCatName} (正確為 ${item.correctCatName})</div>`
                                    : `<div style="color:var(--success-color)">✅ <strong>分類正確:</strong> ${item.correctCatName}</div>`
                                }
                                ${!item.isSentenceCorrect && item.isCatCorrect
                                    ? `<div style="color:var(--danger-color)">❌ <strong>句子錯誤:</strong> ${item.userSentence} ${item.usedAI ? '<span class="ai-badge">AI 判定</span>' : ''}</div><div style="color:var(--primary-dark)"><strong>標準答案:</strong> ${item.correctSentence}</div>` + (item.aiExplanation ? `<div style="color:#d35400; margin-top:6px; font-size: 0.9em; background:#fff3cd; padding:6px; border-radius:4px;">🤖 <strong>AI 點評:</strong> ${item.aiExplanation}</div>` : "")
                                    : (!item.isCatCorrect ? `<div style="color:var(--primary-dark)"><strong>正確句子:</strong> ${item.correctSentence}</div>` : "")
                                }
                                <div style="font-size:0.9em; color:#666; margin-top:5px; padding-top:5px; border-top:1px dashed #ccc;">💡 <strong>相關規則：</strong>${item.explanation}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                analysisHTML = `<h3 style="color:var(--secondary-dark); margin-top:30px;">完美！全對！🎉</h3>`;
            }

            const retryBtnStyle = wrongAnswers.length > 0 ? "display:inline-block;" : "display:none;";

            dom.endScreen.innerHTML = `
                <div class="end-game-container">
                    <h1>Challenge Complete!</h1>
                    <div class="final-score">總得分: ${score} / ${totalQ * 10} (${percentage}%)</div>
                    ${analysisHTML}
                    <div class="result-controls">
                        <button class="result-btn btn-menu" onclick="goBackToMenu()">返回選單</button>
                        <button class="result-btn btn-retry-wrong" style="${retryBtnStyle}" onclick="retryWrongQuestions()">重做錯題</button>
                        <button class="result-btn btn-restart" onclick="initGame()">再來一次</button>
                    </div>
                </div>
            `;
        }

        dom.submitSentenceBtn.addEventListener('click', checkSentence);
        dom.englishInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && currentPhase === 2 && !dom.englishInput.disabled && !dom.submitSentenceBtn.disabled) {
                if (dom.englishInput.value.trim() === '') {
                    alert("請輸入英文句子！");
                    return;
                }
                checkSentence();
            }
        });
        
function goBackToMenu() {
            // 現在改為退回主選單，而不是離開頁面
            stopTimer();
            dom.gameArea.style.display = 'none';
            dom.endScreen.style.display = 'none';
            document.getElementById('startOverlay').style.display = 'block';
            renderOptions(); // 返回時重新顯示一下選項
        }
