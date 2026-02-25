import { formatDate, formatPeso } from '@/lib/utils';
import { toTitleCase } from './text';

interface EmailTemplate {
  subject: string;
  body: string;
}

interface TransactionEmailContext {
  number: string;
  customerName: string | null;
  customerEmail: string | null;
  pickupDate: string | null;
  total: string;
  paid: string;
}

function balance(ctx: TransactionEmailContext): number {
  return parseFloat(ctx.total) - parseFloat(ctx.paid);
}

export const EMAIL_TEMPLATES = {
  pickup_ready: 'pickup_ready',
  payment_reminder: 'payment_reminder',
  new_pickup_date: 'new_pickup_date',
} as const;

export type EmailTemplateKey = typeof EMAIL_TEMPLATES[keyof typeof EMAIL_TEMPLATES];

export const EMAIL_TEMPLATE_LABELS: Record<EmailTemplateKey, string> = {
  pickup_ready: 'Shoes Ready for Pickup',
  payment_reminder: 'Payment Reminder',
  new_pickup_date: 'Updated Pickup Date',
};

function buildTemplate(key: EmailTemplateKey, ctx: TransactionEmailContext): EmailTemplate {
  const name = toTitleCase(ctx.customerName) || 'Customer';
  const bal = balance(ctx);

  switch (key) {
    case EMAIL_TEMPLATES.pickup_ready:
      return {
        subject: `Your sneakers are ready for pickup! — Txn #${ctx.number}`,
        body: [
          `Hi ${name},`,
          '',
          `Great news! Your shoe(s) from Sneaker Doctor are ready for pickup.`,
          '',
          `Transaction: #${ctx.number}`,
          `Pickup date: ${formatDate(ctx.pickupDate)}`,
          ...(bal > 0 ? [`Balance due: ${formatPeso(bal)}`] : ['Balance: Fully paid']),
          '',
          `Please bring this reference number when you come in.`,
          '',
          `See you soon!`,
          `— Sneaker Doctor`,
        ].join('\n'),
      };

    case EMAIL_TEMPLATES.payment_reminder:
      return {
        subject: `Payment reminder — Txn #${ctx.number} — Sneaker Doctor`,
        body: [
          `Hi ${name},`,
          '',
          `This is a friendly reminder that you have an outstanding balance for your transaction with Sneaker Doctor.`,
          '',
          `Transaction: #${ctx.number}`,
          `Total: ${formatPeso(ctx.total)}`,
          `Paid: ${formatPeso(ctx.paid)}`,
          `Balance due: ${formatPeso(bal)}`,
          '',
          `Please settle your balance upon pickup. Thank you!`,
          '',
          `— Sneaker Doctor`,
        ].join('\n'),
      };

    case EMAIL_TEMPLATES.new_pickup_date:
      return {
        subject: `Pickup date updated — Txn #${ctx.number} — Sneaker Doctor`,
        body: [
          `Hi ${name},`,
          '',
          `We wanted to let you know that your pickup date for transaction #${ctx.number} has been updated.`,
          '',
          `New pickup date: ${formatDate(ctx.pickupDate)}`,
          '',
          `We appreciate your patience and will have your shoes ready by then.`,
          '',
          `— Sneaker Doctor`,
        ].join('\n'),
      };
  }
}

export function generateGmailLink(ctx: TransactionEmailContext, templateKey: EmailTemplateKey): string {
  if (!ctx.customerEmail) return '';
  const { subject, body } = buildTemplate(templateKey, ctx);
  const params = new URLSearchParams({ view: 'cm', to: ctx.customerEmail, su: subject, body });
  return `https://mail.google.com/mail/?${params.toString()}`;
}
