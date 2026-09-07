import balance from '@/lib/fiscal/balance.gen.json';
import perCapita from '@/lib/fiscal/per-capita.gen.json';
import growth from '@/lib/fiscal/growth.gen.json';
import interest from '@/lib/fiscal/interest.gen.json';
import accounts from '@/lib/fiscal/accounts.gen.json';
import { EUROSTAT_UPDATED_AT, EUROSTAT_UPDATE_REPORT } from '@/lib/eurostat.debt.gen';
import { EUROSTAT_RATIO_UPDATED_AT, EUROSTAT_RATIO_UPDATE_REPORT } from '@/lib/eurostat.ratio.gen';
import { methodologyRegistry, METHODOLOGY_REVIEWED } from '@/lib/fiscal/methodology-registry';
import { registryCopy } from './registry-copy';
import styles from './registry.module.css';

export default function DatasetRegistry({ lang = 'en' }) {
  const copy = registryCopy(lang);
  const rows = methodologyRegistry({ balance, perCapita, growth, interest, accounts }, {
    debt: { fetchedAt: EUROSTAT_UPDATED_AT, period: EUROSTAT_UPDATE_REPORT.dominantLatestTime },
    ratio: { fetchedAt: EUROSTAT_RATIO_UPDATED_AT, period: EUROSTAT_RATIO_UPDATE_REPORT.dominantLatestTime },
  });
  const date = value => value && Number.isFinite(Date.parse(value))
    ? new Intl.DateTimeFormat(lang, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(value)) : copy.labels.missing;
  return (
    <section id="dataset-registry" className={styles.registry} aria-labelledby="dataset-registry-title">
      <h2 id="dataset-registry-title">{copy.title}</h2>
      <p>{copy.intro}</p>
      <p className={styles.review}>{copy.labels.review}: <time dateTime={METHODOLOGY_REVIEWED}>{date(METHODOLOGY_REVIEWED)}</time></p>
      <ul className={styles.kinds}>{Object.entries(copy.kinds).map(([kind, label]) => <li key={kind} data-kind={kind}>{label}</li>)}</ul>
      <p>{copy.quality}</p>
      {rows.map(row => (
        <details className={styles.metric} key={row.id} id={`registry-${row.id}`} data-registry-kind={row.kind}>
          <summary>
            <strong>{copy.metrics[row.id][0]}</strong>
            <span>{copy.kinds[row.kind]}</span>
            <small>{row.period}</small>
          </summary>
          <div className={styles.detail}>
            <h3>{copy.labels.calculation}</h3>
            <p>{copy.metrics[row.id][1]}</p>
            <h3>{copy.labels.sources}</h3>
            {row.sources.map((source, i) => (
              <div className={styles.source} key={`${source.url}-${i}`}>
                <a href={source.url} target="_blank" rel="noreferrer">Eurostat · {source.dataset} ↗</a>
                {source.context && <p>{copy.labels[source.context]}</p>}
                <dl>
                  <div><dt>{copy.labels.period}</dt><dd>{source.period} · {source.filters.freq} · {source.unit === 'persons' ? copy.labels.persons : source.unit}</dd></div>
                  <div><dt>{copy.labels.filters}</dt><dd><code>{Object.entries(source.filters).map(([key, value]) => `${key}=${value}`).join(' · ')}</code></dd></div>
                  <div><dt>{copy.labels.accessed}</dt><dd><time dateTime={source.accessed}>{date(source.accessed)}</time></dd></div>
                  <div><dt>{copy.labels.updated}</dt><dd>{source.updated ? <time dateTime={source.updated}>{date(source.updated)}</time> : copy.labels.missing}</dd></div>
                </dl>
              </div>
            ))}
            <h3>{copy.labels.update}</h3><p>{copy.updates[row.update]}</p>
            <a href={`#${row.method}`}>{copy.labels.details} →</a>
          </div>
        </details>
      ))}
      <div className={styles.notes}><p>{copy.aggregate}</p><p>{copy.vintage}</p><p>{copy.modelNote}</p></div>
      <p className={styles.attribution}>{copy.attribution}</p>
    </section>
  );
}
