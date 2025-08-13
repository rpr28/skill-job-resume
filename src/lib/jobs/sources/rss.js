import Parser from "rss-parser";
import { normalizeJob, mkId } from "../normalize";
const parser = new Parser({ timeout: 12000, headers: { "User-Agent":"careerboost/1.0" } });
export const RSS_SOURCES = [ /* add feeds later */ ];
export async function fetchRSS(){
  const out=[]; await Promise.all(RSS_SOURCES.map(async (u)=>{ try{
    const feed = await parser.parseURL(u);
    for(const it of feed.items||[]){
      out.push(normalizeJob({
        id: mkId("rss", it.link || it.guid || it.title), title: it.title || "",
        company: (feed.title || ""), location: "", remote:/remote/i.test(String(it.contentSnippet||it.content||"")),
        tags: [], summary: String(it.contentSnippet || it.content || ""), url: it.link || "",
        employmentType: "", source: "rss", postedAt: it.isoDate || ""
      }));
    }
  }catch{} })); return out;
}
