// 全局变量
let currentGrade = 3;
let currentMode = "auto";
let calculationSteps = [];
let currentStepIndex = 0;
let currentExercise = null;
let multiplicationData = null; // 保存乘法计算数据用于动画
let divisionQuotient = null; // 存储除法的完整商
document.querySelectorAll(".operation-option").forEach((option) => {
  option.addEventListener("click", function () {
    // 重置所有运算类型的选中状态
    document.querySelectorAll(".operation-option").forEach((op) => {
      op.classList.remove(
        "selected",
        "ring-2",
        "ring-indigo-500",
        "bg-blue-100",
        "border-blue-500"
      );

      // 恢复原始背景色
      const opType = op.dataset.operation;
      if (opType === "add" || opType === "subtract") {
        op.classList.add("bg-orange-50");
      } else if (opType === "multiply") {
        op.classList.add("bg-blue-50");
      } else if (opType === "divide") {
        op.classList.add("bg-green-50");
      }
    });

    // 设置当前选中项的样式
    this.classList.remove("bg-orange-50", "bg-blue-50", "bg-green-50");
    this.classList.add(
      "selected",
      "ring-2",
      "ring-indigo-500",
      "bg-blue-100",
      "border-blue-500"
    );

    // 以下是原有逻辑...
    const operation = this.getAttribute("data-operation");

    const operationSymbolMap = {
      add: "+",
      subtract: "-",
      multiply: "×",
      divide: "÷",
    };

    const operationTitleMap = {
      add: "加法计算",
      subtract: "减法计算",
      multiply: "乘法计算",
      divide: "除法计算",
    };

    const operationIconMap = {
      add: "fa-plus text-orange-500",
      subtract: "fa-minus text-orange-500",
      multiply: "fa-times text-blue-500",
      divide: "fa-divide text-green-500",
    };

    document.getElementById("operation-symbol").textContent =
      operationSymbolMap[operation];
    document.getElementById("operation-title").textContent =
      operationTitleMap[operation];
    document.getElementById(
      "operation-icon"
    ).className = `fas ${operationIconMap[operation]} mr-2`;

    const num1LabelMap = {
      add: "加数",
      subtract: "被减数",
      multiply: "被乘数",
      divide: "被除数",
    };

    const num2LabelMap = {
      add: "加数",
      subtract: "减数",
      multiply: "乘数",
      divide: "除数",
    };

    document.getElementById("num1Label").textContent = num1LabelMap[operation];
    document.getElementById("num2Label").textContent = num2LabelMap[operation];

    document.getElementById("operator").value = operation;
    document.getElementById("calculator-area").classList.remove("hidden");
    updateInputConstraints();
  });
});

// 隐藏原来的select元素，但保留它用于维持原有算法逻辑
const operatorSelect = document.createElement("select");
operatorSelect.id = "operator";
operatorSelect.style.display = "none";
["add", "subtract", "multiply", "divide"].forEach((op) => {
  const option = document.createElement("option");
  option.value = op;
  option.textContent = op;
  operatorSelect.appendChild(option);
});
document.body.appendChild(operatorSelect);
// 显示右下角提示框的函数
function showToast(message, type = "info", duration = 3000) {
  const toastContainer = document.getElementById("toastContainer");

  // 设置提示框内容和样式
  toastContainer.innerHTML = `
    <i class="fas ${
      type === "info"
        ? "fa-info-circle"
        : type === "warning"
        ? "fa-exclamation-triangle"
        : type === "success"
        ? "fa-check-circle"
        : "fa-times-circle"
    }"></i>
    <span>${message}</span>
  `;

  // 移除所有类型类并添加当前类型
  toastContainer.className = "toast-notification";
  toastContainer.classList.add(type);

  // 显示提示框
  setTimeout(() => {
    toastContainer.classList.add("show");
  }, 10);

  // 自动隐藏
  setTimeout(() => {
    toastContainer.classList.remove("show");
  }, duration);
}

// 生成加法口诀表（修改后）
function generateAdditionTable() {
  const table = document.getElementById("addition-table");
  table.innerHTML = "";

  const maxNum = currentGrade >= 2 ? 20 : 10;

  for (let i = 1; i <= maxNum; i++) {
    for (let j = 1; j <= maxNum - i; j++) {
      const item = document.createElement("div");
      item.className = "formula-item multiplication";
      item.innerHTML = `${i}+${j}=${i + j}`;
      item.addEventListener("click", () => {
        document.getElementById("num1").value = i;
        document.getElementById("num2").value = j;
        const operatorSelect = document.getElementById("operator");
        operatorSelect.value = "add"; // 设置运算符值
        // 手动触发change事件，强制更新标签
        operatorSelect.dispatchEvent(new Event("change"));
        hideModal("addition");
        calc();
      });
      table.appendChild(item);
    }
  }
}
// 生成减法口诀表
function generateSubtractionTable() {
  const table = document.getElementById("subtraction-table");
  table.innerHTML = "";

  // 根据年级显示范围（1年级10以内，2年级20以内）
  const maxNum = currentGrade >= 2 ? 20 : 10;

  for (let i = 2; i <= maxNum; i++) {
    for (let j = 1; j < i; j++) {
      const item = document.createElement("div");
      item.className = "formula-item multiplication";
      item.innerHTML = `${i}-${j}=${i - j}`;
      item.addEventListener("click", () => {
        document.getElementById("num1").value = i;
        document.getElementById("num2").value = j;
        const operatorSelect = document.getElementById("operator");
        operatorSelect.value = "subtract"; // 设置运算符值
        // 手动触发change事件，强制更新标签
        operatorSelect.dispatchEvent(new Event("change"));
        hideModal("subtraction");
        calc(); // 触发计算（若需真实减法需扩展calc函数支持减法）
      });
      table.appendChild(item);
    }
  }
}

// 生成乘法口诀表
function generateMultiplicationTable() {
  const table = document.getElementById("multiplication-table");
  table.innerHTML = "";

  // 根据年级显示不同范围的乘法表
  const maxMultiplier = currentGrade >= 3 ? 9 : 5;

  for (let i = 1; i <= maxMultiplier; i++) {
    for (let j = 1; j <= i; j++) {
      const item = document.createElement("div");
      item.className = "formula-item multiplication";
      item.innerHTML = `${j}×${i}=${j * i}`;
      item.addEventListener("click", () => {
        document.getElementById("num1").value = j;
        document.getElementById("num2").value = i;
        const operatorSelect = document.getElementById("operator");
        operatorSelect.value = "multiply"; // 设置运算符值
        // 手动触发change事件，强制更新标签
        operatorSelect.dispatchEvent(new Event("change"));
        hideModal("multiplication");
        calc();
      });
      table.appendChild(item);
    }
  }
}

// 生成除法口诀表
function generateDivisionTable() {
  const table = document.getElementById("division-table");
  table.innerHTML = "";

  // 根据年级显示不同范围的除法表
  const maxDivisor = currentGrade >= 4 ? 9 : 5;

  const divisionData = [];
  for (let i = 1; i <= maxDivisor; i++) {
    const row = [];
    for (let j = 1; j <= i; j++) {
      row.push(i * j);
    }
    divisionData.push(row);
  }

  divisionData.forEach((row, index) => {
    const divisor = index + 1;
    row.forEach((dividend) => {
      const item = document.createElement("div");
      item.className = "formula-item division";
      item.innerHTML = ` ${dividend}÷${divisor}=${dividend / divisor}`;
      item.addEventListener("click", () => {
        document.getElementById("num1").value = dividend;
        document.getElementById("num2").value = divisor;
        const operatorSelect = document.getElementById("operator");
        operatorSelect.value = "divide"; // 设置运算符值
        // 手动触发change事件，强制更新标签
        operatorSelect.dispatchEvent(new Event("change"));
        hideModal("division");
        calc();
      });
      table.appendChild(item);
    });
  });
}

// 模态框控制
function showModal(type) {
  // 1年级只能用加减
  if (currentGrade === 1) {
    if (type === "multiplication" || type === "division") {
      showToast(
        "一年级的小朋友先学习加减法，乘除法会在二年级开始学习哦！",
        "info",
        3000
      );
      return;
    }
  }

  // 2年级只能用加减乘
  if (currentGrade === 2 && type === "division") {
    showToast(
      "二年级的小朋友先学习加减乘法，除法会在三年级开始学习哦！",
      "info",
      3000
    );
    return;
  }

  // 新增：同步选择对应的运算类型
  let operationMap = {
    addition: "add",
    subtraction: "subtract",
    multiplication: "multiply",
    division: "divide",
  };
  let operation = operationMap[type];
  if (operation) {
    // 选中对应的运算类型选项
    document.querySelectorAll(".operation-option").forEach((option) => {
      if (option.dataset.operation === operation) {
        option.click(); // 触发点击事件，同步选中状态
      }
    });
    // 更新运算符选择器
    document.getElementById("operator").value = operation;
    // 显示计算区
    document.getElementById("calculator-area").classList.remove("hidden");
  }

  // 2年级练习题只能是加减乘
  if (currentGrade === 2 && type === "exercises") {
    document.getElementById("exerciseType").value = "add";
    document.getElementById("exerciseType").innerHTML = `
<option value="add">加法</option>
<option value="subtract">减法</option>
<option value="multiply">乘法</option>
`;
  } else if (currentGrade === 1 && type === "exercises") {
    // 1年级练习题只能是加减
    document.getElementById("exerciseType").value = "add";
    document.getElementById("exerciseType").innerHTML = `
<option value="add">加法</option>
<option value="subtract">减法</option>
`;
  } else {
    // 其他年级可以选择所有类型
    document.getElementById("exerciseType").innerHTML = `
<option value="add">加法</option>
<option value="subtract">减法</option>
<option value="multiply">乘法</option>
<option value="divide">除法</option>
<option value="both">混合</option>
`;
  }

  const modal = document.getElementById(`${type}-modal`);
  modal.style.display = "flex";
  setTimeout(() => modal.classList.add("active"), 10);
}

