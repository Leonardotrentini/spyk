import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// This function should be called via Supabase Cron
// It uses service role to access all users' data and refresh stale library entries
Deno.serve(async (req) => {
  try {
    // Verify this is called from Supabase Cron (optional: check headers)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find library entries that need refresh (status=monitoring, last_checked > 7 days ago or null)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: entriesToRefresh, error: fetchError } = await supabaseAdmin
      .from("library_entries")
      .select("*")
      .eq("status", "monitoring")
      .or(`last_checked.is.null,last_checked.lt.${sevenDaysAgo.toISOString()}`)
      .limit(50); // Process in batches

    if (fetchError) {
      console.error("Error fetching entries:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch entries", details: fetchError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!entriesToRefresh || entriesToRefresh.length === 0) {
      return new Response(
        JSON.stringify({ message: "No entries to refresh", processed: 0 }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    let processed = 0;
    let errors = 0;

    // Process each entry
    for (const entry of entriesToRefresh) {
      try {
        // Call analyze-url internally
        const prompt = `Analyze this Ad Library or Website URL: ${entry.url}. 
      
      I need you to extract or infer the following information:
      1. Brand Name: The likely name of the company or page.
      2. Niche: The specific industry or category.
      3. Active Ads Count: PRIORITIZE finding the *actual* number of active ads running for this brand.
      4. Landing Page URL: The main website or landing page associated with this ad library.
      5. Summary: A very brief 1-sentence description of what they sell.
      6. Traffic Estimate: Estimate the monthly website traffic.`;

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
          console.error(`Failed to analyze ${entry.id}:`, await pass1Response.text());
          errors++;
          continue;
        }

        const pass1Data = await pass1Response.json();
        const pass1Text = pass1Data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Pass 2: Force JSON
        const pass2Prompt = `Based on this analysis: "${pass1Text}"

      Return the result as a valid JSON object with:
      {
        "brandName": "string",
        "niche": "string",
        "estimatedAdsCount": number,
        "landingPageUrl": "string",
        "summary": "string",
        "trafficEstimate": "string"
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
                    brandName: { type: "string" },
                    niche: { type: "string" },
                    estimatedAdsCount: { type: "number" },
                    landingPageUrl: { type: "string" },
                    summary: { type: "string" },
                    trafficEstimate: { type: "string" },
                  },
                  required: ["brandName", "niche", "estimatedAdsCount", "landingPageUrl", "summary", "trafficEstimate"],
                },
              },
            }),
          }
        );

        if (!pass2Response.ok) {
          console.error(`Failed to get structured response for ${entry.id}`);
          errors++;
          continue;
        }

        const pass2Data = await pass2Response.json();
        const resultText = pass2Data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const result = JSON.parse(resultText);

        // Find or create niche
        let nicheId = entry.niche_id;
        if (result.niche) {
          const { data: existingNiche } = await supabaseAdmin
            .from("niches")
            .select("id")
            .eq("user_id", entry.user_id)
            .eq("label", result.niche)
            .single();

          if (existingNiche) {
            nicheId = existingNiche.id;
          } else {
            // Create niche with random color
            const colors = [
              "bg-blue-100 text-blue-800",
              "bg-indigo-100 text-indigo-800",
              "bg-emerald-100 text-emerald-800",
              "bg-amber-100 text-amber-800",
              "bg-purple-100 text-purple-800",
            ];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            const { data: newNiche } = await supabaseAdmin
              .from("niches")
              .insert({
                user_id: entry.user_id,
                label: result.niche,
                color: randomColor,
              })
              .select("id")
              .single();

            if (newNiche) {
              nicheId = newNiche.id;
            }
          }
        }

        // Update entry
        await supabaseAdmin
          .from("library_entries")
          .update({
            brand_name: result.brandName || entry.brand_name,
            active_ads_count: result.estimatedAdsCount || entry.active_ads_count,
            landing_page_url: result.landingPageUrl || entry.landing_page_url,
            traffic_estimate: result.trafficEstimate || entry.traffic_estimate,
            niche_id: nicheId,
            last_checked: new Date().toISOString(),
          })
          .eq("id", entry.id);

        processed++;
      } catch (error) {
        console.error(`Error processing entry ${entry.id}:`, error);
        errors++;
      }
    }

    return new Response(
      JSON.stringify({
        message: "Refresh completed",
        processed,
        errors,
        total: entriesToRefresh.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in cron-refresh-libraries:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});




