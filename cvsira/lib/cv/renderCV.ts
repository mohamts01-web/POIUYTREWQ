/**
 * CV Rendering Engine
 * 
 * This file renders CV HTML that works for both:
 * - Live Preview (iframe)
 * - PDF Generation (Puppeteer)
 * 
 * Same HTML = Same Result (Single Source of Truth)
 */

import { CV, Theme, Font, TemplateType, getTheme, getFont } from './schema'

/**
 * Render CV to HTML
 * 
 * @param template - Template type (classic, modern, hybrid)
 * @param data - CV data
 * @param theme - Color theme
 * @param font - Font settings
 * @returns HTML string
 */
export function renderCV(
  template: TemplateType,
  data: CV,
  theme: Theme,
  font: Font
): string {
  const themeColors = getTheme(template)
  const fontSettings = getFont(template)

  return renderTemplate(template, data, themeColors, fontSettings)
}

/**
 * Classic Template
 */
function renderClassic(
  data: CV,
  theme: Theme,
  font: Font
): string {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="${font.direction}">
    <head>
      <meta charset="UTF-8">
      <title>${data.personalInfo.name} - سيرة ذاتية</title>
      <style>
        @font-face {
          font-family: '${font.family}';
          src: url('/fonts/${font.family}-Regular.ttf') format('truetype');
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          width: 210mm;
          min-height: 297mm;
          direction: ${font.direction};
          word-break: break-word;
          font-family: '${font.family}', sans-serif;
          color: ${theme.text};
          background: white;
          padding: 40px;
        }
        @media print {
          body { margin: 0; }
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid ${theme.primary};
        }
        .name {
          font-size: 28px;
          font-weight: bold;
          color: ${theme.primary};
          margin-bottom: 5px;
        }
        .title {
          font-size: 18px;
          color: #666;
          margin-bottom: 20px;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: ${theme.primary};
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .content {
          line-height: 1.6;
        }
        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }
        .skill {
          background: ${theme.primary}20;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
        }
        .experience-item, .education-item {
          margin-bottom: 15px;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-weight: bold;
        }
        .item-date {
          color: #666;
          font-size: 14px;
        }
        .bullets {
          list-style: none;
          padding-right: 20px;
        }
        .bullets li {
          margin-bottom: 5px;
          position: relative;
          padding-right: 15px;
        }
        .bullets li::before {
          content: '•';
          position: absolute;
          right: 0;
          color: ${theme.primary};
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="name">${data.personalInfo.name}</h1>
        <p class="title">${data.personalInfo.title}</p>
        <p>${data.personalInfo.email} | ${data.personalInfo.phone}</p>
        <p>${data.personalInfo.address}</p>
      </div>

      ${data.summary ? `
        <div class="section">
          <h2 class="section-title">الملخص المهني</h2>
          <div class="content">${data.summary}</div>
        </div>
      ` : ''}

      <div class="section">
        <h2 class="section-title">المهارات</h2>
        <div class="skills">
          ${data.skills.map(skill => `<div class="skill">${skill}</div>`).join('')}
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">الخبرة العمل</h2>
        ${data.experience.map(exp => `
          <div class="experience-item">
            <div class="item-header">
                <span>${exp.title}</span>
                <span class="item-date">${exp.startDate} - ${exp.endDate}</span>
              </div>
              <div class="item-header">
                <span>${exp.company}</span>
              </div>
              <div class="content">
                ${exp.description}
              </div>
            </div>
        `).join('')}
      </div>

      ${data.education.length > 0 ? `
        <div class="section">
          <h2 class="section-title">التعليم</h2>
          ${data.education.map(edu => `
            <div class="education-item">
              <div class="item-header">
                <span>${edu.school}</span>
                <span class="item-date">${edu.year}</span>
              </div>
              <div class="item-header">
                <span>${edu.degree}</span>
              </div>
              <div class="item-header">
                <span>${edu.field}</span>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </body>
    </html>
  `
}

/**
 * Modern Template
 */
function renderModern(
  data: CV,
  theme: Theme,
  font: Font
): string {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="${font.direction}">
    <head>
      <meta charset="UTF-8">
      <title>${data.personalInfo.name} - سيرة ذاتية</title>
      <style>
        @font-face {
          font-family: '${font.family}';
          src: url('/fonts/${font.family}-Regular.ttf') format('truetype');
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          width: 210mm;
          min-height: 297mm;
          direction: ${font.direction};
          word-break: break-word;
          font-family: '${font.family}', sans-serif;
          color: ${theme.text};
          background: white;
          padding: 50px;
        }
        @media print {
          body { margin: 0; }
        }
        .container {
          max-width: 700px;
          margin: 0 auto;
        }
        .header {
          background: ${theme.primary};
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 0 5px 5px 0;
        }
        .name {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .title {
          font-size: 20px;
          opacity: 0.9;
        }
        .contact {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-bottom: 30px;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 14px;
          font-weight: bold;
          color: ${theme.primary};
          text-transform: uppercase;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid ${theme.primary};
        }
        .content {
          line-height: 1.8;
        }
        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }
        .skill {
          background: ${theme.primary}15;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
        }
        .experience-item {
          margin-bottom: 20px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-weight: bold;
        }
        .item-date {
          color: #666;
          font-size: 13px;
        }
        .bullets {
          list-style: none;
          padding: 0;
        }
        .bullets li {
          margin-bottom: 8px;
          padding-right: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="name">${data.personalInfo.name}</div>
          <div class="title">${data.personalInfo.title}</div>
          <div class="contact">
            <div class="contact-item">📧 ${data.personalInfo.email}</div>
            <div class="contact-item">📱 ${data.personalInfo.phone}</div>
            <div class="contact-item">📍 ${data.personalInfo.address}</div>
          </div>
        </div>

        ${data.summary ? `
          <div class="section">
            <div class="section-title">📋 الملخص المهني</div>
            <div class="content">${data.summary}</div>
          </div>
        ` : ''}

        <div class="section">
          <div class="section-title">💡 المهارات</div>
          <div class="skills">
            ${data.skills.map(skill => `<div class="skill">${skill}</div>`).join('')}
          </div>
        </div>

        <div class="section">
          <div class="section-title">💼 الخبرة العمل</div>
          ${data.experience.map(exp => `
            <div class="experience-item">
              <div class="item-header">
                <span>${exp.title}</span>
                <span class="item-date">${exp.startDate} - ${exp.endDate}</span>
              </div>
              <div class="item-header">
                <span>${exp.company}</span>
              </div>
              <div class="content">
                ${exp.description}
              </div>
            </div>
          `).join('')}
        </div>

        ${data.education.length > 0 ? `
          <div class="section">
            <div class="section-title">🎓 التعليم</div>
            ${data.education.map(edu => `
              <div class="education-item">
                  <div class="item-header">
                    <span>${edu.school}</span>
                    <span class="item-date">${edu.year}</span>
                  </div>
                  <div class="item-header">
                    <span>${edu.degree}</span>
                  </div>
                  <div class="item-header">
                    <span>${edu.field}</span>
                  </div>
                </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `
}

/**
 * Hybrid Template
 */
function renderHybrid(
  data: CV,
  theme: Theme,
  font: Font
): string {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="${font.direction}">
    <head>
      <meta charset="UTF-8">
      <title>${data.personalInfo.name} - سيرة ذاتية</title>
      <style>
        @font-face {
          font-family: '${font.family}';
          src: url('/fonts/${font.family}-Regular.ttf') format('truetype');
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          width: 210mm;
          min-height: 297mm;
          direction: ${font.direction};
          word-break: break-word;
          font-family: '${font.family}', sans-serif;
          color: ${theme.text};
          background: white;
          padding: 40px;
        }
        @media print {
          body { margin: 0; }
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-bottom: 3px solid ${theme.primary};
          margin-bottom: 30px;
        }
        .name {
          font-size: 24px;
          font-weight: bold;
          color: ${theme.primary};
        }
        .title {
          font-size: 16px;
          color: #666;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 14px;
          font-weight: bold;
          color: ${theme.primary};
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid ${theme.primary};
        }
        .content {
          line-height: 1.7;
        }
        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }
        .skill {
          background: ${theme.primary}10;
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 13px;
        }
        .experience-item {
          margin-bottom: 15px;
          padding: 15px;
          border-left: 4px solid ${theme.primary};
          padding-left: 15px;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-weight: 600;
        }
        .item-date {
          color: #888;
          font-size: 13px;
        }
        .bullets {
          list-style: none;
          padding: 0;
        }
        .bullets li {
          margin-bottom: 5px;
          padding-right: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="name">${data.personalInfo.name}</div>
          <div class="title">${data.personalInfo.title}</div>
        </div>
        <div>
          ${data.personalInfo.email}
          ${data.personalInfo.phone}
          ${data.personalInfo.address}
        </div>
      </div>

      ${data.summary ? `
        <div class="section">
          <div class="section-title">الملخص المهني</div>
          <div class="content">${data.summary}</div>
        </div>
      ` : ''}

      <div class="section">
        <div class="section-title">المهارات</div>
        <div class="skills">
          ${data.skills.map(skill => `<div class="skill">${skill}</div>`).join('')}
        </div>
      </div>

      <div class="section">
        <div class="section-title">الخبرة العمل</div>
        ${data.experience.map(exp => `
          <div class="experience-item">
            <div class="item-header">
              <span>${exp.title}</span>
              <span class="item-date">${exp.startDate} - ${exp.endDate}</span>
            </div>
            <div class="item-header">
              <span>${exp.company}</span>
            </div>
            <div class="content">
              ${exp.description}
            </div>
          </div>
        `).join('')}
      </div>

      ${data.education.length > 0 ? `
        <div class="section">
          <div class="section-title">التعليم</div>
          ${data.education.map(edu => `
            <div class="experience-item">
              <div class="item-header">
                <span>${edu.school}</span>
                <span class="item-date">${edu.year}</span>
              </div>
              <div class="item-header">
                <span>${edu.degree}</span>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </body>
    </html>
  `
}

/**
 * Render template based on type
 */
function renderTemplate(
  template: TemplateType,
  data: CV,
  theme: Theme,
  font: Font
): string {
  switch (template) {
    case 'classic':
      return renderClassic(data, theme, font)
    case 'modern':
      return renderModern(data, theme, font)
    case 'hybrid':
      return renderHybrid(data, theme, font)
    default:
      return renderClassic(data, theme, font)
  }
}
