import { Router } from "express";
import multer from "multer";
import { parse as parseCsv } from "csv-parse/sync";
import xlsx from "xlsx";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

type ParsedFile = {
  headers: string[];
  rows: Record<string, string | null>[];
};

type Mapping = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
};

function normalizeHeader(header: string) {
  return header.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function detectMapping(headers: string[]): Mapping {
  const normalized = headers.map((header) => ({
    raw: header,
    normalized: normalizeHeader(header)
  }));

  const findHeader = (candidates: string[]) => {
    const match = normalized.find((header) =>
      candidates.some((candidate) => header.normalized.includes(candidate))
    );
    return match?.raw || null;
  };

  return {
    firstName: findHeader(["firstname", "fname", "givenname", "first"]),
    lastName: findHeader(["lastname", "lname", "surname", "last"]),
    email: findHeader(["email", "emailaddress"]),
    phone: findHeader(["phone", "phonenumber", "mobile", "cell"])
  };
}

function parseFile(buffer: Buffer, filename: string): ParsedFile {
  const extension = filename.split(".").pop()?.toLowerCase();

  if (extension === "csv") {
    const records = parseCsv(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    }) as Record<string, string>[];

    const headers = records.length ? Object.keys(records[0]) : [];
    return { headers, rows: records };
  }

  if (extension === "xlsx" || extension === "xls") {
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const firstSheet = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheet];
    const records = xlsx.utils.sheet_to_json<Record<string, string>>(worksheet, {
      defval: "",
      raw: false
    });

    const headers = records.length ? Object.keys(records[0]) : [];
    return { headers, rows: records };
  }

  throw new Error("Unsupported file type. Please upload CSV or Excel.");
}

router.post(
  "/leads/import",
  requireAuth,
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "File is required." });
      }

      const { headers, rows } = parseFile(req.file.buffer, req.file.originalname);
      if (!headers.length) {
        return res.status(400).json({ message: "No headers found in file." });
      }

      const mappingInput = req.body.mapping
        ? (JSON.parse(req.body.mapping) as Mapping)
        : null;

      if (!mappingInput) {
        const detectedMapping = detectMapping(headers);
        return res.json({
          columns: headers,
          mapping: detectedMapping,
          sampleRows: rows.slice(0, 5)
        });
      }

      const source = req.body.source ?? "import";
      const emails = new Set<string>();
      const mappedLeads = rows.map((row) => {
        const email = mappingInput.email ? row[mappingInput.email] : undefined;
        const normalizedEmail = email?.toString().trim().toLowerCase() || undefined;
        if (normalizedEmail) {
          emails.add(normalizedEmail);
        }

        return {
          firstName: mappingInput.firstName ? row[mappingInput.firstName] : undefined,
          lastName: mappingInput.lastName ? row[mappingInput.lastName] : undefined,
          email: normalizedEmail,
          phone: mappingInput.phone ? row[mappingInput.phone] : undefined,
          source,
          rawData: row
        };
      });

      const existingLeads = await prisma.lead.findMany({
        where: { email: { in: Array.from(emails) } },
        select: { email: true }
      });
      const existingEmailSet = new Set(
        existingLeads.map((lead) => lead.email?.toLowerCase())
      );

      const seenEmails = new Set<string>();
      const errors: { row: number; message: string }[] = [];
      const leadsToInsert = mappedLeads.filter((lead, index) => {
        if (!lead.email) {
          errors.push({ row: index + 1, message: "Missing email." });
          return false;
        }
        if (!EMAIL_REGEX.test(lead.email)) {
          errors.push({ row: index + 1, message: "Invalid email." });
          return false;
        }
        if (seenEmails.has(lead.email)) {
          errors.push({ row: index + 1, message: "Duplicate email in file." });
          return false;
        }
        if (existingEmailSet.has(lead.email)) {
          errors.push({ row: index + 1, message: "Email already exists." });
          return false;
        }
        seenEmails.add(lead.email);
        return true;
      });

      if (leadsToInsert.length) {
        await prisma.lead.createMany({
          data: leadsToInsert.map((lead) => ({
            firstName: lead.firstName?.toString() || null,
            lastName: lead.lastName?.toString() || null,
            email: lead.email,
            phone: lead.phone?.toString() || null,
            source: lead.source,
            rawData: lead.rawData
          }))
        });
      }

      return res.json({
        importedCount: leadsToInsert.length,
        skippedCount: rows.length - leadsToInsert.length,
        errors
      });
    } catch (error) {
      return next(error);
    }
  }
);

export default router;
