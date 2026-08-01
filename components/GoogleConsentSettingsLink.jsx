"use client";

export default function GoogleConsentSettingsLink({
  children,
  className,
  style,
}) {
  function openGoogleConsentSettings(event) {
    event.preventDefault();

    const googlefc = window.googlefc;
    if (!googlefc || typeof googlefc.showRevocationMessage !== "function") {
      return;
    }

    // Google documents both the asynchronous queue and direct API call.
    if (typeof googlefc.callbackQueue?.push === "function") {
      googlefc.callbackQueue.push(googlefc.showRevocationMessage);
      return;
    }

    googlefc.showRevocationMessage();
  }

  return (
    <a
      href="#"
      className={className}
      style={style}
      onClick={openGoogleConsentSettings}
    >
      {children}
    </a>
  );
}
