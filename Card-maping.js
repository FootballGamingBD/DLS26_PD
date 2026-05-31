// ১. কার্ডের উপাদানগুলোর নিখুঁত পজিশন ও সাইজ (আপনার দেওয়া ইমেজ অনুযায়ী)
const style = document.createElement('style');
style.textContent = `
  .dls-card-wrapper {
    display: flex;
    justify-content: center;
    margin: 25px auto;
    font-family: 'Arial', sans-serif;
  }
  
  /* মেইন কার্ড কন্টেইনার */
  .dls-player-card {
    position: relative;
    width: 280px;
    height: 400px;
    border-radius: 14px;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    box-shadow: 0 10px 25px rgba(0,0,0,0.4);
  }

  /* বর্ডার ইমেজ (কার্ডের একদম উপরে ফিট হবে) */
  .card-border-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
    pointer-events: none;
  }

  /* রেটিং সার্কেল */
  .card-rating-circle {
    position: absolute;
    top: 55px;
    left: 25px;
    width: 60px;
    height: 60px;
    z-index: 4;
  }

  /* রেটিং টেক্সট (সার্কেলের ঠিক মাঝখানে) */
  .card-rating-text {
    position: absolute;
    top: 66px;
    left: 25px;
    width: 60px;
    text-align: center;
    font-size: 28px;
    font-weight: 900;
    color: #ffffff;
    z-index: 4;
    text-shadow: 1px 1px 4px rgba(0,0,0,0.8);
  }

  /* প্লেয়ার ফটো (পেছনের ব্যাকগ্রাউন্ডের সাথে ফিট হবে) */
  .card-player-photo {
    position: absolute;
    top: 30px;
    right: 15px;
    width: 170px;
    height: 220px;
    object-fit: contain;
    z-index: 2;
  }

  /* গোল্ডেন কালার নেম প্লেট স্ট্রিপ */
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

  /* প্লেয়ারের নাম */
  .card-player-name {
    font-size: 22px;
    font-weight: 900;
    color: #000000;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* ফ্ল্যাগ এবং পজিশনের নিচের সেকশন */
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

  /* দেশের পতাকা */
  .card-flag-img {
    width: 48px;
    height: 32px;
    object-fit: cover;
    border-radius: 3px;
    box-shadow: 1px 1px 3px rgba(0,0,0,0.5);
  }

  /* পজিশন বক্স (যেমন: CF) */
  .card-position-box {
    background: #e10600;
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
    padding: 4px 10px;
    border-radius: 5px;
    text-transform: uppercase;
    box-shadow: 1px 1px 3px rgba(0,0,0,0.5);
  }

  /* নিচে থাকা স্টার বা রেয়ারিটি */
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

// ২. মেইন ডাটা সার্চ এবং জেনারেটর ইঞ্জিন
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

          // ফোল্ডারের নামের স্পেসগুলো ঠিকভাবে রেন্ডার করার জন্য encodeURIComponent ব্যবহার করা হয়েছে
          const bgUrl = `${base}${encodeURIComponent('Card bg')}/${player['card-bg']}`;
          const borderUrl = `${base}${encodeURIComponent('Card border')}/${player.border}`;
          const ratingCircleUrl = `${base}${encodeURIComponent('Rating-circle')}/${player.rating_circle}`;
          const photoUrl = `${base}${encodeURIComponent('Player photos')}/${player.photo}`;
          const flagUrl = `${base}${encodeURIComponent('Flags')}/${player.flag}`;
          const starUrl = `${base}${encodeURIComponent('Star')}/${player.star}`;

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
          resultEl.innerHTML = "<p style='color:#ff4a6b; text-align:center; font-weight:bold;'>প্লেয়ার পাওয়া যায়নি!</p>";
        }
      })
      .catch(err => {
        console.error("Error loader:", err);
        resultEl.innerHTML = "<p style='color:#ff4a6b; text-align:center; font-weight:bold;'>ডাটাবেজ কানেক্ট করতে সমস্যা হয়েছে!</p>";
      });
  });
};
