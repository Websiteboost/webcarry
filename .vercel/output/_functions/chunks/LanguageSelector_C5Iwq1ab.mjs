import { n as createRenderInstruction } from './entrypoint_DdqMY4so.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect, useCallback } from 'react';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

const COOKIE_NAME = "bb_lang";
function readLangCookie() {
  try {
    const match = document.cookie.match(/bb_lang=([^;]+)/);
    if (match?.[1] === "ES") return "es";
  } catch {
  }
  return "en";
}
function useLanguage() {
  const [locale, setLocale] = useState("en");
  useEffect(() => {
    setLocale(readLangCookie());
  }, []);
  const changeLocale = useCallback((next) => {
    const cookieValue = next === "es" ? "ES" : "EN";
    document.cookie = `${COOKIE_NAME}=${cookieValue};path=/;max-age=31536000;SameSite=Lax`;
    window.location.reload();
  }, []);
  return { locale, changeLocale };
}

function FlagUS() {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 14",
      width: "20",
      height: "14",
      "aria-hidden": "true",
      style: { display: "block", borderRadius: "1px" },
      children: [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => /* @__PURE__ */ jsx(
          "rect",
          {
            x: "0",
            y: i * (14 / 13),
            width: "20",
            height: 14 / 13 + 0.5,
            fill: i % 2 === 0 ? "#B22234" : "#FFFFFF"
          },
          i
        )),
        /* @__PURE__ */ jsx("rect", { x: "0", y: "0", width: "8", height: "7.5", fill: "#3C3B6E" }),
        [
          [1, 1],
          [2.6, 1],
          [4.2, 1],
          [5.8, 1],
          [7.3, 1],
          [1.8, 2.1],
          [3.4, 2.1],
          [5, 2.1],
          [6.6, 2.1],
          [1, 3.2],
          [2.6, 3.2],
          [4.2, 3.2],
          [5.8, 3.2],
          [7.3, 3.2],
          [1.8, 4.3],
          [3.4, 4.3],
          [5, 4.3],
          [6.6, 4.3],
          [1, 5.4],
          [2.6, 5.4],
          [4.2, 5.4],
          [5.8, 5.4],
          [7.3, 5.4],
          [1.8, 6.5],
          [3.4, 6.5],
          [5, 6.5],
          [6.6, 6.5]
        ].map(([cx, cy], i) => /* @__PURE__ */ jsx("circle", { cx, cy, r: "0.55", fill: "#FFFFFF" }, i))
      ]
    }
  );
}
function FlagES() {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 14",
      width: "20",
      height: "14",
      "aria-hidden": "true",
      style: { display: "block", borderRadius: "1px" },
      children: [
        /* @__PURE__ */ jsx("rect", { x: "0", y: "0", width: "20", height: "3.5", fill: "#c60b1e" }),
        /* @__PURE__ */ jsx("rect", { x: "0", y: "3.5", width: "20", height: "7", fill: "#ffc400" }),
        /* @__PURE__ */ jsx("rect", { x: "0", y: "10.5", width: "20", height: "3.5", fill: "#c60b1e" }),
        /* @__PURE__ */ jsx("rect", { x: "6.5", y: "4.5", width: "1.2", height: "4.5", fill: "#c60b1e", rx: "0.2" }),
        /* @__PURE__ */ jsx("rect", { x: "9.2", y: "4.5", width: "1.2", height: "4.5", fill: "#c60b1e", rx: "0.2" }),
        /* @__PURE__ */ jsx("rect", { x: "6.2", y: "3.8", width: "4.5", height: "0.8", fill: "#c60b1e", rx: "0.2" }),
        /* @__PURE__ */ jsx("rect", { x: "6.2", y: "8.8", width: "4.5", height: "0.6", fill: "#c60b1e", rx: "0.1" })
      ]
    }
  );
}
const OPTIONS = [
  { value: "en", label: "English", Flag: FlagUS },
  { value: "es", label: "Español", Flag: FlagES }
];
function LanguageSelector() {
  const { locale, changeLocale } = useLanguage();
  return /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2.5", role: "group", "aria-label": "Language selector", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "relative flex items-center rounded-md overflow-hidden",
      style: {
        border: "1px solid rgba(168,85,247,0.25)",
        background: "rgba(26,11,46,0.6)"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": "true",
            className: "absolute inset-y-0 w-1/2 rounded-[3px] transition-transform duration-200 ease-out",
            style: {
              background: "rgba(168,85,247,0.15)",
              border: "1px solid rgba(168,85,247,0.5)",
              transform: locale === "es" ? "translateX(100%)" : "translateX(0%)"
            }
          }
        ),
        OPTIONS.map(({ value, label, Flag }) => {
          const isActive = locale === value;
          return /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => !isActive && changeLocale(value),
              "aria-pressed": isActive,
              "aria-label": `Language: ${label}`,
              title: label,
              className: `relative z-10 flex items-center justify-center px-2.5 py-1.5 transition-opacity duration-150 cursor-pointer ${isActive ? "opacity-100" : "opacity-40 hover:opacity-70"}`,
              children: /* @__PURE__ */ jsx(Flag, {})
            },
            value
          );
        })
      ]
    }
  ) });
}

export { LanguageSelector as L, renderScript as r };
