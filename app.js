(() => {
  let currentStep = 1;
  let mode = "count";
  let timer;
  const totalSteps = 4;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const values = () => ({
    hook: Number($("#hook-range").value),
    segments: Number($("#segments-range").value),
    clip: Number($("#clip-range").value),
    count: Math.max(1, Math.min(100, Number($("#output-count").value) || 1)),
    resolution: $("#resolution").value,
  });

  const duration = () => {
    const v = values();
    if (mode === "music") return 18;
    return v.hook + v.segments * v.clip;
  };

  function syncValues() {
    const v = values();
    $("#hook-value").textContent = `${v.hook.toFixed(1)}s`;
    $("#segments-value").textContent = `${v.segments} 段`;
    $("#clip-value").textContent = `${v.clip.toFixed(1)}s`;
    $("#duration-estimate").textContent = `${duration().toFixed(1)} 秒`;
    $("#mode-note").textContent = mode === "music" ? "以演示 BGM 的 18 秒为成片长度" : mode === "groups" ? `Hook + ${v.segments} 个分组片段` : `Hook + ${v.segments} 个 Body 片段`;
    $("#summary-count").textContent = `${v.count} 条`;
    $("#summary-duration").textContent = `${duration().toFixed(1)} 秒`;
    $("#summary-resolution").textContent = v.resolution;
  }

  function showStep(step) {
    currentStep = Math.max(1, Math.min(totalSteps, step));
    $$(".step").forEach((el) => el.classList.toggle("active", Number(el.dataset.step) === currentStep));
    $$(".step-panel").forEach((el) => el.classList.toggle("active", Number(el.dataset.panel) === currentStep));
    $("#prev-step").disabled = currentStep === 1;
    $("#next-step").textContent = currentStep === totalSteps ? "重新查看 ↺" : "下一步 →";
    $("#step-label").textContent = `${currentStep} / ${totalSteps}`;
    syncValues();
  }

  $$(".step").forEach((el) => el.addEventListener("click", () => showStep(Number(el.dataset.step))));
  $("#prev-step").addEventListener("click", () => showStep(currentStep - 1));
  $("#next-step").addEventListener("click", () => showStep(currentStep === totalSteps ? 1 : currentStep + 1));

  ["#hook-range", "#segments-range", "#clip-range", "#output-count", "#resolution"].forEach((id) => $(id).addEventListener("input", syncValues));
  $$(".choice").forEach((el) => el.addEventListener("click", () => {
    mode = el.dataset.mode;
    $$(".choice").forEach((item) => item.classList.toggle("active", item === el));
    syncValues();
  }));

  $$(".file-input").forEach((input) => input.addEventListener("change", () => {
    const count = input.files.length;
    const target = document.getElementById(input.dataset.target);
    target.textContent = count ? `已选 ${count} 条（不上传）` : "未选择文件";
  }));

  const phases = [
    [8, "[预检] 检查素材格式与音轨…"],
    [22, "[组合] 随机选取 Hook 和 Body 片段…"],
    [46, "[混音] 合并原声、BGM 与配音…"],
    [71, "[编码] 应用输出规格与画面变换…"],
    [91, "[导出] 写入独立成片文件…"],
    [100, "[完成] 模拟任务已完成。下载桌面版可进行真实导出。"],
  ];

  $("#run-demo").addEventListener("click", () => {
    clearInterval(timer);
    const button = $("#run-demo");
    const logs = ["[系统] 使用演示数据创建模拟任务…"];
    let progress = 0;
    let phaseIndex = 0;
    button.disabled = true;
    button.textContent = "模拟处理中…";
    $("#task-log").textContent = logs.join("\n");
    timer = setInterval(() => {
      progress = Math.min(100, progress + Math.ceil(Math.random() * 5));
      while (phaseIndex < phases.length && progress >= phases[phaseIndex][0]) {
        logs.push(phases[phaseIndex][1]);
        phaseIndex += 1;
      }
      $("#progress-value").textContent = `${progress}%`;
      $("#progress-bar").style.width = `${progress}%`;
      $("#progress-label").textContent = progress === 100 ? "模拟完成" : `处理 ${Math.max(1, Math.ceil(values().count * progress / 100))} / ${values().count}`;
      $("#task-log").textContent = logs.join("\n");
      $("#task-log").scrollTop = $("#task-log").scrollHeight;
      if (progress === 100) {
        clearInterval(timer);
        button.disabled = false;
        button.innerHTML = "<span>↺</span> 重新模拟";
      }
    }, 180);
  });

  syncValues();
})();