// 更新练习题年级提示（改为根据练习题难度显示）
function updateExerciseGradeNotice() {
  const noticeEl = document.getElementById("exerciseGradeNotice");
  // 获取当前选择的练习题难度（而非页面初始年级）
  const selectedDifficulty = parseInt(
    document.getElementById("exerciseDifficulty").value
  );
  let noticeText = "";

  switch (selectedDifficulty) {
    case 1:
      noticeText = "一年级的小朋友先学习加减法，为乘除法打下基础哦！";
      break;
    case 2:
      noticeText =
        "二年级的小朋友可以开始学习乘法啦，从简单的乘法口诀开始练习吧！";
      break;
    case 3:
      noticeText = "三年级的小朋友已经学习乘法，可以开始挑战除法啦！";
      break;
    case 4:
      noticeText = "四年级的小朋友可以练习多位数的乘除法了，加油！";
      break;
    case 5:
    case 6:
      noticeText =
        "五六年级的小朋友可以挑战更复杂的乘除法计算，包括小数运算哦！";
      break;
  }

  noticeEl.querySelector("p").textContent = noticeText;
}

function hideModal(type) {
  const modal = document.getElementById(`${type}-modal`);
  modal.classList.remove("active");
  setTimeout(() => (modal.style.display = "none"), 300);
}

window.onclick = function (event) {
  const modals = document.getElementsByClassName("modal");
  for (let i = 0; i < modals.length; i++) {
    if (event.target == modals[i]) {
      modals[i].classList.remove("active");
      setTimeout(() => (modals[i].style.display = "none"), 300);
    }
  }
};

// 修正后的年级选择逻辑（完整代码）
document.querySelectorAll(".grade-option").forEach((option) => {
  option.addEventListener("click", function () {
    // 1. 移除所有年级选项的选中样式（包括选中类和边框样式）
    document.querySelectorAll(".grade-option").forEach((opt) => {
      opt.classList.remove("selected", "border-yellow-400"); // 移除选中状态相关类
      opt.classList.add("border-transparent"); // 恢复透明边框
    });

    // 2. 为当前点击的年级添加选中样式
    this.classList.add("selected", "border-yellow-400"); // 添加选中类和黄色边框
    this.classList.remove("border-transparent"); // 移除透明边框

    // 3. 获取并更新当前年级
    const grade = parseInt(this.dataset.grade);
    currentGrade = grade;

    // 4. 年级信息数据
    const gradeInfos = {
      1: {
        title: "一年级学习内容",
        content:
          "一年级主要学习20以内的加减法，包括不进位加法和不退位减法，为数学学习打下基础。",
      },
      2: {
        title: "二年级学习内容",
        content: "二年级的小朋友可以练习20以内的加减法和简单乘法哦！",
      },
      3: {
        title: "三年级学习内容",
        content: "三年级的小朋友已经学习乘法，可以开始挑战除法啦！",
      },
      4: {
        title: "四年级学习内容",
        content: "四年级的小朋友可以练习多位数的四则运算了，加油！",
      },
      5: {
        title: "五年级学习内容",
        content: "五年级的小朋友可以挑战小数运算和更复杂的四则混合运算。",
      },
      6: {
        title: "六年级学习内容",
        content:
          "六年级的小朋友可以进行各种综合运算练习，为初中数学学习做准备。",
      },
    };

    // 5. 更新年级信息区域内容
    document.getElementById("grade-info-title").textContent =
      gradeInfos[grade].title;
    document.getElementById("grade-info-content").textContent =
      gradeInfos[grade].content;

    // 6. 年级对应的颜色配置
    const colors = {
      1: "blue",
      2: "green",
      3: "yellow",
      4: "purple",
      5: "pink",
      6: "orange",
    };

    // 7. 更新信息区域样式
    const infoEl = document.getElementById("grade-info");
    infoEl.className = `mt-6 p-4 bg-${colors[grade]}-50 rounded-lg border border-${colors[grade]}-100`;
    infoEl.querySelector(
      "h3"
    ).className = `font-semibold text-${colors[grade]}-800 flex items-center`;
    infoEl.querySelector(
      "p"
    ).className = `text-${colors[grade]}-700 mt-2 text-sm`;

    // 8. 同步更新界面其他部分
    updateGradeUI(); // 更新UI以匹配当前年级
    updateInputConstraints(); // 更新输入框限制
    updateExerciseGradeNotice(); // 更新练习题年级提示

    // 9. 更新各类口诀表
    generateAdditionTable();
    generateSubtractionTable();
    generateMultiplicationTable();
    generateDivisionTable();
  });
});

// 根据年级更新UI
// 修改updateGradeUI函数，确保正确控制运算类型
// 根据年级更新UI，控制运算类型选中状态和计算区显示
function updateGradeUI() {
  const num1 = document.getElementById("num1");
  const num2 = document.getElementById("num2");
  const operator = document.getElementById("operator");
  const calcBtn = document.getElementById("calcBtn");
  const additionTag = document.getElementById("additionTag");
  const subtractionTag = document.getElementById("subtractionTag");
  const multiplicationTag = document.getElementById("multiplicationTag");
  const divisionTag = document.getElementById("divisionTag");
  const gradeNote = document.getElementById("gradeNote");
  const num1Label = document.getElementById("num1Label");
  const num2Label = document.getElementById("num2Label");
  const processTitle = document.getElementById("processTitle");

  // 隐藏计算区相关元素
  document.getElementById("calculator-area").classList.add("hidden");
  document.getElementById("result").classList.add("hidden");
  document.getElementById("stepControls").classList.add("hidden");
  document.getElementById("manualInputArea").classList.add("hidden");

  // 获取当前选中的运算类型元素
  const selectedOperation = document.querySelector(
    ".operation-option.selected"
  );

  // 获取运算类型选择区域的元素
  const operationOptions = document.querySelectorAll(".operation-option");

  // 重置所有运算类型的选中状态（释放选中）- 关键修改处
  operationOptions.forEach((option) => {
    // 移除所有选中相关样式
    option.classList.remove(
      "selected",
      "ring-2",
      "ring-indigo-500",
      "bg-blue-100", // 移除选中的蓝色背景
      "border-blue-500" // 移除选中的蓝色边框
    );

    // 恢复原始背景色（根据运算类型）
    const op = option.dataset.operation;
    if (op === "add" || op === "subtract") {
      option.classList.add("bg-orange-50");
    } else if (op === "multiply") {
      option.classList.add("bg-blue-50");
    } else if (op === "divide") {
      option.classList.add("bg-green-50");
    }
  });

  // 重置所有元素状态
  [
    num1,
    num2,
    operator,
    calcBtn,
    additionTag,
    subtractionTag,
    multiplicationTag,
    divisionTag,
  ].forEach((el) => {
    el.classList.remove("disabled");
    el.disabled = false;
  });

  // 重置运算选项样式和可用性
  operationOptions.forEach((option) => {
    option.classList.remove("disabled", "opacity-50", "cursor-not-allowed");
    option.style.pointerEvents = "auto";
  });

  // 重置运算符选项
  operator.innerHTML = `
<option value="add">+</option>
<option value="subtract">-</option>
<option value="multiply">×</option>
<option value="divide">÷</option>
`;

  // 定义当前年级允许的运算类型
  let allowedOperators = [];

  // 根据年级设置UI和提示信息
  switch (currentGrade) {
    case 1:
      gradeNote.innerHTML = "📚 一年级的小朋友可以学习10以内的加减法啦！";
      // 只允许加减
      allowedOperators = ["add", "subtract"];
      multiplicationTag.classList.add("disabled");
      divisionTag.classList.add("disabled");
      operator.querySelectorAll("option").forEach((option) => {
        if (option.value === "multiply" || option.value === "divide") {
          option.disabled = true;
        }
      });
      // 禁用乘法和除法的运算选项
      document
        .querySelector('[data-operation="multiply"]')
        .classList.add("disabled", "opacity-50", "cursor-not-allowed");
      document
        .querySelector('[data-operation="divide"]')
        .classList.add("disabled", "opacity-50", "cursor-not-allowed");
      document.querySelector(
        '[data-operation="multiply"]'
      ).style.pointerEvents = "none";
      document.querySelector('[data-operation="divide"]').style.pointerEvents =
        "none";

      num1Label.textContent = "加数";
      num2Label.textContent = "加数";
      processTitle.textContent = "加法计算过程：";
      break;

    case 2:
      gradeNote.innerHTML =
        "📚 二年级的小朋友可以练习20以内的加减法和简单乘法哦！";
      // 允许加减乘，禁用除法
      allowedOperators = ["add", "subtract", "multiply"];
      divisionTag.classList.add("disabled");
      operator.querySelectorAll("option").forEach((option) => {
        if (option.value === "divide") option.disabled = true;
      });
      // 禁用除法的运算选项
      document
        .querySelector('[data-operation="divide"]')
        .classList.add("disabled", "opacity-50", "cursor-not-allowed");
      document.querySelector('[data-operation="divide"]').style.pointerEvents =
        "none";
      break;

    case 3:
    case 4:
    case 5:
    case 6:
      // 3年级及以上允许所有运算
      allowedOperators = ["add", "subtract", "multiply", "divide"];
      if (currentGrade === 3) {
        gradeNote.innerHTML =
          "📚 三年级的小朋友已经学习加减乘法，可以开始挑战除法啦！";
      } else if (currentGrade === 4) {
        gradeNote.innerHTML =
          "📚 四年级的小朋友可以练习多位数的四则运算了，加油！";
      } else {
        gradeNote.innerHTML =
          "📚 五六年级的小朋友可以挑战更复杂的四则运算，包括小数运算哦！";
      }
      break;
  }

  // 检查之前选中的运算类型是否在允许范围内
  if (selectedOperation) {
    const selectedOp = selectedOperation.dataset.operation;
    // 如果不在允许范围内，完全释放选中状态
    if (!allowedOperators.includes(selectedOp)) {
      selectedOperation.classList.remove("selected");
      operator.value = allowedOperators[0]; // 重置为第一个允许的运算类型
    } else {
      // 如果在允许范围内，保持选中状态
      selectedOperation.classList.add("selected", "ring-2", "ring-indigo-500");
      operator.value = selectedOp;
    }
  } else {
    // 没有选中的运算类型时，默认选中第一个允许的
    operator.value = allowedOperators[0];
    document
      .querySelector(`[data-operation="${allowedOperators[0]}"]`)
      .classList.add("selected", "ring-2", "ring-indigo-500");
  }

  // 触发change事件更新相关标签和状态
  operator.dispatchEvent(new Event("change"));
  // 更新输入限制
  updateInputConstraints();
}

