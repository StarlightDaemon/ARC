// ARC - Accessories Guides Website
// Copy-to-clipboard functionality and UI interactions

document.addEventListener('DOMContentLoaded', () => {
  initCopyButtons();
});

/**
 * Initialize all copy buttons with click handlers
 */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const sectionId = button.dataset.section;
      const codeElement = document.getElementById(`code-${sectionId}`);
      
      if (codeElement) {
        await copyToClipboard(codeElement.textContent, button);
      }
    });
  });
}

/**
 * Copy text to clipboard and show feedback
 * @param {string} text - The text to copy
 * @param {HTMLElement} button - The button that was clicked
 */
async function copyToClipboard(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    
    // Update button state
    const originalHTML = button.innerHTML;
    button.innerHTML = '<span class="icon">✓</span> Copied!';
    button.classList.add('copied');
    
    // Show toast
    showToast('BBCode copied to clipboard!');
    
    // Reset button after delay
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.classList.remove('copied');
    }, 2000);
    
  } catch (err) {
    console.error('Failed to copy:', err);
    showToast('Failed to copy. Please try again.', 'error');
  }
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - 'success' or 'error'
 */
function showToast(message, type = 'success') {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create new toast
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  if (type === 'error') {
    toast.style.background = '#ef4444';
  }
  
  document.body.appendChild(toast);
  
  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  // Remove after delay
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/**
 * Copy all sections at once (optional feature)
 */
function copyAllSections() {
  const codeElements = document.querySelectorAll('.bbcode-content pre');
  const allCode = Array.from(codeElements)
    .map(el => el.textContent)
    .join('\n\n---\n\n');
  
  copyToClipboard(allCode, document.querySelector('.copy-all-btn'));
}
