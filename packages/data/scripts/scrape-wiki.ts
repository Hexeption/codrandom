/**
 * Scrape a Call of Duty Fandom weapon page for attachment data and generate a markdown notes file.
 *
 * Usage:
 *  ts-node --transpile-only scripts/scrape-wiki.ts --url <wiki-url> [--game mw2|mw3|bo6|...] [--out <outputPath>] [--name <weaponName>] [--dry]
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { load } from 'cheerio';

type Args = {
    url: string;
    game: string; // folder key e.g., mw2, mw3
    out?: string; // optional explicit output path
    name?: string; // optional weapon name override
    dry?: boolean; // if true, do not write to disk
};

const KNOWN_CATEGORIES = [
    'Muzzle',
    'Barrel',
    'Laser',
    'Optic', // we'll normalize to "Optics" in output
    'Stock',
    'Underbarrel',
    'Ammunition',
    'Magazine',
    'Rear Grip',
    'Conversion Kit',
    'Aftermarket Parts',
];

function parseArgs(argv: string[]): Args {
    const out: Partial<Args> = {};
    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];
        const next = argv[i + 1];
        if (a === '--url') {
            out.url = next as string; i++;
        } else if (a === '--game') {
            out.game = (next as string) || 'mw2'; i++;
        } else if (a === '--out') {
            out.out = next as string; i++;
        } else if (a === '--name') {
            out.name = next as string; i++;
        } else if (a === '--dry') {
            out.dry = true;
        } else if (a === '--help' || a === '-h') {
            printHelp();
            process.exit(0);
        }
    }
    if (!out.url) {
        console.error('Error: --url is required');
        printHelp();
        process.exit(1);
    }
    if (!out.game) out.game = 'mw2';
    return out as Args;
}

function printHelp() {
    console.log(`
Scrape a CoD Fandom weapon page for attachments into a markdown file.

Options:
  --url   <string>   Required. The Fandom wiki weapon URL.
  --game  <string>   Optional. Folder key for output (default: mw2).
  --out   <string>   Optional. Explicit output file path; overrides --game.
  --name  <string>   Optional. Weapon name override. Parsed from page if omitted.
  --dry              Optional. Do not write file; print a short summary instead.

Examples:
  ts-node --transpile-only scripts/scrape-wiki.ts --url https://callofduty.fandom.com/wiki/Kastov_762 --game mw2
  ts-node --transpile-only scripts/scrape-wiki.ts --url https://callofduty.fandom.com/wiki/Kastov_545 --game mw2 --out packages/data/weapon-notes/mw2/mw2-kastov-545.md
`);
}

function slugify(input: string): string {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9\s-]+/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

function normalizeText(s: string | undefined | null): string {
    if (!s) return '';
    return String(s)
        .replace(/\u00A0/g, ' ')
        .replace(/[\u200B-\u200F\uFEFF]/g, '') // zero-width chars
        .replace(/[\r\n\t]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function cleanItem(text: string): string {
    // Remove bracketed notes like (Modern Warfare III) and trim • bullets
    return text
        .replace(/^•\s*/g, '')
        .replace(/\s*\([^)]*\)\s*$/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

function escapeRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function fetchPage(url: string): Promise<string> {
    // Prefer action=render to get fully rendered, static HTML with section IDs
    const base = url.split('#')[0] as string;
    // Only append action=render for Fandom wiki pages; other sites (Game8) should be fetched raw
    const isFandom = /\.fandom\.com/i.test(base);
    const u = base.includes('action=render') ? base : (isFandom ? base + '?action=render' : base);
    const res = await fetch(u);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${u}: ${res.status} ${res.statusText}`);
    }
    return await res.text();
}

function extractWeaponName($: any): string | undefined {
    // Prefer Game8 article H1 if present (site-specific)
    const g8TitleTop = normalizeText($('h1.p-archiveHeader__title').first().text());
    if (g8TitleTop) {
        return g8TitleTop.replace(/\s*-?\s*(Best Loadout( and Build)?|Best Build|Best Loadout and Build)$/i, '').trim() || g8TitleTop;
    }
    // Prefer the MediaWiki firstHeading (reliable for article title)
    const fh = $('#firstHeading').first();
    if (fh && fh.length) {
        const fhText = normalizeText(fh.text());
        if (fhText && !/contents?/i.test(fhText)) return fhText.replace(/\s+\[.*/, '').trim();
    }
    // Try first h1/h2-like title text near top but avoid table-of-contents
    const firstHeader = (normalizeText($('h1').first().text()) || normalizeText($('h2').first().text()));
    if (firstHeader && !/contents?/i.test(firstHeader)) return firstHeader.replace(/\s+\[.*/, '').trim();
    // Fallback to page title in <title>
    const titleRaw = normalizeText(String($('title').text() || ''));
    const title = (String(titleRaw).split('-')[0] || '').trim();
    if (title) return title.replace(/\s+\[.*/, '').trim();
    return undefined;
}

function extractWeaponClass($: any): string | undefined {
    // 1) Try Game8-style intro sentence: "The <name> is a type of Battle Rifle in..."
    try {
        const g8Intro = normalizeText($('.p-archiveContent__main p').first().text() || $('article p').first().text() || $('p').first().text());
        if (g8Intro) {
            // match "is a type of X" or "is a X"
            let m = g8Intro.match(/\btype of\s+([A-Za-z0-9 \-]+?)(?:\s+in\b|\s+for\b|\s+that\b|\s+which\b|\.|,)/i);
            if (!m) m = g8Intro.match(/\bis an?\s+([A-Za-z0-9 \-]+?)(?:\s+in\b|\s+for\b|\s+that\b|\s+which\b|\.|,)/i);
            if (m && m[1]) {
                const cls = normalizeText(m[1]).replace(/\s+$/, '');
                if (cls) return cls;
            }
        }
    } catch { /* ignore */ }

    // 2) Prefer the closest "Weapon Class" label near the first h1/h2 title block (fallback)
    let cls: string | undefined;
    const title = $('h1').first();
    const region = title.nextAll().slice(0, 50); // limit search window
    region.each((_: any, el: any) => {
        const $el = $(el);
        const txt = $el.text().trim();
        if (/Weapon Class/i.test(txt)) {
            const next = $el.next();
            const val = next && next.text ? next.text().trim() : '';
            if (val) { cls = val.replace(/\s+\(.*/, '').trim(); return false; }
        }
    });
    if (cls) cls = normalizeText(cls);
    if (!cls) cls = 'Assault Rifle';
    return cls;
}

type AttachmentMap = Record<string, string[]>;

function getGameTagRegex(gameKey: string): { include?: RegExp; exclude?: RegExp } {
    // Identify parentheses game markers like (Modern Warfare II)
    switch (gameKey.toLowerCase()) {
        case 'mw2':
            return {
                include: /(\(|\[)?\s*(modern warfare ii|mwii|mw2)\s*(\)|\])?/i,
                exclude: /(modern warfare iii|mwiii|mw3|black ops|bo\d|vanguard|cold war)/i,
            };
        case 'mw3':
            return {
                include: /(\(|\[)?\s*(modern warfare iii|mwiii|mw3)\s*(\)|\])?/i,
                exclude: /(modern warfare ii|mwii|mw2|black ops|bo\d|vanguard|cold war)/i,
            };
        case 'bo6':
        case 'blackops6':
            return {
                include: /(black\s*ops\s*6|bo6|black ops 6)/i,
                exclude: /(modern warfare ii|mwii|mw2|modern warfare iii|mwiii|mw3)/i,
            };
        default:
            return {};
    }
}

function extractAttachments($: any, opts?: { anchor?: string, game?: string, weaponName?: string }): AttachmentMap {
    const anchor = opts?.anchor;
    const gameKey = (opts?.game || '').toLowerCase();
    const tagRegex = getGameTagRegex(gameKey);

    const debug = !!process.env.SCRAPE_DEBUG;

    // Quick support for Game8 article pages (they use structured tables with <th>/<td>)
    // e.g. https://game8.co/games/MW3/archives/431305
    const isGame8 = !!$('.p-archiveContent__main').length || $('table.a-table').length > 0;
    if (isGame8) {
        if (debug) console.log('[debug] detected Game8 article format; parsing tables');
        const map: AttachmentMap = {};
        const push = (k: string | undefined, v: string) => {
            if (!k) return;
            if (!map[k]) map[k] = [];
            if (!map[k].includes(v)) map[k].push(v);
        };
        const synonyms: Record<string, string> = {
            'optic': 'Optics',
            'optics': 'Optics',
            'sight': 'Optics',
            'sights': 'Optics',
            'muzzle': 'Muzzle',
            'barrel': 'Barrel',
            'underbarrel': 'Underbarrel',
            'under barrel': 'Underbarrel',
            'magazine': 'Magazine',
            'magazines': 'Magazine',
            'ammunition': 'Ammunition',
            'ammo': 'Ammunition',
            'rear grip': 'Rear Grip',
            'handle': 'Rear Grip',
            'stock': 'Stock',
            'laser': 'Laser',
            'conversion kit': 'Aftermarket Parts',
            'aftermarket parts': 'Aftermarket Parts',
            'body': 'Aftermarket Parts'
        };

        const collectCell = (td: any) => {
            const $td = $(td);
            // prefer link texts if present
            const links = $td.find('a').map((_: any, a: any) => normalizeText($(a).text())).get().filter(Boolean) as string[];
            if (links.length) return links.map(cleanItem).filter(x => x !== '-');
            // fallback: split by <br> or commas/newlines
            const html = $td.html() || '';
            const parts = html.replace(/<br\s*\/?>(\s*)/gi, '|').replace(/<[^>]+>/g, '');
            return parts.split(/[|,\n]+/).map((s: string) => cleanItem(normalizeText(s))).filter((s: string) => !!s && s !== '-') as string[];
        };

        // Prefer the 'All ... Attachments' section if present
        // Some Game8 render variants omit their CSS class names; prefer id=hl_4 or text match
        let attachmentsSection: any = $('h2#hl_4').first();
        if (!attachmentsSection || !attachmentsSection.length) {
            attachmentsSection = $('h2').filter((_: any, el: any) => /All .* Attachments/i.test($(el).text())).first();
        }

        if (attachmentsSection && attachmentsSection.length) {
            if (debug) console.log('[debug] game8: found All Attachments section');
            // Use nextUntil('h2') to be robust across rendered vs. client HTML
            const region = attachmentsSection.nextUntil('h2');
            // When debugging, enumerate h3 subsection titles and approximate link counts
            if (debug) {
                try {
                    console.log('[debug] game8 region length:', region.length);
                    const snippetHtml = (region && region.length) ? (region.first().html() || '').replace(/\s+/g, ' ').slice(0, 1200) : '';
                    console.log('[debug] game8 region htmlSnippet:', snippetHtml.slice(0, 1000));
                    console.log('[debug] game8 region h3.count=', region.find('h3').length);
                    // print a small sample of tag names inside the region
                    try {
                        const tags = new Set();
                        region.find('*').slice(0, 200).each((i: any, el: any) => { if (el && el.tagName) tags.add(el.tagName.toLowerCase()); });
                        console.log('[debug] game8 region tags sample:', Array.from(tags).slice(0, 40));
                    } catch (ee) { /* ignore */ }
                    region.find('h3.a-header--3, h3').each((_: any, h3El: any) => {
                        const title = normalizeText($(h3El).text() || '');
                        // Count links in the following tables/blocks until the next h3 or h2
                        let count = 0;
                        let cur = $(h3El).next();
                        while (cur && cur.length && !cur.is('h3') && !cur.is('h2')) {
                            count += cur.find('a').length || 0;
                            cur = cur.next();
                        }
                        console.log(`[debug] game8 section: "${title}" -> ${count} links`);
                    });
                } catch (e) { console.log('[debug] game8 enum error', String(e)); }
            }
            // Walk h3 subsections (category headings) inside the region
            const h3count = region.find('h3.a-header--3, h3').length;
            if (!h3count) {
                // Fallback: tables-only variant (some rendered pages omit h3 headings). For each table, try to infer the category
                region.find('table').each((_: any, table: any) => {
                    const $table = $(table);
                    // Candidate sources for category name: caption, preceding text nodes/elements, first header cell
                    let catText = normalizeText($table.find('caption').first().text() || '');
                    if (!catText) {
                        // look back at previous siblings (up to 3) for a descriptor
                        let prev = $table.prev();
                        let tries = 0;
                        while (prev && prev.length && tries < 4 && !catText) {
                            const t = normalizeText(prev.text() || '');
                            if (t) catText = t;
                            prev = prev.prev(); tries++;
                        }
                    }
                    if (!catText) {
                        const firstTh = $table.find('th').first();
                        if (firstTh && firstTh.length) catText = normalizeText(firstTh.text() || '');
                    }
                    if (!catText) return;
                    // Strip leading weapon name if present (e.g., "Lachmann-762 Barrels")
                    const parts = catText.split(/\s+/);
                    if (parts.length > 1 && opts?.weaponName) {
                        const firstToken = (opts.weaponName || '').toLowerCase().split(' ')[0];
                        if (parts[0] && String(parts[0]).toLowerCase().startsWith(firstToken)) {
                            catText = parts.slice(1).join(' ');
                        }
                    }
                    const keyLower = catText.toLowerCase();
                    let mapped = synonyms[keyLower] || KNOWN_CATEGORIES.find(c => c.toLowerCase() === keyLower) || undefined;
                    if (!mapped) {
                        for (const s of Object.keys(synonyms)) {
                            if (keyLower.indexOf(s) !== -1) { mapped = synonyms[s]; break; }
                        }
                    }
                    if (!mapped) return;
                    // collect links and td texts from this table
                    $table.find('a').each((__: any, a: any) => { const it = cleanItem(normalizeText($(a).text())); if (it && it !== '-') { push(mapped, it); if (debug) console.log(`[debug] game8 table-put ${it} -> ${mapped}`); } });
                    $table.find('td').each((__: any, td: any) => { const texts = collectCell(td); for (const it of texts) { if (!it || it === '-') continue; push(mapped, it); if (debug) console.log(`[debug] game8 table-put ${it} -> ${mapped}`); } });
                });
                // If still nothing collected, do a sequential walk: detect category markers in text nodes and collect following links into that category
                const collectedBefore = Object.keys(map).length;
                const allKeys = Object.keys(synonyms).concat(KNOWN_CATEGORIES.map(c => c.toLowerCase()));
                let currentMapped: string | undefined;
                region.children().each((i: any, el: any) => {
                    const $el = $(el);
                    const txt = normalizeText($el.text() || '').toLowerCase();
                    // detect if this node looks like a category header
                    let found: string | undefined;
                    for (const k of allKeys) {
                        if (txt.indexOf(k) !== -1) { found = k; break; }
                    }
                    if (found) {
                        currentMapped = synonyms[found] || KNOWN_CATEGORIES.find(c => c.toLowerCase() === found) as string | undefined;
                        if (debug) console.log('[debug] sequential found header ->', found, 'mapped->', currentMapped);
                        return; // header node doesn't itself contain links usually
                    }
                    // otherwise, collect links/text under currentMapped
                    if (currentMapped) {
                        // prefer anchors
                        $el.find('a').each((_: any, a: any) => {
                            const it = cleanItem(normalizeText($(a).text()));
                            if (!it || it === '-') return;
                            push(currentMapped, it);
                            if (debug) console.log(`[debug] seq-put ${it} -> ${currentMapped}`);
                        });
                        // also check td cells
                        $el.find('td').each((_: any, td: any) => {
                            const texts = collectCell(td);
                            for (const it of texts) { if (!it || it === '-') continue; push(currentMapped, it); if (debug) console.log(`[debug] seq-put ${it} -> ${currentMapped}`); }
                        });
                    }
                });
                if (debug) console.log('[debug] sequential collection delta:', Object.keys(map).length - collectedBefore);
            }
            // If h3s exist, use them as before
            region.find('h3.a-header--3, h3').each((_: any, h3: any) => {
                const catText = normalizeText($(h3).text() || '').toLowerCase();
                if (debug) console.log('[debug] game8 h3 raw:', catText.slice(0, 120));
                let mapped = synonyms[catText] || KNOWN_CATEGORIES.find(c => c.toLowerCase() === catText) || undefined;
                if (!mapped) {
                    for (const s of Object.keys(synonyms)) {
                        if (catText.indexOf(s) !== -1) { mapped = synonyms[s]; break; }
                    }
                }
                if (debug) console.log('[debug] game8 h3 mapped ->', mapped);
                if (!mapped) return;
                // collect tables or lists immediately following this h3 until the next h3
                let cur = $(h3).next();
                while (cur && cur.length && !cur.is('h3') && !cur.is('h2')) {
                    // If this node is a table or contains tables, iterate contained tables
                    const tables = cur.is('table') ? cur : cur.find('table');
                    if (tables && tables.length) {
                        tables.each((_: any, table: any) => {
                            const $table = $(table);
                            $table.find('a.a-link, td a').each((__: any, a: any) => {
                                const it = cleanItem(normalizeText($(a).text()));
                                if (!it || it === '-') return;
                                push(mapped, it);
                                if (debug) console.log(`[debug] game8 put ${it} -> ${mapped}`);
                            });
                            // also check plain td text cells (no link)
                            $table.find('td').each((__: any, td: any) => {
                                const texts = collectCell(td);
                                for (const it of texts) {
                                    if (!it || it === '-') continue;
                                    push(mapped, it);
                                    if (debug) console.log(`[debug] game8 put ${it} -> ${mapped}`);
                                }
                            });
                        });
                    } else {
                        // Fallback: any anchor links directly inside this node
                        cur.find('a').each((__: any, a: any) => {
                            const it = cleanItem(normalizeText($(a).text()));
                            if (!it || it === '-') return;
                            push(mapped, it);
                            if (debug) console.log(`[debug] game8 put (fallback) ${it} -> ${mapped}`);
                        });
                    }
                    cur = cur.next();
                }
            });
        } else {
            // Fallback: iterate tables under main content
            $('table').each((_: any, table: any) => {
                $(table).find('tr').each((_: any, tr: any) => {
                    const th = $(tr).find('th').first();
                    const td = $(tr).find('td').first();
                    if (!th || !th.length || !td || !td.length) return;
                    const key = normalizeText(th.text()).toLowerCase();
                    let mapped = synonyms[key] || KNOWN_CATEGORIES.find(c => c.toLowerCase() === key) || undefined;
                    if (!mapped) {
                        // try partial match (e.g., 'optic' inside 'Optic(s)')
                        for (const s of Object.keys(synonyms)) {
                            if (key.indexOf(s) !== -1) { mapped = synonyms[s]; break; }
                        }
                    }
                    if (!mapped) return;
                    const items = collectCell(td);
                    if (!map[mapped]) map[mapped] = [];
                    for (const it of items) {
                        if (!it) continue;
                        const k = mapped as string;
                        if (!map[k]) map[k] = [];
                        if (!map[k].includes(it)) map[k].push(it);
                        if (debug) console.log(`[debug] game8 put ${it} -> ${k}`);
                    }
                });
            });
        }

        // Ensure Optics key exists
        if (!map['Optics']) map['Optics'] = [];
        return map;
    }

    // If an anchor is provided, first narrow to that section.
    // Fandom anchors can appear in several forms (raw, URL-encoded, with underscores, or with HTML entities like &amp;).
    let scopeStart: any | undefined;
    if (anchor) {
        const decoded = (() => {
            try { return decodeURIComponent(anchor).trim(); } catch { return anchor.trim(); }
        })();
        const decodedSpaces = decoded.replace(/_/g, ' ').trim();
        const variants = new Set<string>();
        variants.add(anchor);
        variants.add(decoded);
        variants.add(decodedSpaces);
        // HTML entity variants for ampersand
        variants.add(decoded.replace(/&amp;/g, '&'));
        variants.add(decoded.replace(/&/g, '&amp;'));
        // Fandom sometimes encodes '&' into ".26_" in id attributes (e.g. "...II_.26_Modern...")
        variants.add(decoded.replace(/&amp;/g, '.26_'));
        variants.add(decoded.replace(/&/g, '.26_'));
        // URL-encoded forms
        variants.add(decoded.replace(/&/g, '%26'));
        variants.add(decoded.replace(/&amp;/g, '%26'));
        // encoded/unencoded underscores/spaces
        variants.add(decoded.replace(/\s+/g, '_'));
        variants.add(decoded.replace(/_/g, ' '));
        // URL-encoded form
        try { variants.add(encodeURIComponent(decoded)); } catch { }

        for (const v of Array.from(variants)) {
            if (!v) continue;
            // Try exact id match
            scopeStart = $(`[id="${v}"]`).first();
            if (scopeStart && scopeStart.length) break;
            // Some pages use the heading text instead of id attributes
            scopeStart = $('h2, h3, h4').filter((_: any, el: any) => $(el).text().trim().toLowerCase() === v.replace(/_/g, ' ').toLowerCase()).first();
            if (scopeStart && scopeStart.length) break;
        }

        // As a last resort, try a loose id match by normalizing id attributes (replace underscores with spaces)
        if ((!scopeStart || !scopeStart.length)) {
            const needle = decodedSpaces.toLowerCase();
            scopeStart = $(`*[id]`).filter((_: any, el: any) => {
                const id = (($(el).attr('id') || '')).replace(/_/g, ' ').trim();
                return id.toLowerCase() === needle;
            }).first();
        }
    }

    if (debug) console.log('[debug] scopeStart:', scopeStart && scopeStart.length ? scopeStart.text().trim().slice(0, 80) : '<none>');

    // Prefer scoping to the weapon's subheading (e.g., M13B) inside the anchor region
    let rootStart: any = undefined;
    if (scopeStart && scopeStart.length && opts?.weaponName) {
        // Look ahead for the weapon subheading among subsequent headings
        // Accept exact matches or variant headings that start with the base name
        const want = opts!.weaponName!.trim();
        const wantLower = want.toLowerCase();
        rootStart = scopeStart
            .nextAll('h2, h3, h4')
            .filter((_: any, el: any) => {
                const txt = $(el).text().trim();
                const tl = txt.toLowerCase();
                if (tl === wantLower) return true;
                // allow variants like "M13B" to match when looking for "M13"
                if (tl.startsWith(wantLower) && tl.length > wantLower.length) return true;
                return false;
            })
            .first();
    }
    if ((!rootStart || !rootStart.length) && opts?.weaponName) {
        const want = opts!.weaponName!.trim();
        const wantLower = want.toLowerCase();
        rootStart = $('h2, h3, h4').filter((_: any, el: any) => {
            const txt = $(el).text().trim();
            const tl = txt.toLowerCase();
            if (tl === wantLower) return true;
            if (tl.startsWith(wantLower) && tl.length > wantLower.length) return true;
            return false;
        }).first();
    }

    if (debug) console.log('[debug] rootStart:', rootStart && rootStart.length ? rootStart.text().trim().slice(0, 80) : '<none>');

    // Find Attachments header; prefer the one whose nearest previous h2 equals the weapon name
    let attachHeader: any = undefined;
    // First, try precise wiki pattern: span.mw-headline with text 'Attachments'
    const headlineCandidates = $('span.mw-headline').filter((_: any, el: any) => /Attachments/i.test($(el).text())).toArray();
    const weaponLower = (opts?.weaponName || '').trim().toLowerCase();
    for (const el of headlineCandidates) {
        const heading = $(el).closest('h2, h3, h4');
        // check the nearest previous heading at multiple levels (h2/h3/h4)
        const prevH2 = heading.prevAll('h2, h3, h4').first();
        if (weaponLower && prevH2 && prevH2.length && prevH2.text().trim().toLowerCase() === weaponLower) {
            attachHeader = heading;
            break;
        }
    }
    // Next, fallback to generic header text search and nearest previous h2/h3/h4
    const candidates = (!attachHeader || !attachHeader.length)
        ? $('h2, h3, h4').filter((_: any, el: any) => /Attachments/i.test($(el).text())).toArray()
        : [];
    for (const el of candidates) {
        const prevHeader = $(el).prevAll('h2, h3, h4').first();
        if (weaponLower && prevHeader && prevHeader.length && prevHeader.text().trim().toLowerCase() === weaponLower) {
            attachHeader = $(el);
            break;
        }
    }
    if ((!attachHeader || !attachHeader.length) && rootStart && rootStart.length) {
        const tag = rootStart.prop('tagName')?.toLowerCase() || 'h2';
        const untilSel = tag === 'h2' ? 'h2' : tag === 'h3' ? 'h3' : 'h2,h3';
        const region = rootStart.nextUntil(untilSel);
        attachHeader = region.find('h2, h3, h4').filter((_: any, el: any) => /Attachments/i.test($(el).text())).first();
    }
    if ((!attachHeader || !attachHeader.length) && scopeStart && scopeStart.length) {
        const levelTag = scopeStart.prop('tagName')?.toLowerCase() || 'h2';
        const untilSel = levelTag === 'h2' ? 'h2' : levelTag === 'h3' ? 'h3' : 'h2,h3';
        const region = scopeStart.nextUntil(untilSel);
        attachHeader = region.find('h2, h3, h4').filter((_: any, el: any) => /Attachments/i.test($(el).text())).first();
    }
    if (!attachHeader || !attachHeader.length) {
        // Fallback: global search
        attachHeader = $('h2, h3, h4').filter((_: any, el: any) => /Attachments/i.test($(el).text())).first();
    }
    if (debug) console.log('[debug] attachHeader:', attachHeader && attachHeader.length ? attachHeader.text().trim().slice(0, 80) : '<none>');
    if (!attachHeader || !attachHeader.length) return {};
    // Collect all <li> texts until the next h2 and classify each
    const lowerCats = new Set(KNOWN_CATEGORIES.map(c => c.toLowerCase()));
    const navRegex = new RegExp(Array.from(lowerCats).join('|'), 'ig');
    const listTexts: string[] = [];
    let sib: any = attachHeader.next();
    while (sib && sib.length) {
        if (sib.is('h2')) break;
        sib.find && sib.find('li').each((_: any, li: any) => {
            let t = $(li).text().replace(/\u00A0/g, ' ');
            t = t.replace(/\s+/g, ' ').trim();
            if (!t) return;
            // Skip if this li looks like the categories nav (contains many category names stuck together)
            const matches = t.match(navRegex);
            if (matches && matches.length >= 2 && t.replace(/[A-Za-z ]/g, '') === '') {
                return; // looks like concatenated category names only
            }
            // If game filter applies, drop items explicitly tagged for another game
            if (tagRegex.exclude && tagRegex.exclude.test(t)) return;
            // If includes are defined and the line contains any parentheses tag, require include or allow if no tag present
            if (tagRegex.include) {
                const parenMatch = t.match(/\(([^)]*)\)/) || t.match(/\[([^\]]*)\]/);
                const parenText = parenMatch ? parenMatch[1] : '';
                if (parenText && tagRegex.include && !tagRegex.include.test(parenText)) return;
            }
            listTexts.push(t);
        });
        sib = sib.next();
    }
    if (debug) console.log(`[debug] collected listTexts: ${listTexts.length}`, listTexts.slice(0, 8));

    // Try DOM-grouped categorization using nearby headings/labels, walking siblings in order
    const map: AttachmentMap = {};
    const put = (cat: string, val: string) => {
        const key = cat === 'Optic' ? 'Optics' : cat;
        if (!map[key]) map[key] = [];
        const v = cleanItem(val);
        if (v && !map[key].includes(v)) {
            map[key].push(v);
            if (debug) console.log(`[debug] put ${v} -> ${key}`);
        }
    };

    const textToCat = (txt: string): string | undefined => {
        const cleaned = txt.replace(/\u00A0/g, ' ').replace(/\s+\[Sign in to edit\].*$/i, '').replace(/\s+/g, ' ').trim();
        const base = cleaned.replace(/:\s*$/, '');
        const found = KNOWN_CATEGORIES.find(c => c.toLowerCase() === base.toLowerCase());
        if (!found) return undefined;
        // If the heading text exactly matches a known category, return it immediately.
        return found;
        // Map common plural/alias headings
        if (/^sight(s)?$/i.test(base)) return 'Optic';
        if (!attachHeader || !attachHeader.length) {
            // Fallback: global search
            attachHeader = $('h2, h3, h4').filter((_: any, el: any) => /Attachments/i.test($(el).text())).first();
        }
        // Prepare holders used by both primary and fallback paths
        const lowerCats = new Set(KNOWN_CATEGORIES.map(c => c.toLowerCase()));
        const navRegex = new RegExp(Array.from(lowerCats).join('|'), 'ig');
        const listTexts: string[] = [];
        const map: AttachmentMap = {};

        if (attachHeader && attachHeader.length) {
            // Collect all <li> texts until the next h2 and classify each
            let sib: any = attachHeader.next();
            while (sib && sib.length) {
                if (sib.is('h2')) break;
                sib.find && sib.find('li').each((_: any, li: any) => {
                    let t = $(li).text().replace(/\u00A0/g, ' ');
                    t = t.replace(/\s+/g, ' ').trim();
                    if (!t) return;
                    // Skip if this li looks like the categories nav (contains many category names stuck together)
                    const matches = t.match(navRegex);
                    if (matches && matches.length >= 2 && t.replace(/[A-Za-z ]/g, '') === '') {
                        return; // looks like concatenated category names only
                    }
                    // If game filter applies, drop items explicitly tagged for another game
                    if (tagRegex.exclude && tagRegex.exclude.test(t)) return;
                    // If includes are defined and the line contains any parentheses tag, require include or allow if no tag present
                    if (tagRegex.include) {
                        const parenMatch = t.match(/\(([^)]*)\)/) || t.match(/\[([^\]]*)\]/);
                        const parenText = parenMatch ? parenMatch[1] : '';
                        if (parenText && tagRegex.include && !tagRegex.include.test(parenText)) return;
                    }
                    listTexts.push(t);
                });
                sib = sib.next();
            }
        }
    };

    let currentCat: string | undefined;
    let cursor = attachHeader.next();
    while (cursor && cursor.length) {
        if (cursor.is('h2')) break;
        if (debug) {
            const tag = cursor.prop && cursor.prop('tagName') ? cursor.prop('tagName') : '<unknown>';
            const snippet = (cursor.text && cursor.text().trim()) ? cursor.text().trim().replace(/\s+/g, ' ').slice(0, 120) : '';
            console.log(`[debug] cursor node: ${tag} => "${snippet}"`);
        }
        const isHeading = cursor.is('h3') || cursor.is('h4') || cursor.is('h5') || cursor.is('strong') || cursor.is('b');
        if (isHeading) {
            const cat = textToCat(cursor.text());
            if (cat) { currentCat = cat; if (!map[currentCat]) map[currentCat] = []; }
        }
        // UL lists
        if (cursor.is('ul') && currentCat) {
            const liTexts = cursor.find('li').map((_: any, li: any) => $(li).text().trim()).get() as string[];
            if (debug) console.log(`[debug] ul li count for ${currentCat}: ${liTexts.length}`, liTexts.slice(0, 6));
            const allCats = liTexts.length > 0 && liTexts.every((t: string) => lowerCats.has(t.replace(/:\s*$/, '').toLowerCase()));
            if (!allCats) {
                for (let t of liTexts) {
                    if (debug) console.log(`[debug] consider li (ul): ${t}`);
                    if (tagRegex.exclude && tagRegex.exclude.test(t)) { if (debug) console.log(`[debug] excluded by exclude regex: ${t}`); continue; }
                    if (tagRegex.include) {
                        const parenMatch = t.match(/\(([^)]*)\)/) || t.match(/\[([^\]]*)\]/);
                        const parenText = parenMatch ? (parenMatch[1] || '').trim() : '';
                        const looksLikeGameTag = /modern|mw|black|ops|bo\d?|vanguard|cold war|warfare/i.test(parenText);
                        if (parenText && looksLikeGameTag && !tagRegex.include.test(parenText)) { if (debug) console.log(`[debug] skipped by include check: paren='${parenText}' t='${t}'`); continue; }
                    }
                    const s = t.replace(/\s+/g, ' ').replace(/\s*-\s*/g, '-').replace(/\s*\([^)]*\)\s*$/g, '').trim();
                    if (!s) { if (debug) console.log('[debug] skipped empty after clean'); continue; }
                    if (lowerCats.has(s.toLowerCase())) { if (debug) console.log(`[debug] skipped because looks like category name: ${s}`); continue; }
                    if (debug) console.log(`[debug] put candidate ${s} -> ${currentCat}`);
                    put(currentCat, s);
                }
            }
        }
        // Text-bullet lists using • characters
        if (currentCat) {
            let raw = cursor.text ? cursor.text() : '';
            raw = raw.replace(/\u00A0/g, ' ');
            if (/[•]/.test(raw)) {
                const parts = raw.split('•').map((x: string) => x.trim()).filter(Boolean) as string[];
                for (let t of parts) {
                    if (!t) continue;
                    if (tagRegex.exclude && tagRegex.exclude.test(t)) continue;
                    if (tagRegex.include) {
                        const parenMatch = t.match(/\(([^)]*)\)/) || t.match(/\[([^\]]*)\]/);
                        const parenText = parenMatch ? parenMatch[1] : '';
                        if (parenText && tagRegex.include && !tagRegex.include.test(parenText)) continue;
                    }
                    const s = t.replace(/\s*-\s*/g, '-').replace(/\s*\([^)]*\)\s*$/g, '').replace(/:\s*$/, '').trim();
                    if (!s || lowerCats.has(s.toLowerCase())) continue;
                    put(currentCat, s);
                }
            }
        }
        cursor = cursor.next();
    }

    // Fallback: if nothing captured, heuristically classify flat items
    const collectedCount = Object.values(map).reduce((a, b) => a + b.length, 0);
    if (collectedCount === 0) {
        const items = listTexts
            .map(s => s.replace(/\s*-\s*/g, '-'))
            .map(s => s.replace(/\s*\([^)]*\)\s*$/g, ''))
            .map(s => s.replace(/:\s*$/, ''))
            .map(s => s.trim())
            .filter(s => s.length > 0 && !lowerCats.has(s.toLowerCase()));

        const isAmmo = (s: string) => /(frangible|hollowpoint|armor piercing|overpressured|high velocity|low grain|high grain|round nose|mono)/i.test(s);
        const isMag = (s: string) => /(\b|\d)\s*round\s*mag\b|\bmag\b|single tap mod/i.test(s);
        const isBarrel = (s: string) => /(barrel|\b\d{2,3}mm\b|\b\d{1,2}\.\d?\s*("|inch))/i.test(s);
        const isLaser = (s: string) => /(laser|peq|lzr|ultrabeam|solarflare|ole)/i.test(s);
        const isOptic = (s: string) => /(optic|reflex|scope|holo|hybrid|thermal|angel|vlk|sro|vortex|zero-p|ct90|bullseye|ghostview|oscar|delta 4|truesight|eagleseye|mortis|bandera|farsight|rfl-?optic)/i.test(s);
        // broaden optic detection to include common sight names like Red Dot, VMR, Tracker, RDS
        const isOpticExt = (s: string) => /\b(red dot|dot sight|tracker|vmr|rds|reflex|micro|sight)\b/i.test(s);
        const isStock = (s: string) => /stock\b/i.test(s);
        const isUnderbarrel = (s: string) => /(foregrip|bipod|masterkey|torch|kl40|tl40|40mm|wrecker)/i.test(s);
        const isRearGrip = (s: string) => /grip\b/i.test(s) && !isUnderbarrel(s);
        const isMuzzle = (s: string) => /(flash hider|silencer|suppressor|talon|mono|brake|comp|tread|kt85|leveler|bore|gh50|breach|dx90|zulu|polarfire|husher)/i.test(s);
        const isAftermarket = (s: string) => /(jak|tac kit|recoilless|harbinger|requiem)/i.test(s);

        for (const raw of items) {
            const s = cleanItem(raw);
            if (!s) continue;
            if (isBarrel(s)) { put('Barrel', s); continue; }
            if (isLaser(s)) { put('Laser', s); continue; }
            if (isOptic(s) || isOpticExt(s)) { put('Optic', s); continue; }
            if (isStock(s)) { put('Stock', s); continue; }
            if (isMag(s)) { put('Magazine', s); continue; }
            if (isAmmo(s)) { put('Ammunition', s); continue; }
            if (isMuzzle(s)) { put('Muzzle', s); continue; }
            if (isUnderbarrel(s)) { put('Underbarrel', s); continue; }
            if (isRearGrip(s)) { put('Rear Grip', s); continue; }
            if (isAftermarket(s)) { put('Aftermarket Parts', s); continue; }
        }
    }

    // Normalize Conversion Kit -> Aftermarket Parts
    if (map['Conversion Kit'] && !map['Aftermarket Parts']) {
        map['Aftermarket Parts'] = map['Conversion Kit'];
        delete map['Conversion Kit'];
    }

    // Fallback 2: Direct category sweep under the weapon's section using mw-headline anchors
    const total = Object.values(map).reduce((a, b) => a + b.length, 0);
    if (total === 0 && opts?.weaponName) {
        const weaponLower = opts.weaponName.trim().toLowerCase();
        const catLabels: Array<{ out: string; find: RegExp }> = [
            { out: 'Optics', find: /^Optic(s)?$/i },
            { out: 'Muzzle', find: /^Muzzle$/i },
            { out: 'Barrel', find: /^Barrel$/i },
            { out: 'Underbarrel', find: /^Underbarrel$/i },
            { out: 'Magazine', find: /^Magazine(s)?$/i },
            { out: 'Rear Grip', find: /^Rear Grip$/i },
            { out: 'Stock', find: /^Stock$/i },
            { out: 'Laser', find: /^Laser$/i },
            { out: 'Ammunition', find: /^Ammunition$/i },
            { out: 'Aftermarket Parts', find: /^(Aftermarket Parts|Conversion Kit)$/i },
        ];

        const collectFrom = (headerEl: any, outCat: string) => {
            const levelTag = headerEl.prop('tagName')?.toLowerCase() || 'h3';
            const untilSel = levelTag === 'h2' ? 'h2' : levelTag === 'h3' ? 'h3' : 'h2,h3,h4,h5';
            let cur = headerEl.next();
            while (cur && cur.length) {
                if (cur.is(untilSel)) break;
                // UL
                if (cur.is('ul, ol')) {
                    const liTexts = cur.find('li').map((_: any, li: any) => $(li).text().trim()).get() as string[];
                    for (let t of liTexts) {
                        if (!t) continue;
                        if (tagRegex.exclude && tagRegex.exclude.test(t)) continue;
                        if (tagRegex.include) {
                            const parenMatch = t.match(/\(([^)]*)\)/) || t.match(/\[([^\]]*)\]/);
                            const parenText = parenMatch ? parenMatch[1] : '';
                            if (parenText && tagRegex.include && !tagRegex.include.test(parenText)) continue;
                        }
                        const s = t.replace(/\s+/g, ' ').replace(/\s*-\s*/g, '-').replace(/\s*\([^)]*\)\s*$/g, '').trim();
                        if (!s || lowerCats.has(s.toLowerCase())) continue;
                        put(outCat, s);
                    }
                } else if (cur.is('table')) {
                    // Tables: take first column cell text or link text
                    const cells = cur.find('tr > td:first-child, tr > th:first-child');
                    cells.each((_: any, td: any) => {
                        let t = $(td).text().trim();
                        if (!t) t = $(td).find('a').first().text().trim();
                        if (!t) return;
                        if (tagRegex.exclude && tagRegex.exclude.test(t)) return;
                        if (tagRegex.include) {
                            const hasParenTag = /\(([^)]*)\)/.test(t) || /\[([^\]]*)\]/.test(t);
                            if (hasParenTag && !tagRegex.include.test(t)) return;
                        }
                        const s = t.replace(/\s*\([^)]*\)\s*$/g, '').replace(/\s*:\s*$/, '').replace(/\s+/g, ' ').trim();
                        if (!s || lowerCats.has(s.toLowerCase())) return;
                        put(outCat, s);
                    });
                } else {
                    // Bullet-text
                    let raw = cur.text ? cur.text() : '';
                    raw = raw.replace(/\u00A0/g, ' ');
                    if (/[•]/.test(raw)) {
                        const parts = raw.split('•').map((x: string) => x.trim()).filter(Boolean) as string[];
                        for (let t of parts) {
                            if (!t) continue;
                            if (tagRegex.exclude && tagRegex.exclude.test(t)) continue;
                            if (tagRegex.include) {
                                const parenMatch = t.match(/\(([^)]*)\)/) || t.match(/\[([^\]]*)\]/);
                                const parenText = parenMatch ? parenMatch[1] : '';
                                if (parenText && tagRegex.include && !tagRegex.include.test(parenText)) continue;
                            }
                            const s = t.replace(/\s*-\s*/g, '-').replace(/\s*\([^)]*\)\s*$/g, '').replace(/:\s*$/, '').trim();
                            if (!s || lowerCats.has(s.toLowerCase())) continue;
                            put(outCat, s);
                        }
                    }
                }
                cur = cur.next();
            }
        };

        // Determine the weapon section region
        // Pick the weapon heading instance that actually contains category headlines in its region
        let regionStart: any;
        const headingCands = (rootStart && rootStart.length)
            ? [rootStart]
            : $('h2, h3, h4').filter((_: any, el: any) => $(el).text().trim().toLowerCase() === weaponLower).toArray().map((el: any) => $(el));
        const catFinders = [/(Attachments)/i, /^Muzzle$/i, /^Barrel$/i, /^Laser$/i, /^Optic(s)?$/i, /^Stock$/i, /^Underbarrel$/i, /^Ammunition$/i, /^Magazine(s)?$/i, /^Rear Grip$/i];
        for (const cand of headingCands as any[]) {
            const tag = cand.prop('tagName')?.toLowerCase() || 'h2';
            const untilSel = tag === 'h2' ? 'h2' : tag === 'h3' ? 'h3' : 'h2,h3';
            const region = cand.nextUntil(untilSel);
            const spans = region.find('span.mw-headline');
            const hasCats = spans.toArray().some((el: any) => {
                const t = $(el).text().trim();
                return catFinders.some(re => re.test(t));
            });
            if (hasCats) { regionStart = cand; break; }
        }
        if (!regionStart || !regionStart.length) {
            // Fallback to the first matching heading if none showed category spans
            regionStart = $('h2, h3, h4').filter((_: any, el: any) => $(el).text().trim().toLowerCase() === weaponLower).first();
        }

        // Helper to check if a node is within the region after regionStart
        const findInRegion = (selector: string) => {
            if (!regionStart || !regionStart.length) return $(selector);
            const tag = regionStart.prop('tagName')?.toLowerCase() || 'h3';
            const untilSel = tag === 'h2' ? 'h2' : tag === 'h3' ? 'h3' : 'h2,h3,h4';
            const region = regionStart.nextUntil(untilSel);
            return region.find(selector);
        };

        // For each category, look for a headline/heading node inside the weapon region and collect
        for (const { out, find } of catLabels) {
            let picked: any;
            // Prefer mw-headline span text
            const spans = findInRegion('span.mw-headline').filter((_: any, el: any) => find.test($(el).text().trim()));
            if (spans && spans.length) {
                picked = spans.first().closest('h2, h3, h4, h5');
            } else {
                // Fallback: raw heading text without mw-headline
                picked = findInRegion('h2, h3, h4, h5, strong, b').filter((_: any, el: any) => find.test($(el).text().trim())).first();
            }
            if (picked && picked.length) {
                if (!map[out]) map[out] = [];
                collectFrom(picked, out);
            }
        }
    }

    return map;
}

function toMarkdown(game: string, name: string, weaponClass: string | undefined, attachments: AttachmentMap): string {
    const lines: string[] = [];
    lines.push('# ' + game.toUpperCase());
    lines.push('');
    lines.push(`Gun: ${name}`);
    lines.push(`Category: ${weaponClass || 'Assault Rifle'}`);
    lines.push('');

    const order = ['Optics', 'Muzzle', 'Barrel', 'Underbarrel', 'Magazine', 'Rear Grip', 'Stock', 'Laser', 'Ammunition', 'Aftermarket Parts'];
    for (const cat of order) {
        const items = attachments[cat];
        if (!items || items.length === 0) continue;
        lines.push(cat + ':');
        lines.push('');
        for (const item of items) {
            lines.push(`- ${item}`);
        }
        lines.push('');
    }

    return lines.join('\n');
}

async function main() {
    const args = parseArgs(process.argv);
    const html = await fetchPage(args.url);
    const $ = load(html);
    let weaponName = args.name || extractWeaponName($) || '';
    const weaponClass = extractWeaponClass($) || 'Assault Rifle';
    let anchor: string | undefined;
    let basePageName: string | undefined;
    try {
        const urlObj = new URL(args.url.replace(/\\/g, ''));
        anchor = urlObj.hash ? urlObj.hash.slice(1) : undefined;
        const raw = urlObj.pathname.split('/').pop() || '';
        basePageName = decodeURIComponent(raw).replace(/_/g, ' ').trim();
        // Normalize common parenthetical qualifiers from the page slug (e.g. "Honey_Badger_(weapon)")
        if (basePageName) basePageName = basePageName.replace(/\s*\([^)]*\)\s*$/i, '').trim();
    } catch { }
    // If we have an anchor, and the current weaponName is missing or looks generic
    // prefer the specific weapon subheading inside that anchor region (e.g., find "M13B" under the MWII/MWIII anchor)
    const nameLooksGeneric = !weaponName || /call of duty|contents?|overview|attachments?/i.test(weaponName);
    if (anchor && nameLooksGeneric) {
        const decoded = decodeURIComponent(anchor).replace(/_/g, ' ').trim();
        // Find the region element representing the anchor
        let scopeEl = $(`[id="${anchor}"]`).first();
        if ((!scopeEl || !scopeEl.length) && decoded) {
            scopeEl = $('h2, h3, h4').filter((_: any, el: any) => $(el).text().trim().toLowerCase() === decoded.toLowerCase()).first();
        }
        if (scopeEl && scopeEl.length) {
            const tag = scopeEl.prop('tagName')?.toLowerCase() || 'h2';
            const untilSel = tag === 'h2' ? 'h2' : tag === 'h3' ? 'h3' : 'h2,h3';
            const region = scopeEl.nextUntil(untilSel);

            // 1) Prefer a heading inside the region that starts with the base page name (M13 -> M13B)
            if (basePageName) {
                const bp = basePageName.toLowerCase();
                const match = region.find('h2, h3, h4').filter((_: any, el: any) => {
                    const t = $(el).text().trim().toLowerCase();
                    return t === bp || t.startsWith(bp);
                }).first();
                if (match && match.length) weaponName = match.text().trim();
            }

            // 2) If still generic, pick the first non-generic heading inside the region
            if (!weaponName || nameLooksGeneric) {
                const candidate = region.find('h2, h3, h4').filter((_: any, el: any) => {
                    const t = $(el).text().trim();
                    return !!t && !/^(attachments|overview|blueprints|gallery|trivia|recent images?)$/i.test(t.trim());
                }).first();
                if (candidate && candidate.length) weaponName = candidate.text().trim();
            }
        }

        // 3) Last resort: find any heading in the document that equals/starts with basePageName
        if ((!weaponName || nameLooksGeneric) && basePageName) {
            const bp = basePageName.toLowerCase();
            const cand = $('h2, h3, h4').filter((_: any, el: any) => {
                const t = $(el).text().trim().toLowerCase();
                return t === bp || t.startsWith(bp);
            }).first();
            if (cand && cand.length) weaponName = cand.text().trim();
        }
    }

    // Prefer a variant subheading inside the anchor region (e.g., M13 -> M13B) explicitly
    if (anchor && basePageName) {
        const decoded = decodeURIComponent(anchor).replace(/_/g, ' ').trim();
        let scopeEl = $(`[id="${anchor}"]`).first();
        if ((!scopeEl || !scopeEl.length) && decoded) {
            scopeEl = $('h2, h3, h4').filter((_: any, el: any) => $(el).text().trim().toLowerCase() === decoded.toLowerCase()).first();
        }
        if (scopeEl && scopeEl.length) {
            const tag = scopeEl.prop('tagName')?.toLowerCase() || 'h2';
            const untilSel = tag === 'h2' ? 'h2' : tag === 'h3' ? 'h3' : 'h2,h3';
            const region = scopeEl.nextUntil(untilSel);
            const bp = basePageName.toLowerCase();
            const variant = region.find('h2, h3, h4').filter((_: any, el: any) => {
                const t = $(el).text().trim().toLowerCase();
                return t.startsWith(bp) && t.length > bp.length;
            }).first();
            if (variant && variant.length) weaponName = variant.text().trim();
        }
    }
    // Additionally, always prefer any variant heading anywhere in the document that starts with the base page name
    // This helps when anchor scoping misses the variant location
    if (basePageName) {
        const bp = basePageName.toLowerCase();
        const globalVariant = $('h2, h3, h4').filter((_: any, el: any) => {
            const t = $(el).text().trim().toLowerCase();
            return t.startsWith(bp) && t.length > bp.length;
        }).first();
        if (globalVariant && globalVariant.length) weaponName = globalVariant.text().trim();
    }
    if (weaponName) {
        weaponName = normalizeText(weaponName);
        // Remove trailing "vs ..." or "v. ..." artifacts sometimes emitted by headings
        weaponName = weaponName.replace(/\s+v(?:s|\.)?\s+.*$/i, '').trim();
    }
    if (!weaponName) weaponName = 'Unknown Weapon';

    const attachments = extractAttachments($, { anchor, game: args.game, weaponName });

    // Ensure Optics section exists (some pages list optics inside attachments as bullets)
    if (!attachments['Optics']) attachments['Optics'] = [];

    const md = toMarkdown(args.game, weaponName, weaponClass, attachments);

    if (args.dry) {
        console.log(`Parsed: name="${weaponName}", class="${weaponClass}"`);
        const counts = Object.entries(attachments).map(([k, v]) => `${k}: ${v.length}`).join(', ');
        console.log(`Attachments counts: ${counts}`);
        console.log('\n--- Preview ---\n');
        console.log(md.substring(0, 800) + (md.length > 800 ? '\n...\n' : ''));
        return;
    }

    let outPath = args.out;
    if (!outPath) {
        const slug = slugify(weaponName);
        const fileName = `${args.game.toLowerCase()}-${slug}.md`;
        outPath = join(__dirname, '..', 'weapon-notes', args.game.toLowerCase(), fileName);
    }

    // If exists, avoid overwrite by appending a suffix
    let finalPath = outPath;
    if (existsSync(finalPath)) {
        const slug = slugify(weaponName);
        const baseDir = dirname(outPath);
        let n = 1;
        while (existsSync(join(baseDir, `${args.game.toLowerCase()}-${slug}-${n}.md`))) n++;
        finalPath = join(baseDir, `${args.game.toLowerCase()}-${slug}-${n}.md`);
    }

    mkdirSync(dirname(finalPath), { recursive: true });
    writeFileSync(finalPath, md, 'utf8');
    console.log(`Wrote ${finalPath}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