// 添加运算类型选择的事件监听
document.querySelectorAll(".operation-option").forEach((option) => {
  option.addEventListener("click", function () {
    const operation = this.dataset.operation;

    // 检查当前年级是否允许该运算
    if (
      currentGrade === 1 &&
      (operation === "multiply" || operation === "divide")
    ) {
      showToast(
        "一年级的小朋友先学习加减法，乘除法会在二年级开始学习哦！",
        "info",
        3000
      );
      return;
    }

    if (currentGrade === 2 && operation === "divide") {
      showToast(
        "二年级的小朋友先学习加减乘法，除法会在三年级开始学习哦！",
        "info",
        3000
      );
      return;
    }

    // 如果允许，则正常选择
    document.querySelectorAll(".operation-option").forEach((opt) => {
      opt.classList.remove("selected", "bg-blue-100", "border-blue-500");
    });
    this.classList.add("selected", "bg-blue-100", "border-blue-500");

    // 更新运算符选择器
    const operatorSelect = document.getElementById("operator");
    operatorSelect.value = operation;
    operatorSelect.dispatchEvent(new Event("change"));
  });
});
// 模式选择
document.getElementById("autoMode").addEventListener("change", function () {
  currentMode = "auto";
  document.getElementById("stepControls").classList.add("hidden");
  document.getElementById("manualInputArea").classList.add("hidden");
  document.getElementById("manualInputLabel").textContent =
    "恭喜你完成了所有步骤！";
});

document.getElementById("manualMode").addEventListener("change", function () {
  currentMode = "manual";
  if (currentGrade > 1) {
    // 只有2年级及以上才有此功能
    document.getElementById("stepControls").classList.remove("hidden");
    document.getElementById("manualInputArea").classList.remove("hidden");
  }
});

// 根据年级更新输入限制
function updateInputConstraints() {
  const num1 = document.getElementById("num1");
  const num2 = document.getElementById("num2");
  const operator = document.getElementById("operator");

  // 根据年级设置数字范围
  let maxNum1, maxNum2, allowDecimals;

  switch (currentGrade) {
    case 1:
      maxNum1 = 20;
      maxNum2 = 20;
      allowDecimals = false;
      break;
    case 2:
      maxNum1 = 50;
      maxNum2 = 9; // 二年级乘法表内的数字
      allowDecimals = false;
      operator.value = "multiply"; // 二年级只学乘法
      break;
    case 3:
      maxNum1 = 100;
      maxNum2 = 20;
      allowDecimals = false;
      break;
    case 4:
      maxNum1 = 1000;
      maxNum2 = 100;
      allowDecimals = false;
      break;
    case 5:
    case 6:
      maxNum1 = 10000;
      maxNum2 = 1000;
      allowDecimals = true;
      break;
  }

  // 应用限制
  num1.max = maxNum1;
  num2.max = maxNum2;

  // 小数控制
  if (!allowDecimals) {
    num1.step = 1;
    num2.step = 1;
  } else {
    num1.step = 0.01;
    num2.step = 0.01;
  }
}

// 动态切换输入框标签
document.getElementById("operator").addEventListener("change", function () {
  const num1Label = document.getElementById("num1Label");
  const num2Label = document.getElementById("num2Label");
  const processTitle = document.getElementById("processTitle");

  // 更新输入框标签
  switch (this.value) {
    case "add":
      num1Label.textContent = "被加数";
      num2Label.textContent = "加数";
      processTitle.textContent = "加法计算过程：";
      break;
    case "subtract":
      num1Label.textContent = "被减数";
      num2Label.textContent = "减数";
      processTitle.textContent = "减法计算过程：";
      break;
    case "multiply":
      num1Label.textContent = "被乘数";
      num2Label.textContent = "乘数";
      processTitle.textContent = "乘法计算过程：";
      break;
    case "divide":
      num1Label.textContent = "被除数";
      num2Label.textContent = "除数";
      processTitle.textContent = "除法计算过程：";
      break;
  }
});

// 初始化
window.onload = function () {
  generateAdditionTable(); // 新增
  generateSubtractionTable(); // 新增
  generateMultiplicationTable();
  generateDivisionTable();
  updateGradeUI(); // 初始化UI
  updateInputConstraints();

  // 为输入框添加回车键触发计算
  document.getElementById("num1").addEventListener("keyup", function (event) {
    if (event.key === "Enter") calc();
  });
  document.getElementById("num2").addEventListener("keyup", function (event) {
    if (event.key === "Enter") calc();
  });

  // 分步控制按钮
  document.getElementById("prevStep").addEventListener("click", goToPrevStep);
  document.getElementById("nextStep").addEventListener("click", goToNextStep);
  document
    .getElementById("checkAnswer")
    .addEventListener("click", checkManualAnswer);

  // 练习题生成
  document
    .getElementById("generateExercises")
    .addEventListener("click", generateExercises);
  document
    .getElementById("checkExercises")
    .addEventListener("click", checkAllExercises);

  // 练习题难度选择与年级联动
  document
    .getElementById("exerciseDifficulty")
    .addEventListener("change", function () {
      const selectedDifficulty = parseInt(this.value);
      const exercisesContainer = document.getElementById("exercisesContainer");
      const exerciseType = document.getElementById("exerciseType");

      // 切换难度时清空现有题目
      exercisesContainer.innerHTML = "";

      // 根据年级设置正确的运算类型选项（与showModal逻辑统一）
      if (selectedDifficulty === 1) {
        // 1年级：只能加减
        exerciseType.innerHTML = `
<option value="add">加法</option>
<option value="subtract">减法</option>
<option value="both">混合</option>
`;
        exerciseType.value = "add"; // 默认加法
        exerciseType.disabled = false; // 允许选择加减
      } else if (selectedDifficulty === 2) {
        // 2年级：加减乘
        exerciseType.innerHTML = `
<option value="add">加法</option>
<option value="subtract">减法</option>
<option value="multiply">乘法</option>
<option value="both">混合</option>

`;
        exerciseType.value = "add"; // 默认加法
        exerciseType.disabled = false; // 允许选择加减乘
      } else {
        // 3年级及以上：所有运算
        exerciseType.innerHTML = `
<option value="add">加法</option>
<option value="subtract">减法</option>
<option value="multiply">乘法</option>
<option value="divide">除法</option>
<option value="both">混合</option>
`;
        exerciseType.value = "multiply"; // 默认乘法
        exerciseType.disabled = false;
      }
      document.getElementById("exercisesContainer").innerHTML = "";
      // 隐藏检查答案按钮
      document.getElementById("checkExercises").hidden = true;
      // 更新年级提示
      // 更新提示文本
      updateExerciseGradeNotice();
    });
};

// 格式处理
function formatNumber(num) {
  if (Number.isInteger(num)) return num.toString();
  return num
    .toString()
    .replace(/(\.\d*?)0+$/, "$1")
    .replace(/\.$/, "");
}

// 计算乘法横线的动态宽度
function calculateMultiplicationLineWidth() {
  const verticalEl = document.getElementById("vertical");
  const targetElements = verticalEl.querySelectorAll(
    ".multiplicand-digit, .partial-product, .multiplication-result"
  );

  let maxWidth = 0;
  targetElements.forEach((el) => {
    const elementWidth = el.offsetWidth;
    if (elementWidth > maxWidth) {
      maxWidth = elementWidth;
    }
  });

  const dynamicWidth = Math.max(maxWidth + 60, 200);
  const lines = verticalEl.querySelectorAll(".multiplication-line");
  lines.forEach((line) => {
    line.style.width = `${dynamicWidth}px`;
  });
  return dynamicWidth;
}

// 手动模式下显示指定步骤的动画
function showStepAnimation(stepIndex) {
  if (
    !multiplicationData ||
    document.getElementById("operator").value !== "multiply"
  ) {
    return;
  }

  const { carryDetails, partProducts } = multiplicationData;
  const verticalEl = document.getElementById("vertical");
  const lines = verticalEl.querySelectorAll(".multiplication-line");

  // 重置所有动画元素
  verticalEl.querySelectorAll(".carry").forEach((carry) => {
    carry.classList.remove("visible");
  });
  verticalEl.querySelectorAll(".partial-product").forEach((pp) => {
    pp.classList.remove("visible");
  });
  verticalEl
    .querySelector(".multiplication-result")
    .classList.remove("visible");

  // 显示第一条横线
  lines[0].style.width = calculateMultiplicationLineWidth() + "px";

  // 特殊处理第一步（说明步骤）
  if (stepIndex === 0) {
    return;
  }

  // 调整步骤索引（因为第一步是说明步骤）
  const adjustedIndex = stepIndex - 1;

  // 显示当前步骤的进位
  if (adjustedIndex < carryDetails.length) {
    const currentCarryElements = verticalEl.querySelectorAll(
      `.carry[data-position="${adjustedIndex}"]`
    );
    currentCarryElements.forEach((carry) => {
      carry.classList.add("visible");
    });
  }

  // 显示当前及之前的部分积
  for (let i = 0; i <= adjustedIndex && i < partProducts.length; i++) {
    const partialProduct = verticalEl.querySelectorAll(".partial-product")[i];
    if (partialProduct) {
      partialProduct.classList.add("visible");
    }
  }

  // 显示第二条横线和结果（最后一步）
  if (adjustedIndex === carryDetails.length) {
    if (lines.length > 1) {
      lines[1].style.width = calculateMultiplicationLineWidth() + "px";
    }
    verticalEl.querySelector(".multiplication-result").classList.add("visible");
  }
}

// 分步导航
function goToPrevStep() {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    updateStepDisplay();
    // 显示当前步骤的动画
    showStepAnimation(currentStepIndex);
  }
}

function goToNextStep() {
  if (currentStepIndex < calculationSteps.length - 1) {
    currentStepIndex++;
    updateStepDisplay();
    // 显示当前步骤的动画
    showStepAnimation(currentStepIndex);
  }
}

