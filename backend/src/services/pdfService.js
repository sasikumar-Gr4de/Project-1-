import puppeteer from "puppeteer";
import { generatePresignedUploadUrl, s3Config } from "../config/aws.config.js";

class PDFService {
  constructor() {
    this.browser = null;
  }

  async init() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }
  }

  async generateReportPDF(reportData, jobId) {
    await this.init();

    const {
      gr4de_score,
      tempo_index,
      technical_score,
      tactical_score,
      physical_score,
      mental_score,
      insights = [],
      benchmarks = {},
      player_name = "Player",
      match_date,
      competition = "Unknown",
    } = reportData;

    const html = this.generateHTMLTemplate({
      gr4de_score,
      tempo_index,
      technical_score,
      tactical_score,
      physical_score,
      mental_score,
      insights,
      benchmarks,
      player_name,
      match_date,
      competition,
    });

    const page = await this.browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    await page.close();

    // Upload to S3
    const timestamp = Date.now();
    const key = `reports/${jobId}/report_${timestamp}.pdf`;

    try {
      const presignedUrl = await generatePresignedUploadUrl(
        key,
        "application/pdf",
        3600
      );

      // Upload PDF buffer to S3
      const response = await fetch(presignedUrl, {
        method: "PUT",
        body: pdfBuffer,
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      if (!response.ok) {
        throw new Error(`S3 upload failed: ${response.status}`);
      }

      return `${s3Config.baseUrl}/${key}`;
    } catch (error) {
      console.error("PDF upload error:", error);
      throw error;
    }
  }

  generateHTMLTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>GR4DE Performance Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
          }
          .header h1 {
            font-size: 36px;
            margin-bottom: 10px;
            font-weight: bold;
          }
          .header .subtitle {
            font-size: 18px;
            opacity: 0.9;
          }
          .score-section {
            padding: 40px;
            text-align: center;
            background: #f8f9fa;
          }
          .main-score {
            font-size: 72px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 20px;
          }
          .score-label {
            font-size: 24px;
            color: #666;
            margin-bottom: 40px;
          }
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
            padding: 40px;
          }
          .metric-card {
            background: white;
            border-radius: 10px;
            padding: 25px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-left: 4px solid #667eea;
          }
          .metric-score {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .metric-label {
            font-size: 16px;
            color: #666;
            text-transform: capitalize;
          }
          .insights-section {
            padding: 40px;
            background: white;
          }
          .insights-section h2 {
            font-size: 28px;
            margin-bottom: 30px;
            color: #333;
            text-align: center;
          }
          .insights-grid {
            display: grid;
            gap: 20px;
          }
          .insight-item {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #28a745;
          }
          .insight-item.negative {
            border-left-color: #dc3545;
          }
          .footer {
            background: #333;
            color: white;
            padding: 30px;
            text-align: center;
          }
          .footer p {
            opacity: 0.8;
            font-size: 14px;
          }
          .tempo-highlight {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            margin: 20px 0;
            border-radius: 10px;
            text-align: center;
          }
          .tempo-highlight .tempo-score {
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>GR4DE Performance Report</h1>
            <div class="subtitle">
              ${data.player_name} • ${data.match_date} • ${data.competition}
            </div>
          </div>

          <div class="score-section">
            <div class="main-score">${data.gr4de_score}</div>
            <div class="score-label">GR4DE Score</div>
          </div>

          ${
            data.tempo_index
              ? `
          <div class="tempo-highlight">
            <div class="tempo-score">${data.tempo_index}</div>
            <div>Tempo Index - Passing Sequence Efficiency</div>
          </div>
          `
              : ""
          }

          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-score">${data.technical_score}</div>
              <div class="metric-label">Technical</div>
            </div>
            <div class="metric-card">
              <div class="metric-score">${data.tactical_score}</div>
              <div class="metric-label">Tactical</div>
            </div>
            <div class="metric-card">
              <div class="metric-score">${data.physical_score}</div>
              <div class="metric-label">Physical</div>
            </div>
            <div class="metric-card">
              <div class="metric-score">${data.mental_score}</div>
              <div class="metric-label">Mental</div>
            </div>
          </div>

          <div class="insights-section">
            <h2>Key Insights</h2>
            <div class="insights-grid">
              ${data.insights
                .map(
                  (insight) => `
                <div class="insight-item">
                  ${insight}
                </div>
              `
                )
                .join("")}
            </div>
          </div>

          <div class="footer">
            <p>Generated by GR4DE Platform • ${new Date().toLocaleDateString()}</p>
            <p>Advanced Football Performance Analysis</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export default new PDFService();
