(function() {
  'use strict';

  // Configuration
  const WIDGET_VERSION = '1.0.0';
  const API_BASE_URL = 'https://dummyjson.com'; // Using DummyJSON for demo
  
  // Product ID to DummyJSON product mapping
  const productMapping = {
    'product-1': 1,
    'product-2': 2,
    'product-3': 3,
    'semaglutide-001': 1,
    'tirzepatide-002': 2,
    'peptide-mix-003': 3
  };
  
  // Rating calculation based on product data
  const calculateRating = (product) => {
    const score = (product.rating || 4.5);
    if (score >= 4.7) return { rating: 'A', label: 'GREAT' };
    if (score >= 4.2) return { rating: 'B', label: 'GOOD' };
    if (score >= 3.5) return { rating: 'C', label: 'FAIR' };
    if (score >= 2.5) return { rating: 'D', label: 'POOR' };
    return { rating: 'F', label: 'FAIL' };
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
    'A': '#28a745',
    'B': '#6cb43f',
    'C': '#ffc107',
    'D': '#fd7e14',
    'F': '#dc3545'
  };

  // Finnrick logo SVG (simplified version)
  const finnrickLogoSVG = `<svg width="80" height="22" viewBox="0 0 4490 1239" xmlns="http://www.w3.org/2000/svg">
    <g fill="#1a1a1a">
      <path d="M268.116 32.58v588h281.7v-87.52h-221.28V372.02h152.54v-87.5h-152.54V120.1h221.28V32.58h-281.7z"/>
      <path d="M1337.716 32.58h120.44v588h-120.44z"/>
      <path d="M1572.856 32.58v588h98.78V120.1l101.68 496.48h176.28V32.58h-98.76v496.48L1749.136 32.58h-176.28z"/>
      <path d="M2214.676 32.58v588h98.78V120.1l101.68 496.48h176.28V32.58h-98.76v496.48L2390.976 32.58h-176.28z"/>
      <path d="M2771.496 601.58c-1.12-13.18-2.06-32.56-2.58-58.14-.28-24.72.08-48.46.92-71.26 1.94-40 -5.42-70.58-22.3-92.3-16.82-21.52-41.6-32.3-74.38-32.3h-6.66c28.34-6.1 49.3-14.66 62.92-25.42 27.22-21.66 40.84-63.62 40.84-125.84 0-55.1-13.48-94.28-40.42-117.52-27.04-23.34-72.02-35-134.98-35h-177.08v588h120.44V380.04h35v.02c28.88 0 49.16 6.04 60.84 18.12 11.66 12.08 17.22 32.86 16.66 62.3v71.26c0 26.12.42 45.7 1.26 58.76.84 13.06 2.22 22.78 4.16 29.18h120.02c-2.26-6.66-4.04-16.38-5.14-29.1z"/>
      <rect x="2887.236" y="32.58" width="120.44" height="588"/>
      <path d="M3363.316 414.04v17.52c1.1 68.9-11.66 117.96-38.34 147.28-26.66 29.32-71.82 43.96-135.44 43.96-67.52 0-115.08-15.9-142.74-47.72-27.64-31.8-41.46-85.46-41.46-160.9V221.58c0-75.98 13.82-130.18 41.46-162.58 27.66-32.4 75.22-48.6 142.74-48.6 58.62 0 103.1 14.86 133.44 44.58 26.66 27.78 41.28 68.24 41 121.76v28.76h-119.6v-17.52c.54-30.56-6.84-53.4-15.32-68.56-8.48-15.14-21.34-22.72-38.54-22.72-22.5 0-38.76 8.68-48.76 26.04-10 17.36-15 45.64-15 84.82v181.28c0 51.12 4.66 88.68 13.96 112.68 9.32 24 25.9 36 49.8 36 18.6 0 32.44-8.54 41.46-25.62 9.02-17.08 13.26-43.86 12.7-80.34v-17.5h119.62z"/>
      <path d="M3537.756 32.58v588h120.42V309.5l.22.06 129.08-276.98h127.84l-127.9 258.78 130 308.22h-130.82l-128.54-318.7-.08.06v307.64h-120.22z"/>
      <rect x="412.536" y="120.1" width="412.98" height="412.98" fill="#000"/>
    </g>
  </svg>`;

  // Create widget HTML
  function createWidgetHTML(data) {
    const bgColor = ratingColors[data.rating] || '#666';
    
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
      const response = await fetch(`${API_BASE_URL}/products/${dummyProductId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const product = await response.json();
      const ratingInfo = calculateRating(product);
      
      // Transform DummyJSON data to Finnrick widget format
      return {
        rating: ratingInfo.rating,
        ratingLabel: ratingInfo.label,
        companyName: product.brand || 'Unknown Brand',
        productName: product.title || 'Product',
        testCount: Math.floor(Math.random() * 10) + 3, // Random test count 3-12
        lastTestDate: new Date().toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        })
      };
    } catch (error) {
      console.error('Error fetching rating data:', error);
      
      // Fallback data when API fails
      return {
        rating: 'B',
        ratingLabel: 'GOOD',
        companyName: 'Sample Company',
        productName: 'Sample Product',
        testCount: 5,
        lastTestDate: '19 Feb 2025'
      };
    }
  }

  // Initialize widget
  async function initWidget(container) {
    const productId = container.getAttribute('data-product-id');
    
    if (!productId) {
      container.innerHTML = '<div class="finnrick-widget-embed finnrick-widget-embed--error">Product ID is required</div>';
      return;
    }

    // Show loading state
    container.innerHTML = '<div class="finnrick-widget-embed finnrick-widget-embed--loading">Loading rating...</div>';

    try {
      const data = await fetchRatingData(productId);
      container.innerHTML = createWidgetHTML(data);
    } catch (error) {
      console.error('Finnrick Widget Error:', error);
      container.innerHTML = '<div class="finnrick-widget-embed finnrick-widget-embed--error">Failed to load rating</div>';
    }
  }

  // Inject styles
  function injectStyles() {
    if (document.getElementById('finnrick-widget-styles')) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = 'finnrick-widget-styles';
    style.textContent = widgetStyles;
    document.head.appendChild(style);
  }

  // Auto-initialize widgets
  function autoInit() {
    injectStyles();
    
    const containers = document.querySelectorAll('.finnrick-rating');
    containers.forEach(container => {
      if (!container.hasAttribute('data-initialized')) {
        container.setAttribute('data-initialized', 'true');
        initWidget(container);
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  // Expose API for manual initialization
  window.FinnrickWidget = {
    version: WIDGET_VERSION,
    init: initWidget,
    refresh: autoInit
  };
})();