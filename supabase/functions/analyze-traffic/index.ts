import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

interface TrafficStats {
  totalVisits: string;
  bounceRate: string;
  avgDuration: string;
  pagesPerVisit: string;
  history: { date: string; visits: number }[];
}

// Parse JSON from text response
function parseJsonFromText(text: string): any {
  try {
    let cleanText = text.trim();
    const start = cleanText.indexOf('{');
    const end = cleanText.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
      cleanText = cleanText.substring(start, end + 1);
    } else {
      cleanText = cleanText.replace(/^```(json)?/, '').replace(/```$/, '');
    }

    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    try {
      const aggressiveClean = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const start = aggressiveClean.indexOf('{');
      const end = aggressiveClean.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        return JSON.parse(aggressiveClean.substring(start, end + 1));
      }
    } catch (e2) {}
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Validate input
    const { brandName, url, libraryEntryId } = await req.json();

    if (!brandName || typeof brandName !== "string" || !url || typeof url !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid brandName or url parameter" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY not configured" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Check for recent snapshot (3 days cache)
    if (libraryEntryId) {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const { data: recentSnapshot } = await supabase
        .from("traffic_snapshots")
        .select("*")
        .eq("library_entry_id", libraryEntryId)
        .eq("user_id", user.id)
        .gte("created_at", threeDaysAgo.toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (recentSnapshot) {
        return new Response(
          JSON.stringify({
            totalVisits: recentSnapshot.total_visits,
            bounceRate: recentSnapshot.bounce_rate,
            avgDuration: recentSnapshot.avg_duration,
            pagesPerVisit: recentSnapshot.pages_per_visit,
            history: recentSnapshot.history,
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
    }

    // 2-Pass approach
    const prompt = `Analyze the web traffic for the brand "${brandName}" (URL: ${url}).
      Use Google Search to find recent traffic data (Similarweb, Semrush, etc.).

      I need:
      1. Total Monthly Visits (e.g. "1.2M", "50k")
      2. Bounce Rate (e.g. "45%")
      3. Avg Visit Duration (e.g. "02:30")
      4. Pages per Visit (e.g. "3.5")
      5. Historical Trend: Estimate the traffic visits (number) for the LAST 6 MONTHS. 
         If exact data isn't available, infer a realistic trend based on the brand's popularity and seasonality.
         Return exactly 6 data points. Dates should be "Jan", "Feb", etc.

      Return valid JSON only. Do not use markdown code blocks.`;

    // Pass 1: With Google Search
    const pass1Response = await fetch(
      `${GEMINI_BASE_URL}/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ googleSearch: {} }],
        }),
      }
    );

    if (!pass1Response.ok) {
      const errorText = await pass1Response.text();
      console.error("Pass 1 failed:", errorText);
      return new Response(
        JSON.stringify({ error: "AI analysis failed", details: errorText }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const pass1Data = await pass1Response.json();
    const pass1Text = pass1Data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Pass 2: Force JSON
    const pass2Prompt = `Based on this analysis: "${pass1Text}"

      Return valid JSON with this exact structure:
      {
        "totalVisits": "string",
        "bounceRate": "string",
        "avgDuration": "string",
        "pagesPerVisit": "string",
        "history": [
           { "date": "string", "visits": number }
        ]
      }`;

    const pass2Response = await fetch(
      `${GEMINI_BASE_URL}/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: pass2Prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                totalVisits: { type: "string" },
                bounceRate: { type: "string" },
                avgDuration: { type: "string" },
                pagesPerVisit: { type: "string" },
                history: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      date: { type: "string" },
                      visits: { type: "number" },
                    },
                    required: ["date", "visits"],
                  },
                },
              },
              required: ["totalVisits", "bounceRate", "avgDuration", "pagesPerVisit", "history"],
            },
          },
        }),
      }
    );

    if (!pass2Response.ok) {
      const errorText = await pass2Response.text();
      console.error("Pass 2 failed:", errorText);
      const fallbackResult = parseJsonFromText(pass1Text);
      if (fallbackResult && fallbackResult.totalVisits) {
        // Save to DB even if fallback
        if (libraryEntryId) {
          await supabase.from("traffic_snapshots").insert({
            user_id: user.id,
            library_entry_id: libraryEntryId,
            total_visits: fallbackResult.totalVisits || "N/A",
            bounce_rate: fallbackResult.bounceRate || "-",
            avg_duration: fallbackResult.avgDuration || "-",
            pages_per_visit: fallbackResult.pagesPerVisit || "-",
            history: fallbackResult.history || [],
            source: "gemini",
          });
        }
        return new Response(JSON.stringify(fallbackResult), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
      return new Response(
        JSON.stringify({ error: "AI analysis failed", details: errorText }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const pass2Data = await pass2Response.json();
    const resultText = pass2Data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    let result: TrafficStats;

    try {
      result = JSON.parse(resultText);
    } catch (e) {
      const fallbackResult = parseJsonFromText(resultText);
      if (!fallbackResult || !fallbackResult.totalVisits) {
        throw new Error("Failed to parse JSON response");
      }
      result = fallbackResult;
    }

    // Save to database
    if (libraryEntryId) {
      await supabase.from("traffic_snapshots").insert({
        user_id: user.id,
        library_entry_id: libraryEntryId,
        total_visits: result.totalVisits,
        bounce_rate: result.bounceRate,
        avg_duration: result.avgDuration,
        pages_per_visit: result.pagesPerVisit,
        history: result.history,
        source: "gemini",
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error in analyze-traffic:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});




