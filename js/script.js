// Set the default report date to today
document.getElementById('report-date').valueAsDate = new Date();

// TAB FUNCTIONALITY
const tabButtons = document.querySelectorAll('.tab-button');
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    button.classList.add('active');
    const tabId = button.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

// FILE INPUT DISPLAY
const fileInputs = document.querySelectorAll('input[type="file"]');
fileInputs.forEach(input => {
  input.addEventListener('change', function() {
    const fileName = this.files[0] ? this.files[0].name : 'No file chosen';
    this.parentElement.nextElementSibling.textContent = fileName;
  });
});

// INSIGHT ADD/REMOVE FUNCTIONS
function addInsight(type) {
  const container = type === 'strengths' ? document.getElementById('strengths-container') : document.getElementById('opportunities-container');
  const inputClass = type === 'strengths' ? 'strength-input' : 'opportunity-input';
  const insightHTML = `
    <div class="insight-container">
      <div class="insight-field">
        <input type="text" class="${inputClass}" placeholder="Enter a ${type === 'strengths' ? 'strength' : 'improvement opportunity'}...">
        <button type="button" class="btn-danger" onclick="removeInsight(this)">✕</button>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', insightHTML);
}
function removeInsight(button) {
  button.closest('.insight-container').remove();
}

// ACTION ADD/REMOVE FUNCTIONS
function addAction() {
  const container = document.getElementById('actions-container');
  const actionHTML = `
    <div class="action-container">
      <div class="form-group">
        <label>Action Title *</label>
        <input type="text" class="action-title" placeholder="e.g., Refine Rules Configuration">
      </div>
      <div class="form-group">
        <label>Action Description *</label>
        <textarea class="action-description" placeholder="Describe the action in detail..."></textarea>
      </div>
      <div class="form-group">
        <label>Impact Level *</label>
        <select class="impact-level">
          <option value="high">High Impact</option>
          <option value="medium">Medium Impact</option>
          <option value="low">Low Impact</option>
        </select>
      </div>
      <div class="form-group">
        <label>Effort Level *</label>
        <select class="effort-level">
          <option value="high">High Effort</option>
          <option value="medium">Medium Effort</option>
          <option value="low">Low Effort</option>
        </select>
      </div>
      <div class="form-group">
        <label>Estimated Value</label>
        <input type="text" class="estimated-value" placeholder="e.g., 15% efficiency gain">
      </div>
      <button type="button" class="btn-danger" onclick="removeAction(this)">Remove Action</button>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', actionHTML);
}
function removeAction(button) {
  button.closest('.action-container').remove();
}

// Helper function: Read a file input as a Data URL
function readFileAsDataUrl(inputId) {
  return new Promise((resolve) => {
    const inputEl = document.getElementById(inputId);
    if (inputEl && inputEl.files && inputEl.files[0]) {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = e => resolve(null);
      reader.readAsDataURL(inputEl.files[0]);
    } else {
      resolve(null);
    }
  });
}

