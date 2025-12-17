// ===========================
// Like Button Functionality
// ===========================

let likeCount = 1700; // Starting count
let isLiked = false;

const likeBtn = document.getElementById('likeBtn');
const likeCountElement = document.getElementById('likeCount');

// Format number with K suffix
function formatCount(count) {
    if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
}

// Handle like button click
likeBtn.addEventListener('click', () => {
    if (!isLiked) {
        likeCount++;
        isLiked = true;
        likeBtn.classList.add('liked');

        // Create floating hearts animation
        createFloatingHeart();
    } else {
        likeCount--;
        isLiked = false;
        likeBtn.classList.remove('liked');
    }

    // Update count with animation
    animateCountChange();
});

// Animate count change
function animateCountChange() {
    likeCountElement.style.transform = 'scale(1.3)';
    likeCountElement.style.color = 'var(--accent-primary)';

    setTimeout(() => {
        likeCountElement.textContent = formatCount(likeCount);
        likeCountElement.style.transform = 'scale(1)';
        likeCountElement.style.color = '';
    }, 200);
}

// Create floating heart effect
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.cssText = `
        position: fixed;
        bottom: ${likeBtn.offsetTop}px;
        right: ${window.innerWidth - likeBtn.offsetLeft - likeBtn.offsetWidth / 2}px;
        font-size: 2rem;
        pointer-events: none;
        z-index: 9999;
        animation: floatUp 2s ease-out forwards;
    `;

    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 2000);
}

// Add floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.5);
        }
    }
`;
document.head.appendChild(style);

// ===========================
// Profile Image Upload
// ===========================

const profileImg = document.getElementById('profileImg');

// Handle drag and drop for profile image
profileImg.addEventListener('dragover', (e) => {
    e.preventDefault();
    profileImg.style.opacity = '0.5';
});

profileImg.addEventListener('dragleave', () => {
    profileImg.style.opacity = '1';
});

profileImg.addEventListener('drop', (e) => {
    e.preventDefault();
    profileImg.style.opacity = '1';

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            profileImg.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Click to upload profile image
profileImg.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                profileImg.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    input.click();
});

// ===========================
// Smooth Scroll & Animations
// ===========================

// Add intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all code sections
document.querySelectorAll('.code-section').forEach(section => {
    observer.observe(section);
});

// ===========================
// Typing Effect for Comments
// ===========================

function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ===========================
// Code Syntax Highlighting Enhancement
// ===========================

// Add line numbers to code sections (optional)
function addLineNumbers() {
    const codeSections = document.querySelectorAll('.code-section');

    codeSections.forEach((section, index) => {
        const lineNumberDiv = document.createElement('div');
        lineNumberDiv.className = 'line-numbers';
        lineNumberDiv.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            padding: var(--spacing-lg);
            color: var(--text-secondary);
            font-size: var(--font-size-xs);
            user-select: none;
            opacity: 0.5;
        `;

        const lines = section.textContent.split('\n').length;
        for (let i = 1; i <= lines; i++) {
            lineNumberDiv.innerHTML += i + '<br>';
        }

        // Uncomment to enable line numbers
        // section.style.position = 'relative';
        // section.style.paddingLeft = '3rem';
        // section.appendChild(lineNumberDiv);
    });
}

// ===========================
// Keyboard Shortcuts
// ===========================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + L to like
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        likeBtn.click();
    }

    // Ctrl/Cmd + P to print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
    }
});

// ===========================
// Copy to Clipboard Functionality
// ===========================

// Add copy buttons to code sections
document.querySelectorAll('.code-section').forEach(section => {
    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = '📋';
    copyBtn.className = 'copy-btn';
    copyBtn.style.cssText = `
        position: absolute;
        top: var(--spacing-sm);
        right: var(--spacing-sm);
        background: var(--bg-primary);
        border: 1px solid var(--accent-primary);
        color: var(--text-primary);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: 4px;
        cursor: pointer;
        opacity: 0;
        transition: opacity var(--transition-fast);
        font-size: 1rem;
    `;

    section.style.position = 'relative';
    section.appendChild(copyBtn);

    section.addEventListener('mouseenter', () => {
        copyBtn.style.opacity = '1';
    });

    section.addEventListener('mouseleave', () => {
        copyBtn.style.opacity = '0';
    });

    copyBtn.addEventListener('click', async () => {
        const text = section.textContent;
        try {
            await navigator.clipboard.writeText(text);
            copyBtn.innerHTML = '✅';
            setTimeout(() => {
                copyBtn.innerHTML = '📋';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });
});

// ===========================
// Theme Toggle (Optional)
// ===========================

let isDarkTheme = true;

function toggleTheme() {
    isDarkTheme = !isDarkTheme;

    if (isDarkTheme) {
        document.documentElement.style.setProperty('--bg-primary', '#1e1e1e');
        document.documentElement.style.setProperty('--bg-secondary', '#252526');
        document.documentElement.style.setProperty('--text-primary', '#d4d4d4');
    } else {
        document.documentElement.style.setProperty('--bg-primary', '#ffffff');
        document.documentElement.style.setProperty('--bg-secondary', '#f5f5f5');
        document.documentElement.style.setProperty('--text-primary', '#1e1e1e');
    }
}

// ===========================
// Performance Optimizations
// ===========================

// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
    });
}

// ===========================
// Analytics & Tracking (Optional)
// ===========================

// Track like button clicks
likeBtn.addEventListener('click', () => {
    console.log('Like button clicked at:', new Date().toISOString());
    // Add your analytics code here
});

// ===========================
// Initialize
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    console.log('CV loaded successfully! 🚀');

    // Add any initialization code here
    // addLineNumbers(); // Uncomment to enable line numbers
});

// ===========================
// Export to PDF Functionality
// ===========================

function exportToPDF() {
    window.print();
}

// Add export button (optional)
const exportBtn = document.createElement('button');
exportBtn.textContent = '📄 Export PDF';
exportBtn.style.cssText = `
    position: fixed;
    top: var(--spacing-md);
    right: var(--spacing-md);
    background: var(--accent-primary);
    color: white;
    border: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: 4px;
    cursor: pointer;
    font-family: var(--font-code);
    font-size: var(--font-size-sm);
    transition: all var(--transition-fast);
    z-index: 999;
`;

exportBtn.addEventListener('click', exportToPDF);
exportBtn.addEventListener('mouseenter', () => {
    exportBtn.style.transform = 'scale(1.05)';
    exportBtn.style.boxShadow = '0 4px 12px rgba(0, 122, 204, 0.4)';
});
exportBtn.addEventListener('mouseleave', () => {
    exportBtn.style.transform = 'scale(1)';
    exportBtn.style.boxShadow = 'none';
});

document.body.appendChild(exportBtn);

// ===========================
// Easter Eggs
// ===========================

let clickCount = 0;
const profileSection = document.querySelector('.profile-section');

profileSection.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
        alert('🎉 You found the easter egg! You\'re persistent!');
        clickCount = 0;
    }
});

console.log('%c👨‍💻 Built with ❤️ using HTML, CSS & JavaScript', 'color: #4ec9b0; font-size: 16px; font-weight: bold;');
console.log('%cPress Ctrl+L to like this CV!', 'color: #569cd6; font-size: 12px;');
