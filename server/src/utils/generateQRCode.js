const QRCode = require('qrcode');

// Encode arbitrary text (e.g. a check-in URL) as a data-URL PNG. Returns null
// on failure instead of an undefined console.error result.
const generateQR = async text => {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error('QR generation failed:', err.message);
    return null;
  }
};

module.exports = generateQR;
