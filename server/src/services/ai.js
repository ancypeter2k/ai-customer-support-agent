import axios from "axios";
import config from "../config.js";

export const getAIResponse = async (message, history = []) => {
  if (config.aiProvider === 'huggingface' && config.hfApiKey) {
    try {
      let prompt = history.map(m => (m.role === 'user' ? `User: ${m.text}` : `Assistant: ${m.text}`)).join('\n');
      prompt += `\nUser: ${message}\nAssistant:`;

      const resp = await axios.post(
        `https://api-inference.huggingface.co/models/${config.hfModel}`,
        { inputs: prompt, options: { wait_for_model: true } },
        { headers: { Authorization: `Bearer ${config.hfApiKey}`, 'Content-Type': 'application/json' } }
      );

      if (resp.data && Array.isArray(resp.data) && resp.data[0].generated_text) {
        return resp.data[0].generated_text;
      }
      if (typeof resp.data === 'string') return resp.data;
      if (resp.data && resp.data.generated_text) return resp.data.generated_text;
      return 'Sorry, I could not generate a response.';
    } catch (err) {
      console.error('HuggingFace error', err.response?.data || err.message);
      return 'Sorry, AI service unavailable.';
    }
  }

  return `Echo: ${message} (running in mock mode).`;
};
