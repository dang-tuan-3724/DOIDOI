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

export function getSensorStyle(sensor: any) {
  switch (sensor.type) {
    case "Light Sensor":
      return { color: "#FFF2D0", title: sensor.sensorName, value: "LUX" };
    case "Soil Moisture Sensor":
      return { color: "#F3FFA8", title: sensor.sensorName, value: "%" };
    case "Humidity Sensor":
      return { color: "#BAFF8F", title: sensor.sensorName, value: "%" };
    case "Temperature Sensor":
      return { color: "#ffebb7", title: sensor.sensorName, value: "°C" };
    default:
      return { color: "#FFFFFF", title: sensor.sensorName, value: "" };
  }
}

