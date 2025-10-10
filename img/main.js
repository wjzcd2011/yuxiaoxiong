// 生成乘法口诀表
function generateMultiplicationTable() {
  const table = document.getElementById("multiplication-table");
  for (let i = 1; i <= 9; i++) {
    const row = document.createElement("div");
    row.className = "formula-row";
    for (let j = 1; j <= i; j++) {
      const item = document.createElement("div");
      item.className = "formula-item";
      item.textContent = `${j}×${i}=${j * i}`;
      row.appendChild(item);
    }
    table.appendChild(row);
  }
}

// 生成除法口诀表
function generateDivisionTable() {
  const table = document.getElementById("division-table");
  const row1 = document.createElement("div");
  row1.className = "formula-row";
  row1.innerHTML = '<div class="formula-item">1÷1=1</div>';
  table.appendChild(row1);

  const row2 = document.createElement("div");
  row2.className = "formula-row";
  row2.innerHTML = `<div class="formula-item">2÷1=2</div><div class="formula-item">4÷2=2</div>`;
  table.appendChild(row2);

  const row3 = document.createElement("div");
  row3.className = "formula-row";
  row3.innerHTML = `<div class="formula-item">3÷1=3</div><div class="formula-item">6÷2=3</div><div class="formula-item">9÷3=3</div>`;
  table.appendChild(row3);

  const row4 = document.createElement("div");
  row4.className = "formula-row";
  row4.innerHTML = `<div class="formula-item">4÷1=4</div><div class="formula-item">8÷2=4</div><div class="formula-item">12÷3=4</div><div class="formula-item">16÷4=4</div>`;
  table.appendChild(row4);

  const row5 = document.createElement("div");
  row5.className = "formula-row";
  row5.innerHTML = `<div class="formula-item">5÷1=5</div><div class="formula-item">10÷2=5</div><div class="formula-item">15÷3=5</div><div class="formula-item">20÷4=5</div><div class="formula-item">25÷5=5</div>`;
  table.appendChild(row5);

  const row6 = document.createElement("div");
  row6.className = "formula-row";
  row6.innerHTML = `<div class="formula-item">6÷1=6</div><div class="formula-item">12÷2=6</div><div class="formula-item">18÷3=6</div><div class="formula-item">24÷4=6</div><div class="formula-item">30÷5=6</div><div class="formula-item">36÷6=6</div>`;
  table.appendChild(row6);

  const row7 = document.createElement("div");
  row7.className = "formula-row";
  row7.innerHTML = `<div class="formula-item">7÷1=7</div><div class="formula-item">14÷2=7</div><div class="formula-item">21÷3=7</div><div class="formula-item">28÷4=7</div><div class="formula-item">35÷5=7</div><div class="formula-item">42÷6=7</div><div class="formula-item">49÷7=7</div>`;
  table.appendChild(row7);

  const row8 = document.createElement("div");
  row8.className = "formula-row";
  row8.innerHTML = `<div class="formula-item">8÷1=8</div><div class="formula-item">16÷2=8</div><div class="formula-item">24÷3=8</div><div class="formula-item">32÷4=8</div><div class="formula-item">40÷5=8</div><div class="formula-item">48÷6=8</div><div class="formula-item">56÷7=8</div><div class="formula-item">64÷8=8</div>`;
  table.appendChild(row8);

  const row9 = document.createElement("div");
  row9.className = "formula-row";
  row9.innerHTML = `<div class="formula-item">9÷1=9</div><div class="formula-item">18÷2=9</div><div class="formula-item">27÷3=9</div><div class="formula-item">36÷4=9</div><div class="formula-item">45÷5=9</div><div class="formula-item">54÷6=9</div><div class="formula-item">63÷7=9</div><div class="formula-item">72÷8=9</div><div class="formula-item">81÷9=9</div>`;
  table.appendChild(row9);
}

