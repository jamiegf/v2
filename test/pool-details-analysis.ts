import { pd } from 'test/pool-details-data';

export function analysePoolDetails(): void {
  const data: {
    [key: string]: {
      count: number;
      types: { [key: string]: number };
      values: unknown[];
    };
  } = {};

  pd.slice(1, 3)
    .map((p) => p.disciplines)
    .forEach((item: any) => {
      Object.keys(item).forEach((key) => {
        if (data[key]) {
          data[key].count += 1;
        } else {
          data[key] = { count: 1, types: {}, values: [] };
        }
        const value = item[key as keyof typeof item];
        data[key].values.push(value);
        let type: string = typeof value;
        if (value === undefined) type = 'undefined';
        if (value === null) type = 'null';
        if (value instanceof Array) type = 'array';
        if (data[key].types[type]) {
          data[key].types[type] += 1;
        } else {
          data[key].types[type] = 1;
        }
      });
    });
  console.log('data', data);

  const diff: unknown[] = [];
  Object.entries(data).forEach((entry) => {
    if (
      Object.keys(entry[1].types).length > 1 ||
      entry[1].count !== pd.length
    ) {
      diff.push(entry);
    }
  });
  console.log('keys with different types', diff);

  (window as any).pd = pd;
}