// GENERATE REPORT FUNCTION
function generateReport() {
  // Read updated form values
  const clientName = document.getElementById('client-name').value;
  const reportDate = document.getElementById('report-date').value;
  const csmName = document.getElementById('csm-name').value;
  const csmEmail = document.getElementById('csm-email').value;
  const executiveSummary = document.getElementById('executive-summary').value;
  
  // Metrics
  const utilizationScore = document.getElementById('utilization-score').value;
  const businessAlignment = document.getElementById('business-alignment').value;
  const keyOpportunities = document.getElementById('key-opportunities').value;
  const unusedFeatures = document.getElementById('unused-features').value;
  
  // Insights
  const strengths = Array.from(document.querySelectorAll('.strength-input')).map(input => input.value).filter(v => v.trim() !== '');
  const opportunities = Array.from(document.querySelectorAll('.opportunity-input')).map(input => input.value).filter(v => v.trim() !== '');
  const radarInsight = document.getElementById('radar-insight').value;
  const rulesInsight = document.getElementById('rules-insight').value;
  const businessInsight = document.getElementById('business-insight').value;
  
  // Actions
  const actions = [];
  document.querySelectorAll('.action-container').forEach(container => {
    const title = container.querySelector('.action-title').value;
    const description = container.querySelector('.action-description').value;
    const impact = container.querySelector('.impact-level').value;
    const effort = container.querySelector('.effort-level').value;
    const value = container.querySelector('.estimated-value').value;
    if (title && description) {
      actions.push({ title, description, impact, effort, value });
    }
  });
  
  // Next Steps
  const nextSteps = document.getElementById('next-steps').value;
  
  // Show a loading message in the preview iframe while generating
  const iframe = document.getElementById('report-preview');
  iframe.srcdoc = `<div style="display:flex;justify-content:center;align-items:center;height:100%;font-weight:bold;color:#102E44;">Loading Report...</div>`;
  
  // Read any image files (logo, charts)
  Promise.all([
    readFileAsDataUrl('company-logo'),
    readFileAsDataUrl('radar-chart'),
    readFileAsDataUrl('heatmap-chart'),
    readFileAsDataUrl('matrix-chart'),
    readFileAsDataUrl('rules-chart'),
    readFileAsDataUrl('business-chart')
  ]).then(([companyLogoUrl, radarChartUrl, heatmapChartUrl, matrixChartUrl, rulesChartUrl, businessChartUrl]) => {
    // Format the report date
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(reportDate).toLocaleDateString(undefined, dateOptions);
    
    // Build the dynamic HTML template (for brevity, only a portion is shown)
    const templateHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Customer Report Card - ${clientName}</title>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          /* Include report card CSS here (or link to an external CSS file if you prefer) */
          body {
            font-family: 'IBM Plex Sans', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #F8F9FD;
            color: #25282A;
          }
          .template-container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: #FFFFFF;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 30px;
            background: linear-gradient(135deg,
                        #102E44 30%,
                        #F0949B 50%,
                        #EB625C 70%);
            color: #F8F9FD;
          }
          .logo-placeholder {
            width: 150px;
            height: 50px;
            background-color: #F8F9FD;
            border: 2px solid #EB625C;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            color: #102E44;
            border-radius: 5px;
            margin: 0 20px;
          }
          .report-title {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .date-client {
            text-align: right;
            font-size: 14px;
            line-height: 1.5;
          }
          .executive-summary {
            background: linear-gradient(135deg, #F8F9FD, #D7DDF5);
            padding: 25px;
            border-radius: 10px;
            margin: 30px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }
          /* Additional styles from your report template go here */
        </style>
      </head>
      <body>
        <div class="template-container">
          <header>
            <div class="logo-placeholder">
              ${companyLogoUrl ? `<img src="${companyLogoUrl}" style="max-width:100%; max-height:100%;">` : 'Company Logo'}
            </div>
            <div class="date-client">
              <h2 class="report-title">${clientName} Report Card</h2>
              <p>${formattedDate}</p>
              <p>CSM: ${csmName}</p>
            </div>
          </header>
          <section class="executive-summary">
            <h2>Executive Summary</h2>
            <p>${executiveSummary}</p>
          </section>
          <section class="summary-stats">
            <div class="stat-item">
              <div class="stat-value">${utilizationScore}%</div>
              <div class="stat-label">Platform Utilization</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${businessAlignment}%</div>
              <div class="stat-label">Business Alignment</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${keyOpportunities}</div>
              <div class="stat-label">Key Opportunities</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${unusedFeatures}</div>
              <div class="stat-label">Unused Features</div>
            </div>
          </section>
          <!-- Add additional sections such as charts, insights, actions, and next steps as needed -->
        </div>
      </body>
      </html>
    `;
    
    // Update the preview iframe with the new template
    document.getElementById('report-preview').srcdoc = templateHTML;
  });
}

// DOWNLOAD PDF FUNCTION
function downloadPDF() {
  const reportContent = document.getElementById('report-preview').srcdoc;
  const printWindow = window.open('', 'PRINT', 'height=800,width=1200');
  printWindow.document.write(reportContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}