// 模态框控制
function showModal(type) {
  document.getElementById(`${type}-modal`).style.display = "flex";
}
function hideModal(type) {
  document.getElementById(`${type}-modal`).style.display = "none";
}
window.onclick = function (event) {
  const modals = document.getElementsByClassName("modal");
  for (let i = 0; i < modals.length; i++) {
    if (event.target == modals[i]) {
      modals[i].style.display = "none";
    }
  }
};

// 动态切换输入框标签
document.getElementById("operator").addEventListener("change", function () {
  const operator = this.value;
  const num1Label = document.getElementById("num1Label");
  const num2Label = document.getElementById("num2Label");
  if (operator === "multiply") {
    num1Label.textContent = "乘数1";
    num2Label.textContent = "乘数2";
  } else {
    num1Label.textContent = "被除数";
    num2Label.textContent = "除数";
  }
});

// 初始化口诀表
window.onload = function () {
  generateMultiplicationTable();
  generateDivisionTable();
};

// 格式处理
function formatNumber(num) {
  if (Number.isInteger(num)) return num.toString();
  return num
    .toString()
    .replace(/(\.\d*?)0+$/, "$1")
    .replace(/\.$/, "");
}

// 核心计算逻辑
document.getElementById("calcBtn").addEventListener("click", calc);
function calc() {
  const num1 = parseFloat(document.getElementById("num1").value);
  const num2 = parseFloat(document.getElementById("num2").value);
  const operator = document.getElementById("operator").value;
  const errorEl = document.getElementById("error");
  const resultEl = document.getElementById("result");
  const verticalEl = document.getElementById("vertical");
  const finalEl = document.getElementById("finalResult");
  const processTitle = document.getElementById("processTitle");

  // 清空状态
  errorEl.classList.add("hidden");
  resultEl.classList.add("hidden");
  const oldExplanation = document.getElementById("explanation");
  if (oldExplanation) oldExplanation.remove();

  // 基础验证
  if (isNaN(num1) || isNaN(num2)) {
    errorEl.textContent = "请输入有效数字";
    errorEl.classList.remove("hidden");
    return;
  }
  if (operator === "divide" && num2 === 0) {
    errorEl.textContent = "除数不能为0";
    errorEl.classList.remove("hidden");
    return;
  }

  // 分支执行
  let steps, finalText, processHtml;
  if (operator === "multiply") {
    processTitle.textContent = "乘法计算过程：";
    steps = generateMultiplicationSteps(num1, num2);
    processHtml = renderMultiplicationVertical(num1, num2, steps);
    finalText = `${num1} × ${num2} = ${formatNumber(steps.product)}`;
  } else {
    processTitle.textContent = "除法计算过程：";
    steps = generateDivisionSteps(num1, num2);
    processHtml = renderDivisionVertical(num1, num2, steps);
    finalText = `${num1} ÷ ${num2} = ${formatNumber(steps.quotient)}`;
  }

  // 渲染结果
  verticalEl.innerHTML = processHtml;
  finalEl.textContent = finalText;
  const resultContainer = finalEl.closest(".p-3.bg-gray-50.rounded");
  let explanationHtml = `<div id="explanation" class="mt-4 text-sm md:text-base text-gray-700"><h3 class="font-semibold mb-2">推理过程：</h3><ul class="list-disc pl-5 space-y-2">`;
  steps.steps.forEach((step) => {
    step.explanation.forEach((desc) => (explanationHtml += `<li>${desc}</li>`));
  });
  explanationHtml += `</ul></div>`;
  resultContainer.insertAdjacentHTML("afterend", explanationHtml);
  resultEl.classList.remove("hidden");
}

