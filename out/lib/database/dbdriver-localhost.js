export function getLocalhost(address) {
  return {
    async query(text, params) {
      const response = await fetch(`${address}/database/query`, {
        method: "POST",
        body: JSON.stringify({ text, params })
      });
      if (response.status < 200 || response.status > 299) {
        throw await response.json();
      }
      return await response.json();
    }
  };
}
