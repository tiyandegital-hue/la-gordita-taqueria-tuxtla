/* LA GORDITA — site interactions. One swappable business constant. */
const BUSINESS_NAME = "La Gordita";
const PHONE_TEL = "+529611294240";

document.addEventListener("DOMContentLoaded", () => {
  /* Mobile nav toggle */
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  if (toggle && header) {
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    header.querySelectorAll(".main-nav a").forEach((a) =>
      a.addEventListener("click", () => {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* Entrance reveals (stagger via --d inline style) */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal, .mask").forEach((el) => io.observe(el));

  /* Menú category tabs — one live filter over the board */
  const tabs = document.querySelectorAll(".tab");
  const cats = document.querySelectorAll(".board-cat");
  if (tabs.length && cats.length) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.dataset.cat;
        tabs.forEach((t) => t.setAttribute("aria-pressed", t === tab ? "true" : "false"));
        cats.forEach((c) => {
          c.hidden = key !== "todos" && c.dataset.cat !== key;
        });
      });
    });
  }

  /* Ubicación — highlight today's row (browser local day; 0=Sunday..6=Saturday) */
  const hourRows = document.querySelectorAll(".hour-row[data-dow]");
  if (hourRows.length) {
    const today = String(new Date().getDay());
    hourRows.forEach((row) => {
      if (row.dataset.dow === today) {
        row.classList.add("hoy");
        const tag = document.createElement("span");
        tag.className = "hoy-tag";
        tag.textContent = "HOY";
        row.appendChild(tag);
      }
    });
  }

  /* Eventos ticket form — field-tied validation, demo success state */
  const form = document.getElementById("cotizacion-form");
  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      let firstInvalid = null;
      form.querySelectorAll(".field").forEach((field) => {
        const input = field.querySelector("input, select, textarea");
        if (!input) return;
        let ok = true;
        const val = input.value.trim();
        if (input.hasAttribute("required") && input.type === "checkbox") {
          ok = input.checked;
        } else if (input.hasAttribute("required") && !val) {
          ok = false;
        } else if (input.type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          ok = false;
        } else if (input.type === "date" && val) {
          const chosen = new Date(val + "T00:00:00");
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          ok = chosen >= now;
        } else if (input.type === "number" && val && input.hasAttribute("min")) {
          ok = Number(val) >= Number(input.getAttribute("min"));
        }
        field.classList.toggle("invalid", !ok);
        input.setAttribute("aria-invalid", ok ? "false" : "true");
        if (!ok && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }
      const success = document.getElementById("form-success");
      if (success) {
        success.querySelector("[data-biz]").textContent = BUSINESS_NAME;
        form.style.display = "none";
        success.classList.add("show");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
    /* clear invalid state as the user fixes a field */
    form.querySelectorAll("input, select, textarea").forEach((input) => {
      input.addEventListener("input", () => {
        const field = input.closest(".field");
        if (field) {
          field.classList.remove("invalid");
          input.setAttribute("aria-invalid", "false");
        }
      });
    });
  }

  /* Footer year stays as printed (2024); nothing to update. */
});
