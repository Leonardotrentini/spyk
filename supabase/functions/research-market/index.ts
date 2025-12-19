import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

interface MarketTrendReport {
  topic: string;
  nicheScore: number;
  nicheVerdict: string;
  keywordAnalysis: {
    term: string;
    volume: string;
    competition: "Low" | "Medium" | "High";
    score: number;
  }[];
  trendingKeywords: string[];
  commonQuestions: string[];
  risingRelatedTopics: string[];
  productOpportunities: {
    title: string;
    description: string;
    difficulty: "Low" | "Medium" | "High";
    potentialRevenue: string;
  }[];
}

interface CountryTrend {
  topic: string;
  category: string;
}

// Parse JSON from text response
function parseJsonFromText(text: string): any {
  try {
    let cleanText = text.trim();
    const start = cleanText.indexOf('[');
    const end = cleanText.lastIndexOf(']');
    
    if (start !== -1 && end !== -1) {
      cleanText = cleanText.substring(start, end + 1);
    } else {
      const objStart = cleanText.indexOf('{');
      const objEnd = cleanText.lastIndexOf('}');
      if (objStart !== -1 && objEnd !== -1) {
        cleanText = cleanText.substring(objStart, objEnd + 1);
      } else {
        cleanText = cleanText.replace(/^```(json)?/, '').replace(/```$/, '');
      }
    }

    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    try {
      const aggressiveClean = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const start = aggressiveClean.indexOf('[');
      const end = aggressiveClean.lastIndexOf(']');
      if (start !== -1 && end !== -1) {
        return JSON.parse(aggressiveClean.substring(start, end + 1));
      }
      const objStart = aggressiveClean.indexOf('{');
      const objEnd = aggressiveClean.lastIndexOf('}');
      if (objStart !== -1 && objEnd !== -1) {
        return JSON.parse(aggressiveClean.substring(objStart, objEnd + 1));
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
    const { topic, country, type } = await req.json();

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

    // Handle country trends (simpler request)
    if (type === "country-trends") {
      if (!country || typeof country !== "string") {
        return new Response(
          JSON.stringify({ error: "Invalid country parameter" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      const prompt = `What are the top 10 trending market niches, product categories, or consumer search topics in ${country} right now? 
      Focus on topics with high commercial intent (things people want to buy or learn about).
      
      Return ONLY a valid raw JSON array of objects with "topic" and "category". 
      Do NOT wrap in markdown.
      Example: [{"topic": "Matcha Tea Sets", "category": "Food & Bev"}]`;

      const response = await fetch(
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

      if (!response.ok) {
        const errorText = await response.text();
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

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const result = parseJsonFromText(text);

      return new Response(
        JSON.stringify(Array.isArray(result) ? result : []),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Handle market trends analysis (full report)
    if (!topic || typeof topic !== "string" || !country || typeof country !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid topic or country parameter" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Check cache (7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: cachedReport } = await supabase
      .from("market_reports")
      .select("*")
      .eq("user_id", user.id)
      .eq("topic", topic)
      .eq("country", country)
      .gte("created_at", sevenDaysAgo.toISOString())
      .single();

    if (cachedReport) {
      return new Response(JSON.stringify(cachedReport.report), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // 2-Pass approach for market analysis
    const prompt = `Perform a comprehensive market research analysis for the topic: "${topic}" specifically for the market in: ${country}.
      
      CRITICAL INSTRUCTION:
      1. Translate the topic "${topic}" into the NATIVE language of ${country} (e.g., if Country is 'United States', use English; if 'Brazil', use Portuguese; if 'Japan', use Japanese).
      2. Use this TRANSLATED term to perform all Google Searches and analysis to ensure local relevance.
      3. Return the results in English, but based on the local language data.

      I need you to find:
      1. Niche Viability Score: A score from 0-100 indicating how profitable and accessible this niche is in ${country}, and a 1-sentence Verdict.
      2. Keyword Intelligence: Find 6-8 distinct, related search terms or sub-niches (in the native language of ${country}). For each, estimate the Search Volume (e.g. "High", "10k-50k", "Very High") and Competition Level (Low/Medium/High). Assign a score (1-10) to each term based on opportunity.
      3. Top 5 currently trending search keywords/queries related to this topic in ${country}.
      4. 5 Common questions or "pain points" people in ${country} are searching for.
      5. 3 Rising related topics in ${country}.
      6. 3 Product Opportunities: Specific ideas relevant to this market.`;

    // Pass 1: With Google Search and thinking
    const pass1Response = await fetch(
      `${GEMINI_BASE_URL}/gemini-3-pro-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ googleSearch: {} }],
          systemInstruction: {
            parts: [{ text: "You are a market research analyst. Provide detailed, data-driven insights." }],
          },
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

    // Pass 2: Force structured JSON
    const pass2Prompt = `Based on this analysis: "${pass1Text}"

      Return the result as a valid JSON object with this structure:
      {
        "topic": "${topic} (Translated: [Native Term])",
        "nicheScore": number,
        "nicheVerdict": "string",
        "keywordAnalysis": [
           { "term": "string", "volume": "string", "competition": "Low" | "Medium" | "High", "score": number }
        ],
        "trendingKeywords": ["string"],
        "commonQuestions": ["string"],
        "risingRelatedTopics": ["string"],
        "productOpportunities": [
           { "title": "string", "description": "string", "difficulty": "Low" | "Medium" | "High", "potentialRevenue": "string" }
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
                topic: { type: "string" },
                nicheScore: { type: "number" },
                nicheVerdict: { type: "string" },
                keywordAnalysis: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      term: { type: "string" },
                      volume: { type: "string" },
                      competition: { type: "string", enum: ["Low", "Medium", "High"] },
                      score: { type: "number" },
                    },
                    required: ["term", "volume", "competition", "score"],
                  },
                },
                trendingKeywords: {
                  type: "array",
                  items: { type: "string" },
                },
                commonQuestions: {
                  type: "array",
                  items: { type: "string" },
                },
                risingRelatedTopics: {
                  type: "array",
                  items: { type: "string" },
                },
                productOpportunities: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      difficulty: { type: "string", enum: ["Low", "Medium", "High"] },
                      potentialRevenue: { type: "string" },
                    },
                    required: ["title", "description", "difficulty", "potentialRevenue"],
                  },
                },
              },
              required: ["topic", "nicheScore", "nicheVerdict", "keywordAnalysis", "trendingKeywords", "commonQuestions", "risingRelatedTopics", "productOpportunities"],
            },
          },
        }),
      }
    );

    if (!pass2Response.ok) {
      const errorText = await pass2Response.text();
      console.error("Pass 2 failed:", errorText);
      const fallbackResult = parseJsonFromText(pass1Text);
      if (fallbackResult && fallbackResult.nicheScore !== undefined) {
        // Cache fallback result
        await supabase
          .from("market_reports")
          .upsert({
            user_id: user.id,
            topic,
            country,
            report: fallbackResult,
            created_at: new Date().toISOString(),
          });
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
    let result: MarketTrendReport;

    try {
      result = JSON.parse(resultText);
    } catch (e) {
      const fallbackResult = parseJsonFromText(resultText);
      if (!fallbackResult || fallbackResult.nicheScore === undefined) {
        throw new Error("Failed to parse JSON response");
      }
      result = fallbackResult;
    }

    // Cache the result
    await supabase
      .from("market_reports")
      .upsert({
        user_id: user.id,
        topic,
        country,
        report: result,
        created_at: new Date().toISOString(),
      });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error in research-market:", error);
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




