import React, { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend)

const generateRandomPriceData = (previousClose: number) => {
  const open = previousClose + (Math.random() - 0.5) * 20
  const close = open + (Math.random() - 0.5) * 30
  return { open, close }
}

const generateInitialData = () => {
  let data = []
  let currentPrice = 100

  for (let i = 0; i < 100; i++) {
    // Increased to 100 data points
    const { open, close } = generateRandomPriceData(currentPrice)
    data.push({ open, close })
    currentPrice = close
  }
  return data
}

const generateInitialLabels = () => {
  const labels = []
  const now = new Date()

  for (let i = 99; i >= 0; i--) {
    // Adjusted for 100 data points
    const time = new Date(now.getTime() - i * 2000)
    labels.push(time.toLocaleTimeString())
  }
  return labels
}

const CryptoChart = () => {
  const [priceData, setPriceData] = useState<any[]>(generateInitialData())
  const [labels, setLabels] = useState<string[]>(generateInitialLabels())
  const [buyAmount, setBuyAmount] = useState(0)
  const [sellAmount, setSellAmount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const { open, close } = generateRandomPriceData(
        priceData[priceData.length - 1].close
      )
      setPriceData((prevData) => [...prevData.slice(-99), { open, close }])
      setLabels((prevLabels) => [
        ...prevLabels.slice(-99),
        new Date().toLocaleTimeString(),
      ])
    }, 2000)

    return () => clearInterval(interval)
  }, [priceData])

  const data = {
    labels,
    datasets: [
      {
        label: "Rebaz-Daddy Token Price",
        data: priceData.map(({ close }) => close),
        backgroundColor: (context: any) => {
          if (!priceData[context.dataIndex]) return "rgba(34, 197, 94, 0.7)"
          const currentPrice = priceData[context.dataIndex].close
          const previousPrice =
            context.dataIndex > 0
              ? priceData[context.dataIndex - 1].close
              : currentPrice
          return currentPrice > previousPrice
            ? "rgba(34, 197, 94, 0.7)" // Green
            : "rgba(248, 113, 113, 0.7)" // Red
        },
        borderColor: (context: any) => {
          if (!priceData[context.dataIndex]) return "rgba(34, 197, 94, 1)"
          const currentPrice = priceData[context.dataIndex].close
          const previousPrice =
            context.dataIndex > 0
              ? priceData[context.dataIndex - 1].close
              : currentPrice
          return currentPrice > previousPrice
            ? "rgba(34, 197, 94, 1)" // Green
            : "rgba(248, 113, 113, 1)" // Red
        },
        borderWidth: 2, // Increased border width for bold lines
        barThickness: 4, // Increased bar thickness for more dramatic effect
        maxBarThickness: 4, // Matching maxBarThickness
        barPercentage: 1, // No space between bars in same category
        categoryPercentage: 1, // No space between categories
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          maxRotation: 90,
          minRotation: 90,
          font: {
            size: 10, // Slightly larger font for x-axis labels
          },
          autoSkip: false, // Show all labels
          maxTicksLimit: 100, // Show up to 100 labels
        },
      },
      y: {
        grid: {
          color: "#374151",
          drawBorder: true,
        },
        ticks: {
          callback: (value: number) => `$${value.toFixed(2)}`,
        },
      },
    },
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const dataPoint = priceData[context.dataIndex]
            return [
              `Open: $${dataPoint.open.toFixed(2)}`,
              `Close: $${dataPoint.close.toFixed(2)}`,
            ]
          },
        },
      },
    },
  }

  const handleBuy = () => {
    if (buyAmount > 0) {
      const newClose = priceData[priceData.length - 1].close + buyAmount / 100
      setPriceData((prevData) => [
        ...prevData.slice(0, -1),
        { open: prevData[prevData.length - 1].open, close: newClose },
      ])
      setBuyAmount(0)
    }
  }

  const handleSell = () => {
    if (sellAmount > 0) {
      const newClose = priceData[priceData.length - 1].close - sellAmount / 100
      setPriceData((prevData) => [
        ...prevData.slice(0, -1),
        { open: prevData[prevData.length - 1].open, close: newClose },
      ])
      setSellAmount(0)
    }
  }

  return (
    <div className="w-full h-screen bg-gray-800 text-white flex flex-col">
      <header className="p-4 text-center text-3xl font-bold bg-gray-800">
        Rebaz-Daddy Crypto Exchange
      </header>
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="relative w-full h-5/6 px-4 overflow-x-auto">
          {" "}
          {/* Added overflow-x-auto */}
          <Bar data={data} options={options} />
        </div>
        <div className="flex justify-center mt-4 gap-4">
          <div className="flex flex-col items-center">
            <input
              type="number"
              value={buyAmount}
              onChange={(e) => setBuyAmount(parseInt(e.target.value))}
              placeholder="Buy Amount"
              className="p-2 text-black"
            />
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
              onClick={handleBuy}
            >
              Buy
            </button>
          </div>
          <div className="flex flex-col items-center">
            <input
              type="number"
              value={sellAmount}
              onChange={(e) => setSellAmount(parseInt(e.target.value))}
              placeholder="Sell Amount"
              className="p-2 text-black"
            />
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
              onClick={handleSell}
            >
              Sell
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CryptoChart
