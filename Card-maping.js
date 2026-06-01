// ক্যানভাস ভিত্তিক DLS ২০০০×২০০০ কার্ড জেনারেটর ইঞ্জিন (Clean Position-box Only)
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
         width: 300px; 
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

    // মাস্টার ট্রিক: লিঙ্কের সাথে টাইমস্ট্যাম্প যোগ করা হয়েছে যাতে গিটহাবে পুশ করার সাথে সাথে ইনস্ট্যান্ট নতুন ডাটা লোড হয়
    const freshJsonUrl = elements.jsonUrl.split('?')[0] + "?v=" + Date.now();

    fetch(freshJsonUrl)
      .then(response => response.json())
      .then(players => {
        const player = players.find(p => p.searchName.toLowerCase().includes(query));
        
        if (player) {
          // ইমেজগুলোর ক্ষেত্রেও ক্যাশ বাইপাস করা হলো যাতে নতুন ছবি দিলে সাথে সাথে আসে
          const base = elements.imageBaseUrl;
          const cacheBuster = "?v=" + Date.now();

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

          const loadImage = (src) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.crossOrigin = "anonymous"; 
              img.onload = () => resolve(img);
              img.onerror = () => reject(new Error("Failed to load: " + src));
              img.src = src;
            });
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

            resultEl.innerHTML = '';
            const container = document.createElement('div');
            container.className = 'canvas-container';
            container.appendChild(canvas);
            resultEl.appendChild(container);

          }).catch(err => {
            console.error(err);
            resultEl.innerHTML = "<p style='color:#ff4a6b; text-align:center;'>Asset লোড হতে সমস্যা হয়েছে! গিটহাবে ফাইলের নাম বা এক্সটেনশন চেক করুন।</p>";
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
