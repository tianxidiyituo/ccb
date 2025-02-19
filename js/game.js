// 游戏配置
const TOTAL_TIME = 60; // 总游戏时间（秒）
const POINTS_PER_CORRECT = 5; // 每题得分
let currentScore = 0;
let timeLeft = TOTAL_TIME;
let timerId = null;
let questions = [];
let currentQuestionIndex = 0;

// DOM元素
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const optionsEl = document.getElementById('options');
const questionImageEl = document.getElementById('questionImage');
const endScreenEl = document.getElementById('endScreen');
const finalScoreEl = document.getElementById('finalScore');
const rankEl = document.getElementById('rank');

// 初始化游戏
async function initGame() {
    // 加载题目数据
    const response = await fetch('data.json');
    questions = await response.json();
    startGame();
}

// 开始新游戏
function startGame() {
    currentScore = 0;
    timeLeft = TOTAL_TIME;
    currentQuestionIndex = 0;
    endScreenEl.classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    updateScore();
    startTimer();
    showNextQuestion();
}

// 显示下一题
function showNextQuestion() {
    const question = questions[currentQuestionIndex];
    
    // 随机选择正确答案的图片版本（1或2）
    const imgVersion = Math.random() < 0.5 ? 1 : 2;
    questionImageEl.src = `images/${question.image}_${imgVersion}.jpg`;
    
    // 生成选项（正确选项 + 3个随机错误选项）
    const options = getRandomOptions(question);
    
    // 渲染选项按钮
    optionsEl.innerHTML = options.map(opt => `
        <button onclick="checkAnswer('${opt.value}', ${opt.isCorrect})">
            ${opt.value}
        </button>
    `).join('');
}

// 检查答案
function checkAnswer(selectedValue, isCorrect) {
    if (isCorrect) {
        currentScore += POINTS_PER_CORRECT;
        updateScore();
    }
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    showNextQuestion();
}

// 更新分数显示
function updateScore() {
    scoreEl.textContent = `当前得分：${currentScore}`;
}

// 启动倒计时
function startTimer() {
    timerId = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `剩余时间：${timeLeft}秒`;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// 结束游戏
function endGame() {
    clearInterval(timerId);
    document.getElementById('gameScreen').classList.add('hidden');
    endScreenEl.classList.remove('hidden');
    finalScoreEl.textContent = currentScore;
    rankEl.textContent = getRank(currentScore);
}

// 获取等级
function getRank(score) {
    if (score >= 80) return '王者';
    if (score >= 60) return '大师';
    if (score >= 40) return '精英';
    if (score >= 20) return '新手';
    return '菜鸟';
}

// 生成随机选项（包含1个正确和3个错误）
function getRandomOptions(currentQuestion) {
    const otherQuestions = questions.filter(q => q !== currentQuestion);
    const wrongOptions = [];
    
    // 随机选取3个错误选项
    while (wrongOptions.length < 3) {
        const randomQuestion = otherQuestions[Math.floor(Math.random() * otherQuestions.length)];
        if (!wrongOptions.includes(randomQuestion.answer)) {
            wrongOptions.push(randomQuestion.answer);
        }
    }
    
    const options = [
        { value: currentQuestion.answer, isCorrect: true },
        ...wrongOptions.map(value => ({ value, isCorrect: false }))
    ];
    
    // 打乱选项顺序
    return options.sort(() => Math.random() - 0.5);
}

// 启动游戏
initGame();