function updateStepDisplay() {
  // 更新按钮状态
  document.getElementById("prevStep").disabled = currentStepIndex === 0;
  document.getElementById("nextStep").disabled =
    currentStepIndex === calculationSteps.length - 1;

  // 更新解释文本
  const explanationEl = document.querySelector("#explanation ul");
  explanationEl.innerHTML = "";

  calculationSteps[currentStepIndex].explanation.forEach((desc) => {
    explanationEl.innerHTML += `<li>${desc}</li>`;
  });

  // 显示当前步骤的知识点提示
  showKnowledgeTip(currentStepIndex);

  // 更新手动输入提示
  if (currentMode === "manual") {
    const operator = document.getElementById("operator").value;
    const num1 = parseFloat(document.getElementById("num1").value);
    const num2 = parseFloat(document.getElementById("num2").value);

    if (operator === "multiply") {
      if (currentStepIndex === 0) {
        // 找到第一个非零数字的步骤
        const firstNonZeroStep = calculationSteps.find(
          (step) => step.digit2 && step.digit2 > 0
        );
        if (firstNonZeroStep) {
          document.getElementById(
            "manualInputLabel"
          ).textContent = `请输入${firstNonZeroStep.digit2}与${num1}的乘积：`;
        }
      } else {
        document.getElementById(
          "manualInputLabel"
        ).textContent = `请输入最终结果：`;
      }
    } else if (operator === "divide") {
      // 除法手动输入提示
      if (currentStepIndex === 0) {
        document.getElementById(
          "manualInputLabel"
        ).textContent = `请输入${num1} ÷ ${num2}的第一步商：`;
      } else if (currentStepIndex < calculationSteps.length - 1) {
        document.getElementById(
          "manualInputLabel"
        ).textContent = `请输入第${currentStepIndex}步的商：`;
      } else {
        document.getElementById(
          "manualInputLabel"
        ).textContent = `请输入最终的商：`;
      }
    } else if (operator === "add") {
      if (currentStepIndex === 0) {
        document.getElementById(
          "manualInputLabel"
        ).textContent = `请输入${num1} + ${num2}的第一步计算结果：`;
      } else if (currentStepIndex < calculationSteps.length - 1) {
        // 数位名称映射：0->个位，1->十位，2->百位，3->千位...
        const digitPositions = [
          "个",
          "十",
          "百",
          "千",
          "万",
          "十",
          "百",
          "千",
          "亿",
        ];
        // 步骤索引从1开始对应个位（currentStepIndex=1 → 个位，=2 → 十位...）
        const stepDigitIndex = currentStepIndex - 1;
        // 获取当前数位名称（超出预设范围时显示"第n位"）
        const positionName =
          digitPositions[stepDigitIndex] || `第${stepDigitIndex + 1}位`;

        document.getElementById(
          "manualInputLabel"
        ).textContent = `请输入${positionName}位的计算结果（考虑进位后的值）：`;
      } else {
        document.getElementById(
          "manualInputLabel"
        ).textContent = `请输入最终的和：`;
      }
    } else if (operator === "subtract") {
      // 数位名称映射：0->个位，1->十位，2->百位，以此类推
      const digitPositions = [
        "个",
        "十",
        "百",
        "千",
        "万",
        "十",
        "百",
        "千",
        "亿",
      ];

      if (currentStepIndex === 0) {
        document.getElementById(
          "manualInputLabel"
        ).textContent = `请输入${num1} - ${num2}的第一步（个位）计算结果：`;
      } else if (currentStepIndex < calculationSteps.length - 1) {
        // 计算当前步骤对应的数位（步骤1对应个位，步骤2对应十位...）
        const stepDigitIndex = currentStepIndex - 1; // 步骤索引从1开始对应个位
        const positionName =
          digitPositions[stepDigitIndex] || `第${stepDigitIndex + 1}位`;

        document.getElementById(
          "manualInputLabel"
        ).textContent = `请输入${positionName}位的计算结果（注意借位后的值）：`;
      } else {
        document.getElementById(
          "manualInputLabel"
        ).textContent = `请输入最终的差：`;
      }
    }
  }
}

// 显示知识点提示
function showKnowledgeTip(stepIndex) {
  const tipEl = document.getElementById("knowledgeTip");
  const operator = document.getElementById("operator").value;
  const step = calculationSteps[stepIndex];

  // 根据步骤内容显示相应的知识点提示
  let tipContent = "";
  if (operator === "add") {
    // 加法知识点
    if (stepIndex === 0) {
      tipContent = `
  <h4><i class="fas fa-book"></i> 加法基础</h4>
  <p>加法是将两个或多个数合并成一个数的运算，例如3+4表示将3和4合并成7。</p>
`;
    } else if (step.carry && step.carry > 0) {
      tipContent = `
  <h4><i class="fas fa-book"></i> 加法进位规则</h4>
  <p>当某一位的和满十时，要向前一位进1。例如：6+7=13，写3进1。</p>
`;
    } else if (stepIndex === calculationSteps.length - 1) {
      tipContent = `
  <h4><i class="fas fa-book"></i> 加法结果</h4>
  <p>加法满足交换律：a+b = b+a，即交换两个加数的位置，和不变。</p>
`;
    }
  } else if (operator === "subtract") {
    // 减法知识点
    if (stepIndex === 0) {
      tipContent = `
  <h4><i class="fas fa-book"></i> 减法基础</h4>
  <p>减法是从一个数中去掉另一个数的运算，例如7-3表示从7中去掉3，还剩4。</p>
`;
    } else if (step.borrow && step.borrow > 0) {
      tipContent = `
  <h4><i class="fas fa-book"></i> 减法借位规则</h4>
  <p>当被减数某一位小于减数对应位时，要向前一位借1当10。例如：13-5，3不够减5，借1当10，变成13-5=8。</p>
`;
    } else if (stepIndex === calculationSteps.length - 1) {
      tipContent = `
  <h4><i class="fas fa-book"></i> 减法结果</h4>
  <p>减法不满足交换律：a-b ≠ b-a（除非a=b）。被减数-减数=差，差+减数=被减数。</p>
`;
    }
  } else if (operator === "multiply") {
    // 乘法知识点
    if (stepIndex === 0) {
      tipContent = `
                  <h4><i class="fas fa-book"></i> 乘法基础</h4>
                  <p>乘法是相同加数相加的简便运算，例如3×4表示4个3相加（3+3+3+3）。</p>
              `;
    } else if (
      step.digitCarries &&
      step.digitCarries.some((c) => c.carry > 0)
    ) {
      tipContent = `
                  <h4><i class="fas fa-book"></i> 乘法进位规则</h4>
                  <p>当某一位的乘积满十时，要向前一位进位。例如：6×7=42，写2进4。</p>
              `;
    } else if (stepIndex === calculationSteps.length - 1) {
      tipContent = `
                  <h4><i class="fas fa-book"></i> 乘法结果</h4>
                  <p>多位数乘法中，要把各个部分积加起来，注意数位对齐。</p>
              `;
    }
  } else {
    // 除法知识点
    if (stepIndex === 0) {
      tipContent = `
                  <h4><i class="fas fa-book"></i> 除法基础</h4>
                  <p>除法是平均分的过程，例如12÷3表示把12平均分成3份，每份是4。</p>
              `;
    } else if (step.remainder > 0) {
      tipContent = `
                  <h4><i class="fas fa-book"></i> 除法余数规则</h4>
                  <p>余数必须比除数小。如果余数大于或等于除数，说明商小了，需要调大。</p>
              `;
    } else if (stepIndex === calculationSteps.length - 1) {
      tipContent = `
                  <h4><i class="fas fa-book"></i> 除法结果</h4>
                  <p>商×除数+余数=被除数，这是检查除法计算是否正确的好方法。</p>
              `;
    }
  }

  if (tipContent) {
    tipEl.innerHTML = tipContent;
    tipEl.classList.remove("hidden");
  } else {
    tipEl.classList.add("hidden");
  }
}

// 检查手动输入答案
function checkManualAnswer() {
  const userAnswer = parseFloat(document.getElementById("manualInput").value);
  const feedbackEl = document.getElementById("answerFeedback");

  if (isNaN(userAnswer)) {
    feedbackEl.textContent = "请输入有效数字";
    feedbackEl.className = "feedback incorrect";
    return;
  }

  // 获取当前步骤的正确答案
  const operator = document.getElementById("operator").value;
  let correctAnswer;

  if (operator === "multiply") {
    // 乘法步骤答案
    if (currentStepIndex === 0) {
      // 找到第一个非零数字的步骤结果
      const firstNonZeroStep = calculationSteps.find(
        (step) => step.digit2 && step.digit2 > 0
      );
      correctAnswer = firstNonZeroStep ? firstNonZeroStep.partProduct : 0;
    } else if (currentStepIndex < calculationSteps.length - 1) {
      correctAnswer = calculationSteps[currentStepIndex].partProduct;
    } else {
      correctAnswer = calculationSteps[0].product;
    }
  } else if (operator === "divide") {
    // 除法步骤答案（修复后）
    if (currentStepIndex === calculationSteps.length - 1) {
      // 最后一步：使用全局变量中的完整商
      correctAnswer = divisionQuotient;
    } else {
      // 中间步骤：校验当前位的商（保持不变）
      correctAnswer =
        calculationSteps[currentStepIndex].product /
        document.getElementById("num2").value;
    }
  } else if (operator === "add") {
    // 加法步骤答案
    if (currentStepIndex === 0) {
      // 第一步取第1个计算步骤的currentDigit
      correctAnswer = calculationSteps[1]?.currentDigit ?? 0;
    } else if (currentStepIndex < calculationSteps.length - 1) {
      // 中间步骤：如果是进位步骤，取进位值；否则取currentDigit
      const currentStep = calculationSteps[currentStepIndex];
      correctAnswer =
        currentStep.currentDigit !== undefined
          ? currentStep.currentDigit
          : currentStep.explanation[0].match(/进位(\d+)/)?.[1] || 0;
      correctAnswer = parseInt(correctAnswer, 10);
    } else {
      // 最后一步取总和
      correctAnswer = calculationSteps[0].sum;
    }
  } else if (operator === "subtract") {
    // 减法步骤答案
    if (currentStepIndex === 0) {
      correctAnswer = calculationSteps[1].currentDigit;
    } else if (currentStepIndex < calculationSteps.length - 1) {
      correctAnswer = calculationSteps[currentStepIndex].currentDigit;
    } else {
      correctAnswer = calculationSteps[0].difference;
    }
  }

  // 比较答案（考虑浮点数误差）
  if (Math.abs(userAnswer - correctAnswer) < 0.001) {
    feedbackEl.textContent = "正确！真棒！";
    feedbackEl.className = "feedback correct";
    showToast("正确！真棒！", "success", 2000);

    // 进入下一步并显示动画
    setTimeout(() => {
      if (currentStepIndex < calculationSteps.length - 1) {
        goToNextStep();
        document.getElementById("manualInput").value = "";
        feedbackEl.textContent = "";
      } else {
        document.getElementById("manualInputArea").classList.add("hidden");
      }
    }, 1000);
  } else {
    feedbackEl.textContent = `不正确，正确答案是${formatNumber(correctAnswer)}`;
    feedbackEl.className = "feedback incorrect";
    showToast(
      `不正确，正确答案是${formatNumber(correctAnswer)}`,
      "error",
      3000
    );
  }
}

