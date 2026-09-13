import { jsPDF } from 'jspdf';
import { ResumeData } from '../types';

/**
 * Generates an exact replica of the user's single-page academic / SWE LaTeX resume
 * using Times New Roman serif typography, full-width section divider lines,
 * bold/italic hierarchy, and precise alignment.
 */
export function generateAndDownloadResumePdf(resume: ResumeData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 12;
  const contentWidth = pageWidth - margin * 2; // 186mm
  let y = 14;

  // Primary text color: Pure black #000000
  doc.setTextColor(0, 0, 0);

  // ==========================================
  // 1. HEADER (Centered, Serif Times)
  // ==========================================
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.text(resume.name || 'Rakesh Kayal', pageWidth / 2, y, { align: 'center' });
  y += 5.2;

  // Contact line 1: Phone | Email | LinkedIn | GitHub |
  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);

  const phone = resume.phone || '+91-8768799345';
  const email = resume.email || 'rakeshkayal276@gmail.com';
  const linkedin = resume.socials?.linkedin?.replace(/^https?:\/\/(www\.)?/, '') || 'linkedin.com/in/rakesh-kayal';
  const github = resume.socials?.github?.replace(/^https?:\/\/(www\.)?/, '') || 'github.com/RakeshKayal';
  const leetcode = resume.socials?.leetcode?.replace(/^https?:\/\/(www\.)?/, '') || 'leetcode.com/u/RAKESH_kayal09';

  const contactLine1 = `${phone} | ${email} | ${linkedin} | ${github} |`;
  doc.text(contactLine1, pageWidth / 2, y, { align: 'center' });
  y += 4.2;

  // Contact line 2: LeetCode link
  doc.text(leetcode, pageWidth / 2, y, { align: 'center' });
  y += 6;

  // Helper for Section Titles: Title (bold serif) with full-width black line directly underneath
  const renderSectionHeader = (title: string) => {
    y += 1.5;
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(title, margin, y);
    y += 1.5;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.35);
    doc.line(margin, y, pageWidth - margin, y);
    y += 3.8;
  };

  // ==========================================
  // 2. SUMMARY
  // ==========================================
  renderSectionHeader('Summary');
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  const summaryText =
    resume.summary ||
    'Backend Software Engineer with hands-on experience in Java, Spring Boot, and FastAPI, building REST APIs, JWT/OAuth2 authentication, and a WebSocket-based real-time messaging system supporting 500+ concurrent users. 400+ LeetCode problems solved.';
  const summaryLines = doc.splitTextToSize(summaryText, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 3.6 + 2.5;

  // ==========================================
  // 3. EXPERIENCE
  // ==========================================
  renderSectionHeader('Experience');
  (resume.experience || []).forEach((exp) => {
    // Company (Bold) on left, Duration on right
    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    const compName = exp.subName ? `${exp.company} (${exp.subName})` : exp.company;
    doc.text(compName, margin, y);

    const dur = exp.duration || '';
    const durWidth = doc.getTextWidth(dur);
    doc.text(dur, pageWidth - margin - durWidth, y);
    y += 3.8;

    // Role (Italic) on left
    doc.setFont('times', 'italic');
    doc.setFontSize(9);
    doc.text(exp.role, margin, y);
    y += 3.6;

    // Bullets (Times normal)
    doc.setFont('times', 'normal');
    doc.setFontSize(8.8);
    (exp.bullets || []).forEach((bullet) => {
      const bulletLines = doc.splitTextToSize(`• ${bullet}`, contentWidth - 2);
      doc.text(bulletLines, margin + 1.5, y);
      y += bulletLines.length * 3.4;
    });
    y += 1.2;
  });

  // ==========================================
  // 4. PROJECTS
  // ==========================================
  renderSectionHeader('Projects');
  (resume.projects || []).slice(0, 3).forEach((proj) => {
    // Project Title (Bold) | Tech Stack (Italic) | GitHub
    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    const titleText = proj.title;
    doc.text(titleText, margin, y);
    const titleWidth = doc.getTextWidth(titleText);

    doc.setFont('times', 'italic');
    doc.setFontSize(8.8);
    const techText = ` | ${(proj.technologies || []).join(', ')} | `;
    doc.text(techText, margin + titleWidth, y);
    const techWidth = doc.getTextWidth(techText);

    doc.setFont('times', 'normal');
    doc.text('GitHub', margin + titleWidth + techWidth, y);
    y += 3.6;

    // Bullets
    doc.setFont('times', 'normal');
    doc.setFontSize(8.8);
    (proj.highlights || []).forEach((hl) => {
      const hlLines = doc.splitTextToSize(`• ${hl}`, contentWidth - 2);
      doc.text(hlLines, margin + 1.5, y);
      y += hlLines.length * 3.4;
    });
    y += 1.2;
  });

  // ==========================================
  // 5. TECHNICAL SKILLS
  // ==========================================
  renderSectionHeader('Technical Skills');
  const skillsData = [
    { label: 'Languages', value: 'Java, Python, SQL' },
    { label: 'Frameworks', value: 'Spring Boot, Spring Data JPA, Hibernate, Spring Security, FastAPI' },
    { label: 'Backend', value: 'REST APIs, WebSocket, JWT Authentication, OAuth2' },
    { label: 'Core CS', value: 'Data Structures, Algorithms, OOP, DBMS, Operating Systems' },
    { label: 'Cloud', value: 'AWS (EC2, IAM)' },
    { label: 'Tools', value: 'Git, GitHub, Maven, Postman, Docker' },
  ];

  skillsData.forEach((row) => {
    doc.setFont('times', 'bold');
    doc.setFontSize(8.8);
    const labelStr = `${row.label}: `;
    doc.text(labelStr, margin, y);
    const lWidth = doc.getTextWidth(labelStr);

    doc.setFont('times', 'normal');
    doc.text(row.value, margin + lWidth, y);
    y += 3.6;
  });
  y += 1;

  // ==========================================
  // 6. EDUCATION
  // ==========================================
  renderSectionHeader('Education');
  doc.setFont('times', 'bold');
  doc.setFontSize(9.5);
  doc.text(resume.education?.institution || 'The Neotia University', margin, y);

  const eduYear = resume.education?.duration || '2022 – 2026';
  const eduYearWidth = doc.getTextWidth(eduYear);
  doc.text(eduYear, pageWidth - margin - eduYearWidth, y);
  y += 3.8;

  doc.setFont('times', 'italic');
  doc.setFontSize(8.8);
  const degreeLine = `${resume.education?.degree || 'B.Tech in Computer Science and Engineering'}, ${resume.education?.specialization || 'Specialization in Cyber Security'} — CGPA: 8.7/10`;
  doc.text(degreeLine, margin, y);

  const eduLoc = resume.education?.location || 'West Bengal, India';
  const eduLocWidth = doc.getTextWidth(eduLoc);
  doc.text(eduLoc, pageWidth - margin - eduLocWidth, y);
  y += 4.5;

  // ==========================================
  // 7. CERTIFICATIONS & ACHIEVEMENTS
  // ==========================================
  renderSectionHeader('Certifications & Achievements');
  doc.setFont('times', 'normal');
  doc.setFontSize(8.8);

  const certItems = [
    'AWS Academy Cloud Foundations – AWS Academy, 2025. Credential Link',
    'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate – Oracle, 2025. Credential Link',
    'SIH 2025 Hackathon Participant – Built a telemedicine platform prototype, internal round at The Neotia University. Credential Link',
  ];

  certItems.forEach((c) => {
    const cLines = doc.splitTextToSize(`• ${c}`, contentWidth - 2);
    doc.text(cLines, margin + 1.5, y);
    y += cLines.length * 3.4;
  });

  // Download with the professional name
  doc.save('Rakesh_Kayal_Resume.pdf');
}

export const generateResumePdf = generateAndDownloadResumePdf;
