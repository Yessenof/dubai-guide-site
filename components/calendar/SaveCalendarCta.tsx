"use client";

import { useState } from "react";

interface Props {
  locale: "en" | "ru";
}

export default function SaveCalendarCta({ locale }: Props) {
  const isRu = locale === "ru";
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"ios" | "android">("ios");

  const iosSteps = isRu
    ? [
        "Откройте страницу в браузере Safari.",
        "Нажмите кнопку Поделиться в нижней панели.",
        "Выберите пункт На экран Домой.",
      ]
    : [
        "Open this page in Safari.",
        "Tap the Share button at the bottom.",
        "Choose Add to Home Screen.",
      ];

  const androidSteps = isRu
    ? [
        "Откройте страницу в браузере Chrome.",
        "Нажмите меню в правом верхнем углу.",
        "Выберите Добавить на главный экран или Установить приложение.",
      ]
    : [
        "Open this page in Chrome.",
        "Tap the menu in the top-right corner.",
        "Choose Add to Home Screen or Install app.",
      ];

  const steps = tab === "ios" ? iosSteps : androidSteps;

  return (
    <>
      {/* Compact inline strip */}
      <div className="flex items-center justify-between gap-3 border border-stone-200 rounded-xl px-3.5 py-3 mb-5">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-gray-800 leading-snug">
            {isRu ? "Сохраните календарь на телефон" : "Save this calendar to your phone"}
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
            {isRu
              ? "Открывайте с главного экрана как приложение."
              : "Open from your home screen like an app."}
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex-shrink-0 text-[12px] font-semibold text-brass hover:opacity-75 transition-opacity whitespace-nowrap"
        >
          {isRu ? "Как сохранить →" : "How to save →"}
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-[15px] font-bold text-gray-900">
                {isRu ? "Сохранить на телефон" : "Save to your phone"}
              </p>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-[22px] leading-none"
                aria-label={isRu ? "Закрыть" : "Close"}
              >
                ×
              </button>
            </div>

            {/* Platform tabs */}
            <div className="flex gap-2 mb-4">
              {(["ios", "android"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 text-[12px] font-semibold py-1.5 rounded-full border transition-colors ${
                    tab === t
                      ? "bg-navy text-white border-navy"
                      : "text-gray-600 border-stone-200 hover:border-stone-300"
                  }`}
                >
                  {t === "ios" ? "iPhone / Safari" : "Android / Chrome"}
                </button>
              ))}
            </div>

            {/* Steps */}
            <ol className="space-y-2.5 mb-4">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-navy text-white text-[11px] font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-[13px] text-gray-700 leading-snug">{step}</span>
                </li>
              ))}
            </ol>

            <p className="text-[11px] text-gray-400 leading-snug">
              {isRu
                ? "Меню и названия пунктов могут немного отличаться в зависимости от версии браузера."
                : "Menu labels may vary slightly depending on your browser version."}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
