export const STATUS_JSON = `{
  "linkChannel": {
    "id": "whatsapp",
    "label": "WhatsApp",
    "linked": true,
    "authAgeMs": 529016.6955566406
  },
  "heartbeat": {
    "defaultAgentId": "main",
    "agents": [
      {
        "agentId": "main",
        "enabled": true,
        "every": "1h",
        "everyMs": 3600000
      }
    ]
  }
}`;

export const HEALTH_JSON = `{
  "ok": true,
  "ts": 1773012929310,
  "durationMs": 12,
  "channels": {
    "telegram": {
      "configured": true,
      "running": false,
      "lastStartAt": null,
      "lastStopAt": null,
      "lastError": null,
      "tokenSource": "none"
    }
  }
}`;
