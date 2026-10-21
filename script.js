// show card detail

function showCardDetails(cardData) {
  const detailSection = document.getElementById('dcard');
  if (!detailSection) return;

  const maxStat = 5000; 

  const atkPercent = Math.min(100, (cardData.stats.attack / maxStat) * 100);
  const defPercent = Math.min(100, (cardData.stats.defence / maxStat) * 100);

  detailSection.innerHTML = `
    <section id="detail" aria-label="Détail de la créature" class="flex flex-col gap-3 rounded-card border-2 border-ink bg-white p-6">
      <div class="flex items-center justify-between">
        <span class="font-mono text-sm text-muted">${cardData.id} · Détail</span>
        <button type="button" aria-label="Fermer le détail" class="btn-outline w-11 px-0">✕</button>
      </div>
      <div class="flex h-48 items-center justify-center rounded-2xl bg-brand-light overflow-hidden">
        <img src="${cardData.image}" alt="${cardData.name}" class="h-full w-full object-contain p-2">
      </div>
      <div class="flex items-center justify-between">
        <h2 class="font-display text-3xl font-extrabold">${cardData.name}</h2>
        <span class="rounded-full bg-brand-light px-3 py-1 text-sm font-bold">${cardData.type}</span>
      </div>
      <p class="text-gray-700">${cardData.description}</p>
      
      <div class="flex flex-col gap-2 text-sm">
        <div class="grid grid-cols-[80px_1fr_40px] items-center gap-2 mt-7">
          <span class="font-bold">ATK</span>
          <span class="h-3 rounded-full bg-ground overflow-hidden">
            <span class="block h-3 rounded-full bg-brand" style="width: ${atkPercent}%"></span>
          </span>
          <span class="text-right font-mono">${cardData.stats.attack}</span>
        </div>
        
        <div class="grid grid-cols-[80px_1fr_40px] items-center gap-2 mb-7">
          <span class="font-bold">DEF</span>
          <span class="h-3 rounded-full bg-ground overflow-hidden">
            <span class="block h-3 rounded-full bg-brand" style="width: ${defPercent}%"></span>
          </span>
          <span class="text-right font-mono">${cardData.stats.defence}</span>
        </div>
      </div>

      <button type="button" class="btn-primary">Ajouter à l'équipe</button>
    </section>
  `;

  const closeBtn = detailSection.querySelector('button[aria-label="Fermer le détail"]');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      detailSection.innerHTML = "";
    });
  }
}

var cards = document.querySelector("#Ccards");
if (cards && typeof creatures !== 'undefined') {
  cards.innerHTML = "";

  creatures.forEach(c => {
      cards.innerHTML += `<article class="flex flex-col gap-3 rounded-card bg-white p-3 pb-4 border-2 border-transparent transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-brand hover:shadow-2xl cursor-pointer" data-id="${c.id}">
            <div class="relative flex h-36 items-center justify-center rounded-xl bg-brand-light overflow-hidden">
              <img src="${c.image}" alt="${c.name}" class="h-full w-full object-contain p-2">
              <span class="absolute left-3 top-2 font-mono text-sm text-muted">${c.id}</span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <h3 class="font-display text-xl font-semibold">${c.name}</h3>
              <span class="rounded-full bg-brand-light px-3 py-1 text-sm font-bold text-ink">${c.type}</span>
            </div>
            <p class="text-sm text-muted">ATK  ${c.stats.attack} · DEF  ${c.stats.defence}</p>
            <button type="button" class="card-btn btn-outline cursor-pointer">Ajouter à l'équipe</button>
          </article>`;
})};

  cards.addEventListener('click', (event) => {
    if (event.target.closest('button') && event.target.closest('button').classList.contains('card-btn')) {
      return; 
    }

    const article = event.target.closest('article');
    if (!article) return;

    const cardId = article.querySelector('span').textContent
    const selectedCard = creatures.find(c => c.id === cardId);

    if (selectedCard) {
      showCardDetails(selectedCard);
    }
});

