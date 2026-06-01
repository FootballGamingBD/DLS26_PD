// ক্যানভাস ভিত্তিক DLS ২০০০×২০০০ কার্ড জেনারেটর ইঞ্জিন (Position-box ইমেজ লোডারসহ)
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
      .canvas-container {
         display: flex;
         justify-content: center;
         margin: 25px auto;
      }
      .canvas-container canvas {
         max-width: 100%;
         height: auto;
         width: 300px; /* ব্লগারে রেস্পন্সিভ ডিসপ্লে সাইজ */
         border-radius: 14px;
         box-shadow: 0 10px 25px rgba(0,0,0,0.4);
      }
    `;
    document.head.appendChild(style);
  }

  btnEl.addEventListener('click', () => {
    const query = inputEl.value.toLowerCase().trim();
    if (!query) {
      alert("দয়া করে প্লেয়ারের নাম লিখুন!");
      return;
    }

    resultEl.innerHTML = "<p style='color:#fff; text-align:center; font-family:sans-serif;'>কার্ড তৈরি হচ্ছে...</p>";

    fetch(elements.jsonUrl)
      .then(response => response.json())
      .then(players => {
        const player = players.find(p => p.searchName.toLowerCase().includes(query));
        
        if (player) {
          const base = elements.imageBaseUrl;

          let photoName = player.photo;
          if (photoName === "Messi-L83.webp") photoName = "Messi-L-83.webp"; // হাইফেন ফিক্স

          // JSON ফাইলের পজিশন ইমেজের নাম হ্যান্ডেল করা (ধরা যাক: player.position_box বা custom logic)
          // আপনার JSON এ যদি ইমেজ নাম না থাকে, তবে পজিশন নাম অনুযায়ী (যেমন: ss.png, cf.png) ইমেজ ধরবে
          let posImgName = player.position_box ? player.position_box : `${player.position.toLowerCase()}.png`;

          const urls = {
            bg: `${base}Card-bg/${player['card-bg']}`,
            border: `${base}Card-border/${player.border}`,
            circle: `${base}Rating-circle/${player.rating_circle}`,
            photo: `${base}Player-photos/${photoName}`,
            flag: `${base}Flags/${player.flag}`,
            posBox: `${base}Position-box/${posImgName}`, // নতুন পজিশন বক্স ফোল্ডার লিঙ্ক
            star: `${base}Star/${player.star}`
          };

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

          // ফন্ট এবং পজিশন বক্সসহ সব এসেট একসাথে লোড করা
          Promise.all([
            document.fonts.load("190px 'DLS Font'"), 
            loadImage(urls.bg),
            loadImage(urls.border),
            loadImage(urls.circle),
            loadImage(urls.photo),
            loadImage(urls.flag),
            loadImage(urls.posBox), // পজিশন বক্স প্রমিস
            loadImage(urls.star)
          ]).then(([fontStatus, bgImg, borderImg, circleImg, photoImg, flagImg, posBoxImg, starImg]) => {
            
            // ২০০০ × ২০০০ ক্যানভাস তৈরি
            const canvas = document.createElement('canvas');
            canvas.width = 2000;
            canvas.height = 2000;
            const ctx = canvas.getContext('2d');

            // ১. ব্যাকগ্রাউন্ড ইমেজ ড্র
            ctx.drawImage(bgImg, 0, 0, 2000, 2000);

            // ২. প্লেয়ারের ছবি পজিশন
            let type = player['card-bg'].toLowerCase();
            let pX = (type.includes('legendary') || type.includes('rare') || type.includes('common')) ? 622 : 406;
            let pY = (type.includes('legendary') || type.includes('rare') || type.includes('common')) ? 191 : -26;
            let pSize = (type.includes('legendary') || type.includes('rare') || type.includes('common')) ? 980 : 1200;
            
            ctx.drawImage(photoImg, pX, pY, pSize, pSize);

            // ৩. বর্ডার ইমেজ ড্র
            ctx.drawImage(borderImg, 0, 0, 2000, 2000);

            // ৪. রেটিং সার্কেল ড্র (ফিক্সড ৪৩০, ২৬০)
            ctx.drawImage(circleImg, 430, 260, 450, 450);

            // ৫. রেটিং টেক্সট (X: 655, Y: 565)
            ctx.save();
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; 
            ctx.shadowBlur = 10; 
            ctx.shadowOffsetY = 5;
// ক্যানভাস ভিত্তিক DLS ২০০০×২০০০ কার্ড জেনারেটর ইঞ্জিন (Position-box ইমেজ লোডারসহ)
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
      .canvas-container {
         display: flex;
         justify-content: center;
         margin: 25px auto;
      }
      .canvas-container canvas {
         max-width: 100%;
         height: auto;
         width: 300px; /* ব্লগারে রেস্পন্সিভ ডিসপ্লে সাইজ */
         border-radius: 14px;
         box-shadow: 0 10px 25px rgba(0,0,0,0.4);
      }
    `;
    document.head.appendChild(style);
  }

  btnEl.addEventListener('click', () => {
    const query = inputEl.value.toLowerCase().trim();
    if (!query) {
      alert("দয়া করে প্লেয়ারের নাম লিখুন!");
      return;
    }

    resultEl.innerHTML = "<p style='color:#fff; text-align:center; font-family:sans-serif;'>কার্ড তৈরি হচ্ছে...</p>";

    fetch(elements.jsonUrl)
      .then(response => response.json())
      .then(players => {
        const player = players.find(p => p.searchName.toLowerCase().includes(query));
        
        if (player) {
          const base = elements.imageBaseUrl;

          let photoName = player.photo;
          if (photoName === "Messi-L83.webp") photoName = "Messi-L-83.webp"; // হাইফেন ফিক্স

          // JSON ফাইলের পজিশন ইমেজের নাম হ্যান্ডেল করা (ধরা যাক: player.position_box বা custom logic)
          // আপনার JSON এ যদি ইমেজ নাম না থাকে, তবে পজিশন নাম অনুযায়ী (যেমন: ss.png, cf.png) ইমেজ ধরবে
          let posImgName = player.position_box ? player.position_box : `${player.position.toLowerCase()}.png`;

          const urls = {
            bg: `${base}Card-bg/${player['card-bg']}`,
            border: `${base}Card-border/${player.border}`,
            circle: `${base}Rating-circle/${player.rating_circle}`,
            photo: `${base}Player-photos/${photoName}`,
            flag: `${base}Flags/${player.flag}`,
            posBox: `${base}Position-box/${posImgName}`, // নতুন পজিশন বক্স ফোল্ডার লিঙ্ক
            star: `${base}Star/${player.star}`
          };

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

          // ফন্ট এবং পজিশন বক্সসহ সব এসেট একসাথে লোড করা
          Promise.all([
            document.fonts.load("190px 'DLS Font'"), 
            loadImage(urls.bg),
            loadImage(urls.border),
            loadImage(urls.circle),
            loadImage(urls.photo),
            loadImage(urls.flag),
            loadImage(urls.posBox), // পজিশন বক্স প্রমিস
            loadImage(urls.star)
          ]).then(([fontStatus, bgImg, borderImg, circleImg, photoImg, flagImg, posBoxImg, starImg]) => {
            
            // ২০০০ × ২০০০ ক্যানভাস তৈরি
            const canvas = document.createElement('canvas');
            canvas.width = 2000;
            canvas.height = 2000;
            const ctx = canvas.getContext('2d');

            // ১. ব্যাকগ্রাউন্ড ইমেজ ড্র
            ctx.drawImage(bgImg, 0, 0, 2000, 2000);

            // ২. প্লেয়ারের ছবি পজিশন
            let type = player['card-bg'].toLowerCase();
            let pX = (type.includes('legendary') || type.includes('rare') || type.includes('common')) ? 622 : 406;
            let pY = (type.includes('legendary') || type.includes('rare') || type.includes('common')) ? 191 : -26;
            let pSize = (type.includes('legendary') || type.includes('rare') || type.includes('common')) ? 980 : 1200;
            
            ctx.drawImage(photoImg, pX, pY, pSize, pSize);

            // ৩. বর্ডার ইমেজ ড্র
            ctx.drawImage(borderImg, 0, 0, 2000, 2000);

            // ৪. রেটিং সার্কেল ড্র (ফিক্সড ৪৩০, ২৬০)
            ctx.drawImage(circleImg, 430, 260, 450, 450);

            // ৫. রেটিং টেক্সট (X: 655, Y: 565)
            ctx.save();
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; 
            ctx.shadowBlur = 10; 
            ctx.shadowOffsetY = 5;
            ctx.fillStyle = "white"; 
            ctx.font = "900 190px 'DLS Font'";  
            ctx.textAlign = "center";
            ctx.fillText(player.rating, 655, 565); 
            ctx.restore();

            // ৬. প্লেয়ারের নাম ড্র (X: 1000, Y: 1345)
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

            // ৭. দেশের ফ্ল্যাগ ড্র (X: 725, Y: 1440, W: 253, H: 168)
            ctx.drawImage(flagImg, 725, 1440, 253, 168);

            // ৮. পজিশন ব্যাজ ফ্রেম ড্র (আপনার স্ট্যান্ডার্ড কোড পজিশন: X: 955, Y: 1320, W: 400, H: 400)
            ctx.drawImage(posBoxImg, 955, 1320, 400, 400);

            // ৯. পজিশন ফ্রেমের ভেতরে টেক্সট এলাইনমেন্ট (শুধু এক্সট্রা টেক্সট ড্র করার কমান্ড রিমুভ করা হয়েছে)
            ctx.save();
            ctx.fillStyle = "white";
            ctx.font = "900 110px 'DLS Font'";
            ctx.textAlign = "center";
            // অতিরিক্ত text-line বাদ দেওয়া হয়েছে যেন পেছনের ছোট SS লেখা না আসে
            ctx.restore();

            // ১০. রেয়ারিটি বা গোল্ডেন স্টার ড্র (X: সেন্টারে, Y: ১৬১০)
            const starWidth = 180;   
            const starHeight = 180;  
            const starYOffset = 1610; 
            let sX = (2000 - starWidth) / 2;
            ctx.drawImage(starImg, sX, starYOffset, starWidth, starHeight);

            // ক্যানভাস আউটপুট ব্লগারে পুশ করা
            resultEl.innerHTML = '';
            const container = document.createElement('div');
            container.className = 'canvas-container';
            container.appendChild(canvas);
            resultEl.appendChild(container);

          }).catch(err => {
            console.error(err);
            resultEl.innerHTML = "<p style='color:#ff4a6b; text-align:center;'>Position-box বা অন্য কোনো Asset লোড হতে সমস্যা হয়েছে!</p>";
          });

        } else {
          resultEl.innerHTML = "<p style='color:#ff4a6b; text-align:center;'>প্লেয়ার পাওয়া যায়নি!</p>";
        }
      })
      .catch(err => {
        console.error(err);
        resultEl.innerHTML = "<p style='color:#ff4a6b; text-align:center;'>ডাটাবেজ কানেক্ট করতে সমস্যা হয়েছে!</p>";
      });
  });
};