// 计算逻辑
document.getElementById("calcBtn").addEventListener("click", calc);
function calc() {
  // 检查年级限制
  const operator = document.getElementById("operator").value;

  if (currentGrade === 1) {
    if (operator === "multiply" || operator === "divide") {
      // 只限制乘除法
      showToast(
        "一年级的小朋友先学习加减法，乘除法会在二年级开始学习哦！",
        "info",
        3000
      );
      return;
    }
  }

  if (currentGrade === 2 && operator === "divide") {
    showToast(
      "二年级的小朋友先学习乘法，除法会在三年级开始学习哦！",
      "info",
      3000
    );
    return;
  }

  const num1 = parseFloat(document.getElementById("num1").value);
  const num2 = parseFloat(document.getElementById("num2").value);

  const errorEl = document.getElementById("error");
  const resultEl = document.getElementById("result");
  const verticalEl = document.getElementById("vertical");
  const finalEl = document.getElementById("finalResult");
  const processTitle = document.getElementById("processTitle");

  // 清空状态
  errorEl.classList.add("hidden");
  resultEl.classList.add("hidden");
  document.getElementById("knowledgeTip").classList.add("hidden");

  const oldExplanation = document.getElementById("explanation");
  if (oldExplanation) oldExplanation.remove();

  // 验证
  if (isNaN(num1) || isNaN(num2)) {
    errorEl.textContent = "请输入有效数字";
    errorEl.classList.remove("hidden");
    showToast("请输入有效数字", "warning", 3000);
    return;
  }
  if (operator === "divide" && num2 === 0) {
    errorEl.textContent = "除数不能为0";
    errorEl.classList.remove("hidden");
    showToast("除数不能为0", "error", 3000);
    return;
  }

  // 检查年级限制
  let maxNum1, maxNum2;
  switch (currentGrade) {
    case 1:
      maxNum1 = 20;
      maxNum2 = 20;
      break;
    case 2:
      maxNum1 = 50;
      maxNum2 = 9;
      break;
    case 3:
      maxNum1 = 100;
      maxNum2 = 20;
      break;
    case 4:
      maxNum1 = 1000;
      maxNum2 = 100;
      break;
    case 5:
    case 6:
      maxNum1 = 10000;
      maxNum2 = 1000;
      break;
  }

  if (num1 > maxNum1 || num2 > maxNum2) {
    errorEl.textContent = `根据${currentGrade}年级水平，数字太大了，请输入更小的数字`;
    errorEl.classList.remove("hidden");
    showToast(
      `根据${currentGrade}年级水平，数字太大了，请输入更小的数字`,
      "warning",
      3000
    );
    return;
  }

  if (currentGrade < 5 && (num1 % 1 !== 0 || num2 % 1 !== 0)) {
    errorEl.textContent = `${currentGrade}年级先学习整数计算，稍后再挑战小数哦！`;
    errorEl.classList.remove("hidden");

    showToast(
      `${currentGrade}年级先学习整数计算，稍后再挑战小数哦！`,
      "info",
      3000
    );
    return;
  }

  // 计算

  let steps, finalText, processHtml;
  if (operator === "add") {
    processTitle.textContent = "加法计算过程：";
    steps = generateAdditionSteps(num1, num2);
    multiplicationData = null;
    processHtml = renderAdditionVertical(num1, num2, steps);
    finalText = `${num1} + ${num2} = ${formatNumber(steps.sum)}`;
  } else if (operator === "subtract") {
    processTitle.textContent = "减法计算过程：";
    steps = generateSubtractionSteps(num1, num2);
    multiplicationData = null;
    processHtml = renderSubtractionVertical(num1, num2, steps);
    finalText = `${num1} - ${num2} = ${formatNumber(steps.difference)}`;
  } else if (operator === "multiply") {
    processTitle.textContent = "乘法计算过程：";
    steps = generateMultiplicationSteps(num1, num2);
    multiplicationData = steps;
    processHtml = renderMultiplicationVertical(num1, num2, steps);
    finalText = `${num1} × ${num2} = ${formatNumber(steps.product)}`;
  } else {
    processTitle.textContent = "除法计算过程：";
    steps = generateDivisionSteps(num1, num2);
    multiplicationData = null;
    processHtml = renderDivisionVertical(num1, num2, steps);
    finalText = `${num1} ÷ ${num2} = ${formatNumber(steps.quotient)}`;
    divisionQuotient = steps.quotient;
  }

  // 保存计算步骤用于分步展示
  calculationSteps = steps.steps;

  currentStepIndex = 0;

  // 渲染结果
  verticalEl.innerHTML = processHtml;
  finalEl.textContent = finalText;
  const resultContainer = finalEl.closest(".p-4.bg-gray-50.rounded-lg");
  let explanationHtml = `<div id="explanation" class="mt-4 text-sm md:text-base text-gray-700"><h3 class="font-semibold mb-2">推理过程：</h3><ul class="list-disc pl-5 space-y-2">`;
  steps.steps.forEach((step) => {
    // 使用完整步骤列表而非当前步骤
    step.explanation.forEach((desc) => (explanationHtml += `<li>${desc}</li>`));
  });
  explanationHtml += `</ul></div>`;
  resultContainer.insertAdjacentHTML("afterend", explanationHtml);
  resultEl.classList.remove("hidden");

  // 根据模式显示不同的控制界面
  if (currentMode === "manual") {
    document.getElementById("stepControls").classList.remove("hidden");
    document.getElementById("manualInputArea").classList.remove("hidden");

    // 设置手动输入提示并显示第一步动画
    if (operator === "multiply") {
      const firstNonZeroStep = calculationSteps.find(
        (step) => step.digit2 && step.digit2 > 0
      );
      if (firstNonZeroStep) {
        document.getElementById(
          "manualInputLabel"
        ).textContent = `请输入${firstNonZeroStep.digit2}与${num1}的乘积：`;
      }
      // 显示第一步动画
      showStepAnimation(currentStepIndex);
    } else if (operator === "divide") {
      document.getElementById(
        "manualInputLabel"
      ).textContent = `请输入第一步的商：`;
    } else if (operator === "add") {
      document.getElementById(
        "manualInputLabel"
      ).textContent = `请输入${num1} + ${num2}的第一步计算个位数结果是：`;
      showStepAnimation(currentStepIndex);
    } else if (operator === "subtract") {
      document.getElementById(
        "manualInputLabel"
      ).textContent = `请输入${num1} - ${num2}的第一步计算结果：`;
      showStepAnimation(currentStepIndex);
    }
  } else {
    // 启动乘法动画
    if (operator === "multiply") {
      setTimeout(() => {
        calculateMultiplicationLineWidth();
        animateMultiplicationSteps(steps);
      }, 500);
    }
  }

  // 显示第一个知识点提示
  showKnowledgeTip(0);
}

// 加法步骤生成函数（保持逻辑不变，仅确保进位详情正确）
function generateAdditionSteps(num1, num2) {
  const num1Str = num1.toString().replace(/\./, "");
  const num2Str = num2.toString().replace(/\./, "");
  const maxLen = Math.max(num1Str.length, num2Str.length);
  const padded1 = num1Str.padStart(maxLen, "0");
  const padded2 = num2Str.padStart(maxLen, "0");

  const steps = [];
  let carry = 0;
  const carryDetails = [];

  steps.push({
    sum: num1 + num2,
    explanation: [`计算 ${num1} + ${num2}`, `对齐数位，从右往左依次相加`],
  });

  for (let i = maxLen - 1; i >= 0; i--) {
    const digit1 = parseInt(padded1[i], 10);
    const digit2 = parseInt(padded2[i], 10);
    const total = digit1 + digit2 + carry;
    const currentDigit = total % 10;
    const newCarry = Math.floor(total / 10);

    // 记录进位详情（位置0表示个位，1表示十位，以此类推）
    if (newCarry > 0) {
      carryDetails.push({
        position: maxLen - 1 - i, // 位置索引：0=个位，1=十位...
        value: newCarry,
        digitPosition: maxLen - i,
      });
    }

    steps.push({
      digit1,
      digit2,
      total,
      currentDigit,
      carry: newCarry,
      explanation: [
        `第${maxLen - i}位：${digit1} + ${digit2} ${
          carry > 0 ? "+ 进位" + carry : ""
        } = ${total}`,
        `写${currentDigit}，${newCarry > 0 ? "进位" + newCarry : "无进位"}`,
      ],
    });

    carry = newCarry;
  }

  if (carry > 0) {
    steps.push({
      explanation: [`最后进位${carry}，直接写下`],
    });
  }

  steps.push({
    sum: num1 + num2,
    explanation: [`最终结果：${num1} + ${num2} = ${num1 + num2}`],
  });

  return {
    steps,
    sum: num1 + num2,
    carryDetails,
    maxLen,
  };
}

