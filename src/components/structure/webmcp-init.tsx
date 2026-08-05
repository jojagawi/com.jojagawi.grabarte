"use client";

import { useEffect } from "react";
import { initializeWebMCPPolyfill } from "@mcp-b/webmcp-polyfill";
import { setupAiTools } from "@/lib/webmcp-setup";

export function WebMcpInit() {
  useEffect(() => {
    initializeWebMCPPolyfill();
    setupAiTools();
  }, []);

  return null;
}

