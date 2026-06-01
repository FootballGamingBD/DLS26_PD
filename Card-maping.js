// ক্যানভাস ভিত্তিক DLS কার্ড জেনারেটর ইঞ্জিন
window.initDLSSearch = function(elements) {
  const inputEl = document.getElementById(elements.inputId);
  const btnEl = document.getElementById(elements.btnId);
  const resultEl = document.getElementById(elements.resultId);

  if (!inputEl || !btnEl || !resultEl) return;

  // ফন্ট ফেস লোড নিশ্চিত করার জন্য পেজে ইনজেক্ট করা হলো
  if (!document.getElementById('dls-font-style')) {
    const fontStyle = document.createElement('style');
    fontStyle.id = 'dls-font-style';
    fontStyle.textContent = `
      @font-face {
          font-family: 'DLS Font';
          src: url('https://cdn.jsdelivr.net/gh/FootballGamingBD/Dls@main/dls_font.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
      }
      .canvas-container {
         display: flex;
         justify-content: center;
         margin: 20px auto;
      }
      .canvas-container canvas {
         max-width: 100%;
         height: auto;
         width: 320px; /* ব্লগারে দেখানোর জন্য স্ট্যান্ডার্ড ডিসপ্লে সাইজ */
         border-radius: 14px;
         box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      }
    `;
    document.head.appendChild(fontStyle);
  }

  btnEl.addEventListener('click', () => {
    const query = inputEl.value.toLowerCase().trim();
    if (!query) {
      alert("দয়া করে প্লেয়ারের নাম লিখুন!");
      return;
    }

    // প্লেয়ার ডাটা ফেচ করা
    fetch(elements.jsonUrl)
      .then(response => response.json())
      .then(players => {
        const player = players.find(p => p.searchName.toLowerCase().includes(query));
        
        if (player) {
          resultEl.innerHTML = "<p style='color:#fff; text-align:center;'>কার্ড তৈরি হচ্ছে...</p>";
          
          const base = elements.imageBaseUrl;

          // ১. ইমেজ পাথ বা লিঙ্ক তৈরি (আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী)
          let photoName = player.photo;
          if (photoName === "Messi-L83.webp") photoName = "Messi-L-83.webp"; // হাইফেন ফিক্স

          const urls = {
            bg: `${base}Card-bg/${player['card-bg']}`,
            border: `${base}Card-border/${player.border}`,
            circle: `${base}Rating-circle/${player.rating_circle}`,
            photo: `${base}Player-photos/${photoName}`,
            flag: `${base}Flags/${player.flag}`,
            star: `${base}Star/${player.star}`
          };

          // ইমেজ লোডার প্রমিস ফাংশন
          const loadImage = (src) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.crossOrigin = "anonymous"; // CORS ইস্যু এড়াতে
              img.onload = () => resolve(img);
              img.onerror = () => reject(new Error("Image load failed: " + src));
              img.src = src;
            });
          };

          // সব ইমেজ একসাথে লোড হলে ক্যানভাসে ড্র করা শুরু হবে
          Promise.all([
            loadImage(urls.bg),
            loadImage(urls.border),
            loadImage(urls.circle),
            loadImage(urls.photo),
            loadImage(urls.flag),
            loadImage(urls.star)
          ]).then(([bgImg, borderImg, circleImg, photoImg, flagImg, starImg]) => {
            
            // ক্যানভাস তৈরি (আপনার স্ট্যান্ডার্ড ২০০০ × ২০০০ সাইজ)
            const canvas = document.createElement('canvas');
            canvas.width = 2000;
            canvas.height = 2000;
            const ctx = canvas.getContext('2d');

            // ১. ব্যাকগ্রাউন্ড কার্ড ড্র (Card-bg)
            ctx.drawImage(bgImg, 0, 0, 2000, 2000);

            // ২. প্লেয়ার ছবি ডাইনামিক পজিশন লজিক (আপনার কোড অনুযায়ী)
            // প্লেয়ার কার্ডের টাইপ ডাইনামিকালি ডিটেক্ট করা (ডিফল্ট ট্রিপল কন্ডিশন সেট)
            let pX = 622; 
            let pY = 191; 
            let pSize = 980;

            ctx.drawImage(photoImg, pX, pY, pSize, pSize);

            // ৩. কার্ড বর্ডার ড্র (Card-border)
            ctx.drawImage(borderImg, 0, 0, 2000, 2000);

            // ৪. রেটিং সার্কেল (ফিক্সড ৪৩০, ২৬০)
            ctx.drawImage(circleImg, 430, 260, 450, 450);

            // ৫. রেটিং নাম্বারের নিখুঁত পজিশন ও কাস্টম ফন্ট স্টাইল
            ctx.save();
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; 
            ctx.shadowBlur = 10; 
            ctx.shadowOffsetY = 5;
            ctx.fillStyle = "white"; 
            ctx.font = "900 190px 'DLS Font'";  
            ctx.textAlign = "center";
            ctx.fillText(player.rating, 655, 565); 
            ctx.restore();

            // ৬. প্লেয়ারের নাম ড্র করার লজিক (১০০০, ১৩৪৫)
            ctx.save();
            // নাম সাদা বা কালো হবে তা ডিটেক্ট করা (ডিফল্ট কালার ব্ল্যাক)
            let nameColor = "black";
            if (player['card-bg'] && (player['card-bg'].includes('kickoff') || player['card-bg'].includes('legendary'))) {
              nameColor = "white"; // লেজেন্ডারি বা কিকঅফ হলে টেক্সট হোয়াইট হবে
            }
            
            ctx.shadowColor = (nameColor === "white") ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.3)";
            ctx.shadowBlur = 8; 
            ctx.shadowOffsetY = 4;
            ctx.fillStyle = nameColor; 
            ctx.font = "900 150px 'DLS Font'"; 
            ctx.textAlign = "center";
            ctx.fillText(player.name.toUpperCase(), 1000, 1345); 
            ctx.restore();

            // ৭. দেশের ফ্ল্যাগ (Flag) ড্র করার পজিশন (৭২৫, ১৪৪০)
            ctx.drawImage(flagImg, 725, 1440, 253, 168);

            // ৮. প্লেয়ার পজিশন ব্যাজ বা টেক্সট ড্র
            // যেহেতু পজিশন লিঙ্কের ইমেজ এখনো সেট হয়নি, তাই ক্যানভাসে টেক্সট আকারে ড্র করা হলো (CF, ST ইত্যাদি)
            ctx.save();
            ctx.fillStyle = "#e10600"; // পজিশন ব্যাকগ্রাউন্ড রেড
            ctx.font = "900 110px 'DLS Font'";
            ctx.textAlign = "left";
            ctx.fillStyle = "white";
            ctx.fillText(player.position.toUpperCase(), 1020, 1565);
            ctx.restore();

            // ৯. রেয়ারিটি স্টার বা নিচে থাকা স্টার (মাঝখানে এলাইনড)
            const starWidth = 180;   
            const starHeight = 180;  
            const starYOffset = 1610; 
            let sX = (2000 - starWidth) / 2;
            ctx.drawImage(starImg, sX, starYOffset, starWidth, starHeight);

            // আউটপুট ডিভে ক্যানভাসটি পুশ করা
            resultEl.innerHTML = '';
            const container = document.createElement('div');
            container.className = 'canvas-container';
            container.appendChild(canvas);
            resultEl.appendChild(container);

          }).catch(err => {
            console.error(err);
            resultEl.innerHTML = "<p style='color:#ff4a6b; text-align:center;'>ছবিগুলো গিটহাব থেকে লোড হতে ব্যর্থ হয়েছে!</p>";
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
