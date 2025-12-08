// ゲームの状態管理
let currentQuestion = null;
let correctCount = 0;
let totalCount = 0;
let answered = false;
const MAX_QUESTIONS = 10;
let usedQuestions = [];
let selectedSport = null; // 選択されたスポーツ

// DOM要素
const sportNameEl = document.getElementById('sport-name');
const actionNameEl = document.getElementById('action-name');
const actionExplanationEl = document.getElementById('action-explanation');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const explanationEl = document.getElementById('explanation');
const nextBtn = document.getElementById('next-btn');
const correctEl = document.getElementById('correct');
const totalEl = document.getElementById('total');
const remainingEl = document.getElementById('remaining');

// 配列をシャッフルする関数
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 新しい問題を生成
function generateQuestion() {
    // 20問終了チェック
    if (totalCount >= MAX_QUESTIONS) {
        showFinalResults();
        return;
    }
    
    answered = false;
    feedbackEl.textContent = '';
    feedbackEl.className = '';
    explanationEl.style.display = 'none';
    explanationEl.innerHTML = '';
    nextBtn.style.display = 'none';
    
    // 選択されたスポーツに応じて問題をフィルタリング
    let filteredData = sportsData;
    if (selectedSport && selectedSport !== 'all') {
        filteredData = sportsData.filter(data => data.sport === selectedSport);
    }
    
    // まだ使っていない問題をランダムに選択
    let randomData;
    let attempts = 0;
    do {
        randomData = filteredData[Math.floor(Math.random() * filteredData.length)];
        attempts++;
        // 全問題を使い切ったらリセット
        if (attempts > 100) {
            usedQuestions = [];
        }
    } while (usedQuestions.includes(randomData) && usedQuestions.length < filteredData.length);
    
    usedQuestions.push(randomData);
    
    // 使わない筋肉を1つランダムに選択
    const correctAnswer = randomData.unusedMuscles[
        Math.floor(Math.random() * randomData.unusedMuscles.length)
    ];
    
    // 使う筋肉から3つランダムに選択
    const shuffledUsed = shuffle(randomData.usedMuscles);
    const wrongAnswers = shuffledUsed.slice(0, 3);
    
    // 選択肢を作成してシャッフル
    const allOptions = shuffle([correctAnswer, ...wrongAnswers]);
    
    currentQuestion = {
        sport: randomData.sport,
        action: randomData.action,
        correctAnswer: correctAnswer,
        options: allOptions,
        hint: randomData.hint,
        explanation: randomData.explanation
    };
    
    displayQuestion();
}

// 問題を画面に表示
function displayQuestion() {
    // スポーツ名に絵文字を追加
    const sportEmojis = {
        "陸上競技": "🏃",
        "サッカー": "⚽",
        "バスケットボール": "🏀",
        "バレーボール": "🏐",
        "野球": "⚾",
        "テニス": "🎾",
        "卓球": "🏓",
        "水泳": "🏊",
        "柔道": "🥋",
        "剣道": "⚔️",
        "空手": "🥋",
        "バドミントン": "🏸",
        "弓道": "🏹"
    };
    
    const emoji = sportEmojis[currentQuestion.sport] || "🏅";
    sportNameEl.textContent = `${emoji} ${currentQuestion.sport}`;
    actionNameEl.textContent = currentQuestion.action;
    
    // 動作のヒントを表示（問題時点で）- 簡潔に
    let hint = currentQuestion.hint;
    
    // hintがない場合は動作から自動生成
    if (!hint) {
        const action = currentQuestion.action.toLowerCase();
        if (action.includes('走') || action.includes('ダッシュ')) {
            hint = '下肢の伸展動作';
        } else if (action.includes('投') || action.includes('ピッチ') || action.includes('投球')) {
            hint = '肩関節内旋・水平内転、肘関節伸展';
        } else if (action.includes('蹴') || action.includes('キック')) {
            hint = '股関節・膝関節の伸展';
        } else if (action.includes('ジャンプ') || action.includes('跳')) {
            hint = '下肢関節の伸展';
        } else if (action.includes('引') || action.includes('プル')) {
            hint = '肩関節伸展・内転';
        } else if (action.includes('押') || action.includes('プッシュ')) {
            hint = '肩関節屈曲、肘関節伸展';
        } else if (action.includes('回') || action.includes('スイング')) {
            hint = '体幹回旋';
        } else {
            hint = 'どの部位のどんな動作か考えてみましょう';
        }
    }
    
    actionExplanationEl.textContent = `💡 ヒント：${hint}`;

    
    // 全ての筋肉のハイライトをリセット
    resetMuscleHighlights();
    
    optionsEl.innerHTML = '';
    currentQuestion.options.forEach((option, index) => {
        const optionContainer = document.createElement('div');
        optionContainer.className = 'option-container';
        
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.onclick = () => checkAnswer(option, button);
        button.onmouseenter = () => highlightMuscle(option);
        button.onmouseleave = () => resetMuscleHighlights();
        
        const text = document.createElement('span');
        text.textContent = option;
        button.appendChild(text);
        
        optionContainer.appendChild(button);
        optionsEl.appendChild(optionContainer);
    });
}

