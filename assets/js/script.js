"use strict";

// theme preference
const THEME_STORAGE_KEY = "themePreference";
const themeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
const themeButtons = document.querySelectorAll("[data-theme-option]");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

const getStoredThemePreference = function () {
  try {
    const preference = localStorage.getItem(THEME_STORAGE_KEY);
    return ["system", "light", "dark"].includes(preference)
      ? preference
      : "system";
  } catch (error) {
    return "system";
  }
};

const storeThemePreference = function (preference) {
  try {
    if (preference === "system") {
      localStorage.setItem(THEME_STORAGE_KEY, "system");
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, preference);
    }
  } catch (error) {
    // Ignore storage failures so the visible theme control still works.
  }
};

const getResolvedTheme = function (preference) {
  if (preference === "light" || preference === "dark") return preference;
  return themeMediaQuery.matches ? "dark" : "light";
};

const applyThemePreference = function (preference) {
  const resolvedTheme = getResolvedTheme(preference);

  if (preference === "light" || preference === "dark") {
    document.documentElement.dataset.theme = preference;
  } else {
    document.documentElement.removeAttribute("data-theme");
  }

  document.documentElement.dataset.activeTheme = resolvedTheme;

  if (themeColorMeta) {
    themeColorMeta.setAttribute(
      "content",
      resolvedTheme === "dark" ? "#100F0E" : "#F8F6F2"
    );
  }

  for (let i = 0; i < themeButtons.length; i++) {
    const isActive = themeButtons[i].dataset.themeOption === preference;
    themeButtons[i].classList.toggle("active", isActive);
    themeButtons[i].setAttribute("aria-pressed", String(isActive));
  }
};

let currentThemePreference = getStoredThemePreference();
applyThemePreference(currentThemePreference);

for (let i = 0; i < themeButtons.length; i++) {
  themeButtons[i].addEventListener("click", function () {
    currentThemePreference = this.dataset.themeOption;
    storeThemePreference(currentThemePreference);
    applyThemePreference(currentThemePreference);
  });
}

const handleSystemThemeChange = function () {
  if (currentThemePreference === "system") {
    applyThemePreference(currentThemePreference);
  }
};

if (themeMediaQuery.addEventListener) {
  themeMediaQuery.addEventListener("change", handleSystemThemeChange);
} else {
  themeMediaQuery.addListener(handleSystemThemeChange);
}

// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () {
  elementToggleFunc(this);
});

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

// chat variables
const chatFab = document.getElementById("chatFab");
const chatContainer = document.getElementById("chatContainer");
const chatCloseBtn = document.getElementById("chatCloseBtn");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const chatSendBtn = document.getElementById("chatSendBtn");

const CHAT_API_URL = "https://portfolio-be-production-4ce9.up.railway.app/chat";

// toggle chat
function toggleChat() {
  chatFab.classList.toggle("active");
  chatContainer.classList.toggle("active");
  if (chatContainer.classList.contains("active")) {
    chatInput.focus();
  }
}

chatFab.addEventListener("click", toggleChat);
chatCloseBtn.addEventListener("click", toggleChat);

// add message to chat
function addMessage(content, isUser = false) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `chat-message ${isUser ? "user" : "bot"}`;
  messageDiv.innerHTML = `<p>${content}</p>`;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// add typing indicator
function addTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "chat-message bot typing";
  typingDiv.id = "typingIndicator";
  typingDiv.innerHTML = "<span></span><span></span><span></span>";
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// remove typing indicator
function removeTypingIndicator() {
  const typingIndicator = document.getElementById("typingIndicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// send message to API
async function sendMessage(message) {
  try {
    const response = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message }),
    });

    if (!response.ok) {
      throw new Error("Failed to get response");
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Chat API error:", error);
    return "Sorry, I'm having trouble connecting right now. Please try again later or reach out via email!";
  }
}

// handle form submit
chatForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const message = chatInput.value.trim();
  if (!message) return;

  // disable input while processing
  chatInput.disabled = true;
  chatSendBtn.disabled = true;

  // add user message
  addMessage(message, true);
  chatInput.value = "";

  // show typing indicator
  addTypingIndicator();

  // send to API and get response
  const response = await sendMessage(message);

  // remove typing indicator and add bot response
  removeTypingIndicator();
  addMessage(response);

  // re-enable input
  chatInput.disabled = false;
  chatSendBtn.disabled = false;
  chatInput.focus();
});
