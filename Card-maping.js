// ১. কার্ডের উপাদানগুলোর ডিজাইন (CSS)
const style = document.createElement('style');
style.textContent = `
  .dls-card-wrapper {
    display: flex;
    justify-content: center;
    margin: 25px auto;
  }
  
  .dls-player-card {
    position: relative;
    width: 280px;
    height: 400px;
    border-radius: 14px;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  }

  .card-border-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
    pointer-events: none;
  }

  .card-rating-circle {
    position: absolute;
    top: 55px;
    left: 25px;
    width: 60px;
    height: 60px;
    z-index: 4;
  }

  .card-rating-text {
    position: absolute;
    top: 66px;
    left: 25px;
    width: 60px;
    text-align: center;
    font-size: 28px;
    color: #ffffff;
    z-index: 6; /* বর্ডারের উপরে রাখা হলো */
    text-shadow: 1px 1px 4px rgba(0,0,0,0.8);
    font-family: 'DLS Font', Arial, sans-serif !important;
    font-weight: normal !important;
  }

  .card-player-photo {
    position: absolute;
    top: 40px;
    right: 15px;
    width: 170px;
    height: 220px;
    object-fit: contain;
    z-index: 2;
  }

  /* গোল্ডেন বক্স রিমুভ করে নামটিকে সরাসরি কার্ডের পজিশনে আনা হলো */
  .card-player-name {
    position: absolute;
    bottom: 118px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 20px;
    color: #000000;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    z-index: 6;
    font-family: 'DLS Font', Arial, sans-serif !important;
    font-weight: normal !important;
  }

  .card-bottom-row {
    position: absolute;
    bottom: 45px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    z-index: 6;
  }

  .card-flag-img {
    width: 48px;
    height: 32px;
    object-fit: cover;
    border-radius: 3px;
    box-shadow: 1px 1px 3px rgba(0,0,0,0.5);
  }

  .card-position-box {
    background: #e10600;
    color: #ffffff;
    font-size: 16px;
    padding: 4px 10px;
    border-radius: 5px;
    text-transform: uppercase;
    box-shadow: 1px 1px 3px rgba(0,0,0,0.5);
    font-family: 'DLS Font', Arial, sans-serif !important;
    font-weight: normal !important;
  }

  .card-star-img {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    object-fit: contain;
    z-index: 6;
  }
`;
document.head.appendChild(style);

// ২. মেইন ডেটা সার্চ ইঞ্জিন
window.initDLSSearch = function(elements) {
  const inputEl = document.getElementById(elements.inputId);
  const btnEl = document.getElementById(elements.btnId);
  const resultEl = document.getElementById(elements.resultId);

  if (!inputEl || !btnEl || !resultEl) return;

  btnEl.addEventListener('click', () => {
    const query = inputEl.value.toLowerCase().trim();
    if (!query) {
      alert("দয়া করে প্লেয়ারের নাম লিখুন!");
      return;
    }

    fetch(elements.jsonUrl)
      .then(response => response.json())
      .then(players => {
        const player = players.find(p => p.searchName.toLowerCase().includes(query));
        
        if (player) {
          const base = elements.imageBaseUrl;

          let photoName = player.photo;
          if (photoName === "Messi-L83.webp") {
             photoName = "Messi-L-83.webp";
          }

          const bgUrl = `${base}Card-bg/${player['card-bg']}`;
          const borderUrl = `${base}Card-border/${player.border}`;
          const ratingCircleUrl = `${base}Rating-circle/${player.rating_circle}`;
          const photoUrl = `${base}Player-photos/${photoName}`;
          const flagUrl = `${base}Flags/${player.flag}`;
          const starUrl = `${base}Star/${player.star}`;

          resultEl.innerHTML = `
            <div class="dls-card-wrapper">
              <div class="dls-player-card" style="background-image: url('${bgUrl}');">
                <img class="card-border-img" src="${borderUrl}" alt="Border">
                <img class="card-rating-circle" src="${ratingCircleUrl}" alt="Circle">
                <div class="card-rating-text">${player.rating}</div>
                <img class="card-player-photo" src="${photoUrl}" alt="${player.name}">
                
                <!-- গোল্ডেন বক্স ছাড়া সরাসরি নাম -->
                <div class="card-player-name">${player.name}</div>
                
                <div class="card-bottom-row">
                  <img class="card-flag-img" src="${flagUrl}" alt="Flag">
                  <div class="card-position-box">${player.position}</div>
                </div>
                <img class="card-star-img" src="${starUrl}" alt="Star">
              </div>
            </div>
          `;
        } else {
          resultEl.innerHTML = "<p style='color:#ff4a6b; text-align:center; font-family:\"DLS Font\", Arial, sans-serif;'>প্লেয়ার পাওয়া যায়নি!</p>";
        }
      })
      .catch(err => {
        console.error("Error loader:", err);
        resultEl.innerHTML = "<p style='color:#ff4a6b; text-align:center; font-family:\"DLS Font\", Arial, sans-serif;'>ডাটাবেজ কানেক্ট করতে সমস্যা হয়েছে!</p>";
      });
  });
};
