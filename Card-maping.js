// ক্যানভাস ভিত্তিক DLS ২০০০×২০০০ কার্ড জেনারেটর ইঞ্জিন (গিটহাব মাস্টার সংস্করণ)
window.initDLSSearch = function(elements) {
  const inputEl = document.getElementById(elements.inputId);
  const btnEl = document.getElementById(elements.btnId);
  const resultEl = document.getElementById(elements.resultId);

  if (!inputEl || !btnEl || !resultEl) return;

  // ব্রাউজারে ফন্ট এবং রেসপন্সিভ ক্যানভাস স্টাইল ইনজেক্ট করা
  if (!document.getElementById('dls-canvas-style')) {
    const style = document.createElement('style');
    style.id = 'dls-canvas-style';
    style.textContent = `
      @font-face {
          font-family: 'DLS Font';
          src: url('https://cdn.jsdelivr.net/gh/FootballGamingBD/Dls@main/dls_font.ttf') format('truetype');
          font-weight: 900;
          font-style: normal;
          font-display: swap;
      }
      /* গ্রিড লেআউট যাতে একাধিক কার্ড পাশাপাশি সুন্দর দেখায় */
      #${elements.resultId} {
         display: flex;
         flex-wrap: wrap;
         justify-content: center;
         gap: 20px;
         margin-top: 20px;
      }
      .canvas-container {
         display: inline-block;
         transition: transform 0.3s ease;
      }
      .canvas-container:hover {
         transform: translateY(-5px);
      }
      .canvas-container canvas {
         max-width: 100%;
         height: auto;
         width: 260px; /* ব্লগারে পারফেক্ট ডিসপ্লে সাইজ */
         border-radius: 14px;
         box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      }
    `;
    document.head.appendChild(style);
  }

  let allPlayersData = [];

  // ইমেজ লোডার ফাংশন
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; 
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load: " + src));
      img.src = src;
    });
  };

  // একক কার্ড রেন্ডার করার ফাংশন
  const renderCard = (player) => {
    const base = elements.imageBaseUrl;
    const cacheBuster = "?v=" + Date.now(); // ছবি ইনস্ট্যান্ট লোড করার জন্য

    let photoName = player.photo;
    if (photoName === "Messi-L83.webp") photoName = "Messi-L-83.webp"; 

    let posImgName = player.position_box ? player.position_box : `${player.position.toLowerCase()}.png`;

    const urls = {
      bg: `${base}Card-bg/${player['card-bg']}${cacheBuster}`,
      border: `${base}Card-border/${player.border}${cacheBuster}`,
      circle: `${base}Rating-circle/${player.rating_circle}${cacheBuster}`,
      photo: `${base}Player-photos/${photoName}${cacheBuster}`,
      flag: `${base}Flags/${player.flag}${cacheBuster}`,
      posBox: `${base}Position-box/${posImgName}${cacheBuster}`, 
      star: `${base}Star/${player.star}${cacheBuster}`
    };

    Promise.all([
      document.fonts.load("190px 'DLS Font'"), 
      loadImage(urls.bg),
      loadImage(urls.border),
      loadImage(urls.circle),
      loadImage(urls.photo),
      loadImage(urls.flag),
      loadImage(urls.posBox), 
      loadImage(urls.star)
    ]).then(([fontStatus, bgImg, borderImg, circleImg, photoImg, flagImg, posBoxImg, starImg]) => {
      
      const canvas = document.createElement('canvas');
      canvas.width = 2000;
      canvas.height = 2000;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(bgImg, 0, 0, 2000, 2000);

      let type = player['card-bg'].toLowerCase();
      let pX = (type.includes('legendary') || type.includes('rare') || type.includes('common')) ? 622 : 406;
      let pY = (type.includes('legendary') || type.includes('rare') || type.includes('common')) ? 191 : -26;
      let pSize = (type.includes('legendary') || type.includes('rare') || type.includes('common')) ? 980 : 1200;
      
      ctx.drawImage(photoImg, pX, pY, pSize, pSize);
      ctx.drawImage(borderImg, 0, 0, 2000, 2000);
      ctx.drawImage(circleImg, 430, 260, 450, 450);

      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; 
      ctx.shadowBlur = 10; 
      ctx.shadowOffsetY = 5;
      ctx.fillStyle = "white"; 
      ctx.font = "900 190px 'DLS Font'";  
      ctx.textAlign = "center";
      ctx.fillText(player.rating, 655, 565); 
      ctx.restore();

      ctx.save();
      let nameColor = (type.includes('kickoff') || type.includes('classic') || type.includes('champion26')) ? "white" : "black";
      ctx.shadowColor = (nameColor === "white") ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.3)";
      ctx.shadowBlur = 8; 
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = nameColor; 
      ctx.font = "900 150px 'DLS Font'"; 
      ctx.textAlign = "center";
      ctx.fillText(player.name.toUpperCase(), 1000, 1345); 
      ctx.restore();

      ctx.drawImage(flagImg, 725, 1440, 253, 168);
      ctx.drawImage(posBoxImg, 955, 1320, 400, 400);

      const starWidth = 180;   
      const starHeight = 180;  
      const starYOffset = 1610; 
      let sX = (2000 - starWidth) / 2;
      ctx.drawImage(starImg, sX, starYOffset, starWidth, starHeight);

      const container = document.createElement('div');
      container.className = 'canvas-container';
      container.appendChild(canvas);
      resultEl.appendChild(container);

    }).catch(err => {
      console.error(err);
    });
  };

  // ডাটাবেজ থেকে ফ্রেশ ডাটা লোড করার মেইন লজিক (ইনস্ট্যান্ট আপডেটের জন্য)
  const freshJsonUrl = elements.jsonUrl.split('?')[0] + "?t=" + Date.now();

  resultEl.innerHTML = "<p style='color:#fff; text-align:center; font-family:sans-serif;'>ডাটাবেজ লোড হচ্ছে...</p>";

  fetch(freshJsonUrl)
    .then(response => response.json())
    .then(players => {
      allPlayersData = players;
      resultEl.innerHTML = ""; // লোডিং মেসেজ ক্লিয়ার

      // শুরুতে ডাটাবেজের সব প্লেয়ার অটোমেটিক রেন্ডার হবে
      players.forEach(player => renderCard(player));
    })
    .catch(err => {
      console.error(err);
      resultEl.innerHTML = "<p style='color:#ff4a6b; text-align:center;'>ডাটাবেজ কানেক্ট করতে সমস্যা হয়েছে!</p>";
    });

  // সার্চ বাটনের ফিল্টারিং লজিক (একই নামের সব কার্ড একসাথে দেখানোর জন্য)
  btnEl.addEventListener('click', () => {
    const query = inputEl.value.toLowerCase().trim();
    resultEl.innerHTML = ""; // আগের সব কার্ড স্ক্রিন থেকে ক্লিয়ার

    if (!query) {
      // সার্চ খালি করে বাটন টিপলে আবার সব প্লেয়ার চলে আসবে
      allPlayersData.forEach(player => renderCard(player));
      return;
    }

    // .find() এর বদলে .filter() ব্যবহার করা হয়েছে যাতে সব কার্ড ম্যাচ করে
    const matchedPlayers = allPlayersData.filter(p => p.searchName.toLowerCase().includes(query));

    if (matchedPlayers.length > 0) {
      matchedPlayers.forEach(player => renderCard(player));
    } else {
      resultEl.innerHTML = "<p style='color:#ff4a6b; text-align:center; font-family:sans-serif;'>প্লেয়ার পাওয়া যায়নি!</p>";
    }
  });
};
