(function () {
  "use strict";

  // Configuration
  const WIDGET_VERSION = "1.0.0";
  const API_BASE_URL = "https://dummyjson.com"; // Using DummyJSON for demo

  // Product ID to DummyJSON product mapping
  const productMapping = {
    "product-1": 1,
    "product-2": 7,
    "product-3": 14,
    "semaglutide-001": 1,
    "tirzepatide-002": 7,
    "peptide-mix-003": 14,
  };

  // Rating calculation based on product data
  const calculateRating = (product) => {
    const score = product.rating || 4.5;
    if (score >= 4.7) return { rating: "A", label: "GREAT" };
    if (score >= 4.2) return { rating: "B", label: "GOOD" };
    if (score >= 3.5) return { rating: "C", label: "FAIR" };
    if (score >= 2.5) return { rating: "D", label: "POOR" };
    return { rating: "F", label: "FAIL" };
  };

  // Widget styles (embedded to avoid external CSS dependencies)
  const widgetStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    .finnrick-widget-embed {
      --widget-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --widget-bg-color: #f5f5f5;
      --widget-border-radius: 12px;
      --widget-padding: 20px;
      --widget-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      --widget-text-primary: #1a1a1a;
      --widget-text-secondary: #666;
      --widget-border-color: #e0e0e0;
      
      font-family: var(--widget-font-family);
      display: inline-block;
      max-width: 400px;
      width: 100%;
      box-sizing: border-box;
    }
    
    .finnrick-widget-embed * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    .finnrick-widget-embed__container {
      background: var(--widget-bg-color);
      border-radius: var(--widget-border-radius);
      padding: var(--widget-padding);
      box-shadow: var(--widget-shadow);
      border: 1px solid var(--widget-border-color);
    }
    
    .finnrick-widget-embed__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--widget-border-color);
    }
    
    .finnrick-widget-embed__title {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: var(--widget-text-primary);
    }
    
    .finnrick-widget-embed__info-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 2px;
      width: 20px;
      height: 20px;
    }
    
    .finnrick-widget-embed__content {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .finnrick-widget-embed__rating-badge {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      border-radius: 24px;
      color: white;
      flex-shrink: 0;
      height: fit-content;
    }
    
    .finnrick-widget-embed__rating-letter {
      font-size: 24px;
      font-weight: 700;
      line-height: 1;
    }
    
    .finnrick-widget-embed__rating-label {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .finnrick-widget-embed__details {
      flex: 1;
      min-width: 0;
    }
    
    .finnrick-widget-embed__company {
      font-size: 16px;
      font-weight: 600;
      color: var(--widget-text-primary);
      margin-bottom: 4px;
      line-height: 1.3;
    }
    
    .finnrick-widget-embed__product {
      font-size: 14px;
      color: var(--widget-text-primary);
      margin-bottom: 12px;
      line-height: 1.4;
    }
    
    .finnrick-widget-embed__test-info {
      font-size: 12px;
      color: var(--widget-text-secondary);
      line-height: 1.5;
    }
    
    .finnrick-widget-embed__footer {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid var(--widget-border-color);
    }
    
    .finnrick-widget-embed__logo {
      height: 20px;
      width: auto;
    }
    
    .finnrick-widget-embed__powered-by {
      font-size: 11px;
      color: var(--widget-text-secondary);
      font-weight: 500;
    }
    
    .finnrick-widget-embed--loading {
      text-align: center;
      padding: 40px;
      color: var(--widget-text-secondary);
    }
    
    .finnrick-widget-embed--error {
      text-align: center;
      padding: 40px;
      color: #dc3545;
    }
  `;

  // Rating colors
  const ratingColors = {
    A: "#28a745",
    B: "#6cb43f",
    C: "#ffc107",
    D: "#fd7e14",
    F: "#dc3545",
  };

  // Finnrick logo SVG (simplified version)
  const finnrickLogoSVG = `\
  <svg width="100%" height="100%" viewBox="0 0 4490 1239" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <g transform="matrix(2,0,0,2,-231.642,-1880.71)">
        <path d="M735.39,1397L735.39,1103L876.24,1103L876.24,1146.76L795.6,1146.76L795.6,1226.77L871.87,1226.77L871.87,1270.52L795.6,1270.52L795.6,1397L735.39,1397Z" style="fill-rule:nonzero;"/>
    </g>
    <g transform="matrix(2,0,0,2,-241.642,-1880.71)">
        <rect x="909.5" y="1103" width="60.22" height="294" style="fill-rule:nonzero;"/>
    </g>
    <g transform="matrix(2,0,0,2,-241.642,-1880.71)">
        <path d="M1056.74,1397L1007.35,1397L1007.35,1103L1095.91,1103L1146.75,1351.16L1146.75,1103L1196.13,1103L1196.13,1397L1107.99,1397L1056.74,1146.76L1056.74,1397Z" style="fill-rule:nonzero;"/>
    </g>
    <g transform="matrix(2,0,0,2,-251.642,-1880.71)">
        <path d="M1283.15,1397L1233.77,1397L1233.77,1103L1322.32,1103L1373.17,1351.16L1373.17,1103L1422.55,1103L1422.55,1397L1334.41,1397L1283.15,1146.76L1283.15,1397Z" style="fill-rule:nonzero;"/>
    </g>
    <g transform="matrix(2,0,0,2,-251.642,-1880.71)">
        <path d="M1636.88,1381.89C1636.32,1375.3 1635.91,1365.61 1635.63,1352.82C1635.49,1340.46 1635.63,1328.58 1636.05,1317.19C1637.02,1297.19 1633.31,1281.8 1624.9,1271.04C1616.49,1260.28 1604.1,1254.89 1587.71,1254.89L1584.38,1254.89C1598.55,1251.84 1609.03,1247.6 1615.84,1242.18C1629.45,1231.35 1636.26,1210.37 1636.26,1179.26C1636.26,1151.76 1629.52,1132.17 1616.05,1120.5C1602.57,1108.83 1580.07,1103 1548.54,1103L1460.2,1103L1460.2,1397L1520.42,1397L1520.42,1276.98L1537.92,1276.98C1552.36,1276.98 1562.5,1280 1568.34,1286.04C1574.17,1292.08 1576.95,1302.47 1576.67,1317.19L1576.67,1352.82C1576.67,1365.88 1576.88,1375.67 1577.3,1382.2C1577.72,1388.73 1578.41,1393.59 1579.38,1396.79L1639.39,1396.79C1638.26,1393.46 1637.43,1388.5 1636.88,1381.89ZM1568.22,1223.33C1563.01,1229.1 1552.62,1231.98 1537.07,1231.98L1520.4,1231.98L1520.4,1146.76L1537.07,1146.76C1552.07,1146.76 1562.31,1150.09 1567.8,1155.93C1573.29,1161.76 1576.03,1172.74 1576.03,1188.85C1576.03,1206.07 1573.43,1217.57 1568.22,1223.33Z" style="fill-rule:nonzero;"/>
    </g>
    <g transform="matrix(2,0,0,2,-258.642,-1880.71)">
        <rect x="1673.26" y="1103" width="60.22" height="294" style="fill-rule:nonzero;"/>
    </g>
    <g transform="matrix(2,0,0,2,-268.642,-1880.71)">
        <path d="M1950.1,1296.98L1950.1,1305.74C1950.65,1340.19 1944.27,1364.74 1930.93,1379.4C1917.6,1394.06 1895.02,1401.38 1863.21,1401.38C1829.45,1401.38 1805.67,1393.43 1791.84,1377.52C1778.02,1361.62 1771.11,1334.29 1771.11,1295.53L1771.11,1204.89C1771.11,1165.86 1778.02,1138.39 1791.84,1122.48C1805.66,1106.57 1829.45,1098.62 1863.21,1098.62C1892.52,1098.62 1914.26,1106.05 1928.43,1120.91C1941.76,1134.8 1950.27,1155.43 1950.13,1182.79L1950.13,1197.17L1890.33,1197.17L1890.33,1188.42C1890.6,1173.14 1886.72,1161.72 1882.48,1154.14C1878.24,1146.57 1871.82,1142.79 1863.21,1142.79C1851.96,1142.79 1843.83,1147.13 1838.83,1155.81C1833.83,1164.49 1831.33,1178.63 1831.33,1198.21L1831.33,1288.85C1831.33,1314.41 1833.66,1332.19 1838.31,1342.19C1842.97,1352.19 1851.26,1357.19 1863.21,1357.19C1872.51,1357.19 1879.43,1352.92 1883.94,1344.38C1888.45,1335.84 1890.57,1322.95 1890.29,1305.73L1890.29,1296.98L1950.1,1296.98Z" style="fill-rule:nonzero;"/>
    </g>
    <g transform="matrix(2,0,0,2,-278.642,-1880.71)">
        <path d="M2047.98,1397L1987.77,1397L1987.77,1103L2047.98,1103L2047.98,1238.23L2048.09,1238.23L2112.63,1103L2176.55,1103L2112.58,1232.39L2177.59,1397L2112.18,1397L2047.91,1238.23L2047.98,1238.23L2047.98,1397Z" style="fill-rule:nonzero;"/>
    </g>
    <g transform="matrix(2,0,0,2,-231.642,-1880.71)">
        <rect x="322.41" y="1146.76" width="206.49" height="206.49"/>
    </g>
  </svg>
  `;

  // Create widget HTML
  function createWidgetHTML(data) {
    const bgColor = ratingColors[data.rating] || "#666";

    return `
      <div class="finnrick-widget-embed">
        <div class="finnrick-widget-embed__container">
          <div class="finnrick-widget-embed__header">
            <span class="finnrick-widget-embed__title">FINNRICK RATING™</span>
            <button class="finnrick-widget-embed__info-btn" onclick="window.open('https://finnrick.com/about-ratings', '_blank')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#999" stroke-width="1.5"/>
                <text x="8" y="12" text-anchor="middle" fill="#999" font-size="10">?</text>
              </svg>
            </button>
          </div>
          
          <div class="finnrick-widget-embed__content">
            <div class="finnrick-widget-embed__rating-badge" style="background-color: ${bgColor}">
              <span class="finnrick-widget-embed__rating-letter">${data.rating}</span>
              <span class="finnrick-widget-embed__rating-label">${data.ratingLabel}</span>
            </div>
            
            <div class="finnrick-widget-embed__details">
              <h3 class="finnrick-widget-embed__company">${data.companyName}</h3>
              <p class="finnrick-widget-embed__product">${data.productName}</p>
              <div class="finnrick-widget-embed__test-info">
                <p>Tested ${data.testCount} Samples</p>
                <p>Last test ${data.lastTestDate}</p>
              </div>
            </div>
          </div>
          
          <div class="finnrick-widget-embed__footer">
            <div class="finnrick-widget-embed__logo">${finnrickLogoSVG}</div>
            <span class="finnrick-widget-embed__powered-by">Verified by Finnrick</span>
          </div>
        </div>
      </div>
    `;
  }

  // Fetch rating data from DummyJSON API
  async function fetchRatingData(productId) {
    try {
      // Map product ID to DummyJSON product ID
      const dummyProductId = productMapping[productId] || 1;

      // Fetch product data from DummyJSON
      const response = await fetch(
        `${API_BASE_URL}/products/${dummyProductId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const product = await response.json();
      const ratingInfo = calculateRating(product);

      // Transform DummyJSON data to Finnrick widget format
      return {
        rating: ratingInfo.rating,
        ratingLabel: ratingInfo.label,
        companyName: product.brand || "Unknown Brand",
        productName: product.title || "Product",
        testCount: Math.floor(Math.random() * 10) + 3, // Random test count 3-12
        lastTestDate: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      };
    } catch (error) {
      console.error("Error fetching rating data:", error);

      // Fallback data when API fails
      return {
        rating: "B",
        ratingLabel: "GOOD",
        companyName: "Sample Company",
        productName: "Sample Product",
        testCount: 5,
        lastTestDate: "19 Feb 2025",
      };
    }
  }

  // Initialize widget
  async function initWidget(container) {
    const productId = container.getAttribute("data-product-id");

    if (!productId) {
      container.innerHTML =
        '<div class="finnrick-widget-embed finnrick-widget-embed--error">Product ID is required</div>';
      return;
    }

    // Show loading state
    container.innerHTML =
      '<div class="finnrick-widget-embed finnrick-widget-embed--loading">Loading rating...</div>';

    try {
      const data = await fetchRatingData(productId);
      container.innerHTML = createWidgetHTML(data);
    } catch (error) {
      console.error("Finnrick Widget Error:", error);
      container.innerHTML =
        '<div class="finnrick-widget-embed finnrick-widget-embed--error">Failed to load rating</div>';
    }
  }

  // Inject styles
  function injectStyles() {
    if (document.getElementById("finnrick-widget-styles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "finnrick-widget-styles";
    style.textContent = widgetStyles;
    document.head.appendChild(style);
  }

  // Auto-initialize widgets
  function autoInit() {
    injectStyles();

    const containers = document.querySelectorAll(".finnrick-rating");
    containers.forEach((container) => {
      if (!container.hasAttribute("data-initialized")) {
        container.setAttribute("data-initialized", "true");
        initWidget(container);
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    autoInit();
  }

  // Expose API for manual initialization
  window.FinnrickWidget = {
    version: WIDGET_VERSION,
    init: initWidget,
    refresh: autoInit,
  };
})();
