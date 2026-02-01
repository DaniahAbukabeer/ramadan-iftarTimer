import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedText } from "./ThemedText";
import { useKeepAwake } from "expo-keep-awake";
import { prayerApi } from "@/src/apis/apis";

export default function Timer() {
  const [hours, setHours] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);
  const [apiTime, setApiTime] = React.useState();
  const [magribTime, setMagribTime] = React.useState<string>("00:00:00");
  const [iftarTimeGeneral, setIftarTimeGeneral] = React.useState({
    iftarHour: 0,
    iftarMinute: 0,
    iftarSecond: 0,
  });
  const [city, setCity] = useState();
  const [timeNow, setTimeNow] = useState(0);

  var currentDate = new Date();
  useKeepAwake();

  const calculateTimeToIftar = () => {
    console.log("calculating iftar time", magribTime);
    if (magribTime) {
      setIftarTimeGeneral({
        iftarHour: parseInt(magribTime.split(":")[0]),
        iftarMinute: parseInt(magribTime.split(":")[1]),
        iftarSecond: 0o0,
      });
      console.log("iftar time cacluated to int", iftarTimeGeneral);
    }
  };

  const gettingTime = async () => {
    console.log(currentDate);
    try {
      const now = new Date();
      console.log("now from new date", now.getDate());
      setTimeNow(now.getTime());
      const time = await prayerApi.getForTime("31-01-2026", {
        latitude: 31.9544,
        longitude: 35.9106,
      });
      console.log(
        "the timing in TIMER component",
        JSON.stringify(time.data, null, 2),
      );
      setApiTime(time.data);
      setMagribTime(time.data.timings.Maghrib);
      console.log(
        "type of time returned from api: ",
        typeof time.data.timings.Maghrib,
      );
    } catch (error) {
      console.error(
        "error fetching prayer time",
        JSON.stringify(error, null, 2),
      );
    }
  };

  const updateTimer = () => {
    if (magribTime === null || magribTime === undefined) return;
    const now = new Date();
    const iftarTime = new Date();
    iftarTime.setHours(
      iftarTimeGeneral.iftarHour,
      iftarTimeGeneral.iftarMinute,
      iftarTimeGeneral.iftarSecond,
      0,
    );

    let diff = iftarTime.getTime() - now.getTime();
    console.log('!!!!the diff in time between now and iftar time!!!!', diff);
    if (diff < 0) {
      // If Iftar time has passed for today, set it for tomorrow
      iftarTime.setDate(iftarTime.getDate() + 1);
      diff = iftarTime.getTime() - now.getTime();
    }

    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    setHours(hrs);
    setMinutes(mins);
    setSeconds(secs);
  };

  React.useEffect(() => {
    gettingTime();
    calculateTimeToIftar();

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    console.log("the api data", apiTime ? apiTime : "no api data yet");
    return () => clearInterval(interval);
  }, [magribTime,]);


  return (
    <View>
      <ThemedText
        style={{
          fontSize: 100,
          color: "#919191",
          textAlign: "center",
          lineHeight: 140,
          fontWeight: "800",
        }}
      >
        {" "}
        {hours} : {minutes} : {seconds}{" "}
      </ThemedText>

      <ThemedText>timer right now {timeNow}</ThemedText>
    </View>
  );
}
