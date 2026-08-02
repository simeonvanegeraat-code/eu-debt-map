const DEFAULT_COLORS = ["#2563eb", "#0f172a", "#0f9f8f", "#f59e0b", "#8b5cf6", "#ef4444"];

function localeFor(lang) {
  return { nl: "nl-NL", de: "de-DE", fr: "fr-FR", en: "en-GB" }[lang] || "en-GB";
}

function validSegments(segments) {
  if (!Array.isArray(segments)) return [];

  return segments.filter(
    (segment) =>
      segment &&
      typeof segment.label === "string" &&
      segment.label.trim() &&
      Number.isFinite(segment.value) &&
      segment.value > 0
  );
}

export default function ArticleDonutChart({ data, lang = "en" }) {
  const segments = validSegments(data?.segments);
  const segmentTotal = segments.reduce((sum, segment) => sum + segment.value, 0);
  const total = Number.isFinite(data?.total) && data.total > 0 ? data.total : segmentTotal;

  if (!data || data.type !== "donut" || !segments.length || total <= 0) return null;

  let cumulative = 0;
  const gradientStops = segments.map((segment, index) => {
    const start = (cumulative / total) * 100;
    cumulative += segment.value;
    const end = Math.min((cumulative / total) * 100, 100);
    const color = segment.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
    return `${color} ${start.toFixed(4)}% ${end.toFixed(4)}%`;
  });

  const locale = localeFor(lang);
  const amountFormatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const percentFormatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const formatAmount = (value) =>
    `${data.valuePrefix || ""}${amountFormatter.format(value)}${data.valueSuffix || ""}`;
  const chartLabel = segments
    .map(
      (segment) =>
        `${segment.label}: ${percentFormatter.format((segment.value / total) * 100)}%`
    )
    .join(", ");

  return (
    <figure className="articleDonutFigure">
      <figcaption className="articleDonutCaption">
        <strong>{data.title}</strong>
        {(data.subtitle || data.period) && (
          <span>{data.subtitle || data.period}</span>
        )}
      </figcaption>

      <div className="articleDonutLayout">
        <div
          className="articleDonutChart"
          role="img"
          aria-label={`${data.title}. ${chartLabel}`}
          style={{ backgroundImage: `conic-gradient(${gradientStops.join(", ")})` }}
        >
          <div className="articleDonutCenter" aria-hidden="true">
            <strong>{formatAmount(total)}</strong>
            <span>{data.totalLabel || "Totaal"}</span>
          </div>
        </div>

        <ul className="articleDonutLegend" aria-label={data.legendLabel || data.title}>
          {segments.map((segment, index) => {
            const color = segment.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
            return (
              <li key={`${segment.label}-${index}`}>
                <span
                  className="articleDonutSwatch"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="articleDonutLegendLabel">{segment.label}</span>
                <strong>{percentFormatter.format((segment.value / total) * 100)}%</strong>
                <small>{formatAmount(segment.value)}</small>
              </li>
            );
          })}
        </ul>
      </div>

      {(data.note || data.source?.url) && (
        <p className="articleDonutNote">
          {data.note}
          {data.note && data.source?.url ? " " : ""}
          {data.source?.url && (
            <a href={data.source.url} rel="nofollow">
              {data.source.label || "Bron"}
            </a>
          )}
        </p>
      )}
    </figure>
  );
}
