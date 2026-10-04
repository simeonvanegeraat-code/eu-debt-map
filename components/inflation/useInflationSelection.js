"use client";
import { useSyncExternalStore } from "react";
import { readSelection, selectionSearch } from "@/lib/inflation/selection";

function subscribe(callback) {
  window.addEventListener("popstate", callback);
  window.addEventListener("inflation-selection", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("inflation-selection", callback);
  };
}
const getSnapshot = () => window.location.search;
const getServerSnapshot = () => "";

export default function useInflationSelection(snapshot, lang) {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const selection = readSelection(search, snapshot, lang);
  function update(patch) {
    const next = readSelection(selectionSearch({ ...selection, ...patch }), snapshot, lang);
    const url = new URL(window.location.href);
    for (const [key, value] of new URLSearchParams(selectionSearch(next))) url.searchParams.set(key, value);
    window.history.pushState(null, "", url);
    window.dispatchEvent(new Event("inflation-selection"));
  }
  return [selection, update];
}
