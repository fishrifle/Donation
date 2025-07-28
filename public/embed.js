(function() {
  // PassItOn Donation Widget Embed Script
  
  function createDonationWidget(config) {
    const {
      targetElementId = 'passiton-donate-widget',
      organizationId = '',
      defaultAmount = 25,
      color = '#3b82f6',
      buttonText = 'Donate',
      position = 'bottom-left'
    } = config || {};

    // Create the widget container
    const container = document.getElementById(targetElementId) || document.body;
    
    // Widget HTML structure
    const widgetHTML = `
      <div id="passiton-widget-container" style="
        position: ${container === document.body ? 'fixed' : 'relative'};
        ${position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
        ${position.includes('left') ? 'left: 20px;' : 'right: 20px;'}
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <button id="passiton-donate-btn" style="
          background: linear-gradient(135deg, ${color}, #8b5cf6);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
          font-size: 16px;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          ${buttonText}
        </button>
        
        <div id="passiton-modal" style="
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 10000;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            background: white;
            border-radius: 12px;
            padding: 0;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow: hidden;
            position: relative;
          ">
            <button id="passiton-close-btn" style="
              position: absolute;
              top: 15px;
              right: 20px;
              background: none;
              border: none;
              font-size: 24px;
              cursor: pointer;
              z-index: 10001;
              color: #666;
            ">&times;</button>
            <iframe id="passiton-iframe" src="" style="
              width: 100%;
              height: 600px;
              border: none;
              border-radius: 12px;
            "></iframe>
          </div>
        </div>
      </div>
    `;

    // Insert widget into container
    if (container === document.body) {
      container.insertAdjacentHTML('beforeend', widgetHTML);
    } else {
      container.innerHTML = widgetHTML;
    }

    // Add event listeners
    const donateBtn = document.getElementById('passiton-donate-btn');
    const modal = document.getElementById('passiton-modal');
    const closeBtn = document.getElementById('passiton-close-btn');
    const iframe = document.getElementById('passiton-iframe');

    // Get the current domain for the iframe src
    const currentDomain = window.location.origin;
    const widgetDomain = 'YOUR_DOMAIN_HERE'; // Replace with your actual domain
    
    donateBtn.addEventListener('click', function() {
      // Set iframe source to your donation page
      iframe.src = `${widgetDomain}/donation?amt=${defaultAmount}&embedded=true${organizationId ? '&org=' + organizationId : ''}`;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
      iframe.src = ''; // Clear iframe to stop any ongoing processes
    });

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeBtn.click();
      }
    });

    // Handle messages from iframe (for success/completion)
    window.addEventListener('message', function(event) {
      if (event.origin !== widgetDomain) return;
      
      if (event.data.type === 'PASSITON_DONATION_COMPLETE') {
        closeBtn.click();
        // Optional: Show success message
        if (event.data.success) {
          alert('Thank you for your donation!');
        }
      }
    });
  }

  // Auto-initialize if PassItOnConfig is defined
  if (typeof window.PassItOnConfig !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        createDonationWidget(window.PassItOnConfig);
      });
    } else {
      createDonationWidget(window.PassItOnConfig);
    }
  }

  // Make function globally available
  window.PassItOnWidget = {
    init: createDonationWidget
  };
})();