// 乘法步骤生成
function generateMultiplicationSteps(num1, num2) {
  const steps = [];
  const num1Str = num1.toString();
  const num2Str = num2.toString();
  const partProducts = [];
  const carryDetails = [];

  steps.push({
    explanation: [
      `计算 ${num1} × ${num2}，从乘数2的个位开始，逐位与乘数1相乘`,
      `乘数1：${num1Str}，乘数2：${num2Str}`,
    ],
  });

  for (let i = num2Str.length - 1; i >= 0; i--) {
    const digit2 = parseInt(num2Str[i]);
    let carry = 0;
    let partProduct = "";
    const stepExplanations = [
      `用乘数2的第${num2Str.length - i}位（数字${digit2}）乘以乘数1的每一位`,
    ];
    const digitCarries = [];

    for (let j = num1Str.length - 1; j >= 0; j--) {
      const digit1 = parseInt(num1Str[j]);
      const product = digit1 * digit2 + carry;
      const currentDigit = product % 10;
      carry = Math.floor(product / 10);
      partProduct = currentDigit + partProduct;
      digitCarries.push({
        digit1,
        digit2,
        position: j,
        carry: carry,
      });
      stepExplanations.push(
        `${digit1} × ${digit2} + 进位${
          carry === 0 ? "0" : carry
        } = ${product}，写${currentDigit}，进位${carry}`
      );
    }

    if (carry > 0) {
      partProduct = carry + partProduct;
      stepExplanations.push(`最后进位${carry}，直接写下`);
    }

    const partProductNum = parseInt(partProduct);
    partProducts.push(partProductNum);
    carryDetails.push({
      digitPosition: num2Str.length - 1 - i,
      digitCarries,
      partProduct: partProductNum,
    });

    steps.push({
      digit2,
      partProduct: partProductNum,
      digitPosition: num2Str.length - 1 - i,
      digitCarries,
      explanation: stepExplanations,
    });
  }

  const product = partProducts.reduce((sum, p, i) => sum + p * 10 ** i, 0);
  steps.push({
    explanation: [
      `将部分积相加（注意错位对齐）：${partProducts
        .map((p, i) => `${p}×10^${i}`)
        .join(" + ")} = ${product}`,
      `最终结果：${num1} × ${num2} = ${product}`,
    ],
  });

  return { steps, product, partProducts, carryDetails };
}

// 乘法竖式渲染（使用区分class确保对齐）
function renderMultiplicationVertical(num1, num2, data) {
  const { carryDetails, product } = data;
  const num1Str = num1.toString();
  const num2Str = num2.toString();
  // 计算最大长度用于对齐
  const maxLen = Math.max(num1Str.length, num2Str.length);
  // 计算被乘数左侧偏移量（右对齐）
  const multiplicandOffset = (maxLen - num1Str.length) * 40 + 20;

  // 构建被乘数（使用专属class）
  let num1Html = "";
  const firstCarry =
    carryDetails.length > 0 ? carryDetails[0].digitCarries : [];
  for (let i = 0; i < num1Str.length; i++) {
    const carry = firstCarry.find((c) => c.position === i)?.carry || 0;
    num1Html += `<div class="multiplicand-digit">${num1Str[i]}${
      carry > 0 ? `<span class="carry">${carry}</span>` : ""
    }</div>`;
  }

  // 构建乘数（使用专属class）
  let num2Html = "";
  // 乘数右对齐偏移量
  const multiplierOffset = (maxLen - num2Str.length) * 40;
  for (let i = 0; i < num2Str.length; i++) {
    num2Html += `<div class="multiplier-digit">${num2Str[i]}</div>`;
  }

  // 构建部分积
  let partialProductsHtml = "";
  // 修改renderMultiplicationVertical函数中的部分积渲染部分
  carryDetails.forEach((item, index) => {
    const productStr = item.partProduct.toString();
    const paddedProduct = productStr.padStart(maxLen, " ");
    // 使用索引+1作为类名后缀，确保每个部分积有独特的类
    const className = `partial-product-${index + 1}`;
    partialProductsHtml += `<div class="${className}">${paddedProduct}</div>`;
  });

  // 拼接完整竖式
  return `
  <div class="multiplication-vertical">
    <div style="margin-left: ${multiplicandOffset}px">${num1Html}</div>
    <div style="margin-left: ${multiplierOffset}px">×${num2Html}</div>
    <div class="multiplication-line"></div>
    ${partialProductsHtml}
    <div class="multiplication-line"></div>
    <div class="multiplication-result">${product
      .toString()
      .padStart(maxLen)}</div>
  </div>
`;
}

