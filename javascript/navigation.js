/**
 * Modern navigation module without jQuery
 * Handles mobile menu toggle, accessibility, and smooth transitions
 */

const NavModule = (() => {
  const trigger = document.querySelector("#nav-trigger span");
  const menu = document.querySelector("nav#nav-mobile ul");
  const hamburger = document.querySelector(".wrapper-menu");
  
  if (!trigger || !menu) return; // Exit if elements don't exist
  
  // Toggle menu on click
  trigger.addEventListener("click", () => {
    toggleMenu();
  });
  
  // Close menu when a link is clicked
  const navLinks = menu.querySelectorAll("a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });
  
  // Close menu on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("expanded")) {
      closeMenu();
    }
  });
  
  function toggleMenu() {
    menu.classList.toggle("expanded");
    hamburger.classList.toggle("open");
    
    // Update ARIA for accessibility
    const isOpen = menu.classList.contains("expanded");
    trigger.setAttribute("aria-expanded", isOpen);
  }
  
  function closeMenu() {
    menu.classList.remove("expanded");
    hamburger.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  }
  
  function openMenu() {
    menu.classList.add("expanded");
    hamburger.classList.add("open");
    trigger.setAttribute("aria-expanded", "true");
  }
  
  // Initialize ARIA attributes
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-label", "Toggle navigation menu");
  menu.setAttribute("role", "navigation");
  
  return { toggleMenu, closeMenu, openMenu };
})();

/**
 * Dark mode toggle
 */
const DarkModeModule = (() => {
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const html = document.documentElement;
  
  if (!darkModeToggle) return;
  
  // Check system preference and localStorage
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedMode = localStorage.getItem("dark-mode");
  const isDark = savedMode ? savedMode === "true" : prefersDark;
  
  // Apply saved preference
  if (isDark) {
    html.setAttribute("data-theme", "dark");
    darkModeToggle.checked = true;
  }
  
  // Listen for system preference changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (localStorage.getItem("dark-mode") === null) {
      setDarkMode(e.matches);
    }
  });
  
  // Toggle on user click
  darkModeToggle.addEventListener("change", () => {
    setDarkMode(darkModeToggle.checked);
  });
  
  function setDarkMode(isDark) {
    if (isDark) {
      html.setAttribute("data-theme", "dark");
      localStorage.setItem("dark-mode", "true");
    } else {
      html.removeAttribute("data-theme");
      localStorage.setItem("dark-mode", "false");
    }
  }
  
  return { setDarkMode };
})();

/**
 * Active link highlighting based on current page
 */
const ActiveLinkModule = (() => {
  const currentPath = window.location.pathname;
  
  // Highlight main nav active link
  const mainNavLinks = document.querySelectorAll("nav#nav-main a");
  mainNavLinks.forEach(link => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
  
  // Highlight mobile nav active link
  const mobileNavLinks = document.querySelectorAll("nav#nav-mobile a");
  mobileNavLinks.forEach(link => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
})();
