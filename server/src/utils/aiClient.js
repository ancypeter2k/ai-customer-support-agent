import axios from "axios";

const openRouterCall = async (messages) => {
  const key = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || "gpt-4o-mini";
  if (!key) throw new Error("OPENROUTER_API_KEY not set");

  const payload = {
    model,
    messages: messages.map(m => ({ role: m.role, content: m.content }))
  };

  const resp = await axios.post("https://openrouter.ai/api/v1/chat/completions", payload, {
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    }
  });
  const choice = resp.data?.choices?.[0]?.message?.content || resp.data?.choices?.[0]?.text || "";
  return String(choice);
};

const huggingfaceCall = async (messages) => {
  const key = process.env.HUGGINGFACE_API_KEY;
  const model = process.env.HUGGINGFACE_MODEL || "gpt2";
  if (!key) throw new Error("HUGGINGFACE_API_KEY not set");
  const prompt = messages.map(m => `${m.role}: ${m.content}`).join("\n") + "\nassistant:";
  const resp = await axios.post(`https://api-inference.huggingface.co/models/${model}`, {
    inputs: prompt,
  }, {
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    timeout: 60000
  });
  const out = resp.data?.generated_text || "";
  return String(out);
};

export const getAIResponse = async (messages) => {
  const provider = (process.env.AI_PROVIDER || "openrouter").toLowerCase();
  if (provider === "openrouter") {
    return await openRouterCall(messages);
  } else if (provider === "huggingface") {
    return await huggingfaceCall(messages);
  } else {
    throw new Error("Unknown AI_PROVIDER, use openrouter or huggingface");
  }
};
