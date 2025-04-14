export function getDeviceStyle(type: string) {
  switch (type) {
    case "pump":
      return { color: "#7CF5FF", title: "Máy bơm" };
    case "led_light":
      return { color: "#D2FBFE", title: "Đèn LED" };
    default:
      return { color: "#FFFFFF", title: "" };
  }
}

export function getSensorStyle(sensorName: string) {
  const tag = sensorName.split("#")[1]?.trim();

  switch (tag) {
    case "light":
      return { color: "#FFF2D0", title: sensorName.split("#")[0].trim(), value: "LUX" };
    case "soil_humid":
      return { color: "#F3FFA8", title: sensorName.split("#")[0].trim(), value: "%" };
    case "humidity":
      return { color: "#BAFF8F", title: sensorName.split("#")[0].trim(), value: "%" };
    case "temperature":
      return { color: "#ffebb7", title: sensorName.split("#")[0].trim(), value: "°C" };
    default:
      return { color: "#FFFFFF", title: sensorName, value: "" };
  }
}

