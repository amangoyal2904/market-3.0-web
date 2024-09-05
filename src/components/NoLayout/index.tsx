"use client";
import useLogin from "@/hooks/useLogin";
import { useMarketStatus } from "@/hooks/useMarketStatus";

const NoLayout = () => {
  useMarketStatus();
  useLogin();
  return null;
};

export default NoLayout;
