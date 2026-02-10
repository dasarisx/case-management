import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import * as fs from 'fs';

@Injectable()
export class PdfService {
  constructor(private readonly prisma: PrismaService) {}

  async generateNotice(caseId: number): Promise<Buffer> {
    const caseRecord = await this.prisma.case.findUnique({
      where: { id: caseId },
      include: {
        customer: true,
        loan: true,
        actionLogs: { orderBy: { createdAt: 'desc' }, take: 3 },
      },
    });

    if (!caseRecord) {
      throw new NotFoundException(`Case ${caseId} not found`);
    }

    const payBefore = new Date();
    payBefore.setDate(payBefore.getDate() + 3);

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
            .header { display: flex; justify-content: space-between; align-items: center; }
            .logo { width: 140px; height: 40px; border: 2px dashed #94a3b8; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #64748b; }
            h1 { margin: 16px 0 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { border: 1px solid #e2e8f0; padding: 8px; font-size: 12px; }
            th { background: #f1f5f9; text-align: left; }
            .meta { margin-top: 12px; font-size: 13px; }
            .footer { margin-top: 28px; font-size: 11px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Payment Notice</h1>
              <div class="meta">Case #${caseRecord.id}</div>
            </div>
            <div class="logo">LOGO</div>
          </div>

          <div class="meta">
            <div><strong>Customer:</strong> ${caseRecord.customer.name} (${caseRecord.customer.email})</div>
            <div><strong>Loan:</strong> #${caseRecord.loan.id} | Principal: ${caseRecord.loan.principal} | Outstanding: ${caseRecord.loan.outstanding}</div>
            <div><strong>DPD:</strong> ${caseRecord.dpd} | <strong>Stage:</strong> ${caseRecord.stage} | <strong>Assigned:</strong> ${caseRecord.assignedTo ?? 'Unassigned'}</div>
            <div><strong>Pay before:</strong> ${payBefore.toISOString().slice(0, 10)}</div>
          </div>

          <h3>Recent Actions</h3>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Outcome</th>
                <th>Notes</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              ${caseRecord.actionLogs
                .map(
                  (a: {
                    type: string;
                    outcome: string;
                    notes: string | null;
                    createdAt: Date;
                  }) => `
                    <tr>
                      <td>${a.type}</td>
                      <td>${a.outcome}</td>
                      <td>${a.notes ?? ''}</td>
                      <td>${a.createdAt.toISOString()}</td>
                    </tr>
                  `,
                )
                .join('')}
            </tbody>
          </table>

          <div class="footer">
            Generated at ${new Date().toISOString()}
          </div>
        </body>
      </html>
    `;

    const systemPath = '/usr/bin/chromium';
    const candidatePath = await chromium.executablePath();
    const executablePath =
      fs.existsSync(systemPath) ? systemPath : candidatePath;
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
      defaultViewport: { width: 1280, height: 720 },
      executablePath,
      headless: true,
      timeout: 30000,
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
      const pdf = await page.pdf({ format: 'A4' });
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }
}
