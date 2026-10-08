import { fieldName } from './presentation';
export function PreparedRecords({
  source,
  target,
}: {
  source: string;
  target: string;
}) {
  return (
    <div className="input-grid prepared-records">
      {[
        ['Source system knows', source],
        ['Target message contains', target],
      ].map(([title, raw]) => {
        const records = raw!
          .trim()
          .split('\n')
          .map(
            (line) =>
              JSON.parse(line) as {
                role: string;
                concept: string;
                value: string;
              },
          );
        return (
          <section key={title} aria-label={title}>
            <h3>{title}</h3>
            {['DEBTOR', 'CREDITOR'].map((role) => {
              const fields = records.filter((r) => r.role === role);
              return (
                <div key={role}>
                  <h4>{role === 'DEBTOR' ? 'Debtor' : 'Creditor'}</h4>
                  {fields.length ? (
                    <dl>
                      {fields.map((r, i) => (
                        <div className="canonical-value" key={i}>
                          <dt>{fieldName(r.concept)}</dt>
                          <dd>{r.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p>
                      {role === 'DEBTOR' ? 'Debtor' : 'Creditor'} not included
                      in this example
                    </p>
                  )}
                </div>
              );
            })}
            <details>
              <summary>Show underlying test record</summary>
              <pre>{raw}</pre>
            </details>
          </section>
        );
      })}
    </div>
  );
}
