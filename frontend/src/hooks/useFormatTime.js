import { formatTime } from "@/lib/formatTime";
import { useEffect, useState } from "react";


export const useFormatTime = (date) => {
  const [time, setTime] = useState(() => formatTime(date));

  useEffect(() => {
    setTime(formatTime(date));

    const interval = setInterval(() => {
      setTime(formatTime(date));
    }, 60000);

    return () => clearInterval(interval);
  }, [date]);

  return time;
};
