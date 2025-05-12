const fetch = require("node-fetch");
const qs = require("querystring");

const client_id = "Christia-E-SBX-1a71d1f50-5cfac6c4";
const client_secret = process.env.EBAY_CERT_ID; // Store securely in Vercel

module.exports = async (req, res) => {
  const { code } = req.query;

  if (!code) return res.status(400).json({ error: "Missing auth code" });

  const tokenResponse = await fetch("https://api.sandbox.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: qs.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: "Christian_Ferri-Christia-E-SBX--epnjv"
    })
  });

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    return res.status(500).json({ error: "Token exchange failed", details: tokenData });
  }

  const ebayResponse = await fetch("https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search?q=sony", {
    headers: {
      "Authorization": `Bearer ${tokenData.access_token}`,
      "Content-Type": "application/json"
    }
  });

  const ebayData = await ebayResponse.json();

  res.status(200).json({
    tokens: tokenData,
    ebaySampleResponse: ebayData
  });
};