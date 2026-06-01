// ১. কাস্টম DLS Font ফেস এবং কার্ডের উপাদানগুলোর ডিজাইন (CSS)
const style = document.createElement('style');
style.textContent = `
  /* কাস্টম DLS ফন্ট ইমপোর্ট করা হলো */
  @font-face {
      font-family: 'DLS Font';
      src: url('https://cdn.jsdelivr.net/gh/FootballGamingBD/Dls@main/dls_font.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
  }

  /* কার্ডের মেইন র‍্যাপার এবং গ্লোবাল ফন্ট সেটআপ */
  .dls-card-wrapper {
    display: flex;
    justify-content: center;
    margin: 25px auto;
    font-family: 'DLS Font', 'Arial', sans-serif; /* এখানে DLS Font সেট করা হয়েছে */
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
    font-family: 'DLS Font', sans-serif;
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

  /* রেটিং নম্বরের ডিজাইন ও ফন্ট */
  .card-rating-text {
    position: absolute;
    top: 66px;
    left: 25px;
    width: 60px;
    text-align: center;
    font-size: 28px;
    font-weight: normal;
    color: #ffffff;
    z-index: 4;
    text-shadow: 1px 1px 4px rgba(0,0,0,0.8);
    font-family: 'DLS Font', sans-serif; /* রেটিং ফন্ট */
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

  .card-name-plate {
    position: absolute;
    bottom: 110px;
    left: 5%;
    width: 90%;
    height: 42px;
    background: linear-gradient(180deg, #f3e09d 0%, #bca15a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  }

  /* প্লেয়ারের নামের ফন্ট */
  .card-player-name {
    font-size: 20px;
    color: #000000;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-family: 'DLS Font', sans-serif; 
  }

  .card-bottom-row {
    position: absolute;
    bottom: 45px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    z-index: 4;
  }

  .card-flag-img {
    width: 48px;
    height: 32px;
    object-fit: cover;
    border-radius: 3px;
    box-shadow: 1px 1px 3px rgba(0,0,0,0.5);
  }

  /* পজিশন টেক্সটের ফন্ট */
  .card-position-box {
    background: #e10600;
    color: #ffffff;
    font-size: 16px;
    padding: 4px 10px;
    border-radius: 5px;
    text-transform: uppercase;
    box-shadow: 1px 1px 3px rgba(0,0,0,0.5);
    font-family: 'DLS Font', sans-serif; 
  }

  .card-star-img {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    object-fit: contain;
    z-index: 4;
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

          // JSON ফাইলের ভুল নাম অটো-কারেক্ট (হাইফেন ফিক্স)
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
                <div class="card-name-plate">
                  <div class="card-player-name">${player.name}</div>
                </div>
                <div class="card-bottom-row">
                  <img class="card-flag-img" src="${flagUrl}" alt="Flag">
                  <div class="card-position-box">${player.position}</div>
                </div>
                <img class="card-star-img" src="${starUrl}" alt="Star">
              </div>
            </div>
          `;
        } else {
          resultEl.innerHTML = "<p style='color:#ff4a6b; text-align:center; font-family:\"DLS Font\", sans-serif;'>প্লেয়ার পাওয়া যায়নি!</p>";
        }
      })
      .catch(err => {
        console.error("Error loader:", err);
        resultEl.innerHTML = "<p style='color:#ff4a6b; text-align:center; font-family:\"DLS Font\", sans-serif;'>ডাটাবেজ কানেক্ট করতে সমস্যা হয়েছে!</p>";
      });
  });
};
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
    padding: 4px 10px;
    border-radius: 5px;
    text-transform: uppercase;
    box-shadow: 1px 1px 3px rgba(0,0,0,0.5);
  }

  .card-star-img {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    object-fit: contain;
    z-index: 4;
  }
`;
document.head.appendChild(style);

// ২. মেইন ডেটা সার্চ এবং ইউআরএল অটো-ফিক্স ইঞ্জিন
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

          // আপনার JSON ফাইলের ভুল নামটিকে কোডের মাধ্যমে অটো-কারেক্ট করা হলো 
          let photoName = player.photo;
          if (photoName === "Messi-L83.webp") {
             photoName = "Messi-L-83.webp"; // হাইফেন ফিক্স
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
                
                <!-- কার্ড বর্ডার -->
                <img class="card-border-img" src="${borderUrl}" alt="Border">
                
                <!-- রেটিং সার্কেল ও নম্বর -->
                <img class="card-rating-circle" src="${ratingCircleUrl}" alt="Circle">
                <div class="card-rating-text">${player.rating}</div>
                
                <!-- প্লেয়ার ফটো -->
                <img class="card-player-photo" src="${photoUrl}" alt="${player.name}">
                
                <!-- নাম প্লেট স্ট্রিপ -->
                <div class="card-name-plate">
                  <div class="card-player-name">${player.name}</div>
                </div>
                
                <!-- ফ্ল্যাগ ও পজিশন -->
                <div class="card-bottom-row">
                  <img class="card-flag-img" src="${flagUrl}" alt="Flag">
                  <div class="card-position-box">${player.position}</div>
                </div>
                
                <!-- রেয়ারিটি স্টার -->
                <img class="card-star-img" src="${starUrl}" alt="Star">
                
              </div>
            </div>
          `;
        } else {
          resultEl.innerHTML = "<p style='color:#ff4a6b; text-align:center; font-weight:bold;'>প্লেয়ার পাওয়া যায়নি!</p>";
        }
      })
      .catch(err => {
        console.error("Error loader:", err);
        resultEl.innerHTML = "<p style='color:#ff4a6b; text-align:center; font-weight:bold;'>ডাটাবেজ কানেক্ট করতে সমস্যা হয়েছে!</p>";
      });
  });
};
