import initSqlJs, { type Database, type SqlJsStatic } from "sql.js";
import type { HarvestRecord } from "@/types/harvest";

let SQL: SqlJsStatic | null = null;

const getSql = async (): Promise<SqlJsStatic> => {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file) => `/${file}`,
    });
  }
  return SQL;
};

export const createHarvestDb = async (): Promise<Database> => {
  const sql = await getSql();
  const db = new sql.Database();
  db.run(`
    CREATE TABLE IF NOT EXISTS harvest_records (
      harvest_id TEXT,
      date TEXT NOT NULL,
      year INTEGER NOT NULL,
      month INTEGER NOT NULL,
      crop_name TEXT,
      field_id TEXT,
      field_name TEXT NOT NULL,
      area_are REAL NOT NULL,
      timing TEXT NOT NULL,
      harvest_kg REAL NOT NULL,
      lot_no TEXT,
      memo TEXT
    );
  `);
  return db;
};

export const saveRowsToDb = (db: Database, rows: HarvestRecord[]): void => {
  const stmt = db.prepare(`
    INSERT INTO harvest_records (
      harvest_id, date, year, month, crop_name, field_id, field_name,
      area_are, timing, harvest_kg, lot_no, memo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  rows.forEach((row) =>
    stmt.run([
      row.harvestId,
      row.date,
      row.year,
      row.month,
      row.cropName,
      row.fieldId,
      row.fieldName,
      row.areaAre,
      row.timing,
      row.harvestKg,
      row.lotNo,
      row.memo,
    ]),
  );
  stmt.free();
};
