import React, { useEffect, useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Filter, Globe, MapPin, Search, Send, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";

/**
 * VC Aggregate – single-file preview
 * - Clean, modern landing + directory
 * - Search + filters (region, stage, sector)
 * - Bookmarks (localStorage)
 * - Submit VC modal (no backend; just collects JSON you can copy)
 * - Responsive, keyboard-friendly
 *
 * Notes:
 * - Replace SAMPLE_DATA with live data later (CSV/Google Sheet/API)
 * - Wire the submit handler to your backend (Supabase/Firebase/Airtable) when ready
 */

// ---------- Sample Data (trim/add freely) ----------
const SAMPLE_DATA = [
  {
    id: "peakxv",
    name: "Peak XV (formerly Sequoia India/SEA)",
    website: "https://www.peakxv.com",
    hq: "Bengaluru, India",
    regions: ["India", "SEA"],
    stages: ["Pre-Seed", "Seed", "Series A", "Growth"],
    sectors: ["Consumer", "SaaS", "Fintech", "Health", "AI"],
    ticket: "$200k–$20M",
  },
  {
    id: "blume",
    name: "Blume Ventures",
    website: "https://blume.vc",
    hq: "Mumbai, India",
    regions: ["India"],
    stages: ["Pre-Seed", "Seed", "Series A"],
    sectors: ["SaaS", "Consumer", "Deep Tech", "Fintech"],
    ticket: "$100k–$5M",
  },
  {
    id: "accelindia",
    name: "Accel India",
    website: "https://www.accel.com",
    hq: "Bengaluru, India",
    regions: ["India"],
    stages: ["Seed", "Series A", "Growth"],
    sectors: ["SaaS", "Consumer", "B2B", "Fintech"],
    ticket: "$500k–$20M",
  },
  {
    id: "lightspeedindia",
    name: "Lightspeed India Partners",
    website: "https://lsip.com",
    hq: "Gurugram, India",
    regions: ["India"],
    stages: ["Seed", "Series A", "Growth"],
    sectors: ["SaaS", "Consumer", "Fintech", "AI"],
    ticket: "$500k–$15M",
  },
  {
    id: "elevation",
    name: "Elevation Capital",
    website: "https://www.elevationcapital.com",
    hq: "Bengaluru, India",
    regions: ["India"],
    stages: ["Seed", "Series A"],
    sectors: ["Consumer", "Fintech", "SaaS"],
    ticket: "$250k–$10M",
  },
  {
    id: "nexus",
    name: "Nexus Venture Partners",
    website: "https://nexusvp.com",
    hq: "Mumbai / Silicon Valley",
    regions: ["India", "USA"],
    stages: ["Seed", "Series A", "Growth"],
    sectors: ["SaaS", "AI", "Developer Tools", "B2B"],
    ticket: "$500k–$30M",
  },
  {
    id: "kalaari",
    name: "Kalaari Capital",
    website: "https://kalaari.com",
    hq: "Bengaluru, India",
    regions: ["India"],
    stages: ["Seed", "Series A"],
    sectors: ["Consumer", "Gaming", "SaaS", "Web3"],
    ticket: "$200k–$8M",
  },
  {
    id: "100xvc",
    name: "100X.VC",
    website: "https://www.100x.vc",
    hq: "Mumbai, India",
    regions: ["India"],
    stages: ["Pre-Seed", "Seed"],
    sectors: ["Generalist"],
    ticket: "₹1.25Cr iSAFE (standard)",
  },
  {
    id: "a16z",
    name: "Andreessen Horowitz (a16z)",
    website: "https://a16z.com",
    hq: "Silicon Valley, USA",
    regions: ["USA", "Global"],
    stages: ["Seed", "Series A", "Growth"],
    sectors: ["SaaS", "AI", "Bio", "Fintech", "Games"],
    ticket: "$1M–$100M",
  },
  {
    id: "tiger",
    name: "Tiger Global",
    website: "https://www.tigerglobal.com",
    hq: "New York, USA",
    regions: ["Global"],
    stages: ["Growth"],
    sectors: ["Generalist"],
    ticket: "$10M+",
  },
];

const REGIONS = [
  "India",
  "USA",
  "SEA",
  "Global",
  "Europe",
  "MENA",
  "LatAm",
  "Africa",
  "APAC",
];
const STAGES = ["Pre-Seed", "Seed", "Series A", "Series B", "Growth"];
const SECTORS = [
  "SaaS",
  "Consumer",
  "Fintech",
  "AI",
  "Health",
  "Bio",
  "B2B",
  "Developer Tools",
  "Gaming",
  "Web3",
  "Generalist",
];

// ---------- Utility ----------
const cn = (...c) => c.filter(Boolean).join(" ");
const badge = "px-2 py-0.5 rounded-full text-xs border";

// ---------- Components ----------
function NavBar({ onOpenSubmit }) {
  return (
    <div className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <Globe className="h-5 w-5" />
          <span>VC Aggregate</span>
          <span className="text-xs text-neutral-500 hidden sm:inline">— find the right VC, fast</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#directory" className="text-sm hover:underline">Directory</a>
          <a href="#how" className="text-sm hover:underline">How it works</a>
          <button onClick={onOpenSubmit} className="text-sm px-3 py-1.5 rounded-2xl bg-black text-white shadow hover:opacity-90">
            <Send className="inline h-4 w-4 mr-1" /> Submit a VC
          </button>
        </div>
      </div>
    </div>
  );
}

function Hero({ query, setQuery }) {
  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-extrabold tracking-tight"
        >
          Find your perfect <span className="text-emerald-600">VC partner</span>
        </motion.h1>
        <p className="mt-3 max-w-2xl text-neutral-600">
          A fast, curated directory of venture firms worldwide — filter by region, stage, and sector; bookmark your shortlist.
        </p>
        <div className="mt-6 relative">
          <div className="flex items-center gap-2 rounded-2xl border p-2 bg-white shadow-sm">
            <Search className="h-5 w-5 ml-1" />
            <input
              className="w-full outline-none text-sm md:text-base"
              placeholder="Search by name, sector, or keyword…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="mt-3 text-xs text-neutral-500">
            Tip: try "AI India Seed" or "Fintech Growth Global".
          </div>
        </div>
      </div>
    </div>
  );
}

