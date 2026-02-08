"use client";

import { useMemo, useState } from "react";
import { uploadLeads } from "../../../lib/api";

type Mapping = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
};

type DetectionResponse = {
  columns: string[];
  mapping: Mapping;
  sampleRows: Record<string, string>[];
};

type ImportResponse = {
  importedCount: number;
  skippedCount: number;
  errors: { row: number; message: string }[];
};

const emptyMapping: Mapping = {
  firstName: null,
  lastName: null,
  email: null,
  phone: null
};

const mockLeads = Array.from({ length: 24 }).map((_, index) => ({
  name: `Lead ${index + 1}`,
  email: `lead${index + 1}@company.com`,
  phone: "(000) 000-0000",
  source: "CSV Upload",
  createdAt: "Just now"
}));

export default function LeadsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [token, setToken] = useState("");
  const [columns, setColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Mapping>(emptyMapping);
  const [sampleRows, setSampleRows] = useState<Record<string, string>[]>([]);
  const [step, setStep] = useState<"upload" | "map" | "done">("upload");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResponse | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const totalPages = Math.max(1, Math.ceil(mockLeads.length / pageSize));
  const pagedLeads = useMemo(() => {
    const start = (page - 1) * pageSize;
    return mockLeads.slice(start, start + pageSize);
  }, [page, pageSize]);

  const handleFileChange = (nextFile: File | null) => {
    setFile(nextFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV or Excel file.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = (await uploadLeads({
        file,
        token: token || undefined
      })) as DetectionResponse;
      setColumns(response.columns);
      setMapping(response.mapping);
      setSampleRows(response.sampleRows);
      setStep("map");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!file) {
      setError("File not found. Please re-upload.");
      setStep("upload");
      return;
    }

    if (!mapping.email) {
      setError("Email column is required to import leads.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = (await uploadLeads({
        file,
        mapping,
        token: token || undefined
      })) as ImportResponse;
      setResult(response);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Leads</h2>
          <p className="text-slate-300">
            Upload CSV/XLSX files, confirm column mapping, and import leads.
          </p>
        </div>
        <div className="text-sm text-slate-400">Step: {step}</div>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {step === "upload" && (
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div>
            <h3 className="text-lg font-semibold">1. Upload leads file</h3>
            <p className="mt-2 text-sm text-slate-300">
              Upload a CSV or Excel export to auto-detect lead columns.
            </p>
          </div>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 px-6 py-10 text-center text-sm text-slate-300">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(event) => {
                handleFileChange(event.target.files?.[0] || null);
              }}
              className="hidden"
            />
            <span className="text-base font-medium text-white">
              Drag and drop your file here
            </span>
            <span className="text-xs text-slate-400">or click to browse</span>
            {file && (
              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200">
                {file.name}
              </span>
            )}
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isLoading}
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900"
            >
              {isLoading ? "Analyzing..." : "Analyze file"}
            </button>
            <button
              type="button"
              onClick={() => handleFileChange(null)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200"
            >
              Clear file
            </button>
          </div>
          <div className="grid gap-2 text-sm text-slate-400">
            <label className="text-xs uppercase tracking-[0.2em]">
              Auth token (optional)
            </label>
            <input
              type="text"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Paste JWT for protected API"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
            />
          </div>
        </section>
      )}

      {step === "map" && (
        <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div>
            <h3 className="text-lg font-semibold">2. Confirm column mapping</h3>
            <p className="mt-2 text-sm text-slate-300">
              Review detected columns and adjust if needed.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(
              [
                { key: "firstName", label: "First name" },
                { key: "lastName", label: "Last name" },
                { key: "email", label: "Email" },
                { key: "phone", label: "Phone" }
              ] as const
            ).map((field) => (
              <label key={field.key} className="space-y-2 text-sm text-slate-300">
                {field.label}
                <select
                  value={mapping[field.key] ?? ""}
                  onChange={(event) =>
                    setMapping((prev) => ({
                      ...prev,
                      [field.key]: event.target.value || null
                    }))
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                >
                  <option value="">None</option>
                  {columns.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <div>
            <p className="text-sm text-slate-400">Sample rows</p>
            <div className="mt-3 overflow-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/70 text-slate-400">
                  <tr>
                    {columns.map((column) => (
                      <th key={column} className="px-4 py-2 font-medium">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sampleRows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-t border-slate-800">
                      {columns.map((column) => (
                        <td key={column} className="px-4 py-2">
                          {row[column]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStep("upload")}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900"
            >
              {isLoading ? "Importing..." : "Confirm & import"}
            </button>
          </div>
        </section>
      )}

      {step === "done" && result && (
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-lg font-semibold">3. Import summary</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">Imported</p>
              <p className="mt-2 text-2xl font-semibold">{result.importedCount}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">Skipped</p>
              <p className="mt-2 text-2xl font-semibold">{result.skippedCount}</p>
            </div>
          </div>
          {result.errors.length > 0 && (
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              <p className="font-semibold">Validation notes</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {result.errors.map((errorItem, index) => (
                  <li key={`${errorItem.row}-${index}`}>
                    Row {errorItem.row}: {errorItem.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              setStep("upload");
              setFile(null);
              setResult(null);
              setColumns([]);
              setMapping(emptyMapping);
              setSampleRows([]);
            }}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200"
          >
            Import another file
          </button>
        </section>
      )}

      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Existing leads</h3>
            <p className="text-sm text-slate-300">
              Placeholder list until backend pagination is wired up.
            </p>
          </div>
          <div className="text-xs text-slate-400">
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, mockLeads.length)} of {mockLeads.length}
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-slate-400">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Source</th>
                <th className="px-6 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {pagedLeads.map((lead) => (
                <tr key={lead.email} className="border-t border-slate-800 text-slate-200">
                  <td className="px-6 py-4">{lead.name}</td>
                  <td className="px-6 py-4">{lead.email}</td>
                  <td className="px-6 py-4">{lead.phone}</td>
                  <td className="px-6 py-4">{lead.source}</td>
                  <td className="px-6 py-4">{lead.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-300">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="rounded-lg border border-slate-700 px-3 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-slate-700 px-3 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
