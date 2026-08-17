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
      resolvedTheme === "dark" ? "#100F0E" : "#F8F6F2",
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
const formBtnLabel = document.querySelector("[data-form-btn-label]");
const formStatus = document.querySelector("[data-form-status]");

const CONTACT_EMAIL = "khawaja.muhammad.mushood@gmail.com";

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

const setFormStatus = function (message, state) {
  formStatus.textContent = message;
  formStatus.classList.remove("is-success", "is-error");
  if (state) {
    formStatus.classList.add(state);
  }
};

// submit over fetch so the page never navigates away from the answer
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  formBtn.setAttribute("disabled", "");
  formBtnLabel.textContent = "Sending";
  setFormStatus("");

  try {
    const response = await fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    });

    if (!response.ok) {
      throw new Error("Form endpoint returned " + response.status);
    }

    form.reset();
    setFormStatus(
      "Message sent. I'll reply within a couple of days.",
      "is-success",
    );
  } catch (error) {
    console.error("Contact form error:", error);
    formBtn.removeAttribute("disabled");
    setFormStatus(
      "Couldn't send that. Email me at " + CONTACT_EMAIL + " instead.",
      "is-error",
    );
  } finally {
    formBtnLabel.textContent = "Send message";
  }
});

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");
const navbar = document.querySelector("[data-navbar]");

// Publish the nav bar's real height so the chat button and the page's bottom
// margin can clear it. The bar rewraps on narrow screens and its type scale
// changes at 580px and 768px, so a hard-coded offset drifts out of date.
const setNavHeight = function () {
  document.documentElement.style.setProperty(
    "--nav-h",
    navbar.offsetHeight + "px",
  );
};

setNavHeight();

if (window.ResizeObserver) {
  new ResizeObserver(setNavHeight).observe(navbar);
} else {
  window.addEventListener("resize", setNavHeight);
}

/**
 * Show one section and light up its nav link.
 *
 * Matching is on data-nav-link / data-page, not on the button's innerHTML —
 * the old version compared rendered text and indexed the nav links by page
 * position from a loop variable that shadowed the outer one, so it only ever
 * worked because the two lists happened to be in the same order.
 *
 * Returns false for an unknown name so a junk hash leaves the page alone.
 */
const showPage = function (name) {
  // Confirm the section exists before touching anything. Deactivating first
  // and bailing out afterwards leaves every section hidden, so a hash like
  // #nonsense would render a blank page.
  let matched = false;

  for (let i = 0; i < pages.length; i++) {
    if (pages[i].dataset.page === name) {
      matched = true;
      break;
    }
  }

  if (!matched) return false;

  for (let i = 0; i < pages.length; i++) {
    pages[i].classList.toggle("active", pages[i].dataset.page === name);
  }

  for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].classList.toggle(
      "active",
      navigationLinks[i].dataset.navLink === name,
    );
  }

  return true;
};

const pageFromHash = function () {
  return decodeURIComponent(
    window.location.hash.replace(/^#/, ""),
  ).toLowerCase();
};

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    // writing the hash drives showPage through the hashchange handler and
    // leaves a history entry, so the back button walks the sections
    window.location.hash = this.dataset.navLink;
  });
}

window.addEventListener("hashchange", function () {
  if (showPage(pageFromHash())) {
    window.scrollTo(0, 0);
  }
});

// honour a deep link like /#resume on first paint
const initialPage = pageFromHash();
if (initialPage) {
  showPage(initialPage);
}

// chat variables
const chatFab = document.getElementById("chatFab");
const chatContainer = document.getElementById("chatContainer");
const chatCloseBtn = document.getElementById("chatCloseBtn");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const chatSendBtn = document.getElementById("chatSendBtn");
const chatSuggestions = document.getElementById("chatSuggestions");

const CHAT_API_URL = "https://portfolio-be-qwif.onrender.com/chat";

// toggle chat
function toggleChat() {
  chatFab.classList.toggle("active");
  chatContainer.classList.toggle("active");

  const isOpen = chatContainer.classList.contains("active");
  chatFab.setAttribute("aria-expanded", String(isOpen));
  chatFab.setAttribute(
    "aria-label",
    isOpen ? "Close chat" : "Ask about Mushood's work",
  );

  if (isOpen) {
    chatInput.focus();
  } else {
    // hand focus back to the trigger rather than dropping it on <body>
    chatFab.focus();
  }
}

chatFab.addEventListener("click", toggleChat);
chatCloseBtn.addEventListener("click", toggleChat);

// Escape closes the panel, the way every other dialog on the web does
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && chatContainer.classList.contains("active")) {
    toggleChat();
  }
});

// add message to chat
// textContent, not innerHTML: this renders both the visitor's own input and
// whatever the API returns, so markup in either would otherwise execute.
function addMessage(content, isUser = false) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `chat-message ${isUser ? "user" : "bot"}`;

  const paragraph = document.createElement("p");
  paragraph.textContent = content;
  messageDiv.appendChild(paragraph);

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// add typing indicator
function addTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "chat-message bot typing";
  typingDiv.id = "typingIndicator";

  for (let i = 0; i < 3; i++) {
    typingDiv.appendChild(document.createElement("span"));
  }

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

const submitChatMessage = function (message) {
  chatInput.value = message;
  chatForm.requestSubmit();
};

if (chatSuggestions) {
  const suggestions = chatSuggestions.querySelectorAll("[data-chat-suggestion]");
  for (let i = 0; i < suggestions.length; i++) {
    suggestions[i].addEventListener("click", function () {
      submitChatMessage(this.textContent.trim());
    });
  }
}

// handle form submit
chatForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const message = chatInput.value.trim();
  if (!message) return;

  // the openers have done their job once a real question is asked
  if (chatSuggestions) {
    chatSuggestions.remove();
  }

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