// 加法竖式渲染函数（确保进位标记正确渲染）
function renderAdditionVertical(num1, num2, data) {
  const { carryDetails, sum, maxLen } = data;
  const num1Str = num1.toString();
  const num2Str = num2.toString();
  const sumStr = sum.toString();

  // 计算数字的偏移量，确保右对齐
  const num1Offset = maxLen - num1Str.length;
  const num2Offset = maxLen - num2Str.length;
  const sumOffset = maxLen - sumStr.length + (carryDetails.length > 0 ? 1 : 0);

  // 生成带偏移的数字HTML
  let num1Html = " ".repeat(num1Offset);
  let num2Html = " ".repeat(num2Offset);
  let sumHtml = " ".repeat(sumOffset);

  // 添加数字（带单独的span便于定位）
  num1Html += num1Str
    .split("")
    .map((digit) => `<span class="addend-digit">${digit}</span>`)
    .join("");

  num2Html += num2Str
    .split("")
    .map((digit) => `<span class="addend-digit">${digit}</span>`)
    .join("");

  sumHtml += sumStr
    .split("")
    .map((digit) => `<span class="addend-digit">${digit}</span>`)
    .join("");

  // 生成进位标记（左下角）
  let carryHtml = "";
  carryDetails.forEach((carry) => {
    // 每个进位基于自身位置计算偏移，确保在对应数位的左下角
    carryHtml += `<div class="add-carry visible" style="--position: ${carry.position}">${carry.value}</div>`;
  });

  return `
<div class="addition-vertical">
<div class="augend">${num1Html}</div>
<div class="addend">+${num2Html}</div>
${carryHtml} <!-- 进位标记放在数字下方 -->
<div class="addition-line"></div>
<div class="addition-result">${sumHtml}</div>
</div>
`;
}

// 减法步骤生成
function generateSubtractionSteps(num1, num2) {
  if (num1 < num2) {
    // 处理被减数小于减数的情况（交换并标记负号）
    const temp = num1;
    num1 = num2;
    num2 = temp;
    const steps = generateSubtractionSteps(num1, num2).steps;
    steps[steps.length - 1].difference = -steps[steps.length - 1].difference;
    steps[steps.length - 1].explanation = [
      `因为${num2} < ${num1}，所以结果为负数`,
      `最终结果：${num2} - ${num1} = -${num1 - num2}`,
    ];
    return { steps, difference: num2 - num1 };
  }

  const num1Str = num1.toString().replace(/\./, "");
  const num2Str = num2.toString().replace(/\./, "");
  const maxLen = Math.max(num1Str.length, num2Str.length);
  const padded1 = num1Str.padStart(maxLen, "0");
  const padded2 = num2Str.padStart(maxLen, "0");

  const steps = [];
  let borrow = 0;
  const borrowDetails = [];

  steps.push({
    difference: num1 - num2,
    explanation: [`计算 ${num1} - ${num2}`, `对齐数位，从右往左依次相减`],
  });

  for (let i = maxLen - 1; i >= 0; i--) {
    let digit1 = parseInt(padded1[i], 10) - borrow;
    const digit2 = parseInt(padded2[i], 10);
    borrow = 0;

    if (digit1 < digit2) {
      digit1 += 10;
      borrow = 1;
    }

    const currentDigit = digit1 - digit2;

    borrowDetails.push({
      position: maxLen - 1 - i,
      digit1: parseInt(padded1[i], 10),
      digit2,
      adjustedDigit1: digit1,
      currentDigit,
      borrow,
    });

    steps.push({
      digit1: parseInt(padded1[i], 10),
      digit2,
      adjustedDigit1: digit1,
      currentDigit,
      borrow,
      explanation: [
        `第${maxLen - i}位：${parseInt(padded1[i], 10)} - ${digit2} ${
          borrow > 0 ? "（被借走1，变为" + digit1 + "）" : ""
        } = ${currentDigit}`,
        `${borrow > 1 ? "向前一位借1" : "不借位"}`,
      ],
    });
  }

  steps.push({
    difference: num1 - num2,
    explanation: [`最终结果：${num1} - ${num2} = ${num1 - num2}`],
  });

  return {
    steps,
    difference: num1 - num2,
    borrowDetails,
    maxLen,
  };
}

// 减法竖式渲染
function renderSubtractionVertical(num1, num2, data) {
  const { borrowDetails, difference, maxLen } = data;
  const num1Str = num1.toString();
  const num2Str = num2.toString();
  const isNegative = difference < 0;
  const absDifference = Math.abs(difference);

  // 计算对齐偏移量
  const num1Offset = (maxLen - num1Str.replace(/\./, "").length) * 20 + 20;
  const num2Offset = (maxLen - num2Str.replace(/\./, "").length) * 20;

  // 生成数字HTML（带借位标记）
  let num1Html = "";
  let num2Html = "";
  let borrowHtml = "";

  // 补全数字长度
  const padded1 = num1Str.padStart(maxLen, " ");
  const padded2 = num2Str.padStart(maxLen, " ");

  // 生成被减数HTML（带借位标记）
  for (let i = 0; i < padded1.length; i++) {
    const isBorrowed = borrowDetails.some(
      (b) => b.position === maxLen - 1 - i && b.borrow > 0
    );
    num1Html += `<div class="minuend-digit">${
      isBorrowed
        ? '<span style="text-decoration: line-through; font-size: 0.8rem;">' +
          padded1[i] +
          "</span>"
        : padded1[i]
    }</div>`;
  }

  // 生成减数HTML
  for (let i = 0; i < padded2.length; i++) {
    num2Html += `<div class="subtrahend-digit">${padded2[i]}</div>`;
  }

  // 生成借位标记HTML
  borrowDetails.forEach((borrow, index) => {
    if (borrow.borrow > 0) {
      borrowHtml += `<div class="borrow visible" style="--position: ${index}">1</div>`;
    }
  });

  // 计算横线宽度
  const lineWidth = maxLen * 40 + 10;

  return `
<div class="subtraction-vertical">
  ${borrowHtml}
  <!-- 被减数：独立容器 -->
  <div class="subtraction-minuend" style="margin-left: ${num1Offset}px">${num1Html}</div>
  
  <!-- 减号 + 减数：拆分为两个独立容器，外层用弹性布局对齐 -->
  <div class="subtraction-subtrahend-wrapper" style="margin-left: ${num2Offset}px">
    <span class="subtraction-minus-sign">-</span> <!-- 减号：独立 -->
    <span class="subtraction-subtrahend">${num2Html}</span> <!-- 减数：独立 -->
  </div>
  
  <div class="subtraction-line" style="width: ${lineWidth}px"></div>
  <div class="subtraction-result visible">${
    isNegative ? "-" : ""
  }${absDifference}</div>
</div>
`;
}
// 乘法步骤生成
function generateMultiplicationSteps(num1, num2) {
  const getIntegerAndDigits = (num) => {
    const str = num.toString();
    const dotIndex = str.indexOf(".");
    if (dotIndex === -1) {
      return { integer: parseInt(str, 10), digits: 0 };
    }
    const digits = str.length - dotIndex - 1;
    const integerStr = str.replace(".", "");
    return { integer: parseInt(integerStr, 10), digits };
  };

  const { integer: int1, digits: d1 } = getIntegerAndDigits(num1);
  const { integer: int2, digits: d2 } = getIntegerAndDigits(num2);
  const totalDigits = d1 + d2;

  const steps = [];
  const num1Str = int1.toString();
  let num2Str = int2.toString();

  // 处理乘数末尾的0
  let trailingZeros = 0;
  let num2StrWithoutZeros = num2Str;
  while (num2StrWithoutZeros.endsWith("0")) {
    trailingZeros++;
    num2StrWithoutZeros = num2StrWithoutZeros.slice(0, -1);
  }

  const partProducts = [];
  const carryDetails = [];
  let hasCarry = false;

  steps.push({
    product: num1 * num2, // 保存乘积用于最终步骤验证
    explanation: [
      `计算 ${num1} × ${num2}`,
      `被乘数：${num1Str}，乘数：${num2Str}`,
      trailingZeros > 0
        ? `注意：乘数末尾有${trailingZeros}个0，可以先计算非零部分，最后补0`
        : "",
    ].filter(Boolean),
  });

  // 只处理非零部分
  for (let i = num2StrWithoutZeros.length - 1; i >= 0; i--) {
    const digit2 = parseInt(num2StrWithoutZeros[i], 10);
    let carry = 0;
    let partProduct = "";
    const stepExplanations = [
      `用乘数的第${
        num2StrWithoutZeros.length - i
      }位（数字${digit2}）乘以被乘数的每一位`,
    ];
    const digitCarries = [];

    for (let j = num1Str.length - 1; j >= 0; j--) {
      const digit1 = parseInt(num1Str[j], 10);
      const product = digit1 * digit2 + carry;
      const currentDigit = product % 10;
      carry = Math.floor(product / 10);
      partProduct = currentDigit + partProduct;
      digitCarries.push({ digit1, digit2, position: j, carry });
      stepExplanations.push(
        `${digit1} × ${digit2} + 进位${
          carry === 0 ? "0" : carry
        } = ${product}，写${currentDigit}，进位${carry}`
      );

      if (carry > 0) hasCarry = true;
    }

    if (carry > 0) {
      partProduct = carry + partProduct;
      stepExplanations.push(`最后进位${carry}，直接写下`);
      hasCarry = true;
    }

    const partProductNum = parseInt(partProduct, 10);
    partProducts.push(partProductNum);
    carryDetails.push({
      digitPosition: num2StrWithoutZeros.length - 1 - i,
      digitCarries,
      partProduct: partProductNum,
    });

    steps.push({
      digit2,
      partProduct: partProductNum,
      digitPosition: num2StrWithoutZeros.length - 1 - i,
      digitCarries,
      explanation: stepExplanations,
    });
  }

  // 处理末尾的0
  if (trailingZeros > 0) {
    steps.push({
      digit2: 0,
      partProduct: 0,
      digitPosition: num2StrWithoutZeros.length,
      explanation: [
        `乘数末尾有${trailingZeros}个0，相当于乘以${10 ** trailingZeros}`,
        `在之前的结果后面添加${trailingZeros}个0`,
      ],
    });
  }

  let integerProduct = partProducts.reduce((sum, p, i) => sum + p * 10 ** i, 0);

  // 乘以末尾0的数量对应的10的倍数
  integerProduct *= 10 ** trailingZeros;

  const product = integerProduct / 10 ** totalDigits;

  steps.push({
    product: product,
    explanation: [
      `将所有部分积相加：${partProducts.join(" + ")}${
        trailingZeros > 0 ? "，再补0" : ""
      } = ${integerProduct}`,
      totalDigits > 0 ? `调整小数点位置（总共有${totalDigits}位小数）` : "",
      `最终结果：${num1} × ${num2} = ${product}`,
    ].filter(Boolean),
  });

  return { steps, product, partProducts, carryDetails, hasCarry };
}

