let SavedDeck = JSON.parse(localStorage.getItem('mydeck')) || [];
let SavedCardsList = JSON.parse(localStorage.getItem(`cardslist`)) || [];
renderDeck(); 
updateTeamCount();



// Cards List
const cards = document.querySelector("#Ccards");
if(SavedCardsList.length == 0) {
creatures.forEach((c) => SavedCardsList.push(c))
localStorage.setItem(`cardslist`, JSON.stringify(SavedCardsList))
}
cardsList(SavedCardsList)

//cardsList Function
function cardsList(data) {

if (cards) {
  cards.innerHTML = "";

  data.forEach(c => {
      cards.innerHTML += `<article class="relative flex flex-col gap-3 rounded-2xl p-3 pb-4 border border-gray-800 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-yellow-500/50 hover:shadow-2xl cursor-pointer bg-[#12161c] bg-cover bg-center" data-id="${c.id}" style="background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('images/bg.png')">
      
      <div class="relative flex items-center justify-center rounded-xl overflow-hidden">
        <span class="absolute top-2 left-2 font-mono text-xs font-bold text-yellow-400 bg-black/70 px-2 py-0.5 rounded border border-yellow-500/30 z-10">${c.id}</span>
        <img src="${c.image}" alt="${c.name}" class="w-full h-auto object-contain rounded-lg">
      </div>

      <button type="button" class="card-btn w-full py-2.5 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-black font-bold rounded-lg shadow-md transition-all cursor-pointer">
        Add to your cards
      </button>

    </article>`;
})};
}


//filter
let filter = document.querySelector("#filter")
let enabledFilter = false
let filterValue = []
filter.addEventListener("change", (event) => {
  if(event.target.value == "Tous") {
    cardsList(SavedCardsList)
  } else {
    filterValue = SavedCardsList.filter((c) => c.type == event.target.value)
    cardsList(filterValue)
    enabledFilter = true
  }
})

//search
let search = document.querySelector("#search")
let filterSelect = document.querySelector("#filter");
let sortSelect = document.querySelector("#sort");
search.addEventListener("input", (event) => {
  let query = event.target.value.toLowerCase().trim();
let match = SavedCardsList.filter((c) => c.name.toLowerCase().includes(query));
cardsList(match);
if (filterSelect) filterSelect.value = "Tous"; 
if (sortSelect) sortSelect.value = "id";
})

//sort
let sort = document.querySelector("#sort")
sort.addEventListener('change', (event) => {
   let value = event.target.value
   let sorted = []
   if(enabledFilter == true) {
    sorted = [...filterValue]
   } else {
    sorted = [...SavedCardsList]
   }
   if(value != "id") {
    sorted.sort((a, b) => {
      let valA = (value === "attack" || value === "defence") ? Number(a.stats[value]) : Number(a[value]);
           let valB = (value === "attack" || value === "defence") ? Number(b.stats[value]) : Number(b[value]);
           
           return valB - valA; 
    })
   
    cardsList(sorted)
   } else if (value == "id") cardsList(sorted)
})

// show card detail

  cards.addEventListener('click', (event) => {
    if (event.target.closest('button') && event.target.closest('button').classList.contains('card-btn')) {
      return; 
    }

    const article = event.target.closest('article');
    if (!article) return;

    const cardId = article.querySelector('span').textContent
    const selectedCard = SavedCardsList.find(c => c.id === cardId);

    if (selectedCard) {
      showCardDetails(selectedCard);
    }
});

function showCardDetails(cardData) {
  const detailSection = document.getElementById('dcard');
  if (!detailSection) return;


  detailSection.innerHTML = `
    <article id="detail" aria-label="Détail de la créature" class="relative flex flex-col gap-3 rounded-2xl p-4 border border-gray-800 shadow-2xl bg-[#12161c] bg-cover bg-center" style="background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('images/bg.png')">
      
      <div class="flex items-center justify-between relative z-10">
        <span class="font-mono text-xs font-bold text-yellow-400 bg-black/70 px-2.5 py-1 rounded border border-yellow-500/30">${cardData.id} · Détail</span>
        <button type="button" aria-label="Fermer le détail" class="w-8 h-8 flex items-center justify-center text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors cursor-pointer">✕</button>
      </div>

      <div class="relative flex items-center justify-center rounded-xl overflow-hidden z-10">
        <img src="${cardData.image}" alt="${cardData.name}" class="w-full h-auto object-contain rounded-lg">
      </div>


    </article>
  `;

  const closeBtn = detailSection.querySelector('button[aria-label="Fermer le détail"]');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      detailSection.innerHTML = "";
    });
  }
}

// Add mew cards to the list

// Validation
const form = document.querySelector(`#creature-form`);

const regexPatterns = {
    id: /^#\d{3}$/,                  
    name: /^[a-zA-Z\s]{2,30}$/, 
    type: /^(Effect|LIGHT|Fusion|DARK|EARTH|WATER)$/,  
    level: /^([0-9]|1[0-2])$/,  
    attack: /^([0-9]|[1-9][0-9]{1,2}|[1-4][0-9]{3}|5000)$/,              
    defence: /^([0-9]|[1-9][0-9]{1,2}|[1-4][0-9]{3}|5000)$/,
    image:/^https?:\/\/.+\.(png|jpg|jpeg|webp|gif)$/i,         
    description: /^[\s\S]{10,200}$/  
};

