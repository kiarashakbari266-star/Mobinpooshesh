(() => {
  "use strict";
  const menu = document.querySelector(".insurance-menu");
  document.addEventListener("click", (event) => {
    if (menu && !menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu?.open) {
      menu.open = false;
      menu.querySelector("summary").focus();
    }
  });
  const normalize = (text) =>
    text
      .normalize("NFKC")
      .replace(/[يى]/g, "ی")
      .replace(/ك/g, "ک")
      .replace(/[\u064B-\u065F\u200c\u200d]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  const input = document.querySelector("#insurance-search");
  if (input) {
    const cards = [...document.querySelectorAll("[data-category]")];
    document.querySelector(".search-box").hidden = false;
    const initialOpen = new Map();
    let searching = false;
    input.addEventListener("input", () => {
      const query = normalize(input.value);
      if (query && !searching)
        cards.forEach((card) =>
          initialOpen.set(card, card.querySelector("details").open),
        );
      let visible = 0;
      for (const card of cards) {
        const familyMatch = normalize(
          card.querySelector("h3").textContent,
        ).includes(query);
        const items = [...card.querySelectorAll("li")];
        let matches = 0;
        for (const item of items) {
          item.hidden =
            !!query &&
            !familyMatch &&
            !normalize(item.textContent).includes(query);
          if (!item.hidden) matches++;
        }
        card.hidden = matches === 0;
        if (!card.hidden) visible++;
        const details = card.querySelector("details");
        if (query) details.open = !card.hidden;
        else if (searching) details.open = initialOpen.get(card) || false;
      }
      searching = !!query;
      document.querySelector("#search-status").textContent = query
        ? `${visible.toLocaleString("fa-IR")} رشته بیمه با این عبارت پیدا شد.`
        : "نام رشته بیمه یا یکی از پوشش‌های آن را بنویسید.";
      document.querySelector("#empty-results").hidden = visible !== 0;
    });
  }
  const context = document.querySelector("#consultation-context");
  const selected = new URLSearchParams(location.search).get("insurance");
  if (context && selected) {
    context.textContent = `درخواست مشاوره: ${selected.slice(0, 180)} — برای بررسی شرایط این بیمه با ما تماس بگیرید.`;
    context.hidden = false;
  }
})();