// 乘法竖式渲染
function renderMultiplicationVertical(num1, num2, data) {
  const { carryDetails, product, partProducts } = data;
  const num1Str = num1.toString();
  const num2Str = num2.toString();
  const int1Str = num1Str.replace(".", "");

  // 处理乘数末尾的0
  let num2StrWithoutZeros = num2Str.replace(/0+$/, "");
  if (num2StrWithoutZeros === "") num2StrWithoutZeros = "0"; // 处理乘数为0的情况
  const trailingZeros = num2Str.length - num2StrWithoutZeros.length;

  const int2Str = num2StrWithoutZeros.replace(".", "");

  // 计算最大位数作为对齐基准
  const maxDigitCount = Math.max(int1Str.length, int2Str.length);
  const multiplicandOffset = (maxDigitCount - int1Str.length) * 20 + 20;
  const multiplierOffset = (maxDigitCount - int2Str.length) * 20;

  // 生成被乘数HTML（带进位标记）
  let num1Html = "";
  for (let i = 0; i < num1Str.length; i++) {
    const char = num1Str[i];
    if (char === ".") {
      num1Html += `<div class="multiplicand-digit">${char}</div>`;
      continue;
    }

    // 为每一位数字添加所有可能的进位标记
    let carryHtml = "";
    carryDetails.forEach((carryDetail, index) => {
      const digitIndex = int1Str.indexOf(
        char,
        i - (num1Str.substring(0, i).includes(".") ? 1 : 0)
      );
      const carry =
        carryDetail.digitCarries.find((c) => c.position === digitIndex)
          ?.carry || 0;
      if (carry > 0) {
        carryHtml += `<span class="carry" data-position="${index}" style="--position: ${index}">${carry}</span>`;
      }
    });

    num1Html += `<div class="multiplicand-digit">${char}${carryHtml}</div>`;
  }

  // 生成乘数HTML（包含末尾的0）
  let num2Html = "";
  for (let i = 0; i < num2Str.length; i++) {
    const char = num2Str[i];
    if (char === ".") {
      num2Html += `<div class="multiplier-digit">${char}</div>`;
      continue;
    }
    num2Html += `<div class="multiplier-digit">${char}</div>`;
  }

  // 部分积渲染
  let partialProductsHtml = "";
  if (carryDetails.length > 1 || trailingZeros > 0) {
    carryDetails.forEach((item, index) => {
      const productStr = item.partProduct.toString();
      const paddedProduct = productStr.padStart(maxDigitCount, " ");
      partialProductsHtml += `<div class="partial-product" style="--digit-offset: ${index}">${paddedProduct}</div>`;
    });

    // 添加末尾0的占位部分积
    if (trailingZeros > 0) {
      partialProductsHtml += `<div class="partial-product" style="--digit-offset: ${
        carryDetails.length
      }">${"0".repeat(trailingZeros)}</div>`;
    }
  }

  // 计算结果偏移量
  const productStr = product.toString().replace(/\./, "");
  const resultOffset = (maxDigitCount - productStr.length) * 20;

  // 计算单个数字宽度并设置CSS变量
  setTimeout(() => {
    const singleDigitEl = document.querySelector(".multiplicand-digit");
    if (singleDigitEl) {
      const singleDigitWidth = singleDigitEl.offsetWidth;
      document.documentElement.style.setProperty(
        "--single-digit-width",
        `${singleDigitWidth}px`
      );
    }
  }, 0);

  return `
  <div class="multiplication-vertical">
      <div style="margin-left: ${multiplicandOffset}px">${num1Html}</div>
      <div style="margin-left: ${multiplierOffset}px">×${num2Html}</div>
      <div class="multiplication-line"></div>
      ${partialProductsHtml}
      ${
        carryDetails.length > 1 || trailingZeros > 0
          ? '<div class="multiplication-line"></div>'
          : ""
      }
      <div class="multiplication-result" style="--result-offset: ${resultOffset}">${product.toString()}</div>
  </div>
`;
}

// 逐位显示乘法动画（自动模式）
function animateMultiplicationSteps(data) {
  const { carryDetails, partProducts } = data;
  const verticalEl = document.getElementById("vertical");
  const lines = verticalEl.querySelectorAll(".multiplication-line");

  // 显示第一条横线
  setTimeout(() => {
    lines[0].style.width = calculateMultiplicationLineWidth() + "px";
  }, 1000);

  // 逐个显示部分积和对应的进位
  carryDetails.forEach((carryDetail, index) => {
    setTimeout(() => {
      // 隐藏上一位的进位
      if (index > 0) {
        const prevCarryElements = verticalEl.querySelectorAll(
          `.carry[data-position="${index - 1}"]`
        );
        prevCarryElements.forEach((carry) => {
          carry.classList.remove("visible");
        });
      }

      // 显示当前位的进位
      const currentCarryElements = verticalEl.querySelectorAll(
        `.carry[data-position="${index}"]`
      );
      currentCarryElements.forEach((carry) => {
        carry.classList.add("visible");
      });

      // 显示当前部分积
      if (index < partProducts.length) {
        const partialProduct =
          verticalEl.querySelectorAll(".partial-product")[index];
        if (partialProduct) {
          partialProduct.classList.add("visible");
        }
      }

      // 如果是最后一个部分积，显示第二条横线（但不自动显示结果）
      if (index === carryDetails.length - 1) {
        setTimeout(() => {
          // 隐藏最后一次进位
          setTimeout(() => {
            const lastCarryElements = verticalEl.querySelectorAll(
              `.carry[data-position="${index}"]`
            );
            lastCarryElements.forEach((carry) => {
              carry.classList.remove("visible");
            });
          }, 3000);

          // 显示第二条横线
          if (lines.length > 1) {
            lines[1].style.width = calculateMultiplicationLineWidth() + "px";
          }

          // 自动模式下才显示结果，手动模式由检查答案触发
          if (currentMode !== "manual") {
            // 延迟显示最终结果
            setTimeout(() => {
              verticalEl
                .querySelector(".multiplication-result")
                .classList.add("visible");
            }, 1000);
          }
        }, 1000);
      }
    }, 3000 * (index + 1));
  });
}

// 除法步骤生成
function generateDivisionSteps(dividend, divisor) {
  // 处理除数为小数的情况，统一化为整数计算
  const divisorStr = divisor.toString();
  const [divisorIntPart, divisorDecPart = ""] = divisorStr.split(".");
  const divisorDecimalCount = divisorDecPart.length; // 除数的小数位数
  const scale = Math.pow(10, divisorDecimalCount); // 放大倍数

  // 被除数和除数同时放大相同倍数，确保除数变为整数
  const scaledDividend = dividend * scale;
  const scaledDivisor = divisor * scale;

  const steps = [];
  const quotientDigits = [];
  let remainder = 0;
  let hasDecimal = false;
  const maxDecimal = 6;
  let decimalCount = 0;

  const dividendStr = scaledDividend.toString();
  const [dividendIntPart, dividendDecPart = ""] = dividendStr.split(".");
  const intDigits = dividendIntPart.split("").map(Number);
  const decDigits = dividendDecPart.split("").map(Number);
  const totalDigits = intDigits.length + decDigits.length;
  let digitIndex = 0;

  let currentNum = 0;
  while (digitIndex < intDigits.length && currentNum < scaledDivisor) {
    currentNum = currentNum * 10 + intDigits[digitIndex];
    digitIndex++;
  }

  let firstDigit;
  if (currentNum >= scaledDivisor) {
    firstDigit = Math.floor(currentNum / scaledDivisor);
    quotientDigits.push(firstDigit);
  } else {
    firstDigit = 0;
    quotientDigits.push(0);
    if (digitIndex >= intDigits.length) {
      quotientDigits.push(".");
      hasDecimal = true;
    }
  }
  const firstProduct = firstDigit * scaledDivisor;
  remainder = currentNum - firstProduct;

  // 在第一步说明放大逻辑，帮助小学生理解
  steps.push({
    minuend: currentNum,
    product: firstProduct,
    remainder: remainder,
    carryDigit: null,
    isOriginalDigit: false,
    explanation: [
      `计算 ${dividend} ÷ ${divisor}，先统一小数位数：`,
      `除数有${divisorDecimalCount}位小数，被除数和除数同时×${scale}，转化为 ${scaledDividend} ÷ ${scaledDivisor}`,
      `取被除数整数部分${currentNum}（前${digitIndex}位）÷ ${scaledDivisor}，商为${firstDigit}`,
      `${firstDigit}×${scaledDivisor}=${firstProduct}，${currentNum}-${firstProduct}=${remainder}（余数）`,
    ],
  });

  // 后续计算
  while (
    (digitIndex < totalDigits || remainder !== 0) &&
    decimalCount <= maxDecimal
  ) {
    if (digitIndex >= intDigits.length && !hasDecimal) {
      quotientDigits.push(".");
      hasDecimal = true;
    }

    let currentDigit = 0;
    let isOriginalDigit = false;
    if (digitIndex < intDigits.length) {
      currentDigit = intDigits[digitIndex];
      isOriginalDigit = true;
      digitIndex++;
    } else if (digitIndex - intDigits.length < decDigits.length) {
      currentDigit = decDigits[digitIndex - intDigits.length];
      isOriginalDigit = true;
      digitIndex++;
    } else {
      currentDigit = 0;
      isOriginalDigit = false;
      decimalCount++;
    }

    const newMinuend = remainder * 10 + currentDigit;
    const digit =
      newMinuend >= scaledDivisor ? Math.floor(newMinuend / scaledDivisor) : 0;
    quotientDigits.push(digit);

    const product = digit * scaledDivisor;
    const newRemainder = newMinuend - product;

    const explanation = [];
    if (isOriginalDigit) {
      explanation.push(
        remainder === 0
          ? `余数为0，落下被除数的下一位${currentDigit}，得到${newMinuend}`
          : `${remainder}后面落下被除数的下一位${currentDigit}，得到${newMinuend}`
      );
    } else {
      explanation.push(`${remainder}不够除，补0得到${newMinuend}`);
    }
    if (newMinuend < scaledDivisor) {
      explanation.push(`${newMinuend}<${scaledDivisor}，商补0`);
    } else {
      explanation.push(
        `${newMinuend}÷${scaledDivisor}=${digit}（${scaledDivisor}×${digit}=${product}）`
      );
    }
    explanation.push(`${digit}×${scaledDivisor}=${product}`);
    explanation.push(`${newMinuend}-${product}=${newRemainder}（余数）`);

    steps.push({
      minuend: newMinuend,
      product: product,
      remainder: newRemainder,
      carryDigit: currentDigit,
      isOriginalDigit: isOriginalDigit,
      explanation: explanation,
    });

    remainder = newRemainder;
    if (remainder === 0 && digitIndex >= totalDigits) break;
  }

  let quotientStr = quotientDigits.join("");
  quotientStr = quotientStr.replace(/(\.\d*?)0+$/, "$1");
  quotientStr = quotientStr.replace(/\.$/, "");
  const quotient = parseFloat(quotientStr);

  if (remainder === 0) {
    steps[steps.length - 1].explanation.push(
      `余数为0，计算结束，商为${quotient}`
    );
  } else {
    steps[steps.length - 1].explanation.push(
      `保留${maxDecimal}位小数，商为${quotient}`
    );
  }

  return { steps: steps, quotient: quotient };
}

