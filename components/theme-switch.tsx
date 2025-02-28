"use client";

import { FC } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";
import { Switch } from "@/components/ui/switch";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
}) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();
  
  const onChange = () => {
    theme === "dark" ? setTheme("light") : setTheme("dark");
  };

  return (
    <div className="flex items-center gap-2">
      <SunFilledIcon size={22} />
      {!isSSR && (
        <Switch checked={theme === "dark"} onCheckedChange={onChange} />
      )}
      <MoonFilledIcon size={22} />
    </div>
  );
};
