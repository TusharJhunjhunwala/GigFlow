const escapeCsvValue = (value: string | number | Date | null | undefined): string => {
  const normalized = value instanceof Date ? value.toISOString() : String(value ?? "");
  return `"${normalized.replace(/"/g, '""')}"`;
};

export const toCsv = (headers: string[], rows: Array<Array<string | number | Date | null | undefined>>): string => {
  const headerLine = headers.map(escapeCsvValue).join(",");
  const rowLines = rows.map((row) => row.map(escapeCsvValue).join(","));
  return [headerLine, ...rowLines].join("\n");
};