// 除法竖式渲染
function renderDivisionVertical(dividend, divisor, data) {
  const { steps, quotient } = data;
  const quotientStr = quotient.toString();
  const fullDividend = dividend.toString();
  const fullDivisor = divisor.toString();

  let html = `<div class="division-container inline-block">`;
  html += `<div class="mb-1 ml-[calc(50%+12px)]">${quotientStr}</div>`;
  html += `<div class="division-bar relative">`;
  html += `<div class="divisor">${fullDivisor}</div>`;

  html += `<div class="group-1">`;
  html += `<div class="my-1 item-1 full-dividend">${fullDividend}</div>`;
  html += `<div class="my-1 item-2">${steps[0].product}</div>`;
  html += `<div class="border-b-2 border-black my-1"></div>`;
  html += `</div>`;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const groupNum = i + 2;
    const remainderInt = Math.floor(step.remainder);
    let remainderStr = remainderInt.toString();

    if (i < steps.length - 1) {
      const nextStep = steps[i + 1];
      if (remainderInt === 0) {
        remainderStr = `<span class="carry-digit">${nextStep.carryDigit}</span>`;
      } else if (nextStep.isOriginalDigit) {
        remainderStr = `${remainderInt}<span class="carry-digit">${nextStep.carryDigit}</span>`;
      } else if (nextStep.carryDigit === 0) {
        remainderStr = `${remainderInt}<span class="carry-digit">0</span>`;
      }
    }

    html += `<div class="group-${groupNum}">`;
    html += `<div class="my-1 item-1">${remainderStr}</div>`;
    if (i < steps.length - 1) {
      html += `<div class="my-1 item-2">${steps[i + 1].product}</div>`;
      html += `<div class="border-b-2 border-black my-1"></div>`;
    } else if (step.remainder !== 0) {
      html += `<div class="border-b-2 border-black my-1"></div>`;
    }
    html += `</div>`;
  }

  html += `</div></div>`;
  return html;
}

// 生成练习题
function generateExercises() {
  // 获取练习题难度（对应年级）和选择的类型

  const difficulty = parseInt(
    document.getElementById("exerciseDifficulty").value
  );
  let selectedType = document.getElementById("exerciseType").value;

  // 定义各年级允许的运算类型（内部标识：add/subtract/multiply/divide）
  let allowedOpsMap = {
    add: "+",
    subtract: "-",
    multiply: "×",
    divide: "÷",
  };
  let allowedTypes; // 允许的类型列表（包含both）
  let allowedOpsList; // 允许的运算符号列表

  // 根据年级设置允许的运算类型
  if (difficulty === 1) {
    // 1年级：允许加法、减法、加减法混合
    allowedTypes = ["add", "subtract", "both"];
    allowedOpsList = ["+", "-"];
    showToast("一年级的小朋友可以练习加减法哦！", "info", 3000);
  } else if (difficulty === 2) {
    // 2年级：允许加法、减法、乘法、三者混合
    allowedTypes = ["add", "subtract", "multiply", "both"];
    allowedOpsList = ["+", "-", "×"];
  } else {
    // 3-6年级：允许加减乘除及混合
    allowedTypes = ["add", "subtract", "multiply", "divide", "both"];
    allowedOpsList = ["+", "-", "×", "÷"];
  }

  // 过滤运算类型选择框，只保留允许的选项
  const typeSelect = document.getElementById("exerciseType");
  // 先清空现有选项
  typeSelect.innerHTML = "";
  // 添加允许的选项
  allowedTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    switch (type) {
      case "add":
        option.textContent = "加法";
        break;
      case "subtract":
        option.textContent = "减法";
        break;
      case "multiply":
        option.textContent = "乘法";
        break;
      case "divide":
        option.textContent = "除法";
        break;
      case "both":
        option.textContent = "混合运算";
        break;
    }
    typeSelect.appendChild(option);
  });
  // 确保选中的类型在允许范围内，否则默认选第一个
  if (!allowedTypes.includes(selectedType)) {
    selectedType = allowedTypes[0];
    typeSelect.value = selectedType;
  }
  typeSelect.disabled = false; // 允许选择

  const count = parseInt(document.getElementById("exerciseCount").value);
  const container = document.getElementById("exercisesContainer");
  container.innerHTML = "";

  // 根据难度设置数字范围
  let maxNum1, maxNum2, allowDecimals;
  switch (difficulty) {
    case 1:
      maxNum1 = 20; // 1年级数字范围小
      maxNum2 = 10;
      allowDecimals = false;
      break;
    case 2:
      maxNum1 = 50; // 2年级数字范围适中
      maxNum2 = 9;
      allowDecimals = false;
      break;
    case 3:
      maxNum1 = 100;
      maxNum2 = 20;
      allowDecimals = false;
      break;
    case 4:
      maxNum1 = 1000;
      maxNum2 = 100;
      allowDecimals = false;
      break;
    case 5:
    case 6:
      maxNum1 = 1000;
      maxNum2 = 100;
      allowDecimals = true;
      break;
  }

  // 生成题目
  for (let i = 0; i < count; i++) {
    // 确定当前题目的运算类型
    let op;
    if (selectedType === "both") {
      // 混合模式：从当前年级允许的运算中随机选择
      op = allowedOpsList[Math.floor(Math.random() * allowedOpsList.length)];
    } else {
      // 单一模式：使用选择的运算类型
      op = allowedOpsMap[selectedType];
    }

    // 生成数字和答案
    let num1, num2, answer;
    do {
      num1 = Math.floor(Math.random() * maxNum1) + 1;
      num2 = Math.floor(Math.random() * maxNum2) + 1;

      // 处理小数（仅5-6年级）
      if (allowDecimals && Math.random() > 0.5) {
        num1 = parseFloat(num1.toFixed(1));
      }
      if (allowDecimals && Math.random() > 0.7) {
        num2 = parseFloat(num2.toFixed(1));
      }

      // 针对不同运算的特殊处理
      if (op === "-") {
        // 减法确保被减数大于等于减数（避免负数结果）
        if (num1 < num2) {
          [num1, num2] = [num2, num1]; // 交换位置
        }
      } else if (op === "÷") {
        // 除法确保能整除或有简单余数
        if (Math.random() > 0.3) {
          // 确保整除
          num1 = num2 * Math.floor(Math.random() * (maxNum1 / num2)) + 1;
        }
      }

      // 计算答案
      switch (op) {
        case "+":
          answer = num1 + num2;
          break;
        case "-":
          answer = num1 - num2;
          break;
        case "×":
          answer = num1 * num2;
          break;
        case "÷":
          answer = num1 / num2;
          break;
      }
    } while (
      answer < 0 || // 避免负数结果
      answer > 10000 || // 避免过大结果
      (op === "÷" && num1 % num2 !== 0 && Math.random() > 0.5) // 除法特殊处理
    );

    // 创建题目元素
    const exercise = document.createElement("div");
    exercise.className = "exercise-item";
    exercise.dataset.answer = answer;
    exercise.innerHTML = `
<div class="exercise-question">${num1} ${op} ${num2} = ?</div>
<input type="number" class="exercise-input" step="any">
<div class="exercise-feedback"></div>
`;
    container.appendChild(exercise);
  }
  document.getElementById("checkExercises").hidden = false;

  showToast(
    `已生成${count}道${getTypeName(selectedType, difficulty)}练习题！`,
    "success",
    2000
  );
}

// 辅助函数：获取运算类型名称（用于提示信息）
function getTypeName(type, grade) {
  const typeNames = {
    add: "加法",
    subtract: "减法",
    multiply: "乘法",
    divide: "除法",
    both: "",
  };
  if (type !== "both") return typeNames[type];

  // 混合运算的名称
  if (grade === 1) return "加减混合";
  if (grade === 2) return "加减乘混合";
  return "加减乘除混合";
}
// 检查所有练习答案
function checkAllExercises() {
  const exercises = document.querySelectorAll(".exercise-item");
  let correctCount = 0;

  exercises.forEach((exercise) => {
    const input = exercise.querySelector(".exercise-input");
    const feedback = exercise.querySelector(".exercise-feedback");
    const userAnswer = parseFloat(input.value);
    const correctAnswer = parseFloat(exercise.dataset.answer);

    if (isNaN(userAnswer)) {
      feedback.textContent = "未作答";
      feedback.className = "exercise-feedback text-black-500";
    } else if (Math.abs(userAnswer - correctAnswer) < 0.001) {
      feedback.textContent = "正确";
      feedback.className = "exercise-feedback text-black-500";
      correctCount++;
    } else {
      feedback.textContent = `错误，正确答案是${formatNumber(correctAnswer)}`;
      feedback.className = "exercise-feedback text-red-500";
    }
  });

  // 显示总体结果
  showToast(
    `完成！共${exercises.length}题，做对${correctCount}题，正确率${Math.round(
      (correctCount / exercises.length) * 100
    )}%`,
    correctCount === exercises.length ? "success" : "info",
    4000
  );
}
// 帮助按钮点击事件（放在hideModal函数之后）
document.getElementById("helpBtn").addEventListener("click", function () {
  showModal("help");
});
