// ক্যানভাস ভিত্তিক DLS ২০০০×২০০০ কার্ড জেনারেটর ইঞ্জিন
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
        // searchName দিয়ে প্লেয়ার খোঁজা
        const player = players.find(p => p.searchName.toLowerCase().includes(query));
        
        if (player) {
          const base = elements.imageBaseUrl;

          // আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী সঠিক ইউআরএল ম্যাপিং
          const urls = {
            bg: `${base}Card-bg/${player['card-bg']}`,
            border: `${base}Card-border/${player.border}`,
            circle: `${base}Rating-circle/${player.rating_circle}`,
            photo: `${base}Player-photos/${player.photo}`,
            flag: `${base}Flags/${player.flag}`,
            star: `${base}Star/${player.star}`
          };

          // ইমেজ লোড করার প্রমিস ফাংশн (CORS হ্যান্ডেলসহ)
          const loadImage = (src) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.crossOrigin = "anonymous"; 
              img.onload = () => resolve(img);
              img.onerror = () => reject(new Error("Failed to load: " + src));
              img.src = src;
            });
          };

          // সব ইমেজ ব্যাকগ্রাউন্ডে লোড হওয়ার পর ক্যানভাসে ড্র হবে
          Promise.all([
            loadImage(urls.bg),
            loadImage(urls.border),
            loadImage(urls.circle),
            loadImage(urls.photo),
            loadImage(urls.flag),
            loadImage(urls.star)
          ]).then(([bgImg, borderImg, circleImg, photoImg, flagImg, starImg]) => {
            
            // আপনার স্ট্যান্ডার্ড ২০০০ × ২০০০ সাইজের ক্যানভাস তৈরি
            const canvas = document.createElement('canvas');
            canvas.width = 2000;
            canvas.height = 2000;
            const ctx = canvas.getContext('2d');

            // ১. ব্যাকগ্রাউন্ড ইমেজ ড্র (Card-bg)
            ctx.drawImage(bgImg, 0, 0, 2000, 2000);

            // ২. প্লেয়ারের ছবি পজিশন (টাইপ অনুযায়ী ডাইনামিক লজিক)
            let type = player['card-bg'].toLowerCase();
            let pX = (type.includes('legendary') || type.includes('rare') || type.includes('common')) ? 622 : 406;
            let pY = (type.includes('legendary') || type.includes('rare') || type.includes('common')) ? 191 : -26;
            let pSize = (type.includes('legendary') || type.includes('rare') || type.includes('common')) ? 980 : 1200;
            
            ctx.drawImage(photoImg, pX, pY, pSize, pSize);

            // ৩. বর্ডার ইমেজ ড্র (Card-border)
            ctx.drawImage(borderImg, 0, 0, 2000, 2000);

            // ৪. রেটিং সার্কেল ড্র (Rating-circle) - ফিক্সড পজিশন ৪৩০, ২৬০
            ctx.drawImage(circleImg, 430, 260, 450, 450);

            // ৫. রেটিং টেক্সট (নিখুঁত পজিশন ও শ্যাডো)
            ctx.save();
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; 
            ctx.shadowBlur = 10; 
            ctx.shadowOffsetY = 5;
            ctx.fillStyle = "white"; 
            ctx.font = "900 190px 'DLS Font', sans-serif";  
            ctx.textAlign = "center";
            ctx.fillText(player.rating, 655, 565); // X: 655, Y: 565
            ctx.restore();

            // ৬. প্লেয়ারের নাম ড্র (১০০০, ১৩४৫)
            ctx.save();
            // থিম অনুযায়ী ডাইনামিক নাম কালার সিলেক্ট
            let nameColor = (type.includes('kickoff') || type.includes('classic') || type.includes('champion26')) ? "white" : "black";
            
            ctx.shadowColor = (nameColor === "white") ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.3)";
            ctx.shadowBlur = 8; 
            ctx.shadowOffsetY = 4;
            ctx.fillStyle = nameColor; 
            ctx.font = "900 150px 'DLS Font', sans-serif"; 
            ctx.textAlign = "center";
            ctx.fillText(player.name.toUpperCase(), 1000, 1345); // X: 1000, Y: 1345
            ctx.restore();

            // ৭. দেশের ফ্ল্যাগ (Flag) ড্র (৭২৫, ১৪৪০)
            ctx.drawImage(flagImg, 725, 1440, 253, 168);

            // ৮. প্লেয়ার পজিশন টেক্সট ব্যাজ (যেমন: SS, CF)
            ctx.save();
            ctx.fillStyle = "white";
            ctx.font = "900 110px 'DLS Font', sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(player.position.toUpperCase(), 1040, 1565); // পজিশন টেক্সট এলাইনমেন্ট ফিক্স
            ctx.restore();

            // ৯. স্টার ড্র করার লজিক (১৬১০)
            const starWidth = 180;   
            const starHeight = 180;  
            const starYOffset = 1610; 
            let sX = (2000 - starWidth) / 2;
            ctx.drawImage(starImg, sX, starYOffset, starWidth, starHeight);

            // ফাইনাল ক্যানভাস স্ক্রিনে পুশ করা
            resultEl.innerHTML = '';
            const container = document.createElement('div');
            container.className = 'canvas-container';
            container.appendChild(canvas);
            resultEl.appendChild(container);

          }).catch(err => {
            console.error(err);
            resultEl.innerHTML = "<p style='color:#ff4a6b; text-align:center;'>Assets ফোল্ডার থেকে ছবি লোড করা যায়নি!</p>";
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
