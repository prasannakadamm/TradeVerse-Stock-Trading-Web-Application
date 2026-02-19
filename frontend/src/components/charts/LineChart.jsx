import { Line } from "react-chartjs-2";

export default function LineChart({ prices }) {
  return (
    <Line
      data={{
        labels: prices.map((_, i) => i),
        datasets: [
          {
            label: "Price",
            data: prices,
            borderColor: "rgb(34,197,94)",
            tension: 0.3
          }
        ]
      }}
    />
  );
}
