export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  try {
    const data = JSON.parse(event.body);

    const {
      event_name,
      event_id,
      ttclid,
      pixel_code,
      value,
      currency = "BRL",
      email,
      phone,
      ip,
      user_agent,
      page_url
    } = data;

    const payload = {
      event_source: "web",
      event_source_id: pixel_code, // seu Pixel ID aqui
      data: [
        {
          event: event_name,
          event_id: event_id || Date.now().toString(),
          event_time: Math.floor(Date.now() / 1000),

          context: {
            user: {
             ttclid: ttclid || "",
              email: email ? [email] : [],
              phone: phone ? [phone] : [],
              ip: ip || "",
              user_agent: user_agent || ""
            },
            page: {
              url: page_url || ""
            }
          },

          properties: {
            value: value || 0,
            currency: currency
          }
        }
      ]
    };

    const response = await fetch(
      "https://business-api.tiktok.com/open_api/v1.3/event/track/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Token": process.env.TIKTOK_ACCESS_TOKEN
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "success",
        tiktok_response: result
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: "error",
        message: err.message
      })
    };
  }
}
