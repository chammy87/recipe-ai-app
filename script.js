// ローディングや再提案用の要素
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const retryBtn = document.getElementById("retryBtn");
const showHistoryBtn = document.getElementById("showHistoryBtn");
const historyContainer = document.getElementById("historyContainer");

// 履歴保存関数
function saveRecipeToHistory(recipe) {
  const history = JSON.parse(localStorage.getItem("recipeHistory")) || [];
  const timestamp = new Date().toLocaleString();
  history.unshift({ timestamp, recipe });
  localStorage.setItem("recipeHistory", JSON.stringify(history));
  showHistoryBtn.style.display = "block";
}

// 履歴表示関数
function displayHistory() {
  const history = JSON.parse(localStorage.getItem("recipeHistory")) || [];
  if (history.length === 0) return;

  historyContainer.innerHTML = "<h3>過去のレシピ</h3>";
  history.forEach((item, index) => {
    const entry = document.createElement("div");
    entry.className = "history-entry";
    entry.innerHTML = `
      <div class="history-time">${item.timestamp}</div>
      <div class="history-recipe">${item.recipe}</div>
    `;
    entry.onclick = () => {
      result.innerText = item.recipe;
      window.scrollTo({ top: result.offsetTop, behavior: 'smooth' });
    };
    historyContainer.appendChild(entry);
  });

  historyContainer.style.display = "block";
}

// レシピ取得
async function getRecipe() {
  const ingredients = document.getElementById("ingredients").value;
  const adultCount = document.getElementById("adultCount").value;
  const childrenCount = document.getElementById("childrenCount").value;
  const wantKidsMenu = document.getElementById("wantKidsMenu").value;
  const genre = document.getElementById("genre").value;
  const request = document.getElementById("request").value;
  const avoid = document.getElementById("avoid").value;

  result.innerText = "";
  loading.style.display = "block";
  retryBtn.style.display = "none";
  historyContainer.style.display = "none";

  try {
    const response = await fetch("/recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ingredients,
        adultCount,
        childrenCount,
        wantKidsMenu,
        genre,
        request,
        avoid,
      }),
    });

    const data = await response.json();
    result.innerText = data.recipe || "レシピが見つかりませんでした。";
    retryBtn.style.display = "block";
    showHistoryBtn.style.display = "block";
    saveRecipeToHistory(data.recipe);
  } catch (error) {
    console.error(error);
    result.innerText = "エラーが発生しました。";
  } finally {
    loading.style.display = "none";
  }
}

// イベントリスナー
retryBtn.addEventListener("click", getRecipe);
showHistoryBtn.addEventListener("click", displayHistory);
