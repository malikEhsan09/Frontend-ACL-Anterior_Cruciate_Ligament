import jsPDF from "jspdf";

interface PaymentDetails {
  paymentId: string;
  amount: number;
  stripeSessionId: string;
  paymentStatus: string;
  createdAt: string;
  user: {
    userName: string;
    email: string;
  };
}

export const generatePaymentPDF = (paymentDetails: PaymentDetails) => {
  const doc = new jsPDF();
  
  // Add green success circle with checkmark
  doc.setFillColor(236, 253, 245); // Light green background
  doc.circle(105, 30, 15, 'F');
  
  // Draw a complete checkmark
  doc.setDrawColor(34, 197, 94); // Green color for checkmark
  doc.setLineWidth(1.5);
  doc.line(98, 30, 102, 34); // First line of checkmark
  doc.line(102, 34, 112, 26); // Second line of checkmark

  // Payment Success text
  doc.setTextColor(71, 85, 105); // Slate gray
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const successText = "Payment Success!";
  const successTextWidth = doc.getTextWidth(successText);
  doc.text(successText, (210 - successTextWidth) / 2, 60); // Center the success text

  // Amount in large text
  doc.setTextColor(15, 23, 42); // Dark slate
  doc.setFontSize(24);
  const amountText = `PKR ${Number(paymentDetails.amount).toLocaleString()}`;
  const amountWidth = doc.getTextWidth(amountText);
  doc.text(amountText, (210 - amountWidth) / 2, 80); // Center the amount

  // Details section
  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);

  const startY = 100;
  const leftColX = 40;
  const rightColX = 120;
  const lineHeight = 15;

  // Helper function to add a row with label and value
  const addRow = (label: string, value: string, y: number) => {
    doc.setFont("helvetica", "normal");
    doc.text(label, leftColX, y);
    doc.setFont("helvetica", "bold");
    doc.text(value, rightColX, y);
  };

  // Add payment details
  addRow("Ref Number", paymentDetails.paymentId, startY);
  addRow("Payment Time", new Date(paymentDetails.createdAt).toLocaleString(), startY + lineHeight);
  addRow("Payment Method", "Bank Transfer", startY + lineHeight * 2);
  addRow("Sender Name", paymentDetails.user.userName, startY + lineHeight * 3);
  addRow("Amount", `PKR ${Number(paymentDetails.amount).toLocaleString()}`, startY + lineHeight * 4);

  // Add additional fields
  addRow("Payment ID", paymentDetails.paymentId, startY + lineHeight * 5);
  addRow("Stripe Session ID", paymentDetails.stripeSessionId, startY + lineHeight * 6);
  addRow("Payment Status", paymentDetails.paymentStatus, startY + lineHeight * 7);
  addRow("User Email", paymentDetails.user.email, startY + lineHeight * 8);

  // Add subtle divider lines between rows
  const dividerY = 95;
  const dividerLength = 160;
  doc.setDrawColor(226, 232, 240); // Light gray
  doc.setLineWidth(0.1);
  for (let i = 0; i < 9; i++) {
    doc.line(40, dividerY + lineHeight * i, dividerLength, dividerY + lineHeight * i);
  }

  // Add a centered, bold footer
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139); // Slate gray
  const footerText = "Thank you for your payment!";
  const footerWidth = doc.getTextWidth(footerText);
  doc.text(footerText, (210 - footerWidth) / 2, 280); // Center the footer text

  // Download the PDF
  doc.save("payment-receipt.pdf");
};