// 筋肉をハイライト
function highlightMuscle(muscleName) {
    resetMuscleHighlights();
    const muscles = document.querySelectorAll(`.muscle[data-muscle="${muscleName}"]`);
    muscles.forEach(muscle => {
        muscle.classList.add('highlight');
    });
}

// 筋肉のハイライトをリセット
function resetMuscleHighlights() {
    const muscles = document.querySelectorAll('.muscle');
    muscles.forEach(muscle => {
        muscle.classList.remove('highlight', 'used', 'unused');
    });
}

// 使用する筋肉と使用しない筋肉を表示
function showMuscleUsage() {
    // 使用する筋肉を青でハイライト
    const usedMuscles = [...currentQuestion.options].filter(m => m !== currentQuestion.correctAnswer);
    usedMuscles.forEach(muscleName => {
        const muscles = document.querySelectorAll(`.muscle[data-muscle="${muscleName}"]`);
        muscles.forEach(muscle => {
            muscle.classList.add('used');
        });
    });
    
    // 使用しない筋肉を赤でハイライト
    const muscles = document.querySelectorAll(`.muscle[data-muscle="${currentQuestion.correctAnswer}"]`);
    muscles.forEach(muscle => {
        muscle.classList.add('unused');
    });
}

// 回答をチェック
function checkAnswer(selectedAnswer, button) {
    if (answered) return;
    
    answered = true;
    totalCount++;
    
    const allButtons = document.querySelectorAll('.option-btn');
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.onmouseenter = null;
        btn.onmouseleave = null;
    });
    
    // 筋肉の使用状況を表示
    showMuscleUsage();
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
        correctCount++;
        button.classList.add('correct');
        feedbackEl.textContent = '🎉 正解！素晴らしい！';
        feedbackEl.className = 'feedback correct';
    } else {
        button.classList.add('wrong');
        feedbackEl.textContent = `❌ 不正解。正解は「${currentQuestion.correctAnswer}」です。`;
        feedbackEl.className = 'feedback wrong';
        
        // 正解の選択肢をハイライト
        allButtons.forEach(btn => {
            if (btn.textContent === currentQuestion.correctAnswer) {
                btn.classList.add('correct');
            }
        });
    }
    
    // 詳細解説を表示
    if (currentQuestion.explanation) {
        const usedMuscles = currentQuestion.options.filter(m => m !== currentQuestion.correctAnswer);
        
        // 筋肉の役割データベース
        const muscleRoles = {
            "大腿四頭筋": "膝関節伸展の主動作筋。大腿直筋・外側広筋・内側広筋・中間広筋から構成",
            "ハムストリングス": "膝関節屈曲・股関節伸展。大腿二頭筋・半腱様筋・半膜様筋から構成",
            "腓腹筋": "足関節底屈（つま先立ち）の主動作筋。ヒラメ筋とともに下腿三頭筋を形成",
            "前脛骨筋": "足関節背屈（つま先を上げる）の主動作筋",
            "大殿筋": "股関節伸展の最強筋。立ち上がり・階段昇降・走行で重要",
            "腸腰筋": "股関節屈曲の主動作筋。腸骨筋と大腰筋から構成",
            "三角筋": "肩関節外転の主動作筋。前部・中部・後部に分かれる",
            "大胸筋": "肩関節水平内転・内旋・屈曲。押す動作の主動作筋",
            "広背筋": "肩関節伸展・内転。引く動作の主動作筋",
            "僧帽筋": "肩甲骨の挙上・内転・下制。上部・中部・下部に分かれる",
            "上腕二頭筋": "肘関節屈曲・前腕回外の主動作筋",
            "上腕三頭筋": "肘関節伸展の主動作筋。長頭・外側頭・内側頭から構成",
            "腹直筋": "体幹屈曲の主動作筋。シックスパックを形成",
            "腹斜筋": "体幹回旋・側屈の主動作筋。外腹斜筋と内腹斜筋から構成",
            "前腕筋群": "手関節・手指の屈曲伸展を制御",
            "内転筋群": "股関節内転（脚を閉じる）の主動作筋群",
            "外転筋群": "股関節外転（脚を開く）の主動作筋群"
        };
        
        let usedMusclesHTML = usedMuscles.map(muscle => {
            const role = muscleRoles[muscle] || "主要な動作筋";
            return `<div style="margin-bottom: 8px;">
                <strong style="color: #059669;">✅ ${muscle}</strong><br>
                <span style="font-size: 0.9em; color: #065f46;">→ ${role}</span>
            </div>`;
        }).join('');
        
        const unusedRole = muscleRoles[currentQuestion.correctAnswer] || "この動作では使用しない";
        
        explanationEl.innerHTML = `
            <strong>💡 詳細解説</strong><br><br>
            <div style="margin-bottom: 16px;">
                <strong style="color: #059669; font-size: 1.1em;">🟢 この動作で使用する筋肉</strong><br><br>
                ${usedMusclesHTML}
            </div>
            <div style="margin-bottom: 16px; padding: 12px; background: #fee2e2; border-radius: 8px; border-left: 4px solid #dc2626;">
                <strong style="color: #dc2626; font-size: 1.1em;">🔴 使用しない筋肉</strong><br><br>
                <strong style="color: #991b1b;">❌ ${currentQuestion.correctAnswer}</strong><br>
                <span style="font-size: 0.9em; color: #7f1d1d;">→ ${unusedRole}</span>
            </div>
            <div style="padding-top: 16px; border-top: 3px solid #10b981;">
                <strong style="color: #065f46;">📚 運動学的解説</strong><br><br>
                ${currentQuestion.explanation}
            </div>
        `;
        explanationEl.style.display = 'block';
    }
    
    updateScore();
    nextBtn.style.display = 'block';
}

