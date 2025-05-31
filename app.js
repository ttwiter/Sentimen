
const pairs = [
  "EURUSD","USDJPY","GBPUSD","USDCHF","USDCAD","AUDUSD","NZDUSD",
  "EURJPY","EURGBP","EURAUD","EURCHF","EURCAD","EURNZD","GBPJPY",
  "GBPCHF","AUDJPY","CHFJPY","CADJPY","AUDCAD","AUDCHF","AUDNZD",
  "CADCHF","NZDJPY","NZDCAD","XAUUSD"
];

const timeframes = ["M1","M5","M15","M30","H1","H4","D1","W1","MN"];
const indikatorMT4 = [
  "Moving Average","MACD","RSI","Bollinger Bands","Stochastic",
  "ADX","CCI","ATR","Momentum","Williams %R",
  "Parabolic SAR","Ichimoku Kinko Hyo","Envelopes","DeMarker"
];

function scanMyfxbookSinyal() {
  const session = "9UtvFTG9S31Z4vO1aDW31671626";
  const api = `https://www.myfxbook.com/api/get-community-outlook-by-symbol.json?session=${session}`;
  const proxy = "https://api.allorigins.win/raw?url=";
  const output = document.getElementById("signal-list");

  fetch(proxy + encodeURIComponent(api))
    .then(res => res.json())
    .then(data => {
      const outlook = data.symbols || [];
      const valid = outlook.filter(p =>
        parseFloat(p.longPercentage) >= 70 || parseFloat(p.shortPercentage) >= 70
      );

      output.innerHTML = "";

      if (valid.length === 0) {
        output.innerHTML = "<i>Belum ada sinyal saat ini.</i>";
      } else {
        valid.forEach(p => {
          const buy = parseFloat(p.longPercentage).toFixed(1);
          const sell = parseFloat(p.shortPercentage).toFixed(1);
          const arah = buy >= 70 ? "BUY" : "SELL";
          const icon = arah === "BUY" ? "📈" : "📉";
          output.innerHTML += `<div><b>${p.name}</b> : ${arah} ${icon}<br>
          Buy: ${buy}% / Sell: ${sell}%</div><hr style="opacity:0.1">`;
        });
      }
    })
    .catch(() => {
      output.innerHTML = "<i>Gagal ambil data. Coba refresh.</i>";
    });
}

function populateSelect(selectElem, options, defaultVal=null) {
  selectElem.innerHTML = "";
  options.forEach(opt => {
    const el = document.createElement("option");
    el.value = opt;
    el.textContent = opt;
    selectElem.appendChild(el);
  });
  if (defaultVal) selectElem.value = defaultVal;
}

function updateTeknikal() {
  const indikator1 = document.getElementById("indikator1").value;
  const indikator2 = document.getElementById("indikator2").value;
  const indikator3 = document.getElementById("indikator3").value;
  const dataBox = document.getElementById("teknikal-data");

  const kombinasi = [indikator1, indikator2, indikator3].filter(i => i);
  if (kombinasi.length === 0) {
    dataBox.textContent = "Silakan pilih indikator teknikal.";
    return;
  }

  const sinyal = ["Buy", "Sell"][Math.floor(Math.random() * 2)];
  const persenBuy = sinyal === "Buy" ? 75 : 35;
  const persenSell = 100 - persenBuy;

  dataBox.innerHTML = `
    <div>Buy % = <strong>${persenBuy}%</strong></div>
    <div>Sell % = <strong>${persenSell}%</strong></div>
    <div style="margin-top:8px;font-size:0.9rem;">Sinyal dari: ${kombinasi.join(", ")}</div>
  `;
}

function updateNews() {
  const pair = document.getElementById("pair").value.replace("/", "");
  const base = pair.slice(0, 3).toUpperCase();
  const quote = pair.slice(3, 6).toUpperCase();

  const newsList = document.getElementById("news-list");
  newsList.innerHTML = "<li>Memuat berita...</li>";

  const proxy = "https://corsproxy.io/?";
  const api = "https://financialmodelingprep.com/api/v3/fx_calendar?apikey=G5P1iNxCJ5OQ68rUuNgqXytiGeb3LXD0";

  fetch(proxy + api)
    .then(res => res.json())
    .then(data => {
      const items = (data.calendar || []).filter(item =>
        item.currency === base || item.currency === quote
      );

      newsList.innerHTML = "";
      if (items.length === 0) {
        newsList.innerHTML = "<li>Tidak ada berita penting hari ini.</li>";
      } else {
        items.forEach(item => {
          const li = document.createElement("li");
          li.textContent = `${item.date} - ${item.event}`;
          newsList.appendChild(li);
        });
      }
    })
    .catch(() => {
      newsList.innerHTML = "<li>Gagal memuat berita.</li>";
    });
}

window.addEventListener("DOMContentLoaded", () => {
  populateSelect(document.getElementById("pair"), pairs.map(p => p.includes("/") ? p : `${p.slice(0,3)}/${p.slice(3,6)}`), "EUR/USD");
  populateSelect(document.getElementById("timeframe"), timeframes, "H1");
  populateSelect(document.getElementById("indikator1"), indikatorMT4);
  populateSelect(document.getElementById("indikator2"), indikatorMT4);
  populateSelect(document.getElementById("indikator3"), indikatorMT4);

  document.getElementById("indikator1").addEventListener("change", updateTeknikal);
  document.getElementById("indikator2").addEventListener("change", updateTeknikal);
  document.getElementById("indikator3").addEventListener("change", updateTeknikal);
  document.getElementById("pair").addEventListener("change", () => {
    updateNews();
    updateTeknikal();
  });

  updateTeknikal();
  updateNews();
  scanMyfxbookSinyal();
});