// 除法相关逻辑保持不变
function generateDivisionSteps(dividend, divisor) {
  const steps = [];
  const quotientDigits = [];
  let remainder = 0;
  let hasDecimal = false;
  let decimalCount = 0;
  const maxDecimal = 6;

  const [integerPart, decimalPart] = dividend.toString().split(".").concat("");
  const integerDigits = integerPart.split("").map(Number);
  const decimalDigits = decimalPart ? decimalPart.split("").map(Number) : [];
  const allDigits = [...integerDigits, ...decimalDigits];
  const totalDigits = allDigits.length;
  const integerLength = integerDigits.length;
  let digitIndex = 0;

  let currentNum = 0;
  while (digitIndex < totalDigits && currentNum < divisor) {
    currentNum = currentNum * 10 + allDigits[digitIndex];
    digitIndex++;
  }

  const firstDigit = Math.floor(currentNum / divisor);
  quotientDigits.push(firstDigit);
  const firstProduct = firstDigit * divisor;
  remainder = currentNum - firstProduct;

  const firstExplanation = [
    `被除数是${dividend}，除数是${divisor}`,
    `从最高位开始，取${currentNum}（被除数前${digitIndex}位）除以${divisor}，最大商为${firstDigit}`,
    `商${firstDigit}×除数${divisor}=${firstProduct}`,
    `${currentNum}-${firstProduct}=${remainder}（余数）`,
  ];
  steps.push({
    minuend: currentNum,
    product: firstProduct,
    remainder: remainder,
    carryDigit: null,
    isOriginalDigit: false,
    explanation: firstExplanation,
  });

  while (digitIndex < totalDigits || remainder !== 0) {
    if (digitIndex >= integerLength && !hasDecimal) {
      quotientDigits.push(".");
      hasDecimal = true;
    }

    let currentDigit = 0;
    let isOriginalDigit = false;
    if (digitIndex < totalDigits) {
      currentDigit = allDigits[digitIndex];
      isOriginalDigit = true;
      digitIndex++;
    } else {
      currentDigit = 0;
      isOriginalDigit = false;
      if (!hasDecimal) {
        quotientDigits.push(".");
        hasDecimal = true;
      }
      decimalCount++;
      if (decimalCount > maxDecimal) break;
    }

    const newMinuend = remainder * 10 + currentDigit;
    const digit = newMinuend >= divisor ? Math.floor(newMinuend / divisor) : 0;
    quotientDigits.push(digit);

    const product = digit * divisor;
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

    if (newMinuend < divisor) {
      explanation.push(`${newMinuend}<${divisor}，商补0`);
    } else {
      explanation.push(
        `${newMinuend}÷${divisor}=${digit}（${divisor}×${digit}=${product}）`
      );
    }
    explanation.push(`${digit}×${divisor}=${product}`);
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

  if (remainder === 0) {
    steps[steps.length - 1].explanation.push("余数为0，计算结束");
  }

  return {
    steps: steps,
    quotient: parseFloat(quotientDigits.join("")),
  };
}

function renderDivisionVertical(dividend, divisor, data) {
  const { steps, quotient } = data;
  const quotientStr = formatNumber(quotient);
  const fullDividend = dividend.toString();

  let html = `<div class="division-container inline-block">`;
  html += `<div class="mb-1 ml-[calc(50%+12px)]">${quotientStr}</div>`;
  html += `<div class="division-bar relative">`;
  html += `<div class="divisor">${divisor}</div>`;

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