const errorMessages = {
    id: "The format must be # followed by 3 digits (e.g., #010)",
    name: "The name must contain only letters (2-30 characters).",
    level: "Please enter a valid level.",
    attack: "The attack must be a number between 0 and 5000.",
    defence: "The defence must be a number between 0 and 5000.",
    image: "Please enter a valid image link (starting with https:// and ending with a valid image format).",
    description: "The description must contain between 10 and 200 characters."
};

form.addEventListener(`focusout`, (event) => {
  const input = event.target
  const fieldName = input.name

  if (!regexPatterns[fieldName]) return;

  validateField(input, fieldName);
})

function validateField(input, fieldName) {
  const pattern = regexPatterns[fieldName];
  const errorSpan = input.nextElementSibling;
  if (input.value == "") {
    if(errorSpan && errorSpan.classList.contains(`error-message`)) {
      input.classList.remove(`border-red-500`);
      input.classList.remove(`border-green-500`);
      errorSpan.textContent = "";
      }
  }
  else if (pattern.test(input.value.trim())) {
    input.classList.remove(`border-red-500`);
    input.classList.add(`border-green-500`)
    if(errorSpan && errorSpan.classList.contains(`error-message`)) {
      errorSpan.textContent = "";
    }
    return true
  } else {
    input.classList.remove(`border-green-500`);
    input.classList.add(`border-red-500`);
    if(errorSpan && errorSpan.classList.contains(`error-message`)) {
       errorSpan.textContent = errorMessages[fieldName];
       errorSpan.style.color = "red"
    }
    return false
  }
}

form.addEventListener(`submit`, (event) => {
  event.preventDefault();

  let isFormValid = true

  Object.keys(regexPatterns).forEach(fieldName => {
    const input = form.elements[fieldName];
    if(input) {
      const isValid = validateField(input, fieldName);
      if(!isValid) {
        isFormValid = false
      }
    }
  })

  if (!isFormValid) {
    
    console.log("Rectify the errors before submiting.")
    return;
  }


  const formData = new FormData(form);
  
  const newCard = {
    id: formData.get("id"),
    name: formData.get("name"),
    type: formData.get("type"),
    level: formData.get("level"),
    stats: {attack: formData.get("attack"), defence: formData.get("defence")},
    image: formData.get("image"),
    description: formData.get("description")
  };

  SavedCardsList.push(newCard);
  localStorage.setItem(`cardslist`, JSON.stringify(SavedCardsList))

  cardsList(SavedCardsList);

  form.reset();

  form.querySelectorAll('input, textarea, select').forEach(input => {
    input.classList.remove('border-green-500', 'border-red-500');
  });
  
  let Ccounts = document.querySelector("#cards-count")
  Ccounts.textContent = Object.keys(SavedCardsList).length

  console.log("New card added successfully!", newCard);
});


  // Add to my cards

  cards.addEventListener('click', (event) => {
    if (event.target.closest('button') && event.target.closest('button').classList.contains('card-btn')) {
      const button = event.target.closest("button")

      const article = button.closest('article');
      if (!article) return;

      const cardId = article.querySelector('span').textContent
      const selectedCard = SavedCardsList.find(c => c.id == cardId)

      if (selectedCard) {
        addToMyCards(selectedCard)
      }
      

    } 

});


  function addToMyCards(cardData) {
    const mycardsSection = document.getElementById('mycards');
    if (!mycardsSection || mycardsSection.children.length >= 6) return;
    
    const existingCards = mycardsSection.querySelectorAll("#card-item");
    const isAlreadyAdded = Array.from(existingCards).some((d) => d.querySelector("span").textContent.includes(cardData.id));
    if (isAlreadyAdded) return;
    
    SavedDeck.push(cardData)
    
    localStorage.setItem(`mydeck`, JSON.stringify(SavedDeck))

    renderDeck(); 
    updateTeamCount();
  }

  function renderDeck() {
    const mycardsSection = document.getElementById('mycards');
    if (!mycardsSection) return;
    
    mycardsSection.innerHTML = ""; 
    
    SavedDeck.forEach(cardData => {
        mycardsSection.innerHTML += `
           <div id="card-item" class="w-full min-h-[220px] border border-gray-700 rounded-lg p-2" data-id="${cardData.id}"> 
            <div class="flex items-center justify-between relative z-10">
              <span class="font-mono text-xs font-bold text-yellow-400 bg-black/70 px-2.5 py-1 rounded border border-yellow-500/30">${cardData.id} · Détail</span>
              <button type="button" aria-label="Remove card" class="remove-btn w-8 h-8 flex items-center justify-center text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors cursor-pointer">✕</button>
            </div>

            <div class="relative flex items-center justify-center rounded-xl overflow-hidden z-10">
              <img src="${cardData.image}" alt="${cardData.name}" class="w-full h-auto object-contain rounded-lg" loading="lazy">
            </div>
          </div>
        `;
    });
}

  function updateTeamCount() {
    const mycardsSection = document.getElementById('mycards');
    let count = document.querySelectorAll(".team-count");
    if (mycardsSection && count) {
      count.forEach((c) => c.textContent = mycardsSection.children.length);
    }

  }

  const mycardsSection = document.getElementById('mycards');
  if (mycardsSection) {
    mycardsSection.addEventListener('click', (event) => {
      const removeBtn = event.target.closest('button[aria-label="Remove card"]');
      if (!removeBtn) return;

      const cardItem = removeBtn.closest('#card-item');
      if (cardItem) {
        const cardId = cardItem.getAttribute('data-id');
        SavedDeck = SavedDeck.filter((c) => c.id != cardId)
        localStorage.setItem(`mydeck`, JSON.stringify(SavedDeck))
        renderDeck(SavedDeck)
        updateTeamCount();
      }
    });
  }