function Filters({ selected, setSelected }) {
  const toggle = (key, value) => {
    setSelected((s) => {
      const set = new Set(s[key]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...s, [key]: set };
    });
  };

  const ChipGroup = ({ label, list, keyName }) => (
    <div>
      <div className="text-xs uppercase text-neutral-500 mb-1 flex items-center gap-2">
        <Filter className="h-3 w-3" /> {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {list.map((item) => (
          <button
            key={item}
            onClick={() => toggle(keyName, item)}
            className={cn(
              "px-3 py-1 rounded-2xl border text-sm hover:shadow transition",
              selected[keyName].has(item)
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white"
            )}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 grid gap-6 md:grid-cols-3" id="filters">
      <ChipGroup label="Region" list={REGIONS} keyName="regions" />
      <ChipGroup label="Stage" list={STAGES} keyName="stages" />
      <ChipGroup label="Sector" list={SECTORS} keyName="sectors" />
    </div>
  );
}

function FirmCard({ firm, bookmarked, onToggleBookmark }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border p-4 shadow-sm bg-white flex flex-col"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-lg leading-tight">{firm.name}</h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-neutral-600">
            <MapPin className="h-4 w-4" /> {firm.hq}
          </div>
        </div>
        <button
          aria-label="bookmark"
          onClick={onToggleBookmark}
          className="p-2 rounded-xl border hover:bg-neutral-50"
          title={bookmarked ? "Remove bookmark" : "Save to shortlist"}
        >
          {bookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {firm.regions.map((r) => (
          <span key={r} className={cn(badge, "border-emerald-300 bg-emerald-50")}>{r}</span>
        ))}
        {firm.stages.map((s) => (
          <span key={s} className={cn(badge, "border-blue-300 bg-blue-50")}>{s}</span>
        ))}
        {firm.sectors.map((s) => (
          <span key={s} className={cn(badge, "border-neutral-300 bg-neutral-50")}>{s}</span>
        ))}
      </div>

      <div className="mt-3 text-sm text-neutral-700">
        Typical ticket: <span className="font-medium">{firm.ticket}</span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <a
          href={firm.website}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 rounded-xl bg-black text-white text-sm hover:opacity-90"
        >
          Visit website
        </a>
        <a
          href={`mailto:intros@vcaggregate.xyz?subject=Intro request: ${encodeURIComponent(
            firm.name
          )}`}
          className="px-3 py-1.5 rounded-xl border text-sm"
        >
          Request intro
        </a>
      </div>
    </motion.div>
  );
}

function SubmitModal({ open, onClose }) {
  const [form, setForm] = useState({
    name: "",
    website: "",
    hq: "",
    regions: "",
    stages: "",
    sectors: "",
    ticket: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      regions: form.regions.split(",").map((s) => s.trim()).filter(Boolean),
      stages: form.stages.split(",").map((s) => s.trim()).filter(Boolean),
      sectors: form.sectors.split(",").map((s) => s.trim()).filter(Boolean),
    };
    const json = JSON.stringify(payload, null, 2);
    navigator.clipboard.writeText(json).catch(() => {});
    alert("Copied as JSON. Paste into your backend or send via email.");
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="max-w-2xl w-full rounded-2xl bg-white p-4 md:p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Submit a VC</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-100" aria-label="close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          {[
            ["name", "Firm name"],
            ["website", "Website"],
            ["hq", "HQ city, country"],
            ["regions", "Regions (comma-separated)"],
            ["stages", "Stages (comma-separated)"],
            ["sectors", "Sectors (comma-separated)"],
            ["ticket", "Typical ticket (e.g., $200k–$2M)"],
          ].map(([key, label]) => (
            <label key={key} className="grid gap-1">
              <span className="text-sm text-neutral-600">{label}</span>
              <input
                required={key !== "ticket"}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="rounded-xl border p-2"
              />
            </label>
          ))}
          <button type="submit" className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 text-white">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState({
    regions: new Set(["India"]),
    stages: new Set(),
    sectors: new Set(),
  });
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const raw = localStorage.getItem("vc-aggregate-bookmarks");
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("vc-aggregate-bookmarks", JSON.stringify(Array.from(bookmarks)));
  }, [bookmarks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SAMPLE_DATA.filter((f) => {
      const matchesQuery = !q
        ? true
        : [
            f.name,
            f.hq,
            f.ticket,
            ...f.regions,
            ...f.stages,
            ...f.sectors,
          ]
            .join(" ")
            .toLowerCase()
            .includes(q);

      const matchesRegion = selected.regions.size
        ? f.regions.some((r) => selected.regions.has(r))
        : true;
      const matchesStage = selected.stages.size
        ? f.stages.some((s) => selected.stages.has(s))
        : true;
      const matchesSector = selected.sectors.size
        ? f.sectors.some((s) => selected.sectors.has(s))
        : true;

      return matchesQuery && matchesRegion && matchesStage && matchesSector;
    });
  }, [query, selected]);

  const toggleBookmark = (id) => {
    setBookmarks((b) => {
      const next = new Set(b);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const bookmarkedList = SAMPLE_DATA.filter((f) => bookmarks.has(f.id));

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <NavBar onOpenSubmit={() => setOpenModal(true)} />
      <Hero query={query} setQuery={setQuery} />

      {/* Filters */}
      <Filters selected={selected} setSelected={setSelected} />

      {/* Stats */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-2xl border p-4 flex items-center justify-between bg-white">
          <div className="text-sm text-neutral-700">
            Showing <span className="font-semibold">{filtered.length}</span> firms
            {selected.regions.size || selected.stages.size || selected.sectors.size ? (
              <>
                {" "}for your filters
              </>
            ) : null}
          </div>
          <div className="text-sm text-neutral-500 hidden md:flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Pro tip: Bookmark firms to create your shortlist
          </div>
        </div>
      </div>

      {/* Directory */}
      <div id="directory" className="mx-auto max-w-7xl px-4 py-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((f) => (
          <FirmCard
            key={f.id}
            firm={f}
            bookmarked={bookmarks.has(f.id)}
            onToggleBookmark={() => toggleBookmark(f.id)}
          />)
        )}
      </div>

      {/* Bookmarks */}
      <div className="mx-auto max-w-7xl px-4 py-8" id="saved">
        <h2 className="text-xl font-semibold mb-3">Your shortlist</h2>
        {bookmarkedList.length === 0 ? (
          <div className="text-sm text-neutral-600">No bookmarks yet.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookmarkedList.map((f) => (
              <FirmCard
                key={f.id}
                firm={f}
                bookmarked={bookmarks.has(f.id)}
                onToggleBookmark={() => toggleBookmark(f.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* How it works */}
      <div id="how" className="bg-neutral-50 border-t">
        <div className="mx-auto max-w-7xl px-4 py-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Curate & verify",
              desc: "We maintain a living list of active firms. Each profile includes stage, sectors, and region focus.",
            },
            {
              title: "Filter fast",
              desc: "Use smart filters to identify VCs that match your thesis and traction. Save your shortlist for outreach.",
            },
            {
              title: "Warm intros",
              desc: "We help route founder → investor intros when there’s a fit. Coming soon for India + Global.",
            },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border p-5 bg-white">
              <h3 className="font-semibold mb-1">{s.title}</h3>
              <p className="text-sm text-neutral-700">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <div className="text-neutral-600">© {new Date().getFullYear()} VC Aggregate • Built for founders</div>
          <div className="flex items-center gap-3">
            <a href="#filters" className="hover:underline">Filters</a>
            <a href="#saved" className="hover:underline">Shortlist</a>
            <button onClick={() => setOpenModal(true)} className="px-3 py-1.5 rounded-xl border">Submit a VC</button>
          </div>
        </div>
      </footer>

      <SubmitModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}
