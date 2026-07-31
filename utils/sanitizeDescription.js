const sanitizeHtml = require('sanitize-html');

// Matches the toolbar exposed by the Quill editor on the admin product form
// (public/scripts/product-description-editor.js) - nothing broader is ever
// legitimately produced by it, so anything else in submitted HTML is either
// a stale/tampered request or an attempted stored-XSS payload.
const ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'u', 's', 'ol', 'ul', 'li', 'blockquote', 'a'];

function sanitizeDescription(html) {
  return sanitizeHtml(html || '', {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ['href'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
}

module.exports = sanitizeDescription;