// スコアを更新
function updateScore() {
    correctEl.textContent = correctCount;
    totalEl.textContent = totalCount;
    remainingEl.textContent = MAX_QUESTIONS - totalCount;
}

// 最終結果を表示
function showFinalResults() {
    const percentage = Math.round((correctCount / MAX_QUESTIONS) * 100);
    let message = '';
    let emoji = '';
    
    if (percentage >= 90) {
        emoji = '🏆';
        message = '🌟 素晴らしい！完璧な理解です！';
    } else if (percentage >= 70) {
        emoji = '🎉';
        message = '💪 よくできました！高得点です！';
    } else if (percentage >= 50) {
        emoji = '👍';
        message = '✨ 良い結果です！もう少しで完璧！';
    } else {
        emoji = '📚';
        message = '🔥 復習して再挑戦しましょう！';
    }
    
    document.getElementById('quiz-container').innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div style="font-size: 5em; margin-bottom: 20px;">${emoji}</div>
            <h2 style="font-size: 2em; color: #1e293b; margin-bottom: 16px;">🎊 クイズ終了！</h2>
            <p style="font-size: 1.3em; color: #64748b; margin-bottom: 30px;">${message}</p>
            <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); padding: 30px; border-radius: 16px; margin-bottom: 30px; border: 3px solid #10b981;">
                <div style="font-size: 3em; font-weight: 700; color: #10b981; margin-bottom: 10px;">
                    ${correctCount} / ${MAX_QUESTIONS}
                </div>
                <div style="font-size: 1.2em; color: #065f46;">
                    正答率: ${percentage}%
                </div>
            </div>
        </div>
    `;
    
    // DOMが更新された後にイベントリスナーを追加
    setTimeout(() => {
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', function() {
                location.reload();
            });
        }
    }, 0);
}


// 次の問題ボタンのイベント
nextBtn.onclick = generateQuestion;

// ホーム画面に戻る
function backToHome() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('review-screen').style.display = 'none';
    document.getElementById('home-screen').style.display = 'block';
    
    // リセット
    correctCount = 0;
    totalCount = 0;
    usedQuestions = [];
    selectedSport = null;
}

// レビュー画面を表示
function showReview(sport) {
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('review-screen').style.display = 'block';
    
    // スポーツ名に絵文字を追加
    const sportEmojis = {
        "陸上競技": "🏃",
        "サッカー": "⚽",
        "バスケットボール": "🏀",
        "バレーボール": "🏐",
        "野球": "⚾",
        "テニス": "🎾",
        "卓球": "🏓",
        "水泳": "🏊",
        "柔道": "🥋",
        "剣道": "⚔️",
        "空手": "🥋",
        "バドミントン": "🏸",
        "弓道": "🏹"
    };
    
    const emoji = sportEmojis[sport] || "🏅";
    document.getElementById('review-sport-title').textContent = `${emoji} ${sport} - 動作レビュー`;
    
    // そのスポーツの全動作を取得
    const sportData = sportsData.filter(data => data.sport === sport);
    
    // 筋肉の役割データベース
    const muscleRoles = {
        "大腿四頭筋": "膝関節伸展の主動作筋",
        "ハムストリングス": "膝関節屈曲・股関節伸展",
        "腓腹筋": "足関節底屈の主動作筋",
        "前脛骨筋": "足関節背屈の主動作筋",
        "大殿筋": "股関節伸展の最強筋",
        "腸腰筋": "股関節屈曲の主動作筋",
        "三角筋": "肩関節外転の主動作筋",
        "大胸筋": "肩関節水平内転・押す動作",
        "広背筋": "肩関節伸展・引く動作",
        "僧帽筋": "肩甲骨の挙上・内転",
        "上腕二頭筋": "肘関節屈曲の主動作筋",
        "上腕三頭筋": "肘関節伸展の主動作筋",
        "腹直筋": "体幹屈曲の主動作筋",
        "腹斜筋": "体幹回旋・側屈",
        "前腕筋群": "手関節・手指の制御",
        "内転筋群": "股関節内転",
        "外転筋群": "股関節外転"
    };
    
    // レビューコンテンツを生成
    let reviewHTML = '';
    sportData.forEach((data, index) => {
        const hint = data.hint || 'この動作の主要な関節運動を考えてみましょう';
        const usedMuscles = data.usedMuscles;
        const unusedMuscle = data.unusedMuscles[0];
        
        reviewHTML += `
            <div class="review-card">
                <div class="review-action">
                    <span>${index + 1}.</span>
                    <span>${data.action}</span>
                </div>
                
                <div class="review-hint">
                    💡 <strong>動作：</strong>${hint}
                </div>
                
                <div class="review-muscles">
                    <div class="review-section-title">✅ 使用する筋肉</div>
                    ${usedMuscles.map(muscle => `
                        <div class="muscle-item muscle-used">
                            <div class="muscle-name">${muscle}</div>
                            <div class="muscle-role">→ ${muscleRoles[muscle] || '主要な動作筋'}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="review-muscles">
                    <div class="review-section-title">❌ 使用しない筋肉</div>
                    <div class="muscle-item muscle-unused">
                        <div class="muscle-name">${unusedMuscle}</div>
                        <div class="muscle-role">→ ${muscleRoles[unusedMuscle] || 'この動作では使用しない'}</div>
                    </div>
                </div>
                
                ${data.explanation ? `
                    <div class="review-explanation">
                        <strong>📚 詳細解説：</strong><br>
                        ${data.explanation}
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    document.getElementById('review-content').innerHTML = reviewHTML;
}

// クイズを開始
function startQuiz(sport) {
    selectedSport = sport;
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    
    // リセット
    correctCount = 0;
    totalCount = 0;
    usedQuestions = [];
    
    // 初回の問題を生成
    generateQuestion();
}

// ページ読み込み時はホーム画面を表示
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('home-screen').style.display = 'block';
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('review-screen').style.display = 'none';
